import React, { useState, useEffect, useRef} from 'react';
import { sendEmail } from '../mailApi'; // Adjust this path if needed
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestForm = () => {
  const [formData, setFormData] = useState({
    project: '',
    vendor: '',
    leadTime: '',
    amount: '',
    approvers: '',
    attachments: [],
    userId: '', // Include userId in the state
  });

   // Reference for the file input
   const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: storedUserId,
        }));
    } else {
      toast.error("User ID is missing. Please log in again.", { autoClose: 2000 });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  console.log('Selected Files:', files); // Debugging
  setFormData((prevData) => ({
      ...prevData,
      attachments: files, // Update state with file array
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId || typeof storedUserId !== 'string') {
        toast.error("User ID is missing or incorrect. Please log in again.", { autoClose: 2000 });
        return;
    }

    // Check if attachments are provided
    if (formData.attachments.length === 0) {
      toast.error("Attachments are required to submit the request.", { autoClose: 2000 });
      return;
  }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'attachments') {
        formData.attachments.forEach(file => {
          data.append('attachments', file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    // Check for any previous 'userId' values and remove them
    data.delete('userId');

    // Append userId as a string
    data.append('userId', storedUserId);

    // Debugging: Log FormData content
    for (let pair of data.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    try {
        await sendEmail(data);
        toast.success("Request submitted successfully!", { autoClose: 2000 });
        resetForm();
        
         // Refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);

     
      
        
    } catch (error) {
        console.error("Detailed error:", error);
        toast.error("Failed to submit request. Please try again.", { autoClose: 2000 });
    }
};

  

  const resetForm = () => {
    setFormData({
      project: '',
      vendor: '',
      leadTime: '',
      amount: '',
      approvers: '',
      attachments: [],
      userId: formData.userId, // Preserve userId when resetting the form
    });

    // If you are using a file input element, reset it too
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input field
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-blue-900">
      <h1 className="text-white font-bold text-2xl text-center mb-7">PURCHASE REQUEST FORM</h1>
      <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto bg-blue-200 p-6 rounded-lg shadow-md w-full max-w-4xl">
        <div className="mb-4">
          <label htmlFor="project" className="block text-sm font-medium text-gray-700">Project</label>
          <input
            type="text"
            id="project"
            name="project"
            value={formData.project}
            onChange={handleChange}
            placeholder="Project name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">Vendor</label>
          <input
            type="text"
            id="vendor"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            placeholder="Vendor name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="leadTime" className="block text-sm font-medium text-gray-700">Delivery Lead Time</label>
          <input
            type="date"
            id="leadTime"
            name="leadTime"
            value={formData.leadTime}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Total Purchase Amount</label>
          <input
            type="number" // Use number input for amount
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="approvers" className="block text-sm font-medium text-gray-700">Approvers</label>
          <input
            type="text"
            id="approvers"
            name="approvers"
            value={formData.approvers}
            onChange={handleChange}
            placeholder="Purchase Approvers"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">Attachments</label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex">
          <button
            type="submit"
            className="mb-8 ml-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700"
          >
            Submit Request
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="mb-8 ml-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700"
          >
            New Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
