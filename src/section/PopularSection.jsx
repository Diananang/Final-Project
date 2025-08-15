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
            
            let data = res.data.data

            const uniqueCities = Array.from(
                new Map(data.map((item) => [item.name, item])).values()
            )

            const shuffled = uniqueCities.sort(() => Math.random() - 0.5)
            const selected = shuffled.slice(0 , 8)
            setPopular(selected)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPopular();
    },[])

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Explore Popular Cities</h2>
            <div className="flex flex-col sm:flex-row justify-between gap-2">
                {popular.map((pop) => (
                    <div key={pop?.id} className="border border-teal rounded-[30px] py-3 px-8 text-[#495560] text-center text-sm font-bold cursor-pointer hover:bg-teal hover:text-white transition">
                        <p>{pop.name}</p>
                    </div>

                ))}
            </div>
        </section>
    )
}