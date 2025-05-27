// import { Segments, Joi, celebrate } from "celebrate";

// export default {
//   createOrder: () =>
//     celebrate({
//       [Segments.BODY]: Joi.object().keys({
//         userId: Joi.number().required(),
//         productId: Joi.number().required(),
//         customerName: Joi.string().required(),
//         email: Joi.string().required(),
//         phoneno: Joi.string().required(),
//         address: Joi.string().required(),
//         quantity: Joi.number().required(),
//         price: Joi.number().required(),
//       }),
//     }),
// };
// src/validator/orderValidator.ts
import Joi from "joi";

export const validateCreateOrder = async (ctx: any, next: any) => {
  const schema = Joi.object({
    productId: Joi.number().required(),
    customerName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneno: Joi.string().required(),
    address: Joi.object({
      type: Joi.string().required(),
      address: Joi.string().required(),
      country: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string().required(),
    }).required(),
    quantity: Joi.number().required(),
    price: Joi.number().required(),
    status: Joi.string().optional(),
  });

  try {
    await schema.validateAsync(ctx.request.body);
    await next();
  } catch (err:any) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: err.message,
    };
  }
};
