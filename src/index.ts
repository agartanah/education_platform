import express from "express";
import { connectDB } from "./config/db";
import { env } from "process";
import { studentRoutes } from "./routes/studentRoutes";
import { teacherRoutes } from "./routes/teacherRoutes";
import { authorisationRoutes } from "./routes/authorisationRoutes";
import { profileRoutes } from "./routes/profileRoutes";

const app = express();
const port = env.port;

connectDB();

// const viewsPath = path.join(__dirname, "view");
// const partialsPath = path.join(__dirname, "view/partials");

// app.engine(
//   "hbs",
//   engine({
//     layoutsDir: path.join(viewsPath, "layouts"),
//     defaultLayout: "layout",
//     extname: "hbs",
//   }),
// );
// app.set("view engine", "hbs");
// app.set("views", viewsPath);
// hbs.registerPartials(partialsPath);

// app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());

app.use("/", profileRoutes);
app.use("/auth", authorisationRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);

// createUsers();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
