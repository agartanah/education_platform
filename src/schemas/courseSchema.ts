import { z } from 'zod';
import { objectIdSchema } from './objectIdSchema';

export const courseIdSchema = z.object({
  course_id: objectIdSchema,
});

export const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  level: z.string().min(1),
  category_id: objectIdSchema,
  authors: z.array(objectIdSchema).min(1, 'authors must not be empty'),
  tags: z.array(objectIdSchema).optional(),
  isPublish: z.boolean().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseDto = z.infer<typeof createCourseSchema>;
export type UpdateCourseDto = z.infer<typeof updateCourseSchema>;
export type CourseIdDto = z.infer<typeof courseIdSchema>;
