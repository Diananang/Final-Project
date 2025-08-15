import axios from "axios";
import { useEffect, useState } from "react"

export default function FeaturedSection(){
    const [destinations, setDestinations] = useState([])

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
            setDestinations(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDestinations();
    },[])

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Featured Destinations</h2>
            <div className="flex flex-col sm:flex-row gap-6 overflow-x-auto">
                {destinations.map((dest) => (
                    <div key={dest?.id} className="bg-white w-[270px] h-96 shadow rounded-sm overflow-hidden flex-shrink-0">
                        <img 
                            src={dest.imageUrls?.find(url => url && url.trim() !== '') || "/placeholder.jpg"} 
                            alt={dest.title} 
                            className="w-full h-48 object-cover p-2"/>
                        <div className="flex flex-col gap-2 p-4">
                            <h3 className="font-normal font-volkhov font-base text-blueBlack">{dest.title}</h3>
                            <p className="text-sm text-gray-600">{dest.city}</p>
                            <p className="text-sm text-gray-600">Rate: {dest.rating}</p>
                            <p className="text-sm text-gray-600">{dest.total_reviews} reviews</p>
                            <p className="mt-1 font-semibold text-yellow-600">Rp {dest.price.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}