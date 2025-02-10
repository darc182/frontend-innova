import axios from 'axios'

const clienteAxios =  axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/`
})

clienteAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default clienteAxios