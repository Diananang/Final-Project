import { useState, useEffect } from "react";
import axios from 'axios'

export default function Promos () {
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
            setPromos(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleImageError = (e) => {
        e.target.src = "/fallback.jpg";
    };

    useEffect(() => {
        getPromos();
    },[])

    return (
        <div>
            {promos.map((promo) => (
                <div key={promo.id}>
                    <img src={promo.imageUrl} alt={promo.title} onError={handleImageError}/>
                    <p>{promo.title}</p>
                    <p>{promo.description}</p>
                    <p>{promo.promo_code}</p>
                    <p>{promo.term_condition}</p>
                    <p>{promo.minimum_claim_price}</p>
                    <p>{promo.promo_discount_price}</p>
                </div>
            ))}
        </div>
    )
}