import Project from "../models/user.project.model.js";

export const addProject=async(req,res)=>{
    try{
        const { projectName } = req.body;

        if (!projectName || typeof projectName !== 'string') {
            return res.status(400).json({ error: 'Valid project name is required' });
        }
        
       

        // Check if projectName already exists
        const existingProject = await Project.findOne({ projectName });
        if (existingProject) {
            return res.status(400).json({ error: 'Project name already exists' });
        }
        

        const newProject = new Project({ projectName });

        try {
            await newProject.save();
        } catch (error) {
            console.error("Error saving project:", error);
            return res.status(500).json({ error: "Error saving project" });
        }
        res.status(201).json({ msg: 'Project saved successfully' });
    }
    catch(error){
        console.log("Error in Project controller",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}


export const addComponents=async(req,res)=>{
    try{
        const {projectName}=req.params;
        const {componentName,quantity}=req.body;


        if (!componentName || typeof componentName !== 'string') {
            return res.status(400).json({ error: 'Valid component name is required' });
        }

        if (quantity == null || typeof quantity !== 'number') {
            return res.status(400).json({ error: 'Valid component quantity is required' });
        }

        const project=await Project.findOne({projectName});
        if(!project){
            return res.status(404).json({error:"Project not found"})
        }

        project.components.set(componentName,{ name: componentName,quantity});
        await project.save();

        res.status(201).json({ msg: 'Component added successfully' });

    }
    catch (error) {
        console.error('Error in adding component:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



export const getAllProjects = async (req, res) => {
    try {
        // Retrieve all projects from the database
        const projects = await Project.find({}, 'projectName');

        // Map the projects to an array of project names
        const projectNames = projects.map(project => project.projectName);

        // Respond with the list of project names
        res.status(200).json({ projectNames });
    } catch (error) {
        console.error("Error in fetching project names:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getProjectComponents = async (req, res) => {
    try {
        const { projectName } = req.params;

        // Retrieve the project based on the project name
        const project = await Project.findOne({ projectName });

        // Check if the project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Respond with the project's components
        res.status(200).json({ components: project.components });
    } catch (error) {
        console.error("Error in fetching project components:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
