import React, { useEffect, useState } from 'react';
import { getProjectComponents } from './projectApi';

const ProjectComponents = ({ projectName }) => {
  const [components, setComponents] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await getProjectComponents(projectName);
        setComponents(response.components);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      }
    };

    fetchComponents();
  }, [projectName]);

  return (
    <div>
      <h2>Components for {projectName}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {Object.entries(components).map(([name, { quantity }]) => (
          <li key={name}>
            {name}: {quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectComponents;
