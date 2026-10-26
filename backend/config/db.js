import mongoose from "mongoose"

const connectDb=async ()=>{
    try {
        const mongoUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/virtual-assistant"
        await mongoose.connect(mongoUrl)
        console.log("Database connected successfully")
    } catch (error) {
        console.log(error)
    }
}

export default connectDb