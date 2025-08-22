import { useEffect, useState } from "react"
import axios from'axios'

export default function Transactions() {
    const [transactions, setTransactions] = useState([])

    const getMyTransactions = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/my-transactions`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            setTransactions(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMyTransactions();
    },[])

    return (
        <div className="flex flex-col bg-white p-4 w-2/3">
            <h2>Travel Cart</h2>
            <p>Let's continue the transactions.</p>
            {transactions.map((trans) => (
                <div className="flex gap-4 mt-6 justify-between p-4 rounded shadow">
                    <img src="/fallback.jpg" alt="Cart Image" className="w-20 h-20 object-cover"/>
                    <div>
                        <h3>Destination 1</h3>
                        <p>Address 1</p>
                    </div>
                    <p>Number</p>
                    <p>Price</p>
                    <p>Delete item</p>
                </div>
            ))}
        </div>
    )
}