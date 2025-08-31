import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast} from 'sonner';
import DestinationCard from "../../component/DestinationsCard";
import { Link } from 'react-router-dom'

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
                (dest, index, self) =>
                    index === self.findIndex((p) => p.title.trim() === dest.title.trim())
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

    useEffect(() => {
        getDestinations();
    },[])

    return (
        <section className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl font-bold font-volkhov text-blueBlack">Featured Destinations</h2>
                    <p className="text-base font-semibold text-[#778088]">Where will your next adventure take you?</p>
                </div>
                <Link 
                        to="/all-destinations"
                        className="w-fit bg-[#495560] py-4 px-10 text-sm font-bold text-white self-end rounded-sm"
                        >
                            View All Destinations
                </Link>
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