import React from 'react';
import {Link, useNavigate} from 'react-router-dom'


const ButtonPage = () => {
    
    const navigate=useNavigate();

    const handleClick = (buttonName) => {
        alert(`${buttonName} clicked!`);
    };

  return (
    <div className="flex flex-row items-center justify-center h-screen space-x-4">
      <button
        onClick={() => navigate('/RequestLists')}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-blue-600"
      >
        Button 1
      </button>
      <button
        onClick={() => navigate('/RequestForm')}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-green-600"
      >
        Request Form
      </button>
    
    </div>
  );
};

export default ButtonPage;
