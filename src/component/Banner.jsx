import { useEffect, useState } from "react"
import axios from 'axios'
import SearchBar from "./SearchBar"

export default function Banner({onSearch}){
    const [banner, setBanner] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const getBanner = async() => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/banners`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY
                    }
                }
            )
            console.log(res);
            setBanner(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleImageError = (e) => {
        e.target.src = "/placeholder.jpg";
    }
    useEffect(() => {
        getBanner();
    },[])

    useEffect(() => {
        if (banner.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banner.length)
        }, 10000);
        return () => clearInterval(interval);
    },[banner])

    return(
        <div className="relative w-full h-[90vh]">
            {banner.length > 0 && (
                <img
                src={banner[currentIndex].imageUrl}
                alt={banner[currentIndex].name}
                className="absolute inset-0 w-full h-full object-cover object-center"
                />
            )}
            <div className="absolute inset-0 bg-black/30"></div>

            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-white px-4 text-center">
                <h1 className="font-volkhov font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-snug">
                Your Quiet Guide in A Noisy World
                </h1>
                <p className="text-sm sm:text-base md:text-lg font-mulish font-medium mt-4 max-w-2xl">
                In a world of noise, Roamly is your space to breathe, explore, and feel seen.
                <br className="hidden sm:block" />
                We design with empathy, so every interaction feels calm, clear, and truly yours.
                </p>
            </div>

            <div className="absolute bottom-[-35px] sm:bottom-[-45px] left-1/2 -translate-x-1/2 z-30 w-[90%] sm:w-auto">
                <SearchBar onSearch={onSearch} />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {banner.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    onError={handleImageError}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    currentIndex === index ? "bg-white" : "bg-white/50"
                    }`}
                />
                ))}
            </div>
        </div>
    )
}