export default function NewsletterSection(){
    return (
        <section className="bg-blue-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4">Get the latest deals & tips</h2>
            <div className="flex justify-center gap-2">
                <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="p-2 border rounded-lg w-64"
                />
                <button className="bg-yellow px-4 py-2 rounded-lg font-bold">
                    Subscribe
                </button>
            </div>
        </section>
    )
}