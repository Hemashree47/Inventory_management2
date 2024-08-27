import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl text-gray-600 font-bold mb-6">Admin Dashboard</h1>
      <button
        onClick={() => navigate('/adminRequestLists')}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-blue-600"
      >
        Request Lists
      </button>
      <button
        onClick={() => navigate('/adminManageUsers')}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-green-600"
      >
        Manage Users
      </button>
      <button
        onClick={() => navigate('/adminSettings')}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-red-600"
      >
        Settings
      </button>
    </div>
  );
};

export default AdminDashboard;
