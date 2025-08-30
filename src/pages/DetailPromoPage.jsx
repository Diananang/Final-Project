import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from 'axios'
import Navbar from "../component/Navbar";

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
            <Navbar />
            <div className="min-h-screen bg-gray-50 p-6 sm:p-12">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {detailPromo.imageUrl && (
                    <img
                    src={detailPromo.imageUrl}
                    alt={detailPromo.title}
                    className="w-full h-64 sm:h-80 object-cover"
                    />
                )}
                <div className="p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">{detailPromo.title}</h2>

                    <div
                    className="prose prose-sm sm:prose lg:prose-lg text-gray-700 mb-4"
                    dangerouslySetInnerHTML={{ __html: detailPromo.terms_condition }}
                    ></div>

                    <div className="space-y-2 text-gray-700">
                    {detailPromo.minimum_claim_price && (
                        <p>
                        <span className="font-semibold">Minimum Claim Price:</span> Rp{" "}
                        {detailPromo.minimum_claim_price.toLocaleString()}
                        </p>
                    )}
                    {detailPromo.promo_code && (
                        <p>
                        <span className="font-semibold">Promo Code:</span> {detailPromo.promo_code}
                        </p>
                    )}
                    {detailPromo.promo_discount_price && (
                        <p>
                        <span className="font-semibold">Discount Price:</span> Rp{" "}
                        {detailPromo.promo_discount_price.toLocaleString()}
                        </p>
                    )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}