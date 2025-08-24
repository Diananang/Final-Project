import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import { Toaster } from 'sonner'
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DetailDestinationPage from "./pages/DetailDestinationPage"
import DetailPromoPage from "./pages/DetailPromoPage"
import Checkout from "./pages/Checkout"
import ProtectedRoute from "./component/ProtectToken"
import AdminPage from "./pages/admin/AdminPage"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/signin" element={<LoginPage />}></Route>
          <Route path="/signup" element={<RegisterPage />}></Route>
          <Route path="/detail-destination/:id" element={<DetailDestinationPage />}></Route>
          <Route path="/detail-promo/:id" element={<DetailPromoPage />}></Route>
          <Route path="/admin" element={<AdminPage />}></Route>
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>}></Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors expand={true} />
    </>
  )
}

export default App
