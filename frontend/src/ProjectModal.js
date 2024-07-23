import React, { useState, useEffect } from 'react';
import AddProjectModal from './AddProjectModal';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./ProjectModal.css";
import { getAllProjects, addProject } from './projectApi';
import ProjectComponentsPage from './ProjectComponentsPage';

const ProjectModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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

  return (
    <div className='app-container'>
      <button className='but' onClick={handleOpenModal}>Add Project</button>

      <h1>Project List</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {projects.length > 0 ? (
        <ul className="project-list">
          {projects.map((projectName, index) => (
            <li key={index}>
              <Link to={`/projects/${projectName}`}>{projectName}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects available</p>
      )}

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
      />
    </div>
  );
};

export default ProjectModal;
