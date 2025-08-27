import { useEffect, useState } from "react"
import axios from 'axios'

export default function Dashboard () {
    const [totalOrders, setTotalOrders] = useState(0)
    const [activeUsers, setActiveUsers] = useState(0)
    const [revenue, setRevenue] = useState(0)

    const getAllTransactions = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/all-transactions`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            const transactions = res.data.data
            setTotalOrders(transactions.length)

            const totalRevenue = transactions.filter((t) => t.status === 'success').reduce((sum, t) => sum + (t.totalAmount || 0), 0)
            setRevenue(totalRevenue)
        } catch (error) {
            console.log(error);
        }
    }

    const getAllUsers = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/all-user`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            const allUsers = res.data.data
            setActiveUsers(allUsers.length)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getAllTransactions();
        getAllUsers();
    },[])

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-medium">Total Orders</h3>
                <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-medium">Active Users</h3>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-medium">Revenue</h3>
                <p className="text-2xl font-bold text-purple-600">
                Rp {revenue.toLocaleString("id-ID")}
                </p>
            </div>
        </section>
    )
}