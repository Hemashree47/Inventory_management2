import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getAllProjects = () => {
  return axios.get(`${API_URL}/projects`, { withCredentials: true });
};

export const addProject = (projectName) => {
  return axios.post(`${API_URL}/addProject`, { projectName }, { withCredentials: true });
};

export const addComponent = (projectName, component) => {
  return axios.post(`${API_URL}/projects/${projectName}/components`, component, { withCredentials: true });
};

export const getProjectComponents = async (projectName) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectName}/components`, { withCredentials: true });
    console.log('API response:', response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error('Error fetching project components:', {
      message: error.message,
      config: error.config,
      code: error.code,
      response: error.response ? error.response.data : null,
    });
    throw error;
  }
};

export const updateComponentQuantity = async (projectName, componentName, quantity) => {
  try {
    const response = await axios.put(`${API_URL}/projects/${projectName}/components/${componentName}`, {
      quantity
    }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error updating component quantity:', error);
    throw error; // or handle the error as needed
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return { msg: 'Logout successful' };
  } catch (error) {
    console.error('Error during logout:', error);
    throw error; // or handle the error as needed
  }
};

export const deleteProject = async (projectName) => {
  return axios.delete(`${API_URL}/projects/${projectName}`);
};



export const updateProject = async (oldProjectName, newProjectName) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/projects/${oldProjectName}`, {
      newProjectName
    }, { withCredentials: true });
    return response;
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : 'An error occurred');
  }
};

export const validatePassword = async ({ username, password }) => {
  const response = await axios.post('http://localhost:5000/auth/validate-password', {
      username,
      password,
  });
  return response.data;
};

