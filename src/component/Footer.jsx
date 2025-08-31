import { Link } from "react-router-dom";

export default function Footer(){
    return (
        <footer className="p-6 md:px-12 lg:px-24 space-y-20 mt-8 bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
                <div>
                    <h3 className="font-bold text-lg mb-2">Roamly</h3>
                    <p>Explore the world with ease.</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">Discover</h3>
                    <div className="flex flex-col gap-2">
                        <Link to="/">Home</Link>
                        <Link to='/about'>About</Link>
                        <Link to="/all-destination">All Destinations</Link>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">Quick Links</h3>
                    <div className="flex flex-col gap-2">
                        <Link to="/signin">Sign in</Link>
                        <Link to="/signup">Sign up</Link>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg mb-2">Contact</h3>
                    <p>Email: support@roamly.com</p>
                    <p>Phone: +62 812-3456-7890</p>
                </div>
            </div>
            <p className="text-center mt-6 text-sm">&copy; 2025 Roamly. All rights reserved.</p>
        </footer>
    )
}