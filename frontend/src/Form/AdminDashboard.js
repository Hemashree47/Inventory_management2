import React, { useEffect, useState } from 'react';
import { AdminRequests, RequestList } from '../mailApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RequestLists = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            const userId = localStorage.getItem('userId');
            const isAdmin = localStorage.getItem('isAdmin'); // Check if user is admin


            if (!userId) {
                setError('User ID is missing.');
                return;
            }
        
            try {
                const response = await AdminRequests();
                setRequests(response.data);
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Error details:', err.response ? err.response.data : err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    // Filter requests by search query and selected status
    const filteredRequests = requests.filter(request =>
        request.project.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedStatus === '' || request.status === selectedStatus)
    );
    
    
    

    // const updateStatus = async (requestId, newStatus) => {
    //     try {
    //         await axios.post('http://localhost:5000/api/updateStatus', {
    //             requestId,
    //             status: newStatus,
    //         });
    //         // Update local state to reflect the status change
    //         setRequests(requests.map(request =>
    //             request._id === requestId ? { ...request, status: newStatus } : request
    //         ));
    //     } catch (err) {
    //         console.error('Error updating status:', err);
    //     }
    // };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const statusStyles = {
        pending: 'bg-blue-500 text-white',
        accepted: 'bg-green-500 text-white',
        declined: 'bg-red-500 text-white'
    };

    return (
        <div className="w-full h-screen flex flex-col p-4">
            {/* Search Bar */}
            <div className="mb-4 flex justify-end">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by project name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border p-2 pl-10 rounded-xl w-full max-w-xs"
                    />
                    <i className="fas fa-search absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
                </div>
            </div>

            {/* Table */}
            <div className="flex-grow overflow-hidden">
                <div className="overflow-auto max-h-[calc(100vh-150px)]">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-100 border-b shadow-md">
                            <tr>
                            <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-100">Username</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-100">Project</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-100">Vendor</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-100">Delivery Lead Time</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-100">Total Purchase Amount</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-100">Approvers</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-100">
                                    Status
                                    {/* Status Dropdown */}
                                    <select
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                        className="ml-2 border p-1 rounded"
                                    >
                                        <option value="">All</option>
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="declined">Declined</option>
                                    </select>
                                </th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-100">Attachments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(request => (
                                <tr key={request._id} className="border-b">
                                  <td className="py-2 px-4">{request.userId ? request.userId.username : 'Unknown'}</td> {/* Displaying username */}
                                    <td className="py-2 px-4">{request.project}</td>
                                    <td className="py-2 px-4">{request.vendor}</td>
                                    <td className="py-2 px-4">
                                        {new Date(request.leadTime).toLocaleDateString('en-CA')}
                                    </td>
                                    <td className="py-2 px-4">{request.amount}</td>
                                    <td className="py-2 px-4">{request.approvers}</td>
                                    <td className="py-2 px-4">
                                        <div
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[request.status]}`}
                                        >
                                            {request.status}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">
                                        {request.attachments && request.attachments.map((attachment, index) => (
                                            <div key={index}>
                                                <a
                                                    href={`http://localhost:5000/api/attachments/${request._id}/${attachment.filename}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {attachment.filename}
                                                </a>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default RequestLists;
