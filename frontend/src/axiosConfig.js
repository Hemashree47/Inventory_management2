import axios from 'axios';

axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
axios.defaults.baseURL = 'http://localhost:5000'; // Set the base URL for your API

export default axios;
