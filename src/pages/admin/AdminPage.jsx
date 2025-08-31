import { useState } from "react"
import Aside from "./Aside"
import Dashboard from "./Dashboard"
import Users from "./Users"
import Promos from "./Promos"
import Categories from "./Categories"
import Activities from "./Activities"
import TransactionsAdmin from "./Transactions"
import { useNavigate } from "react-router-dom"

export default function () {
    const [activeMenu, setActiveMenu] = useState("dashboard")
    const navigate = useNavigate()

    const menus = [
        { id: "dashboard", label: "Dashboard" },
        { id: "users", label: "Users" },
        { id: "promos", label: "Promos" },
        { id: "categories", label: "Categories" },
        { id: "activity", label: "Activity" },
        { id: "transactions", label: "Transactions" },
        { id: "logout", label: "Logout" },
    ]

    const handleClick = (id) => {
        if (id === "logout") {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/");
        } else{
            setActiveMenu(id);
        }
    };

    return(
        <div className="flex min-h-screen">
            <Aside 
                menus={menus}
                activeMenu={activeMenu} 
                onMenuClick={handleClick}
            />
            <main className="flex-1 p-6 bg-gray-100">
                {activeMenu === "dashboard" && (<Dashboard />)}
                {activeMenu === "users" && (<Users />)}
                {activeMenu === "promos" && (<Promos />)}
                {activeMenu === "categories" && (<Categories />)}
                {activeMenu === "activity" && (<Activities />)}
                {activeMenu === "transactions" && (<TransactionsAdmin />)}
            </main>
        </div>
    )
}