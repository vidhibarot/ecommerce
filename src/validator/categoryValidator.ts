import Joi from "joi";

export const validateAddCategory = async (ctx: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    subcategory: Joi.array().items(Joi.string()).optional()
  });

  try {
    await schema.validateAsync(ctx.request.body, { abortEarly: false });
    await next();
  } catch (err: any) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: "Validation Error",
      details: err.details.map((e: any) => e.message),
    };
  }
};

export const validateUpdateCategory = async (ctx: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    subcategory: Joi.array().items(Joi.string()).optional()
  });

  try {
    await schema.validateAsync(ctx.request.body, { abortEarly: false });
    await next();
  } catch (err: any) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: "Validation Error",
      details: err.details.map((e: any) => e.message),
    };
  }
};
