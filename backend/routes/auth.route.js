import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";

import {login,signup,logout,checkSession,validatePassword,authenticateToken} from "../controller/login.controller.js"

import {addProject,addComponents,getAllProjects,getProjectComponents,updateComponentQuantity,deleteProject,updateProjectName} from "../controller/project.controller.js"

import {sendMail,response,getRequests,getAttachments,updateStatus,requests} from '../controller/mail.controller.js';

const upload = multer({ dest: 'uploads/' }); 

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

router.get('/getRequests',getRequests);

router.get('/attachments/:id/:filename',getAttachments);

router.put('/updateStatus/:id',updateStatus);

router.get('/:userId/requests' ,requests)

export default router;