import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import ProjectModal from './ProjectModal';
import ProjectComponentsPage from './ProjectComponentsPage'; 
import AddComponentModal from './AddComponentModal';
import AddProjectModal from './AddProjectModal';
import ProjectList from './ProjectList';
function App() {
  return (
    <div>
      
        <Routes>
          <Route path="/" element={<ProjectModal/>}/>
          <Route path="/projects/:projectName" element={<ProjectComponentsPage />} />
        </Routes>
      
      {/* < ProjectComponentsPage/> */}
      
        </div>
  )
}

export default App