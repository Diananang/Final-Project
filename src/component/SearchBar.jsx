import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function SearchBar(){
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("")
    const navigate = useNavigate()

    const getCategories = async (categoryId) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/categories`,
                {
                    headers: { apikey: import.meta.env.VITE_API_KEY }
                }
            )
            setCategories(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCategories();
    },[])

    // const handleSearch = () => {
    //     if (!selectedCategory) return
    //     navigate(`/activities/${selectedCategory}`)
    // }

    return (
        <div className="w-[1000px] max-w-full h-[90px] flex justify-between items-center rounded-[10px] shadow p-5 font-mulish bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col">
                <p className="text-[15px] font-extrabold text-teal">Location</p>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-sm text-gray-700 mt-1 rounded-md px-3 py-1"
                >
                    <option value="">Pilih Kota</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <button 
                // onClick={handleSearch}
                className="bg-yellow rounded-[40px] font-extrabold text-blueBlack text-base py-4 px-12 shadow-lg shadow-yellow/50"
            >
                Search
            </button>
        </div>
    )
}