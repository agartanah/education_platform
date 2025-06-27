import express from 'express';
import cors from 'cors';
import routes from './routes/routes';

const app = express();

routes.forEach((route) => {
  app.use(route.name, route.proxy);
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
