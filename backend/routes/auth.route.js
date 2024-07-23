import express from "express";
import {login,signup} from "../controller/login.controller.js"
import {addProject,addComponents,getAllProjects,getProjectComponents} from "../controller/project.controller.js"
const router=express.Router();


router.post("/login",login);

router.post("/signup",signup);

router.post("/addProject",addProject);

//router.post("/addComponents/:projectName",addComponents);

router.post("/projects/:projectName/components", addComponents);

router.get("/projects/:projectName/components", getProjectComponents);

router.get("/projects",getAllProjects);



export default router;