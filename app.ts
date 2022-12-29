require("dotenv").config()
import "express-async-errors"

import express from "express";
const app = express()

//MIDDLEWARE IMPORTS
import  {errorHandler} from "./middleware/error-handler";
import {notFound} from "./middleware/not-found";
import authenticateUser from "./middleware/authentication"

// import routers
import authRouter from "./routes/auth.routes"
import jobsRouter from "./routes/jobs.routes"



app.use(express.json())

// Routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUser, jobsRouter)

app.post("/test", (req, res)=>{
    const tt = req.body
    res.status(200).json({msg: tt})
})


app.use(errorHandler)
app.use(notFound)


export default app