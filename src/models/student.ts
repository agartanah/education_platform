import { Document, model, Schema } from "mongoose";

interface IStudent extends Document {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
}

const studentSchema = new Schema<IStudent>({
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

export const Student = model<IStudent>("Student", studentSchema);
