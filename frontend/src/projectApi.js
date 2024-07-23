import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getAllProjects = () => {
  return axios.get(`${API_URL}/projects`);
};

// Other API methods
export const addProject = (projectName) => {
  return axios.post(`${API_URL}/addProject`, { projectName });
};

export const addComponent = (projectName, component) => {
  return axios.post(`${API_URL}/projects/${projectName}/components`, component);
};

export const getProjectComponents = (projectName) => {
  return axios.get(`${API_URL}/projects/${projectName}/components`);
};
