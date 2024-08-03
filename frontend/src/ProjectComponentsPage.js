import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddComponentModal from './AddComponentModal';
import PasswordModal from './PasswordModal';
import { getProjectComponents, addComponent, updateComponentQuantity } from './projectApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import logo from './images/xyma.png'
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
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

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

    const filteredComponents = Object.entries(components).filter(([componentName]) =>
        componentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-screen flex flex-col bg-blue-100">
            {/* <div className="flex justify-center mb-6">
                <img src={logo} alt="Logo" className="h-16" />
            </div> */}
            <div className="flex justify-between items-center p-4">
                <h2 className="text-2xl font-bold">Components for {projectName}</h2>
                <div className='relative'>
                <input
                    type="text"
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 pl-10 rounded-xl w-full"
                />
                 <i className="fas fa-search absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
                 </div>
            </div>
            <button
                className="ml-4 bg-blue-500 text-white text-bold py-2 px-2 rounded hover:bg-blue-700 transition duration-300 mb-4 self-start"
                onClick={handleOpenComponentModal}
            >
                Add Component
            </button>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex-grow bg-white shadow-md rounded-lg overflow-hidden">
                <ul className="p-4 h-full overflow-y-auto bg-gradient-to-r from-mint to-pink-100">
                    {filteredComponents.length > 0 ? (
                        filteredComponents.map(([componentName, { quantity }]) => (
                            <li key={componentName} className="border-b last:border-none py-2 flex justify-between items-center">
                                <span className="font-medium">{componentName}</span>
                                <div className="flex items-center justify-center space-x-2">
                                    <button
                                        className="bg-gray-300 p-1 rounded hover:bg-gray-400 transition duration-300"
                                        onClick={() => handleQuantityChange(componentName, quantity - 1)}
                                        disabled={quantity <= 0}
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-semibold">{quantity}</span>
                                    <button
                                        className="bg-gray-300 p-1 rounded hover:bg-gray-400 transition duration-300"
                                        onClick={() => handleQuantityChange(componentName, quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-900">No components available</p>
                    )}
                </ul>
            </div>
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
