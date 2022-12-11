import {Request, Response,NextFunction} from "express"
import jwt from "jsonwebtoken"
import { UnauthenticatedError } from "../errors"
import { IUserDetailsJWT } from "../types"



const auth = (req: Request, res: Response, next: NextFunction)=>{
    const authHeaders = req.headers.authorization

    if (!authHeaders || !authHeaders.startsWith("Bearer ")){
        throw new UnauthenticatedError("NO token provided - MDW validation")
    }
    
    const token = authHeaders.split(" ")[1]
    try {
        const {name, userId} = <IUserDetailsJWT>jwt.verify(token, String(process.env.JWT_SECRET))
        req.user = {name, userId}
        next()
        
    } catch (error) {
        throw new UnauthenticatedError ("Invalid credentials- not auth to this route")
    }
}

export default auth