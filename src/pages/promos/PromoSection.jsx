import { useEffect, useState } from "react"
import axios from 'axios'
import { Link } from 'react-router-dom'

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
        <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-volkhov text-blueBlack">
                        Promo Highlights
                    </h2>
                    <p className="text-sm sm:text-base font-semibold text-[#778088]">
                        Travel more, spend less - book your getaway today.
                    </p>
                </div>
                <Link 
                    to="/all-promos"
                    className="w-fit bg-[#495560] py-2 sm:py-3 px-6 sm:px-10 text-xs sm:text-sm font-bold text-white rounded-sm self-start sm:self-end"
                >
                    View All Promos
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {promos.map((promo) => (
                <div 
                    key={promo?.id} 
                    className="relative h-48 sm:h-56 lg:h-60 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                    <img 
                        src={promo.imageUrl} 
                        alt={promo.title} 
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                        <Link 
                            to={`/detail-promo/${promo.id}`}
                            className="absolute top-3 right-3 flex items-center gap-1 text-xs sm:text-sm text-gray-100 hover:text-gray-200"
                        >
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
                        </Link>
                        <h3 className="font-bold text-base sm:text-lg mb-1">{promo.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-200 mb-3">
                            {promo.description.slice(0, 80)}...
                        </p>
                    </div>
                </div>
                ))}
            </div>
        </section>
    )
}