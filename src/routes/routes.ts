import { Router } from "express";
import { studentRoutes } from "./studentRoutes";
import { teacherRoutes } from "./teacherRoutes";
import { authorisationRoutes } from "./authorisationRoutes";
import { profileRoutes } from "./profileRoutes";

type Route = {
  name: string;
  router: Router;
};

const routes: Route[] = [
  { name: "/", router: profileRoutes },
  { name: "/auth", router: authorisationRoutes },
  { name: "/student", router: studentRoutes },
  { name: "/teacher", router: teacherRoutes },
];

export default routes;
