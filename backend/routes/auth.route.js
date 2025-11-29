import express from "express";
import multer from "multer";

import {login,signup,logout,checkSession,validatePassword, adminSignup,getAllUsers,deleteUser} from "../controller/login.controller.js"

import {addProject,addComponents,getAllProjects,getProjectComponents,updateComponentQuantity,deleteProject,updateProjectName,updateComponentName,deleteComponents} from "../controller/project.controller.js"

import {sendMail,response,getRequests,getAttachments,updateStatus,requests,Middleware,adminRequests} from '../controller/mail.controller.js';

import { getRegisterComponents,addRegisterComponents,updateRegisterComponentName,updateRegisterComponentQuantity,deleteRegisterComponent } from "../controller/components.controller.js";

// Multer setup
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const router=express.Router();


router.post("/login",login);

//router.post("/login/user",loginAdmin);

router.post("/signup",signup);

router.post('/logout',logout);

router.post("/addProject",addProject);

//router.post("/addComponents/:projectName",addComponents);

router.post("/projects/:projectName/components", addComponents);

router.get("/projects/:projectName/components", getProjectComponents);

router.get("/projects",getAllProjects);

router.put("/projects/:projectName/components/:componentName",updateComponentQuantity)

router.delete("/projects/:projectName",deleteProject);

router.delete("/checkSession",checkSession);

router.put("/projects/:projectName",updateProjectName);

router.get("/getRegisterComponents",getRegisterComponents);

router.post("/addRegisterComponents",addRegisterComponents);

router.put("/components/:componentName/name",updateRegisterComponentName);

router.put('/components/:componentName/quantity', updateRegisterComponentQuantity);

router.delete('/components/:componentName', deleteRegisterComponent); 

// Update component quantity
router.put('/projects/:projectName/components/:componentName/quantity', updateComponentQuantity);

// Update component name
router.put('/projects/:projectName/components/:componentName/name', updateComponentName);

// Delete component
router.delete('/projects/:projectName/components/:componentName', deleteComponents);


router.post('/validate-password', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Password validated successfully' });
    } catch (error) {
        console.error('Error validating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/sendMail', upload.array('attachments'),sendMail)
    
router.get('/response', response);

router.get('/getRequests/:userId',getRequests);

router.get('/attachments/:id/:filename',getAttachments);

router.put('/updateStatus/:id',updateStatus);

router.get('/requests',Middleware ,requests)

router.get('/adminRequests',adminRequests)

router.post('/adminSignup',adminSignup)


//users

router.get('/getAllUsers',getAllUsers)

router.delete('/deleteUser/:username',deleteUser)


export default router;