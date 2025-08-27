import { useEffect, useState } from "react"
import axios from 'axios'
import DestinationCard from "../../component/DestinationsCard"

export default function Activities () {
    const [activity, setActivity] = useState([])

    const getAllActivities = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/activities`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            setActivity(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleImageError = (e) => {
        e.target.src = "/placeholder.jpg";
    };

    useEffect(() => {
        getAllActivities()
    },[])

    return (
        <div>
            {activity.map((act) => (
                <DestinationCard 
                key={act.id}
                destination={act}
                onImageError={handleImageError}
                />
            ))}
        </div>
    )
}