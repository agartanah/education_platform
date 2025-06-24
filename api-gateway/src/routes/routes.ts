import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';

const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const COURSE_SERVICE =
  process.env.COURSE_SERVICE_URL || 'http://course-service:3002';

type Route = {
  name: string;
  proxy: RequestHandler;
};

const routes: Route[] = [
  {
    name: '/profile',
    proxy: createProxyMiddleware({
      target: USER_SERVICE,
      changeOrigin: true,
    }),
  },
  {
    name: '/auth',
    proxy: createProxyMiddleware({
      target: USER_SERVICE,
      changeOrigin: true,
    }),
  },
  {
    name: '/students',
    proxy: createProxyMiddleware({
      target: USER_SERVICE,
      changeOrigin: true,
    }),
  },
  {
    name: '/teachers',
    proxy: createProxyMiddleware({
      target: USER_SERVICE,
      changeOrigin: true,
    }),
  },
  {
    name: '/courses',
    proxy: createProxyMiddleware({
      target: COURSE_SERVICE,
      changeOrigin: true,
    }),
  },
  {
    name: '/categories',
    proxy: createProxyMiddleware({
      target: COURSE_SERVICE,
      changeOrigin: true,
    }),
  },
  {
    name: '/tags',
    proxy: createProxyMiddleware({
      target: COURSE_SERVICE,
      changeOrigin: true,
    }),
  },
];

export default routes;
