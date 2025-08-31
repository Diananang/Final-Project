import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios'
import DestinationCard from "../../component/DestinationsCard";
import Navbar from "../../component/Navbar";
import { Building2, DollarSign, MapPin, Wrench } from "lucide-react";
import { toast } from "sonner";

export default function DetailDestinationPage(){
    const [detailDest, setDetailDest] = useState({})
    const [recommended, setRecommended] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null)
    const {id} = useParams();
    const navigate = useNavigate()

    const [date, setDate] = useState("")
    const [guest, setGuest] = useState(1)
    const [subTotal, setSubTotal] = useState(0)

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
            if (res.data.data.imageUrls && res.data.data.imageUrls.length > 0) {
                setSelectedImage(res.data.data.imageUrls[0])
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleImageError = (e) => {
            e.target.src = "/placeholder.jpg";
    };

    const handleAddToCart = async (activityId) => {
        const token = localStorage.getItem('token')
        const payload = {
            activityId,
            quantity: guest,
        }

        if (!token) {
            navigate('/signin', {state: {from: `/detail-destination/${id}`}})
            return
        }

        if (!date) {
            toast.error("Please select a date before adding to cart")
            return
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/add-cart`,
                payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success(res.data.message)
            navigate("/cart")
        } catch (error) {
            console.log(error);
            toast.error("Failed to add to cart")
        }
    }

    const getRecommended = async () => {
        try {
        const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/activities`,
            {
            headers: {
                apikey: import.meta.env.VITE_API_KEY,
            },
            }
        );
        const filtered = res.data.data.filter((act) => act.id !== id).slice(0, 4);
        setRecommended(filtered);
        } catch (error) {
        console.log(error);
        }
    };

    useEffect(() => {
        getDetailDest();
        getRecommended();
    },[id])

    useEffect(() => {
        if(detailDest.price) {
            setSubTotal(detailDest.price * guest)
        }
    }, [detailDest.price, guest])

    return (
        <div className="relative w-full min-h-screen bg-white">
            <Navbar />

            <div className="flex flex-col gap-4 px-6 sm:px-24 mt-6 font-mulish">
                <h1 className="font-volkhov text-4xl font-bold text-blueBlack">{detailDest.title}</h1>
                <div className="flex text-sm text-[#778088]">
                    <p className="pr-2 border-r">{detailDest.province}</p>
                    <p className="pl-2">Rate: {detailDest.rating}</p>
                </div>
                <div className="flex min-w-full">
                    <div className="w-3/4">
                        {selectedImage && (
                            <img 
                                src={selectedImage} 
                                alt="Main Preview" 
                                onError={handleImageError}
                                className="w-[770px] h-[570px] object-cover"
                            />
                        )}
                        <div className="flex gap-2 mt-2">
                            {detailDest.imageUrls?.map((url, i) => (
                                <img
                                    key={i}
                                    src={url}
                                    alt={`${detailDest.title}-${i}`}
                                    onError={handleImageError}
                                    onClick={() => setSelectedImage(url)}
                                    className={`w-24 h-20 object-cover cursor-pointer border-2 transition 
                                        ${selectedImage === url ? "border-teal border-4" : "border-gray-300"}`}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-4 bg-[#16527D]/8 p-10 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Wrench className="w-4 h-4 text-teal mt-1"/>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-bold text-[15px] text-blueBlack">Facilities</h3>
                                    <p className="font-normal text-sm text-[#495560]">{detailDest.facilities}</p>
                                </div>

                            </div>
                            <div className="flex items-start gap-2">
                                <DollarSign className="w-4 h-4 text-teal mt-1"/>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-bold text-[15px] text-blueBlack">Price</h3>
                                    <p className="font-normal text-sm text-[#495560]">Rp {detailDest.price?.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-teal mt-1"/>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-bold text-[15px] text-blueBlack">Address</h3>
                                    <p className="font-normal text-sm text-[#495560]">{detailDest.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Building2 className="w-4 h-4 text-teal mt-1"/>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-bold text-[15px] text-blueBlack">City</h3>
                                    <p className="font-normal text-sm text-[#495560]">{detailDest.city}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-6">
                            <h3 className="font-bold text-[15px] text-blueBlack">Description</h3>
                            <p className="font-normal text-sm text-[#495560]">{detailDest.description}</p>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-bold text-[15px] text-blueBlack">Location</h3>
                            <div 
                                className="mt-4 rounded-lg overflow-hidden shadow w-fit"
                                dangerouslySetInnerHTML={{ __html: detailDest.location_maps }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 h-fit w-1/4 rounded-lg shadow p-4">
                        <h3 className="font-bold text-blueBlack text-lg">Booking</h3>
                        <div>
                            <label className="block text-[15px] font-bold mb-1">Date</label>
                            <input 
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)} 
                                className="w-full bg-[#F4F4F5] rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[15px] font-bold mb-1">Guests</label>
                            <input 
                                type="number"
                                min="1"
                                value={guest}
                                onChange={(e) => setGuest(Number(e.target.value))} 
                                className="w-full bg-[#F4F4F5] rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <div>
                            <p className="text-[#778088] text-sm font-semibold">Subtotal</p>
                            <p className="text-teal font-black text-4xl">Rp {subTotal?.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => handleAddToCart(detailDest.id)}
                            disabled={!date}
                            className={`mt-2 bg-teal text-white text-sm py-2 px-4 rounded 
                                ${!date ? "opacity-50 cursor-not-allowed" : "hover:bg-teal/80"}`}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Recommended Destinations</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {recommended.map((dest) => (
                        <DestinationCard
                            key={dest.id}
                            destination={dest}
                            onImageError={(e) => (e.target.src = "/placeholder.jpg")}
                            isDetailPage={false}
                        />
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}