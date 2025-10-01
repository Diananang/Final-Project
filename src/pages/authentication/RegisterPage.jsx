import Navbar from "../../component/Navbar";
import image from '../../assets/hero.jpg'
import { useState } from "react";
import Footer from "../../component/Footer";
import { Link, useNavigate } from "react-router-dom";
import { toast} from 'sonner';
import { registerApi } from "../../api/auth";


export default function RegisterPage(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPassRepeat] = useState('')
    const [role, setRole] = useState('userx')
    const navigate = useNavigate()

    const changeName = ((e) => setName(e.target.value))
    const changeEmail = ((e) => setEmail(e.target.value))
    const changePass = ((e) => setPassword(e.target.value))
    const changeConfirmPass = ((e) => setPassRepeat(e.target.value))
    const changeRole = ((e) => setRole(e.target.value))
    const [isError, setIsError] = useState(false)

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim() || !passwordRepeat.trim()) {
            setIsError(true)
            toast.error("Please fill all fields")
            return
        }

        if (password !== passwordRepeat) {
            setIsError(true)
            toast.error("Passwords do not match")
            return
        }

        setIsError(false)

        try {
            const res = await registerApi(name, email, password, passwordRepeat, role)

            toast.success("Sign up Successfully!")
            navigate('/signin')
        } catch (error) {
            console.log(error);
            toast.error("Sign up failed: " + (error.response?.data?.message || "Something went wrong"))
        }
    }

    return(
        <div>
            <Navbar authOnly = {true}/>
            <div className="flex flex-row-reverse w-fit h-full mx-auto justify-center items-center font-mulish gap-8 rounded-lg">
                <img 
                    src={image} 
                    alt="Login Image" 
                    className="w-[576px] h-[662px] object-cover object-center rounded-r-lg"
                />
                <div className="flex flex-col w-[544px] h-[662px] justify-center items-center ml-6">
                    <h2 className="font-volkhov text-[32px] font-semibold text-yellow">CREATE AN ACCOUNT</h2>
                    <p className="text-base font-medium text-[#6E7074] mb-8">By creating an account you agree to our Privacy policy and Terms of use.</p>
                    <div className="flex flex-col min-w-[400px]">
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                placeholder="Enter Username"
                                value={name}
                                onChange={changeName}
                                className={`border mb-6 py-4 px-6 rounded-lg ${isError && !name.trim() ? "border-red-500" : "border-yellow"}`}
                            />
                            <input 
                                type="email" 
                                placeholder="Enter Email"
                                value={email}
                                onChange={changeEmail}
                                className={`border mb-6 py-4 px-6 rounded-lg ${isError && !email.trim() ? "border-red-500" : "border-yellow"}`}
                            />
                        </div>
                        <input 
                            type="password" 
                            placeholder="Enter Password"
                            value={password}
                            onChange={changePass}
                            className={`border py-4 mb-6 px-6 rounded-lg ${isError && !password.trim() ? "border-red-500" : "border-yellow"}`}
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm Password"
                            value={passwordRepeat}
                            onChange={changeConfirmPass}
                            className={`border py-4 mb-6 px-6 rounded-lg ${isError && (!passwordRepeat.trim() || password !== passwordRepeat) ? "border-red-500" : "border-yellow"}`}
                        />
                        <select 
                            value={role}
                            onChange={changeRole}
                            className="border py-4 mb-6 px-6 rounded-lg border-yellow bg-white"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button 
                        type="submit"
                        onClick={handleRegister}
                        className="bg-yellow py-2 px-[82px] text-center text-blueBlack font-semibold rounded-lg"
                        >
                            CREATE ACCOUNT
                    </button>
                    <p>Already have an account? <Link to='/signin' className="text-teal hover:text-teal/80">Sign In</Link></p>
                </div>
            </div>
            <Footer />
        </div>
    )
}