require("dotenv").config()
import "express-async-errors"

import express from "express";
const app = express()

// Database
import connectDB from "./DB/connect";

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


app.use(errorHandler)
app.use(notFound)



const port = 3000

const start =async () => {
    try {
        connectDB (String(process.env.MONGO_URI))
        console.log("connected to db");

        app.listen(port, ()=>{
            console.log(`sv listening port:${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}
start()
