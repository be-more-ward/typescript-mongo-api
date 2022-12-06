import {Router} from "express";
const router = Router()

import {login, register} from "../controller/auth.controller"

router.route("/register").post(register)
router.route("/login").post(login)


export default router