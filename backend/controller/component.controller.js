import userComp from "../models/user.component.model.js";

export const component=async(req,res)=>{
    try{
        const {componentName,quantity }=req.body;

        const user=await userComp.findOne({componentName});
        if(user){
            return res.status(400).json({error:"Component Name already exists"})
        }
        const newComponent=new userComp({componentName,quantity});

        await newComponent.save()

        res.status(201).json({ msg: 'component added successfully' });

    }
    catch(error){
        console.log("Error in component controller",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
    
}

export const project=async(req,res)=>{
    try{
        const project=await userProject.find();
        if(project){
            return res.status(400).json({error:"project name already used"})
        }
        const newProject=new newProject({projectName});

        await newProject.save()

        res.status(201).json({ msg: 'Project added successfully' });
    }
    catch(error){
        console.log("Error in Project controller",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}