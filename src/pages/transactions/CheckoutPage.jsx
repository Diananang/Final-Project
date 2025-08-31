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
            }
        )
        console.log(res);
        setPaymentMethods(res.data.data)
        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch payment methods")
        }
    }

    const total = carts.reduce((sum, cart) => sum + cart.activity.price * cart.quantity, 0)

    const handlePayment = async () => {
        if (!selectedPayment) {
            toast.error("Please select a payment method")
            return
        }

        try {
            setLoading(true)
            const payload = {
                cartIds: selectedCarts.map(cart => cart.id),
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
            }
        )
        console.log(res);
        const transactionId = res.data.data.transactionId;
        if (!transactionId) {
            toast.error("Transaction ID not found");
            setLoading(false);
            return;
        }

        toast.success(res.data.message || "Payment successful")
        navigate("/upload-payment-proof", {
            state: {
                selectedCarts,
                total,
                paymentMethodId: selectedPayment,
                transactionId  
            }})
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Payment failed")
        } finally{
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
                
                <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Items</h2>
                {carts.map(cart => (
                    <div key={cart.id} className="flex justify-between py-2 border-b">
                        <span>{cart.activity.title} x {cart.quantity}</span>
                        <span>Rp {(cart.activity.price * cart.quantity).toLocaleString()}</span>
                    </div>
                ))}
                <div className="flex justify-between py-2 font-bold">
                    <span>Total</span>
                    <span>Rp {total.toLocaleString()}</span>
                </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
                    <select
                        value={selectedPayment}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map(method => (
                            <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handlePayment}
                    className={`bg-teal text-white px-6 py-2 rounded hover:bg-teal/80 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Confirm & Pay"}
                </button>
            </div>
        </div>
    )
}