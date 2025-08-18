import Navbar from "../component/Navbar";
import Banner from "../component/Banner";
import PromoSection from "../section/PromoSection";
import TestimonialSection from "../section/TestimonialSection";
import NewsletterSection from "../section/NewsletterSection";
import Footer from "../component/Footer";
import PopularSection from "../section/PopularSection";
import FeaturedSection from "../section/FeaturedDestinationsSection";

export default function HomePage(){
    return (
        <div className="relative w-full min-h-screen bg-white">
            <Navbar />
            <Banner />

            <div className="px-6 md:px-12 lg:px-24 space-y-16 mt-28 font-mulish">
                <PromoSection />
                <PopularSection />
                <FeaturedSection />
                <TestimonialSection />
                <NewsletterSection />
            </div>

            <Footer />
        </div>
    )
}