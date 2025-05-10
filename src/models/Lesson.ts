import { Schema, Types, model } from 'mongoose';

const LessonSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: false },
  videoUrl: { type: String, required: false },
  course: { type: Types.ObjectId, required: true },
  order: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
});

interface LessonAttributes {
  title: string;
  content: string;
  videoUrl: string;
  course: string;
  order: number;
  createdAt: Date;
}

const Lesson = model('Lesson', LessonSchema);

export { Lesson, LessonAttributes };
