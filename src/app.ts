import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { koaSwagger } from 'koa2-swagger-ui';
import authRoutes from "./routes/auth";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/product"
import { db } from './models/index';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const app = new Koa();

app.use(cors({ origin: '*' })); 

app.use(bodyParser());

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Koa CRUD API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, 'routes/*.ts')],
}) as Record<string, unknown>;

app.use(
  koaSwagger({
    routePrefix: '/docs',
    swaggerOptions: {
      spec: swaggerSpec,
    },
  })
);

app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(productRoutes.routes()).use(productRoutes.allowedMethods());


const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}/docs`));
});
