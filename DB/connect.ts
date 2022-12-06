import mongoose from "mongoose";

const connect =(url:string) => {
    mongoose.connect(url)
}
export default connect