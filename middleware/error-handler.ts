import { Request,Response,NextFunction} from "express"
import { CustomAPIError} from "../errors"
import { StatusCodes } from "http-status-codes"


// About Error.statusCode
// 1) https://bobbyhadz.com/blog/typescript-property-status-does-not-exist-on-type-error
// 2) https://bobbyhadz.com/blog/typescript-type-undefined-is-not-assignable-to-type-number


// *1
interface Error {
    statusCode?: number,
}


export const errorHandler = (err: Error, req:Request, res:Response, next:NextFunction)=>{

    if (err instanceof CustomAPIError){
        return res.status(err.statusCode!).json({msg: err.message}) // *2
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong"}) 
}