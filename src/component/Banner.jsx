import { useEffect, useState } from "react"
import axios from 'axios'
import SearchBar from "./SearchBar"

export default function Banner(){
    const [banner, setBanner] = useState(null)

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
            setBanner(res.data.data[4])
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getBanner();
    },[])

    return(
        <div className="relative w-full h-[90vh]">
            {banner && (
                <img 
                src={banner.imageUrl} 
                alt={banner.name} 
                className="absolute inset-0 w-full h-full object-cover object-center"
                />
            )}
            <div className="absolute inset-0 bg-black/20"></div>

            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-white px-4">
                <h1 className="font-volkhov font-bold text-5xl text-center">
                    Your Quiet Guide in A Noisy World
                </h1>
                <p className="text-base font-mulish font-semibold text-center mt-[22px]">
                    In a world of noise, Roamly is your space to breathe, explore, and feel seen. <br />We design with empathy, so every interaction feels calm, clear, and truly yours.
                </p>
            </div>
            <div className="absolute bottom-[-45px] left-1/2 -translate-x-1/2 z-30">
                <SearchBar />
            </div>
        </div>
    )
}