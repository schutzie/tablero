import * as z from "zod";

// Schema for array items
const ArrayItemSchema = z.object({
  arrayStringField: z.string(),
  arrayIntField: z.number(), // Note: This is a string in the JSON, not a number
});

// Main schema
export const FirestoreTestingSchema = z.object({
  id: z.string(),
  stringField: z.string(),
  dateField: z.iso, // ISO 8601 datetime string
  arrayExample: z.array(ArrayItemSchema),
});

// Export types
export type FirestoreTesting = z.infer<typeof FirestoreTestingSchema>;
export type ArrayItem = z.infer<typeof ArrayItemSchema>;

// Example usage and validation
// const sampleData = {
//   id: "123",
//   stringField: "someString",
//   dateField: "2026-01-31T15:14:01.123456Z",
//   arrayExample: [
//     { arrayStringField: "string1", arrayIntField: "874913" },
//     { arrayStringField: "string2", arrayIntField: "111222333" },
//   ],
// };

// // Validate the sample data
// try {
//   const validated = FirestoreTestingSchema.parse(sampleData);
//   console.log("Validation successful:", validated);
// } catch (error) {
//   console.error("Validation failed:", error);
// }

