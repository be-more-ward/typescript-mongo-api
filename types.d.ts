

// JOB MODEL INTERFACES

export interface IJob {
    company:string,
    position:string,
    status:string,
    createdBy: mongoose.Schema.Types.ObjectId

}



// USER MODEL INTERFACES

export interface IUser {
    name:string,
    password: string,
    email:string
}

export interface IUserMethods {
    comparePassword(pw:string): Promise<boolean>
    createJWT (): string
}

export type UserModel = Model<IUser, {}, IUserMethods>



// EXTENDING REQUEST
declare global {
    namespace Express{
        interface Request{
            user: {name:string, userId:string}
        }
    }
}


// JWT PAYLOAD
export interface IUserDetailsJWT extends jwt.JwtPayload{
    userId: string,
    name:string
}