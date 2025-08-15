export default function SearchBar(){
    return (
        <div className="w-[1000px] max-w-full h-[90px] flex justify-between items-center rounded-[10px] shadow p-5 font-mulish bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col ">
                <p className="text-[15px] font-extrabold text-teal">Location</p>
                <p className="text-sm text-gray-500 italic">Search For A Destination</p>
            </div>
            <div className="flex flex-col border-l pl-4 border-gray-300">
                <p className="text-[15px] font-extrabold text-teal">Guests</p>
                <p className="text-sm text-gray-500 italic">How Many Guests?</p>
            </div>
            <div className="flex flex-col border-l pl-4 border-gray-300">
                <p className="text-[15px] font-extrabold text-teal">Date</p>
                <p className="text-sm text-gray-500 italic">Pick A Date</p>
            </div>
            <button className="bg-yellow rounded-[40px] font-extrabold text-blueBlack text-base py-4 px-12 shadow-lg shadow-yellow/50">
                Search
            </button>
        </div>
    )
}