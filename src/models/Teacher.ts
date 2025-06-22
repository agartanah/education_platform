import { Schema, model } from 'mongoose';

const TeacherSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  login: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false },
});

const Teacher = model('Teacher', TeacherSchema);

export { Teacher, TeacherSchema };
