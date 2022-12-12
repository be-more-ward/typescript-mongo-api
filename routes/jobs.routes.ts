import {Router} from "express";
const router = Router()

import {getAllJobs, getJob, createJob, updateJob, deleteJob} from "../controller/jobs.controller"
import validator from "../middleware/validator";
import { JobCreateSchema, JobUpdateSchema } from "../validations/job-validation";


router.get("/", getAllJobs)
router.post("/", validator(JobCreateSchema) , createJob)

router.get("/:id", getJob)
router.patch("/:id", validator(JobUpdateSchema), updateJob)
router.delete("/:id", deleteJob)


export default router