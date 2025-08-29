import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast} from 'sonner';
import DestinationCard from "../component/DestinationsCard";

export default function AllDestinationsPage() {
    const [allDest, setAllDest] = useState([])
    const navigate = useNavigate()

    const getAllDestinations = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/activities`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY
                    }
                }
            )
            console.log(res);
            setAllDest(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleImageError = (e) => {
        e.target.src = "/placeholder.jpg";
    };

    useEffect(() => {
        getAllDestinations();
    },[])

    return (
        <div>
            <h1>All Destinations</h1>
            {allDest.map((all) => (
                <DestinationCard
                    key={all.id}
                    destination={all}
                    onImageError={handleImageError}
                    isDetailPage={false}
                />
            ))}
        </div>
    )
}