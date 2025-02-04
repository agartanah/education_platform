import { Document, model, Schema } from "mongoose";

interface ITeacher extends Document {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
}

const teacherSchema = new Schema<ITeacher>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const Teacher = model<ITeacher>("Teacher", teacherSchema);
