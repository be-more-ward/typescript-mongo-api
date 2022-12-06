import { Request, Response } from "express"
import { UnauthenticatedError, BadRequestError } from "../errors"
import { User } from "../models/User.model"

export const register = async(req:Request, res:Response)=>{
    const user = await User.create({...req.body})
    res.status(200).json({msg:"success", userCreated: user})
}

export const login = async(req:Request, res:Response)=>{
    const {password, email} = req.body

    if (!password || !email){
        throw new BadRequestError("Please provide name, email and password")
    }

    const user = await User.findOne({email})
    if (!user){
         throw new UnauthenticatedError("Invalid credentials. No user in database")
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch){
        throw new UnauthenticatedError("Invalid credentials. Wrong password")
    }

    const token = user.createJWT()
    
    res.status(200).json({ user:{name: user.name}, token})
}
