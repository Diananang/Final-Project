import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Banner from "../component/Banner";
import Navbar from '../component/Navbar'
import DestinationCard from "../component/DestinationsCard";
import PromoSection from "./promos/PromoSection";
import PopularSection from "./homeSections/PopularSection";
import FeaturedSection from "./destinations/FeaturedDestinationsSection";
import TestimonialSection from "./homesections/TestimonialSection";
import Footer from "../component/Footer";

export default function HomePage(){
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async (keyword) => {
        setIsLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/activities`,
                {
                headers: { 
                    apikey: import.meta.env.VITE_API_KEY 
                }}
            );
            console.log(res);

            const filtered = res.data.data.filter (
                (item) => 
                    item.title.toLowerCase().includes(keyword.toLowerCase()) ||
                    item.city.toLowerCase().includes(keyword.toLowerCase()) ||
                    item.province.toLowerCase().includes(keyword.toLowerCase())
            )
            setSearchResults(filtered)
        } catch (error) {
            console.log(error);
            toast.error('No result')
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="relative w-full min-h-screen bg-white">
            <Navbar />
            <Banner onSearch={handleSearch}/>

            <div className="px-6 md:px-12 lg:px-24 space-y-16 mt-28 font-mulish">
                {isLoading && <p>Loading...</p>}
                {!isLoading && searchResults.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">
                            Search Results ({searchResults.length})
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {searchResults.map((dest) => (
                                <DestinationCard key={dest.id} destination={dest} />
                            ))}
                        </div>
                    </div>
                )}

                {searchResults.length === 0 && !isLoading && (
                    <>
                        <PromoSection />
                        <PopularSection />
                        <FeaturedSection />
                        <TestimonialSection />
                    </>
                )}
            </div>

            <Footer />
        </div>
    )
}