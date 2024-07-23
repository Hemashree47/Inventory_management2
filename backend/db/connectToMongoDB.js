import mongoose from "mongoose";

const connectToMongoDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to db")
        
    }
    catch(error){
        console.log("Error while connecting to db",error.message)
    }
};

export default connectToMongoDB;