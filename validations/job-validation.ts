import Joi from "joi"

export const jobSchema = Joi.object({
    company: Joi.string().max(50).required(),
    position: Joi.string().max(100).required(),
    status: Joi.string().required(),
    createdBy: Joi.number().required()
})