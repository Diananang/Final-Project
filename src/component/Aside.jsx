export default function Aside ({activeMenu, setActiveMenu}) {
    
    const menus = [
    { id: "dashboard", label: "Dashboard" },
    { id: "users", label: "Users" },
    { id: "promos", label: "Promos" },
    { id: "categories", label: "Categories" },
    { id: "activity", label: "Activity" },
    { id: "transactions", label: "Transactions" },
    { id: "logout", label: "Logout" },
    ]

    return (
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
    )
}