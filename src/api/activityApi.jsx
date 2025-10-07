import axios from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = (isMultipart = false) => {
    const config = {
        apikey: API_KEY,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
    if (isMultipart) config["Content-Type"] = "multipart/form-data"
    else config["Content-Type"] = "application/json"
    return config
}

export const createActivity = async (payload) => {
    try {
        const res = await axios.post(`${BASE_URL}/api/v1/create-activity`, payload, 
        {
            headers: headers(),
        }
        )
        console.log(res);
        return res.data
    } catch (error) {
        console.log(error);
        toast.error("Failed to create activity: ", error.response || error)
        throw error
    }
}

export const getAllActivities = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/api/v1/activities`, 
        {
            headers: {
                apikey: API_KEY
            }
        }
    )
    console.log(res);
    return res.data.data
    } catch (error) {
        console.log(error);
        toast.error("Failed to get activity: ", error.response || error)
        throw error
    }
    
}

export const getActivitiesById = async (activityId) => {
    try {
        const res = await axios.get(`${BASE_URL}/api/v1/activities/${activityId}`, 
        {
            headers: {
                apikey: API_KEY
            }
        }
    )
    console.log(res);
    return res.data.data
    } catch (error) {
        console.log(error);
        toast.error("Failed to get detail: ", error.response || error)
        throw error
    }
    
}

export const getActivitiesByCategoriesId = async (categoryId) => {
    try {
        const res = await axios.get(`${BASE_URL}/api/v1/activities-by-category/${categoryId}`,
        {
            headers: {
                apikey: API_KEY
            }
        }
    )
    console.log(res);
    return res.data.data
    } catch (error) {
        console.log(error);
        toast.error("Failed to get categories: ", error.response || error)
        throw error
    }
    
}

export const updateActivity = async (activityId, payload) => {
    try {
        const res = await axios.post(`${BASE_URL}/api/v1/update-activity/${activityId}`, payload, {
        headers: headers(),
    })
    console.log(res);
    return res.data
    } catch (error) {
        console.log(error);
        toast.error("Failed to update activity: ", error.response || error)
        throw error
    }
    
}

export const deleteActivity = async (activityId) => {
    try {
        const res = await axios.delete(`${BASE_URL}/api/v1/delete-activity/${activityId}`, 
        {
            headers : headers()
        }
    )
    console.log(res);
    return res.data
    } catch (error) {
        console.log(error);
        toast.error("Failed to delete activity: ", error.response || error)
        throw error
    }
    
}