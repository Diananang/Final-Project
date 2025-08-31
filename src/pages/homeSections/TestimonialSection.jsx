import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialSection(){
    const testimonials = [
        {
            id: 1,
            message: "Best travel booking experience ever! Super easy and fast.",
            name: "Jane Doe"
        },
        {
            id: 2,
            message: "The destinations were amazing, everything was well organized.",
            name: "John Smith"
        },
        {
            id: 3,
            message: "Customer service was really helpful, I’ll book again soon!",
            name: "Emily Johnson"
        },
        {
            id: 4,
            message: "Affordable prices and unforgettable trips. Highly recommend!",
            name: "Michael Brown"
        },
        {
            id: 5,
            message: "The app is so smooth to use, my holiday planning is stress-free now.",
            name: "Sophia Lee"
        },
    ]

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction == 'left' ? -300 : 300,
                behavior: 'smooth',
            });
        }
    }

    return (
        <section className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl font-bold font-volkhov text-blueBlack">What Our Customers Say</h2>
                    <p className="text-base font-semibold text-[#778088]">Hear what travelers are saying about their journeys with us.</p>
                </div>

                <div className="flex gap-4 w-fit h-fit text-blueBlack">
                    <button
                        onClick={() => scroll('left')}
                        className="bg-white border border-yellow rounded-full p-2 hover:bg-yellow shadow-lg shadow-yellow/50"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="bg-white border border-yellow rounded-full p-2 hover:bg-yellow shadow-lg shadow-yellow/50"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex flex-col sm:flex-row gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
                >
                    {testimonials.map((t) => (
                        <div
                            key={t.id} 
                            className="bg-white p-6 rounded-lg shadow min-w-[300px] max-w-[300px] flex-shrink-0">
                            <p className="italic">{t.message}</p>
                            <p className="mt-2 font-bold">{t.name}</p>
                        </div>

                    ))}
            </div>
        </section>
    )
}