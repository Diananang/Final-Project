import { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import Navbar from "../../component/Navbar"
import { Minus, Plus, PlusCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function CartPage() {
  const [carts, setCarts] = useState([])
  const [update, setUpdate] = useState([])
  const [selectedCarts, setSelectedCarts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const getCarts = async () => {
    setLoading(true)
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
      setCarts(res.data.data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  const updateCart = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    setLoading(true)
    try {
      const payload = {
        quantity : newQuantity,
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/update-cart/${cartId}`,
        payload,
        {
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      console.log(res);
      setCarts(prev => prev.map(c => c.id === cartId ? {...c, quantity: newQuantity} : c))
    } catch (error) {
      console.log(error);
      toast.error("Failed to update Cart")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cartId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this item?")
    if (!confirmDelete) return

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/delete-cart/${cartId}`,
        {
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      getCarts()
      setSelectedCarts(prev => prev.filter(id => id !== cartId))
      toast.success("Deleted successfully")
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete item")
    }
  }

  const handleSelect = (cartId) => {
    if (selectedCarts.includes(cartId)) {
      setSelectedCarts(selectedCarts.filter(id => id !== cartId))
    } else{
      setSelectedCarts([...selectedCarts, cartId])
    }
  }

  const handleSelectAll = () => {
    if (selectedCarts.length === carts.length) {
      setSelectedCarts([])
    } else{
      setSelectedCarts(carts.map(cart => cart.id))
    }
  }

  const total = carts
    .filter(cart => selectedCarts.includes(cart.id))
    .reduce((sum, cart) => sum + cart.activity.price * cart.quantity, 0)

  const handleImageError = (e) => {
    e.target.src = "/placeholder.jpg";
  };
  
  useEffect(() => {
    getCarts()
  },[])

  if (loading) return <div className="p-6 text-center">Loading...</div>

  return (
    <div className="relative w-full min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col gap-4 px-6 sm:px-24 mt-6 font-mulish text-blueBlack">
        <h1 className="font-volkhov text-3xl font-bold mb-6">My Cart</h1>

        {carts.length === 0 ? (
          <p className="text-[#495560]">Your cart is empty</p>
        ) : (
          <div>
            <div className="flex gap-4">
              <input 
                type="checkbox" 
                checked={selectedCarts.length === carts.length && carts.length > 0} 
                onChange={handleSelectAll}
                className="w-5 h-5 accent-teal cursor-pointer"
              />
              <span className="font-bold">Select All</span>
            </div>

            {carts.map((cart) => (
              <div 
                key={cart.id} 
                className="flex gap-4 mt-6 justify-between items-center p-4 rounded shadow"
              >
                <input 
                  type="checkbox" 
                  checked={selectedCarts.includes(cart.id)}
                  onChange={() => handleSelect(cart.id)}
                  className="w-5 h-5 accent-teal cursor-pointer"
                />

                <img 
                  src={cart.activity.imageUrls?.[0]} 
                  alt={cart.activity.title} 
                  onError={handleImageError}
                  className="w-20 h-20 object-cover rounded-lg"
                />
      
                <div className="flex flex-col flex-1">
                    <h3 className="font-bold">{cart.activity.title}</h3>
                    <p className="text-sm text-gray-500">{cart.activity.province}</p>
                    <p className="text-xs text-gray-400">{new Date(cart.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCart(cart.id, cart.quantity - 1)}
                    disabled={cart.quantity <= 1}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-sm">Guests: {cart.quantity}</span>
                  <button
                    onClick={() => updateCart(cart.id, cart.quantity + 1)}
                  >
                    <Plus size={20}/>
                  </button>
                </div>

                <p className="font-semibold w-32 text-right">Rp {(cart.activity.price * cart.quantity)?.toLocaleString()}</p>
      
                <button
                  onClick={() => handleDelete(cart.id)}
                  className="text-red-500 hover:text-red-700 h-fit self-center"
                >
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6 p-4 border-t font-semibold text-lg">
              <span>Total</span>
              <span className="text-teal text-xl font-bold">Rp {total?.toLocaleString()}</span>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate("/checkout", {state: {selectedCarts}})}
                disabled={selectedCarts.length === 0}
                className={`px-6 py-2 rounded text-white 
                  ${selectedCarts.length === 0 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-teal hover:bg-teal/80"}`}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}