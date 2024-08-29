import React from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ButtonPage = () => {
    
    const navigate=useNavigate();

    const handleClick = (buttonName) => {
        alert(`${buttonName} clicked!`);
    };


    const handleLogout = async () => {
      try {
          await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
          toast.success('Logout Successfully!!', { autoClose: 1000 });
          // Clear user-related data from local storage
          localStorage.removeItem('userId');
          localStorage.removeItem('adminRole');
          
          // Use replace to prevent back navigation
          navigate('/login', { replace: true });
  
          // Optionally, reload the page to ensure state is reset
          window.location.reload();
      } catch (error) {
          console.error('Error during logout:', error);
          toast.error('Failed to log out', { autoClose: 1000 });
      }
  };
  

    return (
      <div className="relative flex flex-col items-center justify-center h-screen">
          {/* Centered buttons */}
          <div className="space-x-4">
              <button
                  onClick={() => navigate('/RequestLists')}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-blue-600"
              >
                  Request History
              </button>
              <button
                  onClick={() => navigate('/RequestForm')}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-green-600"
              >
                  Request Form
              </button>
              
          </div>

          {/* Logout button in the top-right corner */}
          <div className="absolute top-4 right-4">
              <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                  onClick={handleLogout}
              >
                  Logout
              </button>
          </div>
      </div>
  );
};

export default ButtonPage;
