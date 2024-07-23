import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import ProjectModal from './ProjectModal';
import ProjectComponentsPage from './ProjectComponentsPage'; 
import AddComponentModal from './AddComponentModal';
import AddProjectModal from './AddProjectModal';
import ProjectList from './ProjectList';
import Signup from './Signup';
import Login from './Login';
function App() {
  return (
    <div>
      
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/projects/:projectName" element={<ProjectComponentsPage />} />
          <Route path="/ProjectModal" element={<ProjectModal />} />
        </Routes>
      
      {/* < ProjectComponentsPage/> */}
      {/* <Signup /> */}
      {/* <ProjectModal /> */}
        </div>
  )
}

export default App