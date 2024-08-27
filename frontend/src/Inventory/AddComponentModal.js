import React, { useState } from 'react';

const AddComponentModal = ({ isOpen, onClose, onSubmit }) => {
    const [componentName, setComponentName] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(componentName, parseInt(quantity, 10));
        setComponentName('');
        setQuantity('');
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-2xl font-bold mb-4">Add Component</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="componentName" className="block text-gray-700 font-medium mb-1">
                            Component Name:
                        </label>
                        <input
                            type="text"
                            id="componentName"
                            value={componentName}
                            onChange={(e) => setComponentName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="quantity" className="block text-gray-700 font-medium mb-1">
                            Quantity:
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddComponentModal;
