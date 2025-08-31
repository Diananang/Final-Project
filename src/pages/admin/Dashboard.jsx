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
        <div className="flex justify-center items-center min-h-screen">
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 max-w-5xl w-full">
                {/* Total Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform duration-200">
                    <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-blueBlack">Total Orders</h3>
                        <p className="text-3xl font-bold text-teal mt-2">{totalOrders}</p>
                    </div>
                    <div className="p-3 bg-teal/20 rounded-xl">
                        <svg
                        className="w-6 h-6 text-teal"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        >
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4"></path>
                        <circle cx="7" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        </svg>
                    </div>
                    </div>
                </div>

                {/* Active Users */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform duration-200">
                    <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-blueBlack">Active Users</h3>
                        <p className="text-3xl font-bold text-yellow mt-2">{activeUsers}</p>
                    </div>
                    <div className="p-3 bg-yellow/20 rounded-xl">
                        <svg
                        className="w-6 h-6 text-yellow"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        >
                        <path d="M5.121 17.804A6 6 0 1118 12v1a9 9 0 01-12.879 4.804z"></path>
                        </svg>
                    </div>
                    </div>
                </div>

                {/* Revenue */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform duration-200">
                    <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-blueBlack">Revenue</h3>
                        <p className="text-3xl font-bold text-green-500 mt-2">
                        Rp {revenue.toLocaleString("id-ID")}
                        </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-xl">
                        <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        >
                        <path d="M12 8c-1.657 0-3 .672-3 1.5s1.343 1.5 3 1.5 3 .672 3 1.5-1.343 1.5-3 1.5m0-6V6m0 12v-2"></path>
                        </svg>
                    </div>
                    </div>
                </div>
            </section>
        </div>
    )
}