import { useEffect, useState } from "react"
import axios from 'axios'
import { PenBox, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from "sonner";

export default function Categories () {
    const [category, setCategory] = useState([])
    const [editingCategory, setEditingCategory] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 6;

    const [form, setForm] = useState({
        name: "",
        image: null,
        preview: "",
    });

    const getAllCategories = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/categories`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            setCategory(res.data.data)
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch categories")
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

    const handleInputChange = (e) => {
        const {name, value, files} = e.target;
        if(files){
            setForm(prev => ({...prev, image: files[0], preview: URL.createObjectURL(files[0])}))
        } else {
            setForm(prev => ({...prev, [name] : value}))
        }
    };

    const openEditModal = (cat) => {
        setEditingCategory(cat);
        setForm({
            name: cat.name,
            image: null,
            preview: cat.imageUrl,
        });
        setModalOpen(true);
    };

    const createCategories = async (payload) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/create-category`,
                payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success("Category created successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to create category");
        }
    }

    const updateCategory = async (categoryId, payload) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/update-category/${categoryId}`,
                payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success("Category updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update category");
        }
    }


    const handleDelete = async (categoryId) => {
        if (!confirm("Do you want to delete this category?")) return;

        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/delete-category/${categoryId}`, {
                headers: { 
                    apikey: import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });
            toast.success("Category deleted");
            getAllCategories();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete category");
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
                name: form.name,
                imageUrl,
            }
            if (editingCategory) {
                await updateCategory(editingCategory.id, payload)
            }else{
                await createCategories(payload)
            }

            setModalOpen(false);
            setEditingCategory(null);
            setForm({
                name: "",
                image: null,
                preview: "",
            });
            getAllCategories();
        } catch (error) {
            console.log(error);
            toast.error("Failed to save category");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllCategories(page)
    },[page])

    const totalPages = Math.ceil(category.length / limit);
    const currentData = category.slice((page - 1) * limit, page * limit);

    return (
        <div className="min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button
                className="text-teal"
                onClick={() => setModalOpen(true)}
                >
                    <PlusCircle size={24} />
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {currentData.map((cat) => (
                <div
                    key={cat.id}
                    className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        onError={(e) => (e.target.src = "/fallback.jpg")}
                        className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                        <PenBox
                            size={18}
                            className="text-blueBlack hover:text-blue-500 cursor-pointer"
                            onClick={() => openEditModal(cat)}
                        />
                        <Trash2
                            size={18}
                            className="text-red-500 hover:text-red-400 cursor-pointer"
                            onClick={() => handleDelete(cat.id)}
                        />
                    </div>
                </div>
                ))}
            </div>
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

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">
                        {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
                        </h3>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            placeholder="Nama kategori"
                            className="w-full mb-3 p-2 border rounded"
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={handleInputChange}
                            className="mb-3"
                        />
                        {form.preview && (
                        <img
                            src={form.preview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded mb-3"
                        />
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => { 
                                    setModalOpen(false); 
                                    setEditingCategory(null); 
                                    setForm({ 
                                        name: "",
                                        image: null,
                                        preview: "",
                                        }); 
                                    }
                                }
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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