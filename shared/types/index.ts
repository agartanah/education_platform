import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: 'student' | 'teacher';
}

export interface CourseCreationRequest {
  requestId: string;
  courseData: CreateCourseData;
  status:
    | 'pending'
    | 'validating_authors'
    | 'creating_course'
    | 'completed'
    | 'failed';
  userId: string;
  startTime: Date;
  result?: {
    courseId: string;
    courseSlug: string;
    message: string;
  };
  errors?: Array<{
    type?: string;
    message?: string;
    authorId?: string;
    error?: string;
  }>;
}

export interface CreateCourseData {
  title: string;
  description: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category_id: string;
  authors: string[];
  tags?: string[];
  isPublish?: boolean;
}

export interface BaseEventData {
  requestId: string;
  [key: string]: unknown;
}

export interface CourseCreationEventData extends BaseEventData {
  courseData: CreateCourseData;
  userId: string;
}

export interface AuthorsValidationSuccessData extends BaseEventData {
  validAuthors: string[];
}

export interface AuthorsValidationFailedData extends BaseEventData {
  errors: Array<{
    authorId?: string;
    error: string;
  }>;
}

export interface CourseCreatedEventData extends BaseEventData {
  courseId: string;
  courseSlug: string;
}

export interface EventMessage<T = BaseEventData> {
  eventType: string;
  data: T;
  timestamp: string;
  eventId: string;
}

export type CourseEventData =
  | CourseCreationEventData
  | AuthorsValidationSuccessData
  | AuthorsValidationFailedData
  | CourseCreatedEventData;
