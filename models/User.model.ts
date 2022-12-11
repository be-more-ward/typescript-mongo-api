import { model, Schema} from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { IUser, UserModel, IUserMethods } from "../types";


const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
    name:{
        type:String,
        required: true,
        minlength:3,
        maxlength:20
    },
    password:{
        type:String,
        required: true,
        minlength:3
    },
    email:{
        type:String,
        required: true,
        unique:true
    }
})

UserSchema.pre("save", async function (){
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
})

UserSchema.method("comparePassword", async function(candidatePassword){
    const isMatch = await bcryptjs.compare(candidatePassword, this.password)
    return isMatch
})

UserSchema.method("createJWT", function(): string{
    const token = jwt.sign({name:this.name, userId: this._id}, String(process.env.JWT_SECRET), {expiresIn:"1d"})
    return token
})


export const User = model<IUser, UserModel>("User", UserSchema)
