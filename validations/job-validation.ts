import Joi from "joi"

export const JobCreateSchema = Joi.object({
    company: Joi.string().max(50).required(),
    position: Joi.string().max(100).required()
})

export const JobUpdateSchema = Joi.object({
    company: Joi.string().max(50).optional(),
    position: Joi.string().max(100).optional(),
    status: Joi.string().valid("interview", "declined", "pending").optional()
})