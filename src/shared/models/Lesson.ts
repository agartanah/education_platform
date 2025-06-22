import { Schema, Types, model } from 'mongoose';
import slugify from 'slugify';

const LessonSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: false, unique: true },
  content: { type: String, required: false },
  video: { type: String, required: false, unique: true, sparse: true },
  course: { type: Types.ObjectId, required: true },
  order: { type: Number, required: false },
  comments: [{ type: Types.ObjectId, ref: 'Comment', required: false }],
  createdAt: { type: Date, required: true, default: Date.now() },
});

interface LessonAttributes {
  title: string;
  slug: string;
  content: string;
  video: string;
  course: string;
  order: number;
  comments: string[];
  createdAt: Date;
}

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

  if (this.isNew && (this.order === undefined || this.order === null)) {
    const lastLesson = (await Lesson.findOne({ course: this.course })
      .sort({ order: -1 })
      .select('order')
      .exec()) as LessonAttributes | null;
    console.log('order');
    this.order = lastLesson ? lastLesson.order + 1 : 1;
  }

  next();
});

const Lesson = model('Lesson', LessonSchema);

export { Lesson, LessonAttributes };
