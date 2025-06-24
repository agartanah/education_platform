export const COURSE_EVENTS = {
  CREATE_COURSE_REQUESTED: 'course.create.requested',
  AUTHORS_VALIDATED_SUCCESS: 'authors.validated.success',
  AUTHORS_VALIDATED_FAILED: 'authors.validated.failed',
  COURSE_CREATED: 'course.created',
  COURSE_CREATION_FAILED: 'course.creation.failed',
} as const;

export type CourseEventType =
  (typeof COURSE_EVENTS)[keyof typeof COURSE_EVENTS];
