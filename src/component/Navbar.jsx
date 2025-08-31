import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

export default function Navbar ({authOnly = false}) {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const location = useLocation();

    const handleSignOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        navigate('/')
        toast.success('Sign Out Succesfully')
    }
    const isHome = location.pathname === "/"

    return (
        <div 
            className={`top-0 w-full z-40 
                ${isHome && !authOnly ? "absolute bg-gradient-to-b from-black/30 to-transparent" : "bg-white shadow" }`}
        >
            <nav className="flex justify-between py-5 px-10 text-white">
                <Link 
                    to="/" 
                    className={`text-[26px] font-bold font-volkhov
                        ${isHome && !authOnly ? "text-white" : "text-blueBlack"}`}
                >
                    Roamly
                </Link>

                {authOnly ? (
                    <div className="flex gap-6 "></div>
                ) : (
                    <div className="flex gap-10 items-center font-mulish">
                        <ul className={`flex gap-[30px] text-[15px] font-semibold
                            ${isHome ? "text-white" : "text-blueBlack"}`}>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About us</Link></li>
                            <li><Link to="/all-destinations">All Destinations</Link></li>
                            <li><Link to="/cart"><ShoppingCart /></Link></li>
                        </ul>

                        {token ? (
                            <button
                                onClick={handleSignOut}
                                className="bg-yellow py-[14px] px-[43px] rounded-[3px] text-blueBlack font-extrabold"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link 
                                to="/signin"
                                className="bg-yellow py-[14px] px-[43px] rounded-[3px] text-blueBlack font-extrabold"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </div>
    )
}