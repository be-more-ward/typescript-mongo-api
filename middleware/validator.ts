import { Request, Response, NextFunction} from "express";
import Joi from "joi"
import { BadRequestError } from "../errors";

const validator =(schema: Joi.ObjectSchema) => async (req:Request, res:Response, next:NextFunction)=>{
    try {
        // check if body is empty
        if (Object.keys(req.body).length === 0) throw new BadRequestError("req.body cannot be empty")
        
        await schema.validateAsync(req.body)
        next()

    } catch (error){
        if (error instanceof Error){
            throw new BadRequestError(`${error.message}`)
        }
    }
}

export default validator