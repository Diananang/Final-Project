import { useEffect, useState } from "react"
import axios from 'axios'

export default function PromoSection(){
    const [promos, setPromos] = useState([])

    const getPromos = async () => {
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

            const uniquePromos = res.data.data.filter(
                (promo, index, self) =>
                    index === self.findIndex((p) => p.title.trim() === promo.title.trim())
            )

            const shuffled = uniquePromos.sort(() => 0.5 - Math.random())
            setPromos(shuffled.slice(0,3))
        } catch (error) {
            console.log(error);
        }
    }

    const handleImageError = (e) => {
        e.target.src = "/fallback.jpg";
    };

    useEffect(() => {
        getPromos()
    },[])

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Promo Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {promos.map((promo) => (
                    <div 
                        key={promo?.id} 
                        className="relative h-40 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <img 
                            src={promo.imageUrl} 
                            alt={promo.title} 
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                            <a className="absolute top-3 right-3 flex items-center gap-1 self-end text-sm text-gray-100 hover:text-gray-200 ">
                                View Promo
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.25 6.75L6.75 17.25M17.25 6.75H7.5m9.75 0V16.5"
                                    />
                                </svg>
                            </a>
                            <h3 className="font-bold text-lg mb-1">{promo.title}</h3>
                            <p className="text-sm text-gray-200 mb-3">{promo.description.slice(0,80)}...</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}