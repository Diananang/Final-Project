import Navbar from "../../component/Navbar";
import image from '../../assets/hero.jpg'
import Footer from "../../component/Footer";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast} from 'sonner';
import { loginApi } from "../../api/auth";
import { Eye, EyeClosed } from "lucide-react";


export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isError, setIsError] = useState(false)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    const location = useLocation()
    const from = location.state?.from || "/"

    const changeEmail = ((e) => setEmail(e.target.value))
    const changePass = ((e) => setPassword(e.target.value))

    const handleLogin = async () => {
        setIsLoading(true)

        if (!email.trim() || !password.trim()) {
            setIsError(true)
            toast.error("Please fill all fields")
            return
        }

        setIsError(false)

        try {
            const data = await loginApi(email, password)
            
            toast.success("Sign in Succesfully")

            const token = data.token
            const role = data.data.role

            localStorage.setItem("token", token)
            localStorage.setItem("role", role)
            
            if (role === "admin") {
                navigate("/admin", { replace: true })
            } else {
                navigate(from, { replace: true })
            }
        } catch (error) {
            console.log(error.response?.data.message);
            toast.error("Sign in failed: " + error.response?.data.message)
        } finally{
            setIsLoading(false)
        }
    }

    return(
        <div>
            <Navbar authOnly = {true}/>
            <div className="flex flex-col sm:flex-row w-dvw sm:w-fit h-full mx-auto justify-center items-center font-mulish shadow-lg rounded-lg">
                <img 
                    src={image} 
                    alt="Login Image" 
                    className="w-full h-[300px] sm:w-[576px] sm:h-[662px] object-cover object-center rounded-t-lg sm:rounded-l-lg"
                />
                <div className="flex flex-col w-[544px] h-[662px] justify-center items-center">
                    <h2 className="font-volkhov text-2xl sm:text-[64px] font-bold text-yellow">Welcome</h2>
                    <p className="text-sm sm:text-base font-semibold text-[#6E7074] mb-8">Sign in with Email</p>
                    <div className="flex flex-col w-[300px] sm:w-[400px]">
                        <label className="sr-only" htmlFor="email">Email</label>
                        <input 
                            id="email"
                            type="email" 
                            placeholder="Enter Email or Username"
                            className={`border mb-6 py-4 px-6 rounded-lg ${isError && !email.trim() ? "border-red-500" : "border-yellow"}`}
                            value={email}
                            onChange={changeEmail}
                        />
                        {isError && !email.trim() && (
                            <span className="text-red-500 text-xs mb-4">Email is required</span>
                        )}

                        <label className="sr-only" htmlFor="password">Password</label>
                        <div className="relative mb-2">
                            <input 
                                id="password"
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter Password"
                                className={`border w-full py-4 px-6 rounded-lg ${isError && !password.trim() ? "border-red-500" : "border-yellow"}`}
                                value={password}
                                onChange={changePass}
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeClosed size={24} /> : <Eye size={24}/>}
                            </button>
                        </div>
                        {isError && !password.trim() && (
                            <span className="text-red-500 text-xs mb-4">Password is required</span>
                        )}
                        <p className="text-[12px] text-yellow font-medium text-end mb-8">Forgot your password?</p>
                    </div>
                    <button 
                        disabled= {isLoading}
                        type="submit"
                        className="bg-yellow py-2 px-[82px] text-center text-blueBlack font-semibold rounded-lg"
                        onClick={handleLogin}
                        >
                            {isLoading ? "Loading" : "SIGN IN"}
                    </button>

                    <p>Don't have account? {" "}
                        <Link to='/signup' className="text-teal hover:text-teal/80">Sign Up</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}