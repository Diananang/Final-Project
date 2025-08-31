import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../../component/Navbar"
import { toast } from "sonner"

export default function Checkout () {
    const location = useLocation()
    const navigate = useNavigate()
    const { selectedCarts } = location.state || []
    
    const [carts, setCarts] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const [selectedPayment, setSelectedPayment] = useState("")
    const [loading, setLoading] = useState(false)

    const total = carts.reduce(
        (sum, cart) => sum + cart.activity.price * cart.quantity,
        0
    )

    const getCartDetails = async () => {
        try {
        const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/carts`,
            {
            headers: {
                apikey: import.meta.env.VITE_API_KEY,
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
            }
        )
            console.log(res);
            const filteredCarts = res.data.data.filter(cart => selectedCarts.includes(cart.id))
            setCarts(filteredCarts)
        } catch (error) {
        console.log(error)
        toast.error("Failed to fetch cart details")
        }
    }

    const getPaymentMethods = async () => {
        try {
        const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/payment-methods`,
            {
                headers: {
                    apikey: import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            console.log(res);
            setPaymentMethods(res.data.data)
        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch payment methods")
        }
    }

    const createTransaction = async () => {
        if (!selectedPayment) {
            toast.error("Please select a payment method")
            return
        }

        setLoading(true)
        try {
            const payload = {
                cartIds: selectedCarts,
                paymentMethodId: selectedPayment,
            }

            const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/v1/create-transaction`,
            payload,
            {
                headers: {
                    apikey: import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            console.log(res);
            toast.success("Transaction created")
            navigate("/my-transactions")
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to create transaction")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!selectedCarts || selectedCarts.length === 0) navigate("/cart")
        getCartDetails()
        getPaymentMethods()
    }, [])

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="px-6 sm:px-24 py-6">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                
                {/* cart */}
                <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Items</h2>
                {carts.map(cart => (
                    <div key={cart.id} className="flex justify-between py-2 border-b">
                        <span>{cart.activity.title} x {cart.quantity}</span>
                        <span>Rp {(cart.activity.price * cart.quantity)?.toLocaleString()}</span>
                    </div>
                ))}
                    <div className="flex justify-between py-2 font-bold">
                        <span>Total</span>
                        <span>Rp {total?.toLocaleString()}</span>
                    </div>
                </div>

                {/* payment */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
                    {paymentMethods.map((method) => (
                        <label 
                            key={method.id}
                            className={`flex items-center gap-4 p-3 border rounded cursor-pointer transition 
                                 ${selectedPayment === method.id ? "border-teal bg-teal/5" : "border-gray-300"}`}
                        >
                            <input 
                                type="radio" 
                                name="paymentMethod"
                                value={method.id}
                                onChange={() => setSelectedPayment(method.id)}
                                className="w-5 h-5 accent-black"
                            />
                            <img src={method.imageUrl}
                                alt={method.name}
                                className="w-14 h-10 object-contain rounded bg-white"
                                onError={(e) => (e.target.src = "/placeholder.jpg")}
                            />
                            <span className="font-medium">{method.name}</span>
                        </label>
                    ))}
                </div>

                {/* Confirm */}
                <button
                    onClick={createTransaction}
                    className={`bg-teal text-white px-6 py-2 rounded hover:bg-teal/80 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Confirm & Pay"}
                </button>
            </div>
        </div>
    )
}