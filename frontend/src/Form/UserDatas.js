import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUsers } from '../projectApi';
import ConfirmationModal3 from './ConfirmationModal3'; // Import the modal component
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const UserDatas = () => {
  const [users, setUsers] = useState([]); // Initialize with an empty array
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [visiblePasswordUser, setVisiblePasswordUser] = useState(null); // State to track which user's password is visible

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response && response.data && Array.isArray(response.data.users)) { // Check if users array exists
        setUsers(response.data.users); // Ensure this matches the structure of your API response
      } else {
        setUsers([]); // Set an empty array if no users
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users");
    }
  };

  // Handle user deletion
  const deleteUser = async (username) => {
    console.log('Deleting user:', username); // Debugging log
    try {
      await deleteUsers({ username }); // Pass an object with username
      setUsers(users.filter(user => user.username !== username)); // Adjust this for your user object structure
      setIsModalOpen(false); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user");
    }
  };

  // Open confirmation modal
  const handleDeleteClick = (username) => {
    setUserToDelete(username);
    setIsModalOpen(true);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
    }
  };

  // Close confirmation modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  // Toggle password visibility for a specific user
  const handleTogglePassword = (username) => {
    setVisiblePasswordUser(visiblePasswordUser === username ? null : username);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col mx-auto p-6 bg-gradient-to-r from-cyan-600 to-green-600">
      <h2 className="text-3xl font-semibold mb-6 text-gray-50">User List</h2>
      <div className="overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto"> {/* Adjusted height */}
          <table className="min-w-full bg-opacity-15 rounded-lg shadow-md">
            <thead className="sticky bg-white top-0 font-bold ">
              <tr>
                <th className="px-6 py-3 text-left text-black">Username</th>
                <th className="px-6 py-3 text-left text-black">Name</th>
                <th className="px-6 py-3 text-left text-black">Password</th>
                <th className="px-6 py-3 text-left text-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white bg-opacity-10 divide-gray-200 font-semibold">
              {Array.isArray(users) && users.length > 0 ? ( // Ensure users is an array before mapping
                users.map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-white">{user.username}</td> {/* Use user.username */}
                    <td className="px-6 py-4 text-white">{user.name}</td> {/* Access user.name */}
                    <td className="px-6 py-4 text-white flex items-center">
                      {/* Conditionally render password visibility */}
                      {visiblePasswordUser === user.username ? user.password : '****'}
                      <button 
                        className="ml-2"
                        onClick={() => handleTogglePassword(user.username)}
                      >
                        {visiblePasswordUser === user.username ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800 transition duration-150 ease-in-out"
                        onClick={() => handleDeleteClick(user.username)} // Use user.username for deletion
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal3
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the user "${userToDelete}"?`}
      />
    </div>
  );
};

export default UserDatas;
