import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast} from 'sonner';
import DestinationCard from "../../component/DestinationsCard";

export default function FeaturedSection(){
    const [destinations, setDestinations] = useState([])
    const navigate = useNavigate()

    const getDestinations = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/activities`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY
                    }
                }
            )
            console.log(res);
            const sortDest = res.data.data.filter(
                (promo, index, self) =>
                    index === self.findIndex((p) => p.title.trim() === promo.title.trim())
            )

            const shuffled = sortDest.sort(() => 0.5 - Math.random())
            setDestinations(shuffled.slice(0,5))
        } catch (error) {
            console.log(error);
        }
    }

    const handleImageError = (e) => {
        e.target.src = "/placeholder.jpg";
    };

    // const handleAddToCart = async (activityId) => {
    //     const token = localStorage.getItem('token')

    //     if (!token) {
    //         navigate('/signin')
    //         return
    //     }

    //     try {
    //         const res = await axios.post(
    //             `${import.meta.env.VITE_BASE_URL}/api/v1/add-cart`,
    //             {activityId},
    //             {
    //                 headers: {
    //                     apikey: import.meta.env.VITE_API_KEY,
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`
    //                 }
    //             }
    //         )
    //         console.log(res);
    //         toast.success(res.data.message)
            
    //     } catch (error) {
    //         console.log(error);
            
    //     }
    // }

    useEffect(() => {
        getDestinations();
    },[])

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <h2 className="text-4xl font-bold font-volkhov text-blueBlack">Featured Destinations</h2>
                <p className="text-base font-semibold text-[#778088]">Where will your next adventure take you?</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-2">
                {destinations.map((dest) => (
                    <DestinationCard 
                        key={dest.id}
                        destination={dest}
                        onImageError={handleImageError}
                    />
                ))}
            </div>
        </section>
    )
}