import { useEffect, useState } from "react"
import axios from 'axios'
import DestinationCard from "../../component/DestinationsCard"

export default function PopularSection(){
    const [popular, setPopular] = useState([])
    const [destinations, setDestinations] = useState([])
    const [isActive, setIsActive] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const getPopular= async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/categories`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY
                    }
                }
            )
            console.log(res);
            setPopular(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const getDestinationsByCategory = async (categoryId) => {
        setIsLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/activities-by-category/${categoryId}`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY
                    }
                }
            )
            console.log(res);
            setDestinations(res.data.data)
            setIsActive(categoryId)
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getPopular();
    },[])

    const handleImageError = (e) => {
        e.target.src = "/placeholder.jpg"
    }

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <h2 className="text-4xl font-bold font-volkhov text-blueBlack">Explore Popular Cities</h2>
                <p className="text-base font-semibold text-[#778088]">From vibrant streets to hidden gems—start your journey here.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar">
                {popular.map((pop) => (
                    <div 
                        key={pop?.id} 
                        onClick={() => getDestinationsByCategory(pop.id)}
                        className={`flex-shrink-0 snap-start border border-teal rounded-[30px] py-3 px-8 min-w-[150px] text-[#495560] text-center text-sm font-bold cursor-pointer hover:bg-teal hover:text-white transition
                            ${isActive == pop.id ? "bg-teal text-white" : "text-[#495560] hover:bg-teal hover:text-white"}`}
                    >
                        <p>{pop.name}</p>
                    </div>
                ))}
            </div>
            
            {isLoading && <p className="text-[#495560] text-sm text-center">Loading...</p>}
            {!isLoading && destinations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {destinations.map((dest) => (
                        <DestinationCard 
                            key={dest.id}
                            destination={dest}
                            onImageError={handleImageError}
                        />
                    ))}
                </div>
            )}

            {destinations.length === 0 && !isLoading && (
                <p className="text-[#495560] text-sm text-center">No results...</p>
            )}
        </section>
    )
}