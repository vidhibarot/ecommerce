// import swaggerJSDoc from 'swagger-jsdoc';

// // const options = {
// //   definition: {
// //     openapi: '3.0.0',
// //     info: {
// //       title: 'Koa CRUD API',
// //       version: '1.0.0',
// //     },
// //     components: {
// //       securitySchemes: {
// //         bearerAuth: {
// //           type: 'http',
// //           scheme: 'bearer',
// //           bearerFormat: 'JWT',
// //         },
// //       },
// //     },
// //     security: [{ bearerAuth: [] }],
// //   },
// //   apis: ['../routes/*.ts'],
// // };

// // const swaggerSpec = swaggerJsdoc(options);
// // export default swaggerSpec;
// import path from 'path';

// // const swaggerOptions = {
// //   definition: {
// //     openapi: '3.0.0',
// //     info: {
// //       title: 'Koa CRUD API',
// //       version: '1.0.0',
// //     },
// //     components: {
// //       securitySchemes: {
// //         bearerAuth: {
// //           type: 'http',
// //           scheme: 'bearer',
// //           bearerFormat: 'JWT',
// //         },
// //       },
// //     },
// //     security: [{ bearerAuth: [] }],
// //   },
// //   apis: [path.join(__dirname, 'routes/*.ts')], // Corrected path
// // };
// // const swaggerSpec = swaggerJSDoc({
// //   definition: {
// //     openapi: '3.0.0',
// //     info: {
// //       title: 'Koa CRUD API',
// //       version: '1.0.0',
// //     },
// //     components: {
// //       securitySchemes: {
// //         bearerAuth: {
// //           type: 'http',
// //           scheme: 'bearer',
// //           bearerFormat: 'JWT',
// //         },
// //       },
// //     },
// //     security: [{ bearerAuth: [] }],
// //   },
// //   apis: [path.join(__dirname, 'routes/*.ts')],
// // }) as Record<string, unknown>;
// // const swaggerSpec = swaggerJsdoc(swaggerOptions);
// const swaggerSpec = swaggerJSDoc({
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Koa CRUD API',
//       version: '1.0.0',
//     },
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//     },
//     security: [{ bearerAuth: [] }],
//   },
//   apis: [path.join(__dirname, 'routes/*.ts')],
// }) as Record<string, unknown>;
// export default swaggerSpec;
