import axios from 'axios';

const API_URL = 'http://localhost:5000/api';


export const sendEmail = async (formData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/sendMail', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.data : error.message);
    throw error;
  }
};

  
  export const updateStatus=async(id,status)=>{
    try {
      const response = await axios.put(`http://localhost:5000/api/updateStatus/${id}`, { status });
      console.log('Response:', response.data);
      // Handle the response data, which includes the updated status
      alert(`Status updated to: ${response.data.updatedEmail.status}`);
  } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
  }
  }
  
  export const responseMail = async (query) => {
    try {
      const response = await axios.get('http://localhost:5000/api/response', { params: query });
      return response;
    } catch (error) {
      console.error('Error processing response:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
  
  export const RequestList = async (userId) => {
    return axios.get(`${API_URL}/getRequests/${userId}`, { withCredentials: true });
};

  
  export const getAttachments=async()=>{
    return axios.get(`${API_URL}/getAttachments`, { withCredentials: true });
  }

export const Requests=async()=>{
  return axios.get(`${API_URL}/requests`, { withCredentials: true });
}

export const AdminRequests=async()=>{
  return axios.get(`${API_URL}/adminRequests`, { withCredentials: true });
}