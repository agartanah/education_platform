import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Student = model("Student", userSchema);
const Teacher = model("Teacher", userSchema);

export { Student, Teacher };
