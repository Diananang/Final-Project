import Navbar from "../component/Navbar";
import image from '../assets/hero.jpg'
import Footer from "../component/Footer";
import { useState } from "react";
import axios from'axios'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast} from 'sonner';


export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isError, setIsError] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const changeEmail = ((e) => setEmail(e.target.value))
    const changePass = ((e) => setPassword(e.target.value))

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setIsError(true)
            toast.error("Please fill all fields")
            return
        }

        setIsError(false)

        const payload = {
            email,
            password,
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/login`, payload,
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY
                    }
                }
            )
            console.log(res);
            toast.success("Sign in Succesfully")

            const token = await res.data.token
            const role = res.data.data.role

            localStorage.setItem("token", token)
            localStorage.setItem("role", role)
            
            if (role === "admin") {
                navigate("/admin", { replace: true })
            } else {
                navigate("/", { replace: true })
            }
        } catch (error) {
            console.log(error.response?.data.message);
            toast.error("Sign in failed: " + error.response?.data.message)
        }
    }

    return(
        <div>
            <Navbar authOnly = {true}/>
            <div className="flex w-fit h-full mx-auto justify-center items-center font-mulish shadow-lg rounded-lg">
                <img 
                    src={image} 
                    alt="Login Image" 
                    className="w-[576px] h-[662px] object-cover object-center rounded-l-lg"
                />
                <div className="flex flex-col w-[544px] h-[dd2px] justify-center items-center">
                    <h2 className="font-volkhov text-[64px] font-bold text-yellow">Welcome</h2>
                    <p className="text-base font-semibold text-[#6E7074] mb-8">Sign in with Email</p>
                    <div className="flex flex-col w-[400px]">
                        <input 
                            type="email" 
                            placeholder="Enter Email or Username"
                            className={`border mb-6 py-4 px-6 rounded-lg ${isError && !email.trim() ? "border-red-500" : "border-yellow"}`}
                            value={email}
                            onChange={changeEmail}
                        />
                        <input 
                            type="password" 
                            placeholder="Enter Password"
                            className={`border mb-6 py-4 px-6 rounded-lg ${isError && !password.trim() ? "border-red-500" : "border-yellow"}`}
                            value={password}
                            onChange={changePass}
                        />
                        <p className="text-[12px] text-yellow font-medium text-end mb-8">Forgot your password?</p>
                    </div>
                    <button 
                        type="submit"
                        className="bg-yellow py-2 px-[82px] text-center text-blueBlack font-semibold rounded-lg"
                        onClick={handleLogin}
                        >
                            SIGN IN
                    </button>
                    <p>Don't have account? <Link to='/signup' className="text-teal hover:text-teal/80">Sign Up</Link></p>
                </div>
            </div>
            <Footer />
        </div>
    )
}