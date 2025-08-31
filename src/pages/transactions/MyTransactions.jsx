import { useEffect, useState } from "react"
import axios from'axios'
import { toast } from "sonner"

export default function MyTransactions() {
    const [transactions, setTransactions] = useState([])
    const [uploading, setUploading] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState({});

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
            toast.error("Failed to fetch transactions")
        }
    }
    
    const uploadImage = async (file) => {
        try {
            const formData = new FormData()
            formData.append("image", file)

            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/upload-image`,
                formData,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
            )
            console.log(res);
            return res.data.url
        } catch (error) {
            console.log(error);
            toast.error("Failed to upload image")
        }
    }

    const updatePaymentProof = async (transactionId, proofPaymentUrl) => {
        try {
            const payload = {
                proofPaymentUrl,
            }

            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/update-transaction-proof-payment/${transactionId}`,
                payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success("Proof of payment uploaded")
            getMyTransactions()
        } catch (error) {
            console.log(error);
            toast.error("Failed to upload proof")
        }
    }
    const cancelTransaction = async (transactionId) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/cancel-transaction/${transactionId}`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success("Transaction cancelled")
            getMyTransactions()
        } catch (error) {
            console.log(error);
            toast.error("Failed to cancel transaction")
        }
    }

    const handleUpload = async (transactionId, file) => {
        if (!file) return;
        setUploading(true)

        try {
            const url = await uploadImage(file)
            if (url) {
                await updatePaymentProof(transactionId, url)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUploading(false)
        }
    }

    useEffect(() => {
        getMyTransactions();
    },[])

    return (
        <div className="flex flex-col bg-white p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">My Transactions</h2>
            <p className="text-gray-600 mb-6">Let's continue the transactions.</p>

            {transactions.length === 0 && (
                <p className="text-gray-500">No transactions found.</p>
            )}

            {transactions.map((trans) => (
                <div 
                    key={trans.id}
                    className="flex flex-col gap-4 mt-6 p-4 rounded shadow border"
                >
                    <div className="flex gap-4">
                        <img 
                            src={trans.carts?.[0].activity?.imageUrls?.[0]}
                            alt={trans.carts?.[0]?.activity?.title} 
                            onError={(e) => e.target.src("./fallback.jpg")}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                            <h3 className="font-semibold">{trans.carts?.[0]?.activity?.title}</h3>
                            <p className="text-sm text-gray-500">{trans.carts?.[0]?.activity?.province}</p>
                            <p className="text-xs text-gray-400">
                                Status: <span className="font-medium">{trans.status}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                        <p className="font-semibold">
                            Rp{" "}
                            {trans.totalAmount
                                ? trans.totalAmount?.toLocaleString()
                                : "0"}
                            </p>
                    </div>

                    {/* Upload proof kalau status masih pending */}
                    {trans.status === "pending" && (
                    <div className="flex flex-col gap-2 mt-2 w-fit">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setSelectedFiles((prev) => ({
                                ...prev,
                                [trans.id]: e.target.files[0],
                                }))
                            }
                            disabled={uploading}
                        />

                        <button
                            onClick={() => handleUpload(trans.id, selectedFiles[trans.id])}
                            className="px-3 py-1 bg-teal text-white rounded hover:bg-teal/80"
                            disabled={uploading || !selectedFiles[trans.id]}
                            >
                            {uploading ? "Uploading..." : "Upload Proof"}
                        </button>
                        
                        <button
                            onClick={() => cancelTransaction(trans.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    </div>
                    )}
                </div>
            ))}
        </div>
    )
}