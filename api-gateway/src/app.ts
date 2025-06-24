import express from 'express';
import cors from 'cors';
import routes from './routes/routes';

const app = express();

app.use(cors());
app.use(express.json());

routes.forEach((route) => {
  app.use(route.name, route.proxy);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
