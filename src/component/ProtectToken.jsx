import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute({children}) {
    const token = localStorage.getItem('token')

    if (!token) {
        return <Navigate to= '/signin' />
    }
    
    return(
        <>
        {children || <Outlet />}
        </>
    )
}