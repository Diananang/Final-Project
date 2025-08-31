import { useEffect, useState } from "react"
import axios from 'axios'
import { PenBox, Trash2, PlusCircle } from "lucide-react";
import {toast} from 'sonner'


export default function Activities () {
    const [activity, setActivity] = useState([])
    const [editingActivity, setEditingActivity] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 6;

    const [form, setForm] = useState({
        title: "",
        description: "",
        imageUrls: null,
        preview: "",
        location_maps: "",
        categoryId: "",
    });


    const getAllActivities = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/activities`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                    }
                }
            )
            console.log(res);
            setActivity(res.data.data)
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch Activities")
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

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            imageUrls: null,
            preview: "",
            location_maps: "",
            categoryId: "",
        });
        setEditingActivity(null);
        setModalOpen(false);
    };

    const openEditModal = (activity) => {
        setEditingActivity(activity);
        setForm({
            title: activity.title,
            description: activity.description,
            imageUrls: null,
            preview: activity.imageUrls,
            location_maps: activity.location_maps,
            categoryId: act.categoryId,
        });
        setModalOpen(true);
    };

    const createActivity = async (payload) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/create-activity`,
                payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success("Activity created successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to create activity");
        }
    }

    const updateActivity = async (activityId, payload) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/update-activity/${activityId}`,
                payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success("Activity updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update activity");
        }
    }
    
    const handleDelete = async (activityId) => {
        if (!confirm("Do you want to delete this activity?")) return;

        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/delete-activity/${activityId}`, {
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

    const handleSubmit = async () => {
        setLoading(true)

        try {
            let imageUrls = form.preview;
            if (form.image) {
                const uploadedUrl = await uploadImage(form.image);
                if (uploadedUrl) imageUrls = uploadedUrl;
            }

            const payload = {
                title: form.title,
                description: form.description,
                imageUrls,
                location_maps: form.location_maps,
                categoryId: form.categoryId,
            }

            if (editingActivity) {
                await updateActivity(editingActivity.id, payload)
            }else{
                await createActivity(payload)
            }

            resetForm();
            getAllActivities();
        } catch (error) {
            console.log(error);
            toast.error("Failed to save activity");
        } finally {
            setLoading(false)
        }
    };


    const handleImageError = (e) => {
        e.target.src = "/placeholder.jpg";
    };

    useEffect(() => {
        getAllActivities(page)
    },[page])

    const totalPages = Math.ceil(activity.length / limit);
    const currentData = activity.slice((page - 1) * limit, page * limit);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold text-blueBlack">Activities</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded hover:bg-teal/80"
                >
                    <PlusCircle size={24} />
                </button>
            </div>

            {currentData.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    No activity is available.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-[600px] overflow-hidden">
                    {currentData.map((act) => (
                        <div
                            key={act.id}
                            className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                        <img
                            src={act.imageUrls}
                            alt={act.title}
                            onError={handleImageError}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800">{act.title}</h3>
                            <p className="text-sm text-gray-500">{act.description}</p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2">
                            <PenBox
                                size={18}
                                className="text-blueBlack hover:text-blueBlack/80 cursor-pointer"
                                onClick={() => openEditModal(act)}
                            />
                            <Trash2
                                size={18}
                                className="text-red-500 hover:text-red-400 cursor-pointer"
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
                            value={form.title}
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
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 bg-teal text-white rounded hover:bg-teal/80 disabled:opacity-50"
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