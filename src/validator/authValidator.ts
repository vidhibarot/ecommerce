import Joi from "joi";

export const validateRegister = async (ctx: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
      }),
    phoneno: Joi.string().required(),
    adminPassword: Joi.string().optional(),
  });

  try {
    await schema.validateAsync(ctx.request.body, { abortEarly: false });
    await next();
  } catch (err: any) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: "Validation Error",
      details: err.details.map((d: any) => d.message),
    };
  }
};

// Middleware: Login
export const validateLogin = async (ctx: any, next: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    await schema.validateAsync(ctx.request.body, { abortEarly: false });
    await next();
  } catch (err: any) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: "Validation Error",
      details: err.details.map((d: any) => d.message),
    };
  }
};

// Middleware: Update User
export const validateUpdateUser = async (ctx: any, next: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneno: Joi.string().optional(),
  });

  try {
    await schema.validateAsync(ctx.request.body, { abortEarly: false });
    await next();
  } catch (err: any) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: "Validation Error",
      details: err.details.map((d: any) => d.message),
    };
  }
};
