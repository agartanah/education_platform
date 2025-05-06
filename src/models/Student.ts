import { Schema, Types, model } from 'mongoose';

const StudentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorite_courses: [{ type: Types.ObjectId, ref: 'Course', required: false }],
});

const Student = model('Student', StudentSchema);

export { Student, StudentSchema };
