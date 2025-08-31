import { useState, useEffect } from "react";
import axios from 'axios'
import {toast} from 'sonner'
import { PenBox, PlusCircle, Trash2 } from 'lucide-react';

export default function Promos () {
    const [promos, setPromos] = useState([])
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 2;

    const [form, setForm] = useState({
        title: "",
        description: "",
        promo_code: "",
        terms_condition: "",
        minimum_claim_price: "",
        promo_discount_price: "",
        image: null,
        preview: ""
    });

    const handleInputChange = (e) => {
        const {name, value, files} = e.target;
        if(files){
            setForm(prev => ({...prev, image: files[0], preview: URL.createObjectURL(files[0])}))
        } else {
            setForm(prev => ({...prev, [name] : value}))
        }
    }
    
    const getPromos = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/promos`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                    }
                }
            )
            console.log(res);
            setPromos(res.data.data)
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch promos");
        }
    }

    const uploadImage = async (file) => {
        if (!file) return null;
        const formData = new FormData()
        formData.append("image", file)

        try {
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
            return null;
        }
    }

    const createPromo = async (payload) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/create-promo`,
                payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success("Promo created successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to create promo");
        }
    }

    const updatePromo = async (promoId, payload) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/update-promo/${promoId}`,
                payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success("Promo updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update promo");
        }
    }

    const handleDelete = async (promoId) => {
        if (!confirm("Are you sure want to delete this promo?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/delete-promo/${promoId}`, {
                headers: { 
                    apikey: import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });
            toast.success("Promo deleted");
            getPromos();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete promo");
        }
    };


    const handleSubmit = async () => {
        setLoading(true)

        try {
            let imageUrl = form.preview;
            if (form.image) {
                const uploadedUrl = await uploadImage(form.image);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const payload = {
                title: form.title,
                description: form.description,
                imageUrl,
                terms_condition: form.terms_condition,
                promo_code: form.promo_code,
                promo_discount_price: Number(form.promo_discount_price),
                minimum_claim_price: Number(form.minimum_claim_price),
            }
            if (editingPromo) {
                await updatePromo(editingPromo.id, payload)
            }else{
                await createPromo(payload)
            }
            setModalOpen(false);
            setEditingPromo(null);
            setForm({
                title: "",
                description: "",
                promo_code: "",
                terms_condition: "",
                minimum_claim_price: "",
                promo_discount_price: "",
                image: null,
                preview: ""
            });
            getPromos();
        } catch (error) {
            console.log(error);
            toast.error("Failed to save promo");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getPromos(page);
    },[page])

    const totalPages = Math.ceil(promos.length / limit);
    const currentData = promos.slice((page - 1) * limit, page * limit);

    const handleImageError = (e) => {
        e.target.src = "/fallback.jpg";
    };

    const openEditModal = (promo) => {
        setEditingPromo(promo);
        setForm({
            title: promo.title,
            description: promo.description,
            promo_code: promo.promo_code,
            terms_condition: promo.terms_condition,
            minimum_claim_price: promo.minimum_claim_price,
            promo_discount_price: promo.promo_discount_price,
            image: null,
            preview: promo.imageUrl,
        });
        setModalOpen(true);
    };


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold">All Promos</h1>
                <button 
                    onClick={() => setModalOpen(true)} >
                        <PlusCircle size={24} className="text-teal"/>
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {currentData.map((promo) => (
                <div 
                    key={promo.id} 
                    className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden"
                >
                    <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="w-full h-48 object-cover"
                        onError={handleImageError}
                    />

                    <div className="p-4 flex flex-col gap-2 flex-1 text-blueBlack">
                        <h3 className="text-lg font-bold">{promo.title}</h3>
                        <p className="text-sm font-semibold text-teal">{promo.promo_code}</p>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-bold">Description</span>
                            <p className="text-sm text-[#495560]">{promo.description}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-bold">Terms & Condition</span>
                            <p className="text-sm text-[#495560]" dangerouslySetInnerHTML={{ __html: promo.terms_condition }}></p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-bold">Minimum Price</span>
                            <p className="text-sm text-[#495560]">Rp {promo.minimum_claim_price?.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-bold">Minimum Price</span>
                            <p className="text-sm text-[#495560]">Rp {promo.promo_discount_price?.toLocaleString()}</p>
                        </div>
                        <div>
                            <button 
                                onClick={() => openEditModal(promo)} 
                                className="px-2 py-1 text-teal rounded"
                            >
                                <PenBox />
                            </button>
                            <button 
                                onClick={() => handleDelete(promo.id)} 
                                className="px-2 py-1 text-red-500  rounded"
                            >
                                <Trash2 />
                            </button>
                        </div>
                    </div>
                </div>
                ))}
                
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(prev => prev - 1)}
                        className="px-4 py-2 bg-teal text-white rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 bg-gray-200 rounded">
                        {page} / {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(prev => prev + 1)}
                        className="px-4 py-2 bg-teal text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>


            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
                    <h2 className="text-xl font-bold mb-4">{editingPromo ? "Edit Promo" : "Add Promo"}</h2>
                    <div className="flex flex-col gap-3">
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Title" 
                        value={form.title} 
                        onChange={handleInputChange} 
                        className="border p-2 rounded w-full" 
                    />
                    <textarea 
                        name="description" 
                        placeholder="Description" 
                        value={form.description} 
                        onChange={handleInputChange} 
                        className="border p-2 rounded w-full" 
                    />
                    <input 
                        type="text" 
                        name="promo_code" 
                        placeholder="Promo Code" 
                        value={form.promo_code} 
                        onChange={handleInputChange} 
                        className="border p-2 rounded w-full" 
                    />
                    <textarea 
                        name="terms_condition" 
                        placeholder="Terms & Condition" 
                        value={form.terms_condition} 
                        onChange={handleInputChange} 
                        className="border p-2 rounded w-full" 
                    />
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            name="minimum_claim_price" 
                            placeholder="Min Claim Price" 
                            value={form.minimum_claim_price} 
                            onChange={handleInputChange} 
                            className="border p-2 rounded w-1/2" 
                        />
                        <input 
                            type="number" 
                            name="promo_discount_price" 
                            placeholder="Discount Price" 
                            value={form.promo_discount_price} 
                            onChange={handleInputChange} 
                            className="border p-2 rounded w-1/2" 
                        />
                    </div>
                    <input 
                        type="file" 
                        name="image" 
                        onChange={handleInputChange} 
                        className="border p-2 rounded w-full" 
                    />
                    {form.preview && 
                        <img 
                            src={form.preview} 
                            alt="Preview" 
                            className="mt-2 w-32 h-32 object-cover rounded" 
                        />
                    }
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button 
                            onClick={() => { 
                                setModalOpen(false); 
                                setEditingPromo(null); 
                                setForm({ 
                                    title: "", 
                                    description: "", 
                                    promo_code: "", 
                                    terms_condition: "", 
                                    minimum_claim_price: "", 
                                    promo_discount_price: "", 
                                    image: null, 
                                    preview: "" 
                                    }); 
                                }
                            } 
                            className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading} 
                            className="px-4 py-2 bg-teal text-white rounded disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}