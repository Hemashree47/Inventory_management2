import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddComponentModal from './AddComponentModal';
import PasswordModal from './PasswordModal';
import { getProjectComponents, addComponent, updateComponentQuantity } from './projectApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FIXED_PASSWORD = "0000";

const ProjectComponentsPage = () => {
    const { projectName } = useParams();
    const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
    const [components, setComponents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // Track pending actions

    const handleOpenComponentModal = () => setIsComponentModalOpen(true);
    const handleCloseComponentModal = () => setIsComponentModalOpen(false);

    const handleSubmitComponent = async (componentName, quantity) => {
        try {
            await addComponent(projectName, { componentName, quantity });
            toast.success('Component added successfully',{
                autoClose:2000,
            });
            await fetchComponents(); // Refresh the component list
            handleCloseComponentModal();
        } catch (error) {
            console.error('Error adding component:', error);
            toast.error('Error adding component', { autoClose: 2000 });
        }
    };

    const askForPassword = (action) => {
        setPendingAction(() => action); // Set the action to be performed after authentication
        setIsPasswordModalOpen(true); // Open the password modal
    };

    const handlePasswordSubmit = (enteredPassword) => {
        if (enteredPassword === FIXED_PASSWORD) {
            setIsAuthenticated(true);
            setIsPasswordModalOpen(false);
            if (pendingAction) {
                pendingAction(); // Perform the pending action after successful authentication
                setPendingAction(null); // Clear the pending action
            }
        } else {
            toast.error('Incorrect password', { autoClose: 2000 });
            setIsPasswordModalOpen(false); // Close the modal on error
        }
    };
    
    

    const handleQuantityChange = (componentName, newQuantity) => {
        if (!isAuthenticated) {
            // Request password for authentication
            askForPassword(() => {
                // Action to perform if authenticated
                updateComponentQuantity(projectName, componentName, newQuantity)
                    .then(() => {
                        fetchComponents(); // Refresh the component list after update
                    })
                    .catch(error => {
                        console.error('Error updating component quantity:', error);
                        toast.error(error.message || 'Error updating component quantity', { autoClose: 2000 });
                    });
            });
        } else {
            // If already authenticated, proceed with the update
            updateComponentQuantity(projectName, componentName, newQuantity)
                .then(() => {
                    fetchComponents(); // Refresh the component list after update
                })
                .catch(error => {
                    console.error('Error updating component quantity:', error);
                    toast.error(error.message || 'Error updating component quantity', { autoClose: 2000 });
                });
        }
    };

    const fetchComponents = async () => {
        try {
            const response = await getProjectComponents(projectName);
            setComponents(response.components || {}); // Ensure components is always an object
            setLoading(false);
        } catch (error) {
            console.error('Error fetching components:', error);
            setError('Failed to fetch components');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComponents();
    }, [projectName]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Components for {projectName}</h2>
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 mb-4"
                onClick={handleOpenComponentModal}
            >
                Add Component
            </button>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {Object.keys(components).length > 0 ? (
                <ul className="bg-white shadow-md rounded-lg p-4">
                    {Object.entries(components).map(([componentName, { quantity }]) => (
                        <li key={componentName} className="border-b last:border-none py-2 flex justify-between items-center">
                            <span className="font-medium">{componentName}</span>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="bg-gray-300 p-1 rounded"
                                    onClick={() => handleQuantityChange(componentName, quantity - 1)}
                                    disabled={quantity <= 0}
                                >
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button
                                    className="bg-gray-300 p-1 rounded"
                                    onClick={() => handleQuantityChange(componentName, quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
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
            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={handlePasswordSubmit}
            />
        </div>
    );
};

export default ProjectComponentsPage;
