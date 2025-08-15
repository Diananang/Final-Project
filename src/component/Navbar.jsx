import { Link } from "react-router-dom"

export default function Navbar ({authOnly = false}) {
    return (
        <div className={`top-0 w-full z-40 ${authOnly ? "bg-white" : "absolute bg-gradient-to-b from-black/30 to-transparent"}`}>
            <nav className="flex justify-between py-5 px-10 text-white">
                <Link to="/" className={`text-[26px] font-bold ${authOnly ? "text-blueBlack" : "text-white"}`}>Roamly</Link>
                {authOnly ? (
                    <div className="flex gap-6 ">
                        <Link 
                            to="/signin"
                            className="bg-yellow py-[14px] px-[43px] rounded-[3px] text-blueBlack font-extrabold"
                        >
                            Sign In
                        </Link>
                        <Link 
                            to="/signup"
                            className="bg-blueBlack py-[14px] px-[43px] rounded-[3px] text-white font-extrabold"
                        >
                            Sign Up
                        </Link>
                    </div>

                ) : (
                    <div className="flex gap-10 items-center font-mulish">
                        <ul className="flex gap-[30px] text-[15px] font-semibold">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About us</Link></li>
                            <li><Link to="/popular-destinations">Popular Destinations</Link></li>
                        </ul>
                        <Link 
                            to="/signin"
                            className="bg-yellow py-[14px] px-[43px] rounded-[3px] text-blueBlack font-extrabold"
                        >
                            Sign In
                        </Link>
                    </div>
                )}
            </nav>
        </div>
    )
}