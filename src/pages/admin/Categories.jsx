import { useEffect, useState } from "react"
import axios from 'axios'

export default function Categories () {
    const [category, setCategory] = useState([])

    const getAllCategories = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/categories`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            setCategory(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllCategories()
    },[])

    return (
        <div>
            {category.map((cat) => (
                <div key={cat.id}>
                    <img src={cat.imageUrl} alt={cat.name} className="w-40 object-cover"/>
                    <p>Location: {cat.name}</p>
                </div>
            ))}
        </div>
    )
}