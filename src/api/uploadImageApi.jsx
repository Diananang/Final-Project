import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = () => ({
    apikey: API_KEY,
    Authorization: `Bearer ${localStorage.getItem("token")}`,
})

export const uploadImage = async (file) => {
    if (!file) return null;
    if (file.size > 2 * 1024 * 1024){
        throw new error("File too large (max 2MB)")
    }
    const formData = new FormData();
    formData.append("image", file)

    try {
        const res= await axios.post(`${BASE_URL}/api/v1/upload-image`, formData, {
            headers: {
                ...headers(),
                "Content-Type": "multipart/form-data",
            }
        })
        return res.data.url;
    } catch (error) {
        console.log(error);
        toast.error("Failed to upload image", error)
        throw error;
    }
    
}