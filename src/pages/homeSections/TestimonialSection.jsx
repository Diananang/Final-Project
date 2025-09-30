import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react";

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

export default function TestimonialSection(){
    const scrollRef = useRef(null);
    const [direction, setDirection] = useState("right")

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: dir == 'left' ? -300 : 300,
                behavior: 'smooth',
            });
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if(scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth} = scrollRef.current

                if (scrollLeft + clientWidth >= scrollWidth - 5) {
                    setDirection("left")
                } else if(scrollLeft <= 0) {
                    setDirection("right")
                }
            }

            scroll(direction);
        }, 3000)

        return () => clearInterval(interval)
    },[direction])

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                <h2 className="text-2xl sm:text-4xl font-bold font-volkhov text-blueBlack">
                    What Our Customers Say
                </h2>
                <p className="text-sm sm:text-base font-semibold text-[#778088]">
                    Hear what travelers are saying about their journeys with us.
                </p>
                </div>

                <div className="flex gap-3 text-blueBlack">
                <button
                    onClick={() => scroll("left")}
                    className="bg-white border border-yellow rounded-full p-2 hover:bg-yellow shadow-lg shadow-yellow/50"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={() => scroll("right")}
                    className="bg-white border border-yellow rounded-full p-2 hover:bg-yellow shadow-lg shadow-yellow/50"
                >
                    <ChevronRight />
                </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
            >
                {testimonials.map((t) => (
                <div
                    key={t.id}
                    className="bg-white p-6 rounded-lg shadow w-[280px] flex-shrink-0"
                >
                    <p className="italic">{t.message}</p>
                    <p className="mt-2 font-bold">{t.name}</p>
                </div>
                ))}
            </div>
        </section>
    )
}