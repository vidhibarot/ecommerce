import { Segments, Joi, celebrate } from 'celebrate'

export default {
    register: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required(),
            roleId: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
    }),
    login: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.required(),
        }),
    }),
    forgotPassword: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required()
        }),
    }),
    verifyOtp: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            otp: Joi.required()
        }),
    }),
    resetPassword: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),
    }),
    resendOTP: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required()
        }),
    }),
}