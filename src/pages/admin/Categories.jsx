import { useEffect, useState } from "react"
import axios from 'axios'
import { PenBox, Trash2 } from 'lucide-react';

export default function Categories () {
    const [category, setCategory] = useState([])
    const [form, setForm] = useState({
        name: "",
        image: null,
        preview: "",
    });
    const [editingCategory, setEditingCategory] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);


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

    const openEditModal = (cat) => {
        setEditingCategory(cat);
        setForm({
        name: cat.name,
        image: null,
        preview: cat.imageUrl,
        });
        setModalOpen(true);
    };

    const resetForm = () => {
        setForm({ name: "", image: null, preview: "" });
        setEditingCategory(null);
        setModalOpen(false);
    };

    const handleSubmit = async () => {
        if (!form.name) {
        toast.error("Nama kategori wajib diisi");
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
                    "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(uploadRes);
            imageUrl = uploadRes.data.url;
        }

        const payload = {
            name: form.name,
            imageUrl,
        };

        await axios.put(`
            ${import.meta.env.VITE_BASE_URL}/api/v1/update-category/${editingCategory.id}`, payload, {
                headers: {
                apikey: import.meta.env.VITE_API_KEY,
                "Content-Type": "application/json",
            },
        });

        toast.success(editingCategory ? "Kategori diperbarui" : "Kategori dibuat");
        resetForm();
        getAllCategories();
        } catch (error) {
            console.log(error);
            toast.error("Gagal menyimpan kategori");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus kategori ini?")) return;

        try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/categories/${id}`, {
            headers: { apikey: import.meta.env.VITE_API_KEY },
        });
        toast.success("Kategori dihapus");
        getCategories();
        } catch (error) {
        console.log(error);
        toast.error("Gagal menghapus kategori");
        }
    };

    useEffect(() => {
        getAllCategories()
    },[])

    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {category.map((cat) => (
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
                        className="text-gray-500 hover:text-blue-500 cursor-pointer"
                        onClick={() => openEditModal(cat)}
                    />
                    <Trash2
                        size={18}
                        className="text-gray-500 hover:text-red-500 cursor-pointer"
                        onClick={() => handleDelete(cat.id)}
                    />
                    </div>
                </div>
                ))}
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
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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