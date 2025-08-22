import { useEffect, useState } from "react"
import axios from 'axios'

export default function PaymentForm() {
  const [payment, setPayment] = useState([])
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const changeNumber = ((e) => setCardNumber(e.target.value))
  const changeExpiry = ((e) => setExpiry(e.target.value))
  const changeCvc = ((e) => setCvc(e.target.value))

  const getPayment = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/payment-methods`,
        {
          headers: {
            apikey: import.meta.env.VITE_API_KEY
          }
        }
      )
      console.log(res);
      setPayment(res.data.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPayment();
  },[])

  return (
    <form className="flex flex-col gap-4 bg-blueBlack text-white p-4 rounded-2xl shadow w-1/3">
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      <div className="flex w-12 gap-4 ">
      {payment.map((pay) => (
        <img key={pay.id} src={pay.imageUrl} alt={pay.name}/>
      ))}
      </div>

      <div>
        <label className="block text-sm font-medium">Card number</label>
        <input
          type="number"
          name="card-number"
          value={cardNumber}
          onChange={changeNumber}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Expiry</label>
        <input
          type="date"
          name="expiry"
          value={expiry}
          onChange={changeExpiry}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">CVC</label>
        <input
          type="number"
          name="cvc"
          value={cvc}
          onChange={changeCvc}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-teal text-blueBlackx px-4 py-2 rounded hover:bg-teal/80"
      >
        Pay Now
      </button>
    </form>
  )
}
