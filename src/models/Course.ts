import { Schema, Types, model } from 'mongoose';
import slugify from 'slugify';

const CourseSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  image: { type: String, required: true, unique: true },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  category: { type: Types.ObjectId, ref: 'Category', required: true },
  tags: [{ type: Types.ObjectId, ref: 'Tag', required: true }],
  isPublish: { type: Boolean, required: true, default: false },
  authors: [{ type: Types.ObjectId, ref: 'Teacher', required: true }],
  createdAt: { type: Date, required: true, default: Date.now() },
});

interface CourseAttributes {
  title: string;
  description: string;
  price: number;
  image: string;
  level: string;
  category: string;
  tags: string[];
  isPublish: boolean;
  authors: string[];
}

CourseSchema.pre('save', async function (next) {
  const baseSlug = this.slug
    ? slugify(this.slug, { lower: true, strict: true })
    : slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await Course.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

const Course = model('Course', CourseSchema);

export { Course, CourseAttributes };
