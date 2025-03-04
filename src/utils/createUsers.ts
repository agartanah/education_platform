import { Student } from "../models/users";
import { Teacher } from "../models/users";

const createUsers = async () => {
  const newStudent = new Student({
    firstName: "John",
    lastName: "Doe",
    login: "john.doe",
    password: "hashed_password",
  });

  const newTeacher = new Teacher({
    firstName: "Jane",
    lastName: "Smith",
    login: "jane.smith",
    password: "hashed_password",
  });

  try {
    await newStudent.save();
    await newTeacher.save();
    console.log("Пользователи созданы");
  } catch (err) {
    console.error("Ошибка создания пользователей:", err);
  }
};

export default createUsers;
