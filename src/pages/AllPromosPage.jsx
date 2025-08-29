import { useEffect, useState } from "react"
import axios from 'axios'
import { Link } from 'react-router-dom'


export default function AllPromosPage() {
    const [allPromos, setAllPromos] = useState([])

    const getAllPromos = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/promos`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                    }
                }
            )
            console.log(res);
            setAllPromos(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleImageError = (e) => {
        e.target.src = "/fallback.jpg";
    };

    useEffect(() => {
        getAllPromos()
    },[])

    return (
        <div>
            <h1>All Promos</h1>
            {allPromos.map((all) => (
                <div>
                    <img src={all.imageUrl} alt={all.title} />
                    <h2>{all.title}</h2>
                    <p>{all.promo_code}</p>
                    <p>{all.description}</p>
                </div>
            ))}
        </div>
    )
}