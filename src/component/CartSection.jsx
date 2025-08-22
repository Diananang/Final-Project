import { useEffect, useState } from "react"
import axios from 'axios'

export default function CartSection() {
  const [carts, setCarts] = useState([])

  const getCarts = async () => {
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
    }
  }

  const handleDelete = async (cartId) => {
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
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    getCarts()
  },[])

  return (
    <div className="flex flex-col bg-white p-4 w-2/3">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>
      {carts.map((cart) => (
        <div key={cart.id} className="flex gap-4 mt-6 justify-between p-4 rounded shadow">
          <img src={cart.activity.imageUrls} alt={cart.activity.title} className="w-20 h-20 object-cover"/>
          <div>
              <h3>{cart.activity.title}</h3>
              <p>{cart.activity.province}</p>
          </div>
          <p>{cart.quantity}</p>
          <p>Rp {cart.activity.price.toLocaleString()}</p>
          <button
            onClick={() => handleDelete(cart.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 h-fit"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}