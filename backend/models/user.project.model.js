import mongoose from "mongoose";
const componentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    quantity:{
        type:Number,
        required:true
    }

})


const projectSchema=new mongoose.Schema({
    projectName:{
        type:String,
        required:true,
        unique:true
    },

    components:{
        type:Map,
        of:componentSchema,
        default:{}
    }
})

const Project=mongoose.model("Project",projectSchema);

export default Project;