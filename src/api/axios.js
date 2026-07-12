import axios from 'axios';

const API = axios.create({
   //  Isko aaisa bilkul sahi kar do:
baseURL: 'https://vibecart-backend-yame.onrender.com/api', // Tumhara backend jis port par chalta hai
});

// 🔥 Industry Practice: Har request ke saath automatic browser se token utha kar backend ko bhejna
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;