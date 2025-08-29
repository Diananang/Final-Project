import { useState } from "react"

export default function SearchBar({onSearch}){
    const [keyword, setKeyword] = useState("")

    const handleSearch = () => {
        if (!keyword.trim()) return;
        onSearch(keyword)
    }

    return (
        <div className="w-[1000px] max-w-full h-[90px] flex justify-between items-center rounded-[10px] shadow p-5 font-mulish bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col flex-1">
                <input 
                    type="text" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search anything..."
                    className="text-sm text-gray-700 mt-1 rounded-md px-3 py-2 border border-gray-300"
                />
            </div>
            <button 
                onClick={handleSearch}
                className="ml-4 bg-yellow rounded-[40px] font-extrabold text-blueBlack text-base py-4 px-12 shadow-lg shadow-yellow/50"
            >
                Search
            </button>
        </div>
    )
}