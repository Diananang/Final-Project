import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import { Toaster } from 'sonner'
import LoginPage from "./pages/authentication/LoginPage"
import RegisterPage from "./pages/authentication/RegisterPage"
import DetailDestinationPage from "./pages/destinations/DetailDestinationPage"
import AllDestinationsPage from "./pages/destinations/AllDestinationsPage"
import DetailPromoPage from "./pages/promos/DetailPromoPage"
import AllPromosPage from "./pages/promos/AllPromosPage"
import AdminPage from "./pages/admin/AdminPage"
import CartPage from "./pages/transactions/CartPage"
import Checkout from "./pages/transactions/CheckoutPage"
import UploadPaymentProof from "./pages/transactions/PaymentProof"
import ProtectedRoute from "./component/ProtectToken"
import MyTransactions from "./pages/transactions/MyTransactions"
import AdminRoute from "./component/AdminRoute"

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
          
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}></Route>
          
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>}></Route>
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>}></Route>
          <Route path="/my-transactions" element={<ProtectedRoute><MyTransactions /></ProtectedRoute>}></Route>
          <Route path="/upload-payment-proof" element={<ProtectedRoute><UploadPaymentProof /></ProtectedRoute>}></Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors expand={true} />
    </>
  )
}

export default App
