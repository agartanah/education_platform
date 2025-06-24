import { Document, Schema, Types, model } from 'mongoose';

interface StudentDocument extends Document {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  favorite_courses: Types.ObjectId[];
  access_courses: Types.ObjectId[];
  complete_lessons: Types.ObjectId[];
  balance: number;
}

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

export { Student, StudentSchema, StudentDocument };
