import { useEffect, useState } from "react"
import axios from 'axios'

export default function TransactionsAdmin () {
    const [trans, setTrans] = useState([])
    const [sortBy, setSortBy] = useState("");

    const getAllTrans = async () => {
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
            setTrans(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllTrans()
    },[])

    const getSortedTrans = () => {
    if (!sortBy) return trans;

    return [...trans].sort((a, b) => {
        if (sortBy === "pending") {
            return a.status === "pending" ? -1 : 1;
        }
        if (sortBy === "success") {
            return a.status === "success" ? -1 : 1;
        }
        if (sortBy === "failed") {
            return a.status === "failed" ? -1 : 1;
        }
        return 0;
        });
    };

    return (
        <div className="flex flex-col gap-6">

            <div className="flex justify-end mb-4">
                <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                >
                <option value="">Sort by Status</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                </select>
            </div>

            {getSortedTrans().map((t) => (
                <div 
                key={t.id} 
                className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4 border border-gray-100"
                >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                    Invoice #{t.invoiceId}
                    </h3>
                    <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
                        t.status === "success"
                            ? "bg-green-100 text-green-700"
                            : t.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                    `}
                    >
                    {t.status}
                    </span>
                </div>

                {/* Image */}
                {t.proofPaymentUrl && (
                    <div className="w-full">
                    <img
                        src={t.proofPaymentUrl}
                        alt="Proof of Payment"
                        className="rounded-lg border max-h-48 object-cover mx-auto"
                    />
                    </div>
                )}

                {/* Details */}
                <div className="space-y-2 text-gray-600 text-sm">
                    <p>
                    <span className="font-medium text-gray-800">Order Date:</span>{" "}
                    {new Date(t.orderDate).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                    </p>
                    <p>
                    <span className="font-medium text-gray-800">Total:</span>{" "}
                    Rp {t.totalAmount.toLocaleString("id-ID")}
                    </p>
                </div>
                </div>
            ))}
        </div>
    )
}