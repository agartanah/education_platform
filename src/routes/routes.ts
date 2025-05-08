import { Router } from 'express';
import { studentRoutes } from './routers/studentRouter';
import { teacherRoutes } from './routers/teacherRouter';
import { authorisationRoutes } from './routers/authorisationRouter';
import { profileRoutes } from './routers/profileRouter';
import { courseRoutes } from './routers/courseRouter';
import { categoryRoutes } from './routers/categoryRouter';
import { tagRoutes } from './routers/tagRouter';

type Route = {
  name: string;
  router: Router;
};

const routes: Route[] = [
  { name: '/profile', router: profileRoutes },
  { name: '/auth', router: authorisationRoutes },
  { name: '/student', router: studentRoutes },
  { name: '/teacher', router: teacherRoutes },
  { name: '/course', router: courseRoutes },
  { name: '/category', router: categoryRoutes },
  { name: '/tag', router: tagRoutes },
];

export default routes;
