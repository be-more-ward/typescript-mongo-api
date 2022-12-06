import {Request, Response,NextFunction} from "express"
import jwt from "jsonwebtoken"

interface IUserDetailsJWT extends jwt.JwtPayload{
    userId: string,
    name:string
}

declare global {
    namespace Express{
        interface Request{
            user: any
        }
    }
}



const auth = (req: Request, res: Response, next: NextFunction)=>{
    const authHeaders= req.headers.authorization
    console.log(authHeaders);
    
    if (!authHeaders || !authHeaders.startsWith("Bearer ")){
        throw new Error("NO token provided - MDW validation")
    }
    
    const token = authHeaders.split(" ")[1]
    try {
        const {name, userId} = <IUserDetailsJWT>jwt.verify(token, String(process.env.JWT_SECRET))
        req.user = {name, userId}
        // console.log(req.user)
        next()
    } catch (error) {
        throw new Error ("Invalid credentials- not auth to this route")
    }
}

export default auth