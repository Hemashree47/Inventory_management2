import React, { useEffect, useState } from 'react';
import {  RequestList } from '../mailApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';
import DownloadReportModal2 from './DownloadReportModal2';

const RequestLists = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const Navigate=useNavigate();

    

    useEffect(() => {
        const fetchRequests = async () => {
            const userId = localStorage.getItem('userId');
            const role=localStorage.getItem('Role');

            if (!userId) {
                setError('User ID is missing.');
                return;
            }
            console.log(role)
            try {
                const response = await RequestList(userId);
                setRequests(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Error details:', err.response ? err.response.data : err.message);
            } finally {
                setLoading(false);
            }
            }
            
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
    
    const handleDownloadCSV = (project, vendor, status) => {
        const csvData = filteredRequests
          .filter(row =>
            (!project || row.project === project.value) &&
            (!vendor || row.vendor === vendor.value) &&
            (!status || row.status === status.value) 
           
          )
          .map((row) => ({
            
            Project: row.project,
            Vendor: row.vendor,
            'Delivery Lead Time': new Date(row.leadTime).toLocaleDateString('en-CA'),
            'Total Purchase Amount': row.amount,
            Approvers: row.approvers,
            Status: row.status,
            Attachments: row.attachments.map(a => a.filename).join(', ')
          }));
    
        const csv = unparse(csvData, {
          header: true,
          skipEmptyLines: true
        });
    
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'request_report.csv');
      };
    
      // Extract unique options for the dropdowns
      const projects = [...new Set(requests.map(r => r.project))].map(p => ({ value: p, label: p }));
      const vendors = [...new Set(requests.map(r => r.vendor))].map(v => ({ value: v, label: v }));
      const statuses = [...new Set(requests.map(r => r.status))].map(s => ({ value: s, label: s }));
      
    
    

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
        <div className="w-full h-screen flex flex-col p-4 bg-gradient-to-r from-blue-950 to-green-900">
            {/* Search Bar */}
            <div className="mb-4 flex justify-end ">
                <div className="relative text-white ">
                    <input
                        type="text"
                        placeholder="Search by project name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className=" p-2 pl-10 rounded-xl w-full max-w-xs bg-gray-400 bg-opacity-20"
                    />
                    <i className="fas fa-search absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <button
                    onClick={() => setModalIsOpen(true)}
                    className="ml-4 bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600"
                    >
                    Download Report
                </button>
            </div>

            {/* Table */}
            <div className="flex-grow overflow-hidden">
                <div className="overflow-auto max-h-[calc(100vh-150px)]">
                    <table className="min-w-full bg-white bg-opacity-20 ">
                        <thead className="bg-gray-100  shadow-md">
                            <tr>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-900 text-white ">Project</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-900 text-white">Vendor</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-900 text-white">Delivery Lead Time</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-900 text-white">Total Purchase Amount</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-900 text-white">Approvers</th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-900 text-white">
                                    Status
                                    {/* Status Dropdown */}
                                    <select
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                        className="ml-2 border p-1 rounded  bg-gray-900 text-white"
                                    >
                                        <option value="">All</option>
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="declined">Declined</option>
                                    </select>
                                </th>
                                <th className="py-2 px-4 text-left sticky top-0 z-10 bg-gray-900 text-white">Attachments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(request => (
                                <tr key={request._id} className="">
                                    <td className="py-2 px-4 text-white">{request.project}</td>
                                    <td className="py-2 px-4 text-white">{request.vendor}</td>
                                    <td className="py-2 px-4 text-white">
                                        {new Date(request.leadTime).toLocaleDateString('en-CA')}
                                    </td>
                                    <td className="py-2 px-4 text-white">{request.amount}</td>
                                    <td className="py-2 px-4 text-white">{request.approvers}</td>
                                    <td className="py-2 px-4 text-white">
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
                                                    className="text-blue-200 hover:underline"
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
            <DownloadReportModal2
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                projects={projects}
                vendors={vendors}
                statuses={statuses}
                onDownload={handleDownloadCSV}
            />
        </div>
    );
};


export default RequestLists;
