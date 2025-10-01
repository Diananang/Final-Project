import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const loginApi = async (email, password) => {
    const payload = {
        email,
        password
    }

    const res = await axios.post(`${BASE_URL}/api/v1/login`, payload,
        {
            headers: {
                apikey: API_KEY
            }
        }
    )
    console.log(res);
    
    return res.data;
}

export const registerApi = async (name, email, password, passwordRepeat, role) => {
    const payload = {
        name,
        email,
        password,
        passwordRepeat,
        role
    }

    const res = await axios.post(`${BASE_URL}/api/v1/register`, payload, 
        {
            headers: {
                apikey: API_KEY
            }
        }
    )
    console.log(res);
    return res.data;
}