import { Request, Response } from "express"
import { Job } from "../models/Job.model"
import { BadRequestError, NotFoundError } from "../errors"

export const getAllJobs = async(req:Request, res:Response)=>{
    const {userId} = req.user
    const jobs = await Job.find({createdBy: userId}).sort("-createdAt")
    res.status(200).json({jobs})
}
export const getJob = async(req:Request, res:Response)=>{
    const {userId} = req.user
    const {id: jobId} = req.params

    const job = await Job.findOne({ _id:jobId, createdBy:userId })
    if (!job) throw new NotFoundError(`Not job with id: ${jobId}`)

    res.status(200).json({job})
}
export const createJob = async(req:Request, res:Response)=>{
    const {company, position} = req.body
    const {userId} = req.user
    const job = await Job.create({company,position, createdBy:userId})
    res.status(200).json({job})
}
export const updateJob = async(req:Request, res:Response)=>{
    const {company, position} = req.body
    const {userId} = req.user
    const {id: jobId} = req.params

    if (!company || !position) throw new BadRequestError("company or position cannot be empty")

    const job = await Job.findOneAndUpdate({_id: jobId, createdBy: userId }, req.body, {new:true, runValidators:true})
    if (!job) throw new NotFoundError(`Not job with id: ${jobId}`)
    
    res.status(200).json({job})
}
export const deleteJob = async(req:Request, res:Response)=>{
    const {userId} = req.user
    const {id: jobId} = req.params

    const job = await Job.findByIdAndRemove({ _id: jobId, createdBy:userId })
    if(!job) throw new NotFoundError(`Not job with id: ${jobId}`)
    
    res.status(200).send()
}