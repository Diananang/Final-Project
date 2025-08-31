import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast} from 'sonner';
import DestinationCard from "../../component/DestinationsCard";
import Navbar from "../../component/Navbar";

export default function AllDestinationsPage() {
    const [allDest, setAllDest] = useState([])
    const navigate = useNavigate()
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const limit = 10;

    const getAllDestinations = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/activities?page=${pageNumber}&limit=${limit}`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY
                    }
                }
            )
            console.log(res);
            setAllDest(res.data.data)
            setTotalPages(res.data.data.length < limit ? pageNumber : pageNumber + 1)
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch destinations");
        } finally {
            setLoading(false);
        }
    }

    const handleImageError = (e) => {
        e.target.src = "/placeholder.jpg";
    };

    useEffect(() => {
        getAllDestinations(page);
    },[page])

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto p-6 sm:p-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">All Destinations</h1>

                {loading ? (
                <p className="text-gray-500">Loading...</p>
                ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allDest.map(dest => (
                        <DestinationCard
                        key={dest.id}
                        destination={dest}
                        onImageError={handleImageError}
                        isDetailPage={false}
                        />
                    ))}
                    </div>

                    <div className="flex justify-center mt-8 gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(prev => prev - 1)}
                        className="px-4 py-2 bg-teal text-white rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 bg-gray-200 rounded">
                        {page} / {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(prev => prev + 1)}
                        className="px-4 py-2 bg-teal text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}