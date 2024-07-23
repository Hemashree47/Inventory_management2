// src/components/AddProjectModal.js
import React, { useState } from 'react';
import './AddProjectModal.css'; // Custom styles

const AddProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(projectName);
    setProjectName('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add Project</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Project Name:
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </label>
          <div className="modal-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
