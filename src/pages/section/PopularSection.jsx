import { useEffect, useState } from "react"
import axios from 'axios'

export default function PopularSection(){
    const [popular, setPopular] = useState([])

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

    useEffect(() => {
        getPopular();
    },[])

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <h2 className="text-4xl font-bold font-volkhov text-blueBlack">Explore Popular Cities</h2>
                <p className="text-base font-semibold text-[#778088]">From vibrant streets to hidden gems—start your journey here.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar">
                {popular.map((pop) => (
                    <div key={pop?.id} className="flex-shrink-0 snap-start border border-teal rounded-[30px] py-3 px-8 min-w-[150px] text-[#495560] text-center text-sm font-bold cursor-pointer hover:bg-teal hover:text-white transition">
                        <p>{pop.name}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}