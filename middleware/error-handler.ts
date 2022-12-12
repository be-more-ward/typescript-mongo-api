import { Request,Response,NextFunction} from "express"
import { CustomAPIError} from "../errors"
import { StatusCodes } from "http-status-codes"


// About Error new properties
// 1) https://bobbyhadz.com/blog/typescript-property-status-does-not-exist-on-type-error
// 2) https://bobbyhadz.com/blog/typescript-type-undefined-is-not-assignable-to-type-number


// *1
interface Error {
    statusCode?: number,
    code? : number,
}


export const errorHandler = (err: Error, req:Request, res:Response, next:NextFunction)=>{

    let CustomError ={
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Something went wrong"
    }
    
    // DUPLICATE EMAIL, ERROR FROM MONGODB
    if (err.code && err.code === 11000){  // *1
        CustomError.statusCode = StatusCodes.BAD_REQUEST
        CustomError.message = `Duplication value for email field`
    }

    if (err instanceof CustomAPIError){
        return res.status(err.statusCode!).json({msg: err.message}) // *2
    }
    // console.log({err});
    
    return res.status(CustomError.statusCode).json({msg: CustomError.message}) 
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err}) 
}