export default function TestimonialSection(){
    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <h2 className="text-4xl font-bold font-volkhov text-blueBlack">What Our Customers Say</h2>
                <p className="text-base font-semibold text-[#778088]">Hear what travelers are saying about their journeys with us</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-100 p-6 rounded-lg shadow">
                    <p>"Best travel bookiing experience!"</p>
                    <p className="mt-2 font-bold">Jane Doe</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow">
                    <p>"Best travel bookiing experience!"</p>
                    <p className="mt-2 font-bold">Jane Doe</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow">
                    <p>"Best travel bookiing experience!"</p>
                    <p className="mt-2 font-bold">Jane Doe</p>
                </div>
            </div>
        </section>
    )
}