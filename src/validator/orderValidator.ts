import Joi from "joi";

export const validateCreateOrder = async (ctx: any, next: any) => {
  const schema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().required(),
          quantity: Joi.number().required(),
          price: Joi.number().required(),
        })
      )
      .min(1)
      .required(),

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

    paymentMethod: Joi.string().required(),

    status: Joi.string().optional(), // if needed
  });

  try {
    await schema.validateAsync(ctx.request.body);
    await next();
  } catch (err: any) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: err.message,
    };
  }
};
