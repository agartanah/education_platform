import express from 'express';
import { connectDB } from './config/db';
import { env } from 'process';
import routes from './routes/routes';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();
const port = env.port;

connectDB();

app.use(express.json());
app.use(errorMiddleware);

routes.forEach((route) => {
  app.use(route.name, route.router);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
