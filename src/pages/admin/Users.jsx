import { useEffect, useState } from "react"
import axios from 'axios'
import { useParams } from "react-router-dom"

export default function Users () {
    const [allUsers, setAllUsers] = useState([])
    // const [role, setRole] = useState([])

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

    const handleUpdateRole = async (id, newRole) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/update-profile`,
                // {role: newRole},
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            console.log(res);
            getAllUsers()
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getAllUsers();
    }, [])

    return (
        <div className="flex flex-col gap-6">
            {allUsers.map((user) => (
                <div key={user?.id} className="flex gap-4">
                    <img src={user.profilePictureUrl} alt={user.name} className="w-40 object-cover"/>
                    <div>
                        <p>Email: {user.email}</p>
                        <p>Name: {user.name}</p>
                        <p>Phone Number: {user.phoneNumber}</p>
                        <p>Role: {user.role}</p>
                    </div>
                    <div className="flex gap-2">
                        {/* <button
                        className="size-fit px-4 py-2 bg-green-500 text-white rounded"
                        onClick={handleUpdateRole}
                        >
                        Edit
                        </button> */}
                        {/* <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => handleUpdateRole(user.id, "user")}
                        >
                        Delete
                        </button> */}
                    </div>
                </div>
            ))}
        </div>
    )
}