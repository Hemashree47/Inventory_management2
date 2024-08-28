import express from "express";
import multer from "multer";

import {login,signup,logout,checkSession,validatePassword,authenticateToken, adminSignup} from "../controller/login.controller.js"

import {addProject,addComponents,getAllProjects,getProjectComponents,updateComponentQuantity,deleteProject,updateProjectName} from "../controller/project.controller.js"

import {sendMail,response,getRequests,getAttachments,updateStatus,requests,Middleware,adminRequests} from '../controller/mail.controller.js';

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

router.post('/validate-password', validatePassword);

router.post('/sendMail', upload.array('attachments'),sendMail)
    
router.get('/response', response);

router.get('/getRequests/:userId',getRequests);

router.get('/attachments/:id/:filename',getAttachments);

router.put('/updateStatus/:id',updateStatus);

router.get('/requests',Middleware ,requests)

router.get('/adminRequests',adminRequests)

router.post('/adminSignup',adminSignup)

export default router;