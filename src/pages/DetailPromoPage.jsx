import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from 'axios'

export default function DetailPromoPage (){
    const [detailPromo, setDetailPromo] = useState({})
    const {id} = useParams();

    const getDetailPromo = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/v1/promo/${id}`,
                    {
                        headers: {
                            apikey: import.meta.env.VITE_API_KEY
                        }
                    }
                )
                console.log(res);
                setDetailPromo(res.data.data)
            } catch (error) {
                console.log(error);
            }
        }
    
        useEffect(() => {
            getDetailPromo();
        },[id])

    return (
        <div>
            <h2>{detailPromo.title}</h2>
            <img src={detailPromo.imageUrl} alt={detailPromo.title} />
            <div dangerouslySetInnerHTML={{ __html: detailPromo.terms_condition }}></div>
            <p>Minimum Claim Price: Rp {detailPromo.minimum_claim_price?.toLocaleString()}</p>
            <p>Promo Code: {detailPromo.promo_code}</p>
            <p>Discount Price: Rp {detailPromo.promo_discount_price?.toLocaleString()}</p>
        </div>
    )
}