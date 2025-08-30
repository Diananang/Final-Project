import { useState, useEffect } from "react";
import axios from 'axios'
import {toast} from 'sonner'
import { PenBox, Trash2 } from 'lucide-react';

export default function Promos () {
    const [promos, setPromos] = useState([])
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        promo_code: "",
        terms_condition: "",
        minimum_claim_price: "",
        promo_discount_price: "",
        image: null,
        preview: "",
    });
    
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
        }
    }
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm((prev) => ({
            ...prev,
            image: files[0],
            preview: URL.createObjectURL(files[0]),
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const openEditModal = (promo) => {
        setEditingPromo(promo);
        setForm({
            title: promo.title,
            description: promo.description,
            promo_code: promo.promo_code,
            term_condition: promo.term_condition,
            minimum_claim_price: promo.minimum_claim_price,
            promo_discount_price: promo.promo_discount_price,
            image: null,
            preview: promo.imageUrl,
        });
        setModalOpen(true);
    };

    const handleImageError = (e) => {
        e.target.src = "/fallback.jpg";
    };

    const handleSubmit = async () => {
        // if (!form.title || !form.description || !form.promo_code || !form.terms_condition) {
        //     toast.error("Please fill all required fields");
        //     return;
        // }

        try {
            setLoading(true);
            let imageUrl = form.preview;

            // jika ada data baru
            if (form.image) {
                const imgForm = new FormData();
                imgForm.append("image", form.image);

                const uploadRes = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/v1/upload-image`,
                    imgForm,
                    {
                        headers: {
                            apikey: import.meta.env.VITE_API_KEY,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                imageUrl = uploadRes.data.url;
            }
            
            const payload = {
                title: form.title,
                description: form.description,
                promo_code: form.promo_code,
                terms_condition: form.terms_condition,
                minimum_claim_price: Number(form.minimum_claim_price),
                promo_discount_price: Number(form.promo_discount_price),
                imageUrl, 
            };

            if (editingPromo) {
                await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/api/v1/update-promo/${editingPromo.id}`,
                    payload,
                    {
                        headers: {
                            apikey: import.meta.env.VITE_API_KEY,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                toast.success("Promo updated successfully");
            } else {
                await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/create-promo`,
                payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                    },
                }
                );
                toast.success("Promo created successfully");
            }
            setModalOpen(false);
            setEditingPromo(null);
            setForm({ 
                title: "", 
                description: "", 
                promo_code: "", 
                term_condition: "", 
                minimum_claim_price: "", 
                promo_discount_price: "", 
                image: null, 
                preview: "" ,
            })
            getPromos();
        } catch (error) {
            console.log(error);
            toast.error("Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure want to delete this promo?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/delete-promo/${id}`, {
                headers: { 
                    apikey: import.meta.env.VITE_API_KEY 
                },
            }
        );
            toast.success("Promo deleted");
            getPromos();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete promo");
        }
    };

    useEffect(() => {
        getPromos();
    },[])

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold">All Promos</h1>
                <button 
                    onClick={() => setModalOpen(true)} 
                    className="px-4 py-2 bg-teal text-white rounded">
                Add Promo
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Promo Code</th>
                    <th className="p-3 text-left">Term</th>
                    <th className="p-3 text-left">Min Claim</th>
                    <th className="p-3 text-left">Discount</th>
                    <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {promos.map((promo) => (
                    <tr key={promo.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3">
                        <img
                            src={promo.imageUrl || "/placeholder.jpg"}
                            alt={promo.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                            onError={handleImageError}
                        />
                        </td>
                        <td className="p-3">{promo.title}</td>
                        <td className="p-3 max-w-xs sm:max-w-md line-clamp-3 text-sm">{promo.description}</td>
                        <td className="p-3">{promo.promo_code}</td>
                        <td className="p-3 max-w-xs sm:max-w-md line-clamp-3">{promo.terms_condition}</td>
                        <td className="p-3">Rp {promo.minimum_claim_price?.toLocaleString()}</td>
                        <td className="p-3">Rp {promo.promo_discount_price?.toLocaleString()}</td>
                        <td className="p-3 flex gap-2 flex-wrap">
                        <button 
                            onClick={() => openEditModal(promo)} 
                            className="px-2 py-1 text-blue-500 rounded"
                        >
                            <PenBox />
                        </button>
                        <button 
                            onClick={() => handleDelete(promo.id)} 
                            className="px-2 py-1 text-red-500  rounded"
                        >
                            <Trash2 />
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
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
                        name="term_condition" 
                        placeholder="Term Condition" 
                        value={form.term_condition} 
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
                                term_condition: "", 
                                minimum_claim_price: "", 
                                promo_discount_price: "", 
                                image: null, preview: "" 
                                }); 
                                }} 
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