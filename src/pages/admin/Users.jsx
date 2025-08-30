import { useEffect, useState } from "react"
import axios from 'axios'

export default function Users () {
    const [allUsers, setAllUsers] = useState([])
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const limit = 10
    const [editingRole, setEditingRole] = useState({})

    const getAllUsers = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/all-user`,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            setAllUsers(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleRoleChange = (userId, newRole) => {
        setEditingRole(prev => ({ ...prev, [userId]: newRole }));
    }

    const handleUpdateRole = async (userId) => {
        try {
            const newRole = editingRole[userId];
            if (!newRole) return;
            const payload = {
                id: userId, 
                role: newRole
            }
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/update-profile`,
                payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            toast.success(res.data.message || "Role updated successfully");
            getAllUsers()
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        }
    }
    
    useEffect(() => {
        getAllUsers();
    }, [])

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.ceil(filteredUsers.length / limit)
    const currentUsers = filteredUsers.slice((page - 1) * limit, page * limit)

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">All Users</h1>

            <div className="mb-4">
                <input
                type="text"
                placeholder="Search by name, email, or role"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full max-w-md p-2 border border-gray-400 rounded shadow-sm"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-[700px] sm:min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="text-left p-2 sm:p-3">Photo</th>
                    <th className="text-left p-2 sm:p-3">Name</th>
                    <th className="text-left p-2 sm:p-3">Email</th>
                    <th className="text-left p-2 sm:p-3">Phone</th>
                    <th className="text-left p-2 sm:p-3">Role</th>
                    <th className="text-left p-2 sm:p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-2 sm:p-3">
                        <img 
                            src={user.profilePictureUrl || "/placeholder.jpg"} 
                            alt={user.name} 
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full"
                            onError={(e) => e.target.src = "/placeholder.jpg"}
                        />
                        </td>
                        <td className="p-2 sm:p-3">{user.name}</td>
                        <td className="p-2 sm:p-3">{user.email}</td>
                        <td className="p-2 sm:p-3">{user.phoneNumber}</td>
                        <td className="p-2 sm:p-3">{user.role}</td>
                        <td className="p-2 sm:p-3 flex gap-2 items-center flex-wrap">
                        <select
                            value={editingRole[user.id] || user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="border border-gray-400 rounded p-1 text-sm sm:text-base"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button
                            onClick={() => handleUpdateRole(user.id)}
                            className="px-2 py-1 bg-teal text-white rounded text-sm sm:text-base"
                        >
                            Save
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <div className="flex flex-wrap justify-center mt-4 sm:mt-6 gap-2">
                <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-teal text-white rounded disabled:opacity-50"
                >
                Prev
                </button>
                <span className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 rounded">{page} / {totalPages}</span>
                <button
                disabled={page === totalPages}
                onClick={() => setPage(prev => prev + 1)}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-teal text-white rounded disabled:opacity-50"
                >
                Next
                </button>
            </div>
        </div>
    )
}