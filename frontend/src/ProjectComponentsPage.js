import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddComponentModal from './AddComponentModal';
import { getProjectComponents, addComponent } from './projectApi';
import './ProjectComponentsPage.css';

const ProjectComponentsPage = () => {
    const { projectName } = useParams();
    const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleOpenComponentModal = () => setIsComponentModalOpen(true);
    const handleCloseComponentModal = () => setIsComponentModalOpen(false);

    const handleSubmitComponent = async (componentName, quantity) => {
        try {
            await addComponent(projectName, { componentName, quantity });
            await fetchComponents(projectName); // Refresh the component list
            handleCloseComponentModal();
        } catch (error) {
            alert('Error adding component');
        }
    };

    const fetchComponents = async (projectName) => {
        try {
            console.log('Fetching components for project:', projectName);
            const response = await getProjectComponents(projectName);
            console.log('Components fetched:', response.data.components);
            setComponents(response.data.components);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching components:', error);
            setError('Failed to fetch components');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComponents(projectName);
    }, [projectName]);

    return (
        <div className="project-components-page">
            <h2>Components for {projectName}</h2>
            <button onClick={handleOpenComponentModal}>Add Component</button>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
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
            <AddComponentModal
                isOpen={isComponentModalOpen}
                onClose={handleCloseComponentModal}
                onSubmit={handleSubmitComponent}
            />
        </div>
    );
};

export default ProjectComponentsPage;
