import express from "express";
import { connectDB } from "./config/db";
import { env } from "process";
import { studentRoutes } from "./routes/studentRoutes";
import { teacherRoutes } from "./routes/teacherRoutes";
import path from "path";
import hbs from "hbs";

const app = express();
const port = env.port;

connectDB();

const viewsPath = path.join(__dirname, "views");
const partialsPath = path.join(__dirname, "views/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.json());
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);

// createUsers();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
