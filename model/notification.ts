import * as z from "zod"; 
import { TimestampSchema, OptionalTimestampSchema } from './helpers';
import { NotificationType } from "./enums";

// ============================================
// NOTIFICATION SCHEMA
// ============================================

export const NotificationSchema = z.object({
  notificationId: z.string(),
  userId: z.string(),

  // Notification Details
  type: z.nativeEnum(NotificationType),
  title: z.string(),
  body: z.string(),
  imageURL: z.url().optional(),

  // Related Entities
  relatedEntities: z.object({
    gameId: z.string().optional().nullable(),
    teamId: z.string().optional().nullable(),
    playerId: z.string().optional().nullable()
  }).optional(),

  // Delivery
  channels: z.array(z.enum(['push', 'email', 'sms', 'in_app'])).default(['in_app']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),

  // Status
  status: z.enum(['unread', 'read', 'archived']).default('unread'),
  sentAt: TimestampSchema,
  readAt: OptionalTimestampSchema,
  expiresAt: OptionalTimestampSchema,

  // Actions
  actionType: z.enum(['navigate', 'external_link', 'dismiss']).optional(),
  actionData: z.record(z.any()).optional()
});

export type Notification = z.infer<typeof NotificationSchema>;