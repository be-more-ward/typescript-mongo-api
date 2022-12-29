import app from "./app"
import connectDB from "./DB/connect"


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