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

    useEffect(() => {
        getDestinations();
    },[])

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <h2 className="text-4xl font-bold font-volkhov text-blueBlack">Featured Destinations</h2>
                <p className="text-base font-semibold text-[#778088]">Where will your next adventure take you?</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 overflow-x-auto scroll-smooth no-scrollbar">
                {destinations.map((dest) => (
                    <div key={dest?.id} className="bg-white w-[270px] h-96 shadow rounded-sm overflow-hidden flex-shrink-0 ">
                        <img 
                            src={dest.imageUrls?.find(url => url && url.trim() !== '') || "/placeholder.jpg"} 
                            alt={dest.title} 
                            // onError={}
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