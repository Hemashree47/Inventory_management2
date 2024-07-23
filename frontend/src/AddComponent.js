import React, { useState } from 'react';
import './AddComponent.css'; // Ensure you create a corresponding CSS file

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
        <div className="modal-overlay">
            <div className="modal-box">
                <h2>Add Component</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="componentName">Component Name:</label>
                        <input
                            type="text"
                            id="componentName"
                            value={componentName}
                            onChange={(e) => setComponentName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddComponentModal;
