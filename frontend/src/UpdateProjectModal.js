import React, { useState,useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProjectModal = ({ isOpen, onClose, onSubmit, oldProjectName }) => {
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewProjectName(''); // Reset the new project name when the modal is opened
    }
  }, [isOpen, oldProjectName]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProjectName && newProjectName !== oldProjectName) {
      onSubmit(oldProjectName, newProjectName);
    } else {
      toast.warning('New project name cannot be empty or same as oldProjectName',{
        autoClose:2000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Update Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="new-project-name">
              New Project Name
            </label>
            <input
              id="new-project-name"
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="New Project Name"
              required
              className="w-full border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 py-2 px-4 rounded hover:bg-gray-200 transition duration-300"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProjectModal;
