import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute({children}) {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to= '/signin' />
    }
    
    if (!token || role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}