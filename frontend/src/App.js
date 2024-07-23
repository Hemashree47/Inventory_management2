import React, { useState, useEffect } from 'react';
import AddProjectModal from './AddProjectModal';
import './App.css';
import AddComponentModal from './AddComponent'
import { getAllProjects,addProject,getProjectComponents, addComponent  } from './projectApi';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenComponentModal = () => setIsComponentModalOpen(true);
  const handleCloseComponentModal = () => setIsComponentModalOpen(false);

  const handleSubmitProject = async (projectName) => {
    try {
      await addProject(projectName);
      alert('Project added successfully');
      fetchProjects(); // Refresh the project list
      handleCloseModal();
    } catch (error) {
      alert('Error adding project');
    }
    handleCloseModal();
  };


  const handleSubmitComponent = async (componentName, quantity) => {
    try {
        console.log('Adding component:', { componentName, quantity });
        await addComponent(selectedProject, { componentName, quantity });
        await fetchComponents(selectedProject);
        handleCloseComponentModal();
    } catch (error) {
        console.error('Error adding component:', error);
        alert('Error adding component');
    }
};

  const fetchComponents = async (projectName) => {
    try {
        console.log('Fetching components for project:', projectName);
        const response = await getProjectComponents(projectName);
        console.log('Components fetched:', response.data.components);
        setComponents(response.data.components);
    } catch (error) {
        console.error('Error fetching components:', error);
        setError('Failed to fetch components');
    }
};

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getAllProjects();
      setProjects(response.data.projectNames);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch projects');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = async (projectName) => {
    console.log('Project clicked:', projectName); // Debugging line
    setSelectedProject(projectName);
    await fetchComponents(projectName); // Ensure `fetchComponents` is awaited
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  
  return (
    <div className='app-container'>
      <button className='but' onClick={handleOpenModal}>Add Project</button>

      <h1>Project List</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {projects.length > 0 ? (
        <ul className="project-list">
          {projects.map((projectName, index) => (
            <li key={index} onClick={() => handleProjectClick(projectName)}>
            {projectName}
          </li>
          ))}
        </ul>
      ) : (
        <p>No projects available</p>
      )}

{selectedProject && (
    <div>
        <h2>Components for {selectedProject}</h2>
        <button onClick={handleOpenComponentModal}>Add Component</button>
        {components && Object.keys(components).length > 0 ? (
            <ul className="component-list">
                {Object.entries(components).map(([componentName, { quantity }]) => (
                    <li key={componentName}>
                        {componentName}: {quantity}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No components available</p>
        )}
    </div>
)}



      <AddProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
      />
      <AddComponentModal
        isOpen={isComponentModalOpen}
        onClose={handleCloseComponentModal}
        onSubmit={handleSubmitComponent}
      />


    </div>
  );
};

export default App;
