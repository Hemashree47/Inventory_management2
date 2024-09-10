import React, { useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';

Modal.setAppElement('#root'); // Adjust as needed

const DownloadReportModal2 = ({ isOpen, onRequestClose, projects, vendors, statuses, usernames, onDownload }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);

  const handleDownload = () => {
    onDownload(selectedProject, selectedVendor, selectedStatus, selectedUsername);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Download Report"
      className="fixed inset-0 flex items-center justify-center p-4 z-50" // Ensure high z-index
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40" // Ensure high z-index for overlay
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative z-50">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Download Report</h2>
        <form>
          {/* Form content */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Project</label>
            <Select
              options={projects}
              value={selectedProject}
              onChange={setSelectedProject}
              placeholder="Select a project"
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Vendor</label>
            <Select
              options={vendors}
              value={selectedVendor}
              onChange={setSelectedVendor}
              placeholder="Select a vendor"
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Status</label>
            <Select
              options={statuses}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Select a status"
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleDownload}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Download
            </button>
            <button
              type="button"
              onClick={onRequestClose}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DownloadReportModal2;
