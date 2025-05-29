import Joi from "joi";

const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(), 
  categoryId: Joi.string().required(),
  inStock: Joi.number().required(), 
  description: Joi.string().optional().allow(null, ''),
  image: Joi.string().optional().allow(null, ''),
  material: Joi.string().optional().allow(null, ''),
  weight: Joi.string().optional().allow(null, ''),
  size: Joi.string().optional().allow(null, ''),
  attributes: Joi.string().optional().allow(null, ''),
  features: Joi.string().optional().allow(null, ''),
  discount: Joi.string().optional().allow(null, ''),
  careInstructions: Joi.string().optional().allow(null, ''),
});

export const validateAddProduct = async (ctx: any, next: any) => {
  try {
    await productSchema.validateAsync(ctx.request.body);
    await next();
  } catch (err: any) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: err.message,
    };
  }
};

export const validateUpdateProduct = async (ctx: any, next: any) => {
  try {
    await productSchema.validateAsync(ctx.request.body);
    await next();
  } catch (err: any) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: err.message,
    };
  }
};
