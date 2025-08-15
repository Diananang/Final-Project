import Navbar from "../component/Navbar";
import image from '../assets/hero.jpg'
import { useState } from "react";
import Footer from "../component/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast} from 'sonner';


export default function RegisterPage(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPassRepeat] = useState('')
    const [role, setRole] = useState('userx')
    const navigate = useNavigate()
    const [selectedImage, setSelectedImage] = useState(null)

    const changeName = ((e) => setName(e.target.value))
    const changeEmail = ((e) => setEmail(e.target.value))
    const changePass = ((e) => setPassword(e.target.value))
    const changeConfirmPass = ((e) => setPassRepeat(e.target.value))
    const changeRole = ((e) => setRole(e.target.value))

    const handleRegister = async () => {
        const payload = {
            name,
            email,
            password,
            passwordRepeat,
            role
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/register`, payload, 
                {
                    headers: {
                        apikey: import.meta.env.VITE_API_KEY
                    }
                }
            )
            console.log(res);
            toast.success("Sign up Successfully!")
            navigate('/signin')
        } catch (error) {
            console.log(error);
        }
    }

    // const handleImageChange = (e) =>{
    //     const file = e.target.files[0];
    //     if (file) {
    //         setSelectedImage(URL.createObjectURL(file));
    //     }
    // }

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
                                className="border mb-6 py-4 px-6 rounded-lg border-yellow"
                            />
                            <input 
                                type="email" 
                                placeholder="Enter Email"
                                value={email}
                                onChange={changeEmail}
                                className="border mb-6 py-4 px-6 rounded-lg border-yellow"
                            />
                        </div>
                        <input 
                            type="password" 
                            placeholder="Enter Password"
                            value={password}
                            onChange={changePass}
                            className="border py-4 mb-6 px-6 rounded-lg border-yellow"
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm Password"
                            value={passwordRepeat}
                            onChange={changeConfirmPass}
                            className="border py-4 mb-6 px-6 rounded-lg border-yellow"
                        />
                        <select 
                            value={role}
                            onChange={changeRole}
                            className="border py-4 mb-6 px-6 rounded-lg border-yellow bg-white"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {/* <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mb-6"
                        />
                        {selectedImage && (
                            <img 
                                src={selectedImage} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded-full border-yellow mb-6"
                            />
                        )} */}
                    </div>
                    <button 
                        type="submit"
                        onClick={handleRegister}
                        className="bg-yellow py-2 px-[82px] text-center text-blueBlack font-semibold rounded-lg"
                        >
                            CREATE ACCOUNT
                    </button>
                    <p>Already have an account? Sign In</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}