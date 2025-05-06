import { Router } from 'express';
import { studentRoutes } from './routers/studentRoutes';
import { teacherRoutes } from './routers/teacherRoutes';
import { authorisationRoutes } from './routers/authorisationRoutes';
import { profileRoutes } from './routers/profileRoutes';
import { courseRoutes } from './routers/courseRouter';

type Route = {
  name: string;
  router: Router;
};

const routes: Route[] = [
  { name: '/profile', router: profileRoutes },
  { name: '/auth', router: authorisationRoutes },
  { name: '/student', router: studentRoutes },
  { name: '/teacher', router: teacherRoutes },
  { name: '/courses', router: courseRoutes },
];

export default routes;
