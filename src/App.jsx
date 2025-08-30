import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import { Toaster } from 'sonner'
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DetailDestinationPage from "./pages/DetailDestinationPage"
import DetailPromoPage from "./pages/DetailPromoPage"
import ProtectedRoute from "./component/ProtectToken"
import AdminPage from "./pages/admin/AdminPage"
import AllDestinationsPage from "./pages/AllDestinationsPage"
import AllPromosPage from "./pages/AllPromosPage"
import CartPage from "./pages/CartPage"
import Checkout from "./pages/CheckoutPage"
import UploadPaymentProof from "./pages/PaymentProof"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/signin" element={<LoginPage />}></Route>
          <Route path="/signup" element={<RegisterPage />}></Route>
          <Route path="/detail-destination/:id" element={<DetailDestinationPage />}></Route>
          <Route path="/all-destinations" element={<AllDestinationsPage />}></Route>
          <Route path="/detail-promo/:id" element={<DetailPromoPage />}></Route>
          <Route path="/all-promos" element={<AllPromosPage />}></Route>
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>}></Route>
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>}></Route>
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>}></Route>
          <Route path="/upload-payment-proof" element={<ProtectedRoute><UploadPaymentProof /></ProtectedRoute>}></Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors expand={true} />
    </>
  )
}

export default App
