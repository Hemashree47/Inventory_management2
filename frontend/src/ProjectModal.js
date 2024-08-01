import React, { useState, useEffect } from 'react';
import AddProjectModal from './AddProjectModal';
import UpdateProjectModal from './UpdateProjectModal'; // Import the new modal
import { Link, useNavigate } from 'react-router-dom';
import { getAllProjects, addProject, deleteProject, updateProject } from './projectApi';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjectModal = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for update modal
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null); // Track selected project for updating
  const navigate = useNavigate();

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenUpdateModal = (projectName) => {
    setSelectedProject(projectName);
    setIsUpdateModalOpen(true);
  };
  const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);

  const handleSubmitProject = async (projectName) => {
    try {
      await addProject(projectName);
      toast.success('Project added successfully', { autoClose: 2000 });
      fetchProjects(); // Refresh the project list
      handleCloseAddModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.warning('Project name already exists', { autoClose: 2000 });
      } else {
        toast.error('Error adding project', { autoClose: 2000 });
      }
    }
  };

  const handleUpdateProject = async (oldProjectName, newProjectName) => {
    try {
      await updateProject(oldProjectName, newProjectName);
      toast.success('Project updated successfully', { autoClose: 2000 });
      fetchProjects(); // Refresh the project list
      handleCloseUpdateModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.warning('Project name already exists', { autoClose: 2000 });
      } else {
        toast.error('Error updating project', { autoClose: 2000 });
      }
    }
  };

  const handleDeleteProject = async (projectName) => {
    try {
      await deleteProject(projectName);
      toast.success('Project deleted successfully', { autoClose: 2000 });
      fetchProjects(); // Refresh the project list
    } catch (error) {
      toast.error('Error deleting project', { autoClose: 2000 });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      toast.success('Logout Successfully!!', { autoClose: 1000 });
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out', { autoClose: 1000 });
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

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <div className="flex-none h-1/5 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mt-4">Project List</h1>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <div className="flex flex-col items-end">
          <button
            className="text-sm text-gray-600 mb-2"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            onClick={handleOpenAddModal}
          >
            Add Project
          </button>
        </div>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 sticky top-0">
          <tr>
            <th className="py-2 px-3 border-b">Project Name</th>
          </tr>
        </thead>
      </table>
      <div className="flex-grow overflow-y-auto">
        {projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <tbody>
                {projects.map((projectName, index) => (
                  <tr key={index} className="bg-gray-100 border-b hover:bg-gray-200 transition duration-300">
                    <td className="py-2 px-4">
                      <Link className="text-blue-500 hover:underline" to={`/projects/${projectName}`}>{projectName}</Link>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        className="text-red-500 hover:underline mx-2"
                        onClick={() => handleDeleteProject(projectName)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                      <button
                        className="text-blue-500 hover:underline mx-2"
                        onClick={() => handleOpenUpdateModal(projectName)}
                      >
                        <i className="fas fa-pencil-alt"></i> {/* FontAwesome pencil icon */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No projects available</p>
        )}
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleSubmitProject}
      />
      <UpdateProjectModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onSubmit={handleUpdateProject}
        oldProjectName={selectedProject}
      />
    </div>
  );
};

export default ProjectModal;
