import * as z from "zod";
import { TimestampSchema } from "../_archive/model_old/helpers";

// ============================================
// FLEXIBLE APP STATE SCHEMA
// ============================================

/**
 * A flexible AppState model that can accommodate custom schemas at runtime.
 * Uses Zod for validation with support for dynamic data structures.
 */

// Base metadata for tracking state changes
const AppStateMetadataSchema = z.object({
  lastUpdated: TimestampSchema,
  version: z.string().default("1.0.0"),
  userId: z.string().optional(),
});

// Flexible data container that accepts any valid JSON-serializable value
// This allows runtime flexibility while maintaining type safety
const FlexibleDataSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.any()),
  z.record(z.string(), z.any()),
]);

// Individual state entry with metadata
const AppStateEntrySchema = z.object({
  key: z.string(),
  value: FlexibleDataSchema,
  schema: z.string().optional(), // Optional schema identifier for validation
  metadata: z.object({
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    tags: z.array(z.string()).default([]),
    isEncrypted: z.boolean().default(false),
    isPersisted: z.boolean().default(true),
  }),
});

// Main AppState schema
export const AppStateSchema = z.object({
  // State entries stored as key-value pairs with metadata
  state: z.record(z.string(), AppStateEntrySchema),

  // Global metadata
  metadata: AppStateMetadataSchema,

  // Session-specific data (not persisted)
  session: z.object({
    userId: z.string().optional(),
    sessionId: z.string(),
    startedAt: TimestampSchema,
    isActive: z.boolean().default(true),
    deviceId: z.string().optional(),
  }),

  // Feature flags for runtime configuration
  features: z.record(z.string(), z.boolean()).default({}),

  // Custom schemas registered at runtime (stored as stringified schemas)
  registeredSchemas: z.record(z.string(), z.string()).default({}),
});

// Helper type for typed state entries
export const TypedStateEntrySchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    key: z.string(),
    value: valueSchema,
    schema: z.string().optional(),
    metadata: z.object({
      createdAt: TimestampSchema,
      updatedAt: TimestampSchema,
      tags: z.array(z.string()).default([]),
      isEncrypted: z.boolean().default(false),
      isPersisted: z.boolean().default(true),
    }),
  });

// Export types
export type AppState = z.infer<typeof AppStateSchema>;
export type AppStateEntry = z.infer<typeof AppStateEntrySchema>;
export type AppStateMetadata = z.infer<typeof AppStateMetadataSchema>;

// Helper functions for working with AppState
export const createAppStateEntry = <T>(
  key: string,
  value: T,
  options?: {
    schema?: string;
    tags?: string[];
    isEncrypted?: boolean;
    isPersisted?: boolean;
  }
): AppStateEntry => {
  const now = new Date().toISOString();
  return {
    key,
    value: value as any,
    schema: options?.schema,
    metadata: {
      createdAt: now,
      updatedAt: now,
      tags: options?.tags || [],
      isEncrypted: options?.isEncrypted || false,
      isPersisted: options?.isPersisted !== false,
    },
  };
};

export const createInitialAppState = (sessionId: string): AppState => {
  const now = new Date().toISOString();
  return {
    state: {},
    metadata: {
      lastUpdated: now,
      version: "1.0.0",
    },
    session: {
      sessionId,
      startedAt: now,
      isActive: true,
    },
    features: {},
    registeredSchemas: {},
  };
};

// Validation helper with custom schema support
export const validateStateEntry = <T>(
  entry: AppStateEntry,
  customSchema?: z.ZodType<T>
): T => {
  if (customSchema) {
    return customSchema.parse(entry.value);
  }
  return FlexibleDataSchema.parse(entry.value) as T;
};

// Register a custom schema at runtime
export const registerSchema = (
  state: AppState,
  schemaName: string,
  schema: z.ZodTypeAny
): AppState => {
  return {
    ...state,
    registeredSchemas: {
      ...state.registeredSchemas,
      [schemaName]: JSON.stringify(schema),
    },
  };
};

// Update a state entry with validation
export const updateStateEntry = <T>(
  state: AppState,
  key: string,
  value: T,
  customSchema?: z.ZodType<T>
): AppState => {
  // Validate if custom schema provided
  if (customSchema) {
    customSchema.parse(value);
  }

  const existingEntry = state.state[key];
  const now = new Date().toISOString();

  const updatedEntry: AppStateEntry = existingEntry
    ? {
        ...existingEntry,
        value: value as any,
        metadata: {
          ...existingEntry.metadata,
          updatedAt: now,
        },
      }
    : createAppStateEntry(key, value);

  return {
    ...state,
    state: {
      ...state.state,
      [key]: updatedEntry,
    },
    metadata: {
      ...state.metadata,
      lastUpdated: now,
    },
  };
};

// Get a state entry with type safety
export const getStateEntry = <T>(
  state: AppState,
  key: string,
  customSchema?: z.ZodType<T>
): T | undefined => {
  const entry = state.state[key];
  if (!entry) return undefined;

  if (customSchema) {
    return validateStateEntry(entry, customSchema);
  }
  return entry.value as T;
};
