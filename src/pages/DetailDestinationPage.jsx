import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from 'axios'

export default function DetailDestinationPage(){
    const [detailDest, setDetailDest] = useState({})
    const {id} = useParams();
    // console.log(id)
    

    const getDetailDest = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/activity/${id}`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY
                    }
                }
            )
            console.log(res);
            setDetailDest(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDetailDest();
    },[id])

    return (
        <div>
            <h1>{detailDest.title}</h1>
            <div>
                {detailDest.imageUrls?.map((url, i) => (
                    <img 
                        key={i}
                        src={url} 
                        alt={`${detailDest.title}-${i}`} />
                ))}
            </div>
            <p>{detailDest.facilities}</p>
            <p>{detailDest.price}</p>
            <p>{detailDest.rating}</p>
            <p>{detailDest.description}</p>
            <p>{detailDest.province}</p>
            <p>{detailDest.address}</p>
            <div 
                className="mt-4 rounded-lg overflow-hidden shadow"
                dangerouslySetInnerHTML={{ __html: detailDest.location_maps }}
            ></div>
        </div>
    )
}