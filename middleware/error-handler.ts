import { Request,Response,NextFunction} from "express"

export const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction)=>{
    return res.status(404).json({msg:"something went wrong", text: err.message})
}