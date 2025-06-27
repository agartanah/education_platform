import { z } from 'zod';
import { objectIdSchema } from './objectIdSchema';

export const createLessonSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1).optional(),
  course_id: objectIdSchema.optional(),
  comments: z
    .array(objectIdSchema)
    .min(1, 'сomments must not be empty')
    .optional(),
});

export const updateLessonSchema = createLessonSchema.partial();

export type CreateLessonDto = z.infer<typeof createLessonSchema>;
export type UpdateLessonDto = z.infer<typeof updateLessonSchema>;
