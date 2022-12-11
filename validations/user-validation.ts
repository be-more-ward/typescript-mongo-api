import Joi from "joi";
import { IUser } from "../models/User.model";

export const UserRegisterSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(3).required(),
    email: Joi.string().email().required()
})

export const UserLoginSchema = Joi.object({
    password: Joi.string().min(3).required(),
    email: Joi.string().email().required()
})