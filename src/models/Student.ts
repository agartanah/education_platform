import { Schema, Types, model } from 'mongoose';

const StudentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  login: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false },
  favorite_courses: [{ type: Types.ObjectId, ref: 'Course', required: false }],
  access_courses: [{ type: Types.ObjectId, ref: 'Course', required: false }],
  complete_lessons: [{ type: Types.ObjectId, ref: 'Lesson', required: false }],
  balance: { type: Number, required: true, default: 0 },
});

const Student = model('Student', StudentSchema);

export { Student, StudentSchema };
