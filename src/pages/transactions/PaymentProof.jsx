import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../component/Navbar";
import { toast } from "sonner";

export default function UploadPaymentProof() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCarts, paymentMethodId, total, transactionId } = location.state || {};

  const [carts, setCarts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCartDetails = async () => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/carts`,
            {
            headers: {
                apikey: import.meta.env.VITE_API_KEY,
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            }
        );
        const filteredCarts = res.data.data.filter((cart) =>
            selectedCarts.includes(cart.id)
        );
        console.log(res);
        setCarts(filteredCarts);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch cart details");
        }
    };

  const getPaymentMethod = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/payment-methods`,
        {
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      setPaymentMethod(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch payment method");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a payment proof");
      return;
    }

    if (!transactionId) {
      toast.error("Transaction ID not found");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("carts", JSON.stringify(selectedCarts));
    formData.append("paymentMethodId", paymentMethodId);
    formData.append("total", total);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/update-transaction-proof-payment/${transactionId}`,
        formData,
        {
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res.data.message || "Payment proof uploaded");
      navigate("/success");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCarts || selectedCarts.length === 0 || !paymentMethodId) {
      navigate("/cart");
    } else {
      getCartDetails();
      getPaymentMethod();
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="px-6 sm:px-24 py-6">
        <h1 className="text-3xl font-bold mb-6">Upload Payment Proof</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Items</h2>
          {carts.map((cart) => (
            <div key={cart.id} className="flex justify-between py-2 border-b">
              <span>
                {cart.activity.title} x {cart.quantity}
              </span>
              <span>Rp {(cart.activity.price * cart.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 font-bold">
            <span>Total</span>
            <span>Rp {total?.toLocaleString()}</span>
          </div>
        </div>

        {paymentMethod && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
            <p>{paymentMethod.name}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Upload Payment Proof</label>
          <input type="file" onChange={handleFileChange} className="border p-2 rounded w-full" />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-teal text-white px-6 py-2 rounded hover:bg-teal/80 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Submit Payment Proof"}
        </button>
      </div>
    </div>
  );
}
