import mongoose from "mongoose";

export const connectDB = async ()=>{
    try{
        console.log("db");
        const con = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected : ${con.connection.host}`)
    }catch(error){
        // console.log("mongoDB connection error:",error);
        console.log("mongoDB connection error:");
    }
}