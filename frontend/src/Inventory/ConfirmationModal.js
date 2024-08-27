// ConfirmationModal.js
import React from 'react';
import Modal from 'react-modal'; // Ensure this import is correct

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    contentLabel="Confirm Delete"
    className="fixed inset-0 flex items-center justify-center p-4"
    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50"
  >
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">{message}</h2>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
          onClick={onConfirm}
        >
          Yes
        </button>
        <button
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-500"
          onClick={onClose}
        >
          No
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmationModal;
