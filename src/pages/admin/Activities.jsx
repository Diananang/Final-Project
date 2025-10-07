import { useEffect, useState } from "react"
import { PenBox, Trash2, PlusCircle } from "lucide-react";
import {toast} from 'sonner'
import { createActivity, deleteActivity, getAllActivities, updateActivity } from "../../api/activityApi";
import ActivityModal from "../../component/ActivityModal";
import { uploadImage } from "../../api/uploadImageApi";

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
        price: "",
        price_discount: "",
        rating: "",
        total_reviews: "",
        facilities: "",
        address: "",
        province: "",
        city: "",
    });

    const loadActivities = async () => {
        try {
            const data = await getAllActivities()
            setActivity(data)
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch Activities")
        }
    }

    const handleInputChange = (e) => {
        const {name, value, files} = e.target;
        if(files){
            setForm(prev => ({
                ...prev, 
                image: files[0], 
                preview: URL.createObjectURL(files[0])
            }))
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
            editingId: null
        });
        setEditingActivity(null);
        setModalOpen(false);
    };

    const openEditModal = (act) => {
        setEditingActivity(act);
        setForm({
            title: act.title,
            description: act.description,
            imageUrls: null,
            preview: Array.isArray(act.imageUrls) ? act.imageUrls[0] : act.imageUrls,
            location_maps: act.location_maps,
            categoryId: act.categoryId,
            editingId: act.id
        });
        setModalOpen(true);
    };
    
    const handleDelete = async (activityId) => {
        if (!confirm("Do you want to delete this activity?")) return;

        try {
            await deleteActivity(activityId)
            toast.success("Activity deleted succesfully");
            loadActivities();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete activity");
        }
    };

    const handleSubmit = async () => {
        setLoading(true)

        try {
            let imageUrls = [];
            if (form.image) {
                const uploadedUrl = await uploadImage(form.image);
                if (uploadedUrl) imageUrls.push(uploadedUrl);
            }else if (form.preview){
                if(Array.isArray(form.preview)){
                    imageUrls = form.preview;
                }else {
                    imageUrls = [form.preview]
                }
            }

            const payload = {
                title: form.title || "Untitled",
                description: form.description || "No description provided",
                imageUrls: typeof imageUrls === "string" ? imageUrls : imageUrls[0],
                location_maps: form.location_maps || "-",
                categoryId: form.categoryId,
                price: Number(form.price) || 0,
                price_discount: Number(form.price_discount) || 0,
                rating: Number(form.rating) || 0,
                total_reviews: Number(form.total_reviews) || 0,
                facilities: form.facilities || "-",
                address: form.address || "-",
                province: form.province || "-",
                city: form.city || "-",
            }

            if (form.editingId) {
                await updateActivity(form.editingId, payload)
                toast.success("Activity updated succesfully")
            }else{
                await createActivity(payload)
                toast.success("Activity created successfully")
            }

            resetForm();
            loadActivities();
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
        loadActivities(page)
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
                            src={Array.isArray(act.imageUrls) ? act.imageUrls[0] : act.imageUrls}
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

            {/* Pagination */}
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

            {/* Modal */}
            <ActivityModal 
                isOpen={modalOpen}
                onClose={resetForm}
                onSubmit={handleSubmit}
                form={form}
                onChange={handleInputChange}
                loading={loading}
            />
        </div>
    )
}