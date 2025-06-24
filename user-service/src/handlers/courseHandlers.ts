import { Teacher } from '@shared/models';
import { subscribeToEvent, publishEvent } from '@shared/utils/eventBus';
import { COURSE_EVENTS } from '@shared/events/courseEvents';
import {
  CourseCreationEventData,
  AuthorsValidationSuccessData,
  AuthorsValidationFailedData,
} from '@shared/types';

subscribeToEvent<CourseCreationEventData>(
  COURSE_EVENTS.CREATE_COURSE_REQUESTED,
  async (data) => {
    const { requestId, courseData } = data;

    try {
      const { authors } = courseData;
      const invalidAuthors: Array<{ authorId: string; error: string }> = [];
      const validAuthors: string[] = [];

      for (const authorId of authors) {
        const author = await Teacher.findById(authorId);
        if (!author) {
          invalidAuthors.push({ authorId, error: 'Автор не найден' });
        } else {
          validAuthors.push(authorId);
        }
      }

      if (invalidAuthors.length > 0) {
        await publishEvent<AuthorsValidationFailedData>(
          COURSE_EVENTS.AUTHORS_VALIDATED_FAILED,
          {
            requestId,
            errors: invalidAuthors,
          }
        );
      } else {
        await publishEvent<AuthorsValidationSuccessData>(
          COURSE_EVENTS.AUTHORS_VALIDATED_SUCCESS,
          {
            requestId,
            validAuthors,
          }
        );
      }
    } catch (error) {
      await publishEvent<AuthorsValidationFailedData>(
        COURSE_EVENTS.AUTHORS_VALIDATED_FAILED,
        {
          requestId,
          errors: [{ error: (error as Error).message }],
        }
      );
    }
  },
  'user-service'
);
