import axios from 'axios';

const netcloud = axios.create({
    baseURL: 'https://net-music-api-three.vercel.app',
    timeout: 8000,
    withCredentials: true
});

netcloud.interceptors.response.use(res => res, err => {
    return {
        status: false,
        data: null,
        statusText: err.message
    }
});

export { netcloud };