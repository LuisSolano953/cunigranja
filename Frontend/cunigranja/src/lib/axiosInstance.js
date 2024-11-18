import axios from "axios";

const axiosInstance =axios.create({
    baseURL: 'https://localhost:7208/',
    headers: {
        'accept': '*/*',
        'content-type': 'application/json'
    }    
});

export default axiosInstance;