require("dotenv").config()
import "express-async-errors"

import express from "express";
const app = express()

// import SECURITY
import helmet from "helmet"
import cors from "cors"
import xss from "xss-clean"
import rateLimiter from "express-rate-limit"


//MIDDLEWARE IMPORTS
import  {errorHandler} from "./middleware/error-handler";
import {notFound} from "./middleware/not-found";
import authenticateUser from "./middleware/authentication"

// import routers
import authRouter from "./routes/auth.routes"
import jobsRouter from "./routes/jobs.routes"


app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, //15min
    max: 100 //limit each IP to 100 request per windowMs
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())


// Routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUser, jobsRouter)


app.use(errorHandler)
app.use(notFound)


export default app