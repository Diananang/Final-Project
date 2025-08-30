import { useEffect, useState } from "react"
import axios from 'axios'
import { PenBox, Trash2, PlusCircle } from "lucide-react";
import {toast} from 'sonner'


export default function Activities () {
    const [activity, setActivity] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    const [form, setForm] = useState({
        name: "",
        description: "",
        image: null,
        preview: "",
        categoryId: "",
    });
    const [editingActivity, setEditingActivity] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const getAllActivities = async (pageNumber = 1) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/activities?page=${pageNumber}&limit=${limit}`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);

            const allData = res.data.data;
            const start = (pageNumber - 1) * limit;
            const paginated = allData.slice(start, start + limit);
            setActivity(paginated)
            setTotalPages(Math.ceil(allData.length / limit))
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

    const openEditModal = (activity) => {
        setEditingActivity(activity);
        setForm({
        name: activity.name,
        description: activity.description,
        image: null,
        preview: activity.imageUrl,
        categoryId: activity.categoryId,
        });
        setModalOpen(true);
    };

    const resetForm = () => {
        setForm({
        name: "",
        description: "",
        image: null,
        preview: "",
        categoryId: "",
        });
        setEditingActivity(null);
        setModalOpen(false);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.description || !form.categoryId) {
        toast.error("All field must be filled!");
        return;
        }

        try {
        setLoading(true);
        let imageUrl = form.preview;

        if (form.image) {
            const imgForm = new FormData();
            imgForm.append("image", form.image);

            const uploadRes = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/v1/upload-image`,
            imgForm,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            imageUrl = uploadRes.data.url;
        }

        const payload = {
            name: form.name,
            description: form.description,
            imageUrl,
            categoryId: form.categoryId,
        };

        await axios.put(`
            ${import.meta.env.VITE_BASE_URL}/api/v1/activities/${editingActivity.id}`, payload, {
            headers: {
                apikey: import.meta.env.VITE_API_KEY,
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        toast.success(editingActivity ? "Activity updated" : "Activity added");
        getAllActivities();
        resetForm();
        } catch (error) {
            console.log(error);
            toast.error("Failed saving activity");
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Do you want to delete this item?")) return;

        try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/activities/${id}`, {
            headers: {
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        toast.success("Activity deleted");
        getAllActivities();
        } catch (error) {
        console.log(error);
        toast.error("Failed to delete activity");
        }
    };

    const handleImageError = (e) => {
        e.target.src = "/placeholder.jpg";
    };

    useEffect(() => {
        getAllActivities()
    },[page])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Aktivitas</h2>
                <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded hover:bg-teal/80"
                >
                <PlusCircle size={18} />
                Add Activity
                </button>
            </div>

            {activity.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                Belum ada aktivitas yang tersedia saat ini.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {activity.map((act) => (
                    <div
                        key={act.id}
                        className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                    <img
                        src={act.imageUrls}
                        alt={act.name}
                        onError={handleImageError}
                        className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">{act.name}</h3>
                        <p className="text-sm text-gray-500">{act.description}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                        <PenBox
                        size={18}
                        className="text-gray-500 hover:text-blue-500 cursor-pointer"
                        onClick={() => openEditModal(act)}
                        />
                        <Trash2
                        size={18}
                        className="text-gray-500 hover:text-red-500 cursor-pointer"
                        onClick={() => handleDelete(act.id)}
                        />
                    </div>
                    </div>
                ))}
                </div>
            )}

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
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        {editingActivity ? "Edit Activity" : "Add Activity"}
                        </h3>
                        <div className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            placeholder="Nama aktivitas"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            placeholder="Deskripsi aktivitas"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <input
                            type="text"
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleInputChange}
                            placeholder="ID kategori"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={handleInputChange}
                            className="w-full"
                        />
                        {form.preview && (
                            <img
                            src={form.preview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded border border-gray-200"
                            />
                        )}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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