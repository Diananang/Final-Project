import { useState } from "react"
import Aside from "../../component/Aside"
import Dashboard from "./Dashboard"
import Users from "./Users"
import Promos from "./Promos"
import Categories from "./Categories"
import Activities from "./Activities"
import TransactionsAdmin from "./Transactions"

export default function () {
    const [activeMenu, setActiveMenu] = useState("dashboard")

    return(
        <div className="flex min-h-screen">
            <Aside activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
            <main className="flex-1 p-6">
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