import { Schema, Types, model } from 'mongoose';
import slugify from 'slugify';

const LessonSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: false, unique: true },
  content: { type: String, required: false },
  videoUrl: { type: String, required: false },
  course: { type: Types.ObjectId, required: true },
  order: { type: Number, required: true },
  comments: [{ type: Types.ObjectId, ref: 'Comment', required: false }],
  createdAt: { type: Date, required: true, default: Date.now() },
});

interface LessonAttributes {
  title: string;
  slug: string;
  content: string;
  videoUrl: string;
  course: string;
  order: number;
  createdAt: Date;
}

const Lesson = model('Lesson', LessonSchema);

LessonSchema.pre('save', async function (next) {
  const baseSlug = this.slug
    ? slugify(this.slug, { lower: true, strict: true })
    : slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  if (!this.slug) {
    while (await Lesson.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  this.slug = slug;
  next();
});

export { Lesson, LessonAttributes };
