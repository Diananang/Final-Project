import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Aside ({menus, activeMenu, onMenuClick }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <div className="sm:hidden p-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-blueBlack focus:outline-none"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <aside
                className={`bg-white shadow-md w-64 p-4 text-blueBlack fixed sm:static top-0 left-0 h-full transform sm:transform-none transition-transform duration-300 z-50
                    ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
            >
                <h2 className="text-3xl font-bold">Roamly</h2>
                <nav className="space-y-4 mt-6">
                {menus.map((menu) => (
                    <button
                        key={menu.id}
                        onClick={() => {
                            onMenuClick(menu.id);
                            setIsOpen(false);
                        }}
                        className={`block w-full text-left p-2 rounded-lg transition-colors
                            ${
                            activeMenu === menu.id
                                ? "bg-teal text-white"
                                : "text-blueBlack hover:bg-teal hover:text-white"
                            }`
                        }
                    >
                        {menu.label}
                    </button>
                ))}
                </nav>
            </aside>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 sm:hidden"
                />
            )}
        </div>
    )
}