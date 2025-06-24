import { Course, Category, Tag } from '@shared/models';
import { publishEvent, subscribeToEvent } from '@shared/utils/eventBus';
import { COURSE_EVENTS } from '@shared/events/courseEvents';
import {
  AuthorsValidationFailedData,
  AuthorsValidationSuccessData,
  CourseCreationRequest,
} from '@shared/types';

const activeRequests = new Map<string, CourseCreationRequest>();

export function setupCourseEventHandlers() {
  subscribeToEvent<AuthorsValidationSuccessData>(
    COURSE_EVENTS.AUTHORS_VALIDATED_SUCCESS,
    async (data) => {
      const { requestId, validAuthors } = data;

      const request = activeRequests.get(requestId);
      if (!request) return;

      try {
        request.status = 'creating_course';
        const { courseData } = request;

        const category = await Category.findById(courseData.category_id);
        if (!category) {
          throw new Error(`Категория не найдена: ${courseData.category_id}`);
        }

        const validTags: string[] = [];
        if (courseData.tags) {
          for (const tagId of courseData.tags) {
            const tag = await Tag.findById(tagId);
            if (!tag) {
              throw new Error(`Тег не найден: ${tagId}`);
            }
            validTags.push(tagId);
          }
        }

        const course = await Course.create({
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          level: courseData.level,
          category: courseData.category_id,
          tags: validTags,
          authors: validAuthors,
        });

        if (!course.slug) {
          throw new Error('Slug не был сгенерирован');
        }

        request.status = 'completed';
        request.result = {
          courseId: course._id.toString(),
          courseSlug: course.slug,
          message: 'Курс успешно создан!',
        };

        await publishEvent(COURSE_EVENTS.COURSE_CREATED, {
          requestId,
          courseId: course._id,
          courseSlug: course.slug,
        });
      } catch (error) {
        request.status = 'failed';
        request.errors = [{ error: (error as Error).message }];

        await publishEvent(COURSE_EVENTS.COURSE_CREATION_FAILED, {
          requestId,
          error: (error as Error).message,
        });
      }
    },
    'course-service'
  );

  subscribeToEvent<AuthorsValidationFailedData>(
    COURSE_EVENTS.AUTHORS_VALIDATED_FAILED,
    async (data) => {
      const { requestId, errors } = data;

      const request = activeRequests.get(requestId);
      if (!request) return;

      request.status = 'failed';
      request.errors = errors.map((err) => ({
        authorId: err.authorId,
        error: err.error,
      }));
    },
    'course-service'
  );
}
