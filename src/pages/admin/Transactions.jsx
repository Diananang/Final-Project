import { useEffect, useState } from "react"
import axios from 'axios'

export default function TransactionsAdmin () {
    const [trans, setTrans] = useState([])

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

    return (
        <div className="flex flex-col gap-6">
            {trans.map((t) => (
                <div key={t.id}>
                    <p>Invoice Id: {t.invoiceId}</p>
                    <p>Order Date:{t.orderDate}</p>
                    <img src={t.proofPaymentUrl} alt={t.proofPaymentUrl} />
                    <p>Status: {t.status}</p>
                    <p>Rp {t.totalAmount.toLocaleString()}</p>
                </div>
            ))}
        </div>
    )
}