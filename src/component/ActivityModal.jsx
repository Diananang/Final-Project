export default function ActivityModal({
    isOpen,
    onClose,
    onSubmit,
    form,
    onChange,
    loading,
}){
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                {form.editingId ? "Edit Activity" : "Add Activity"}
                </h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={form.title}
                        onChange={onChange}
                        placeholder="Activity name"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        placeholder="Description"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                        type="text"
                        name="categoryId"
                        value={form.categoryId}
                        onChange={onChange}
                        placeholder="ID kategori"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input 
                        type="text"
                        name="location_maps"
                        value={form.location_maps}
                        onChange={onChange}
                        placeholder="Location link (Google Maps)"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                        type="file"
                        name="image"
                        onChange={onChange}
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
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-teal text-white rounded hover:bg-teal/80 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    )
}