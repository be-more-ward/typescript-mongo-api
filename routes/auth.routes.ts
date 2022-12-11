import {Router} from "express";
const router = Router()

import {login, register} from "../controller/auth.controller"
import validator from "../middleware/validator"
import {UserRegisterSchema, UserLoginSchema} from "../validations/user-validation"


router.post("/register", validator(UserRegisterSchema), register)
router.post("/login", validator(UserLoginSchema), login)



export default router