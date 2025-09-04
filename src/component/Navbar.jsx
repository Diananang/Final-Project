import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar ({authOnly = false}) {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false)

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
                ${isHome && !authOnly
                ? "absolute bg-gradient-to-b from-black/30 to-transparent"
                : "bg-white shadow"
                }`}
            >
            <nav className="flex justify-between items-center py-5 px-6 sm:px-10">
                <Link
                    to="/"
                    className={`text-[26px] font-bold font-volkhov
                        ${isHome && !authOnly ? "text-white" : "text-blueBlack"}`}
                >
                    Roamly
                </Link>

                {!authOnly && (
                <div className="hidden sm:flex gap-10 items-center font-mulish">
                    <ul
                        className={`flex gap-[30px] text-[15px] font-semibold
                            ${isHome ? "text-white" : "text-blueBlack"}`}
                        >
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About us</Link></li>
                        <li><Link to="/all-destinations">All Destinations</Link></li>
                        <li>
                            {token ? (
                                <Link to="/cart"><ShoppingCart /></Link>

                            ) : (
                                <Link to="/signin" state={{from: "/cart"}}><ShoppingCart /></Link>
                            )}
                        </li>
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

                {!authOnly && (
                <button
                    className={`sm:hidden ${isHome ? "text-white" : "text-blueBlack"}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
                )}
            </nav>

            {!authOnly && isOpen && (
            <div
                className={`sm:hidden px-6 pb-4 font-mulish 
                    ${isHome ? "bg-black/70 text-white" : "bg-white text-blueBlack shadow"}`
                }
                >
                <ul className="flex flex-col gap-4 text-[15px] font-semibold">
                    <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                    <li><Link to="/about" onClick={() => setIsOpen(false)}>About us</Link></li>
                    <li><Link to="/all-destinations" onClick={() => setIsOpen(false)}>All Destinations</Link></li>
                    <li><Link to="/cart" onClick={() => setIsOpen(false)}><ShoppingCart /></Link></li>
                </ul>

                <div className="mt-4">
                    {token ? (
                    <button
                        onClick={() => { handleSignOut(); setIsOpen(false); }}
                        className="w-full bg-yellow py-3 rounded-[3px] text-blueBlack font-extrabold"
                    >
                        Sign Out
                    </button>
                    ) : (
                    <Link
                        to="/signin"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center bg-yellow py-3 rounded-[3px] text-blueBlack font-extrabold"
                    >
                        Sign In
                    </Link>
                    )}
                </div>
            </div>
            )}
        </div>
    )
}