import { useState } from "react"

export default function () {
    const [activeMenu, setActiveMenu] = useState("dashboard")
    const menus = [
    { id: "dashboard", label: "Dashboard" },
    { id: "users", label: "Users" },
    { id: "promos", label: "Promos" },
    { id: "categories", label: "Categories" },
    { id: "activity", label: "Activity" },
    { id: "transactions", label: "Transactions" },
    { id: "logout", label: "Logout" },
    ]

    return(
        <div className="flex min-h-screen">
            <aside className="bg-white shadow-md w-64 p-4 text-blueBlack">
                <h2 className="text-3xl font-bold">Roamly</h2>
                <nav className="space-y-4 mt-6">
                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            onClick={() => setActiveMenu(menu.id)}
                            className={`block w-full text-left p-2 rounded-lg transition-colors
                            ${
                                activeMenu === menu.id
                                    ? "bg-teal text-white"
                                    : "text-blueBlack hover:bg-teal hover:text-white"
                            }`}
                        >
                        {menu.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="flex-1 p-6">
                <header className="mb-6">
                    {menus.find((m) => m.id === activeMenu)?.label} Overview
                </header>

                {activeMenu === "dashboard" && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-medium">Total Orders</h3>
                    <p className="text-2xl font-bold text-blue-600">128</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-medium">Active Users</h3>
                    <p className="text-2xl font-bold text-green-600">42</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-medium">Revenue</h3>
                    <p className="text-2xl font-bold text-purple-600">Rp 12.500.000</p>
                    </div>
                </section>
                )}

                {activeMenu === "users" && (
                <section className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Users</h2>
                    <div className="text-gray-500">[Daftar user di sini]</div>
                </section>
                )}
            </main>
        </div>
    )
}