import { useEffect, useState } from "react"
import axios from 'axios'
import { Link } from 'react-router-dom'
import Navbar from "../../component/Navbar"


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
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6 sm:p-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">All Promos</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPromos.map((promo) => (
                    <div
                    key={promo.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                    <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        onError={handleImageError}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{promo.title}</h2>
                        <p className="text-sm font-medium text-teal-600 mb-1">{promo.promo_code}</p>
                        <p className="text-gray-700 text-sm">{promo.description}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
}