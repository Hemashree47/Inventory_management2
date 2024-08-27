import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [requests, setRequests] = useState([]);
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`/${userId}/requests`);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, [userId]);

    return (
        <div>
            <h2>My Request History</h2>
            <ul>
                {requests.map((request) => (
                    <li key={request._id}>
                        {request.title} - {request.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserDashboard;
