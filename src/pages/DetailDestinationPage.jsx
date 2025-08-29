import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios'
import DestinationCard from "../component/DestinationsCard";
import Navbar from "../component/Navbar";

export default function DetailDestinationPage(){
    const [detailDest, setDetailDest] = useState({})
    const [recommended, setRecommended] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate()

    const getDetailDest = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/activity/${id}`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY
                    }
                }
            )
            console.log(res);
            setDetailDest(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleImageError = (e) => {
            e.target.src = "/placeholder.jpg";
    };

    const handleAddToCart = async (activityId) => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/signin')
            return
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/add-cart`,
                {activityId},
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success(res.data.message)
            
        } catch (error) {
            console.log(error);
        }
    }

    const getRecommended = async () => {
        try {
        const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/activities`,
            {
            headers: {
                apikey: import.meta.env.VITE_API_KEY,
            },
            }
        );
        const filtered = res.data.data.filter((act) => act.id !== id).slice(0, 4);
        setRecommended(filtered);
        } catch (error) {
        console.log(error);
        }
    };

    useEffect(() => {
        getDetailDest();
        getRecommended();
    },[id])

    return (
        <div className="relative w-full min-h-screen bg-white">
            <Navbar />

            <div className="px-6 md:px-12 lg:px-24 space-y-16 mt-14 font-mulish">
                <h1 className="font-volkhov text-4xl font-bold text-blueBlack">{detailDest.title}</h1>
                <div className="flex text-sm text-[#778088]">
                    <p className="pr-2 border-r">{detailDest.province}</p>
                    <p className="pl-2">Rate: {detailDest.rating}</p>
                </div>
                <div className="w-3/4">
                    {detailDest.imageUrls?.map((url, i) => (
                        <img 
                            key={i}
                            src={url} 
                            alt={`${detailDest.title}-${i}`} 
                            className="w-[770px] h-[570px] object-cover"
                        />
                    ))}
                </div>
                <p>{detailDest.facilities}</p>
                <p>{detailDest.price}</p>
                <p>{detailDest.description}</p>
                <p>{detailDest.address}</p>
                <div 
                    className="mt-4 rounded-lg overflow-hidden shadow"
                    dangerouslySetInnerHTML={{ __html: detailDest.location_maps }}
                ></div>

                <button
                    onClick={handleAddToCart}
                    className="mt-auto bg-teal hover:bg-teal/80 text-white text-sm py-2 px-4 rounded"
                >
                    Add to Cart
                </button>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Recommended Destinations</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                    {recommended.map((dest) => (
                        <DestinationCard
                            key={dest.id}
                            destination={dest}
                            onImageError={(e) => (e.target.src = "/placeholder.jpg")}
                            isDetailPage={false}
                        />
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}