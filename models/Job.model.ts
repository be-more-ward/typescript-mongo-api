import mongoose from "mongoose";

interface IJob {
    company:string,
    position:string,
    status:string,
    createdBy: mongoose.Schema.Types.ObjectId

}


const JobSchema = new mongoose.Schema({
    company:{
        type: String,
        required: [true, "please provide company name"],
        maxlength: 50,
    },
    position:{
        type: String,
        required:[true, "please provide position"],
        maxlength: 100
    },
    status:{
        type: String,
        enum: ["interview", "declined", "pending"],
        default: "pending",
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "please provide user"]
    },
},{timestamps: true})


export const Job = mongoose.model<IJob>("Job", JobSchema)