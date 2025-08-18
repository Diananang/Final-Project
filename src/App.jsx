import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import { Toaster } from 'sonner'
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DetailDestinationPage from "./pages/DetailDestinationPage"
import DetailPromoPage from "./pages/DetailPromoPage"

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
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors expand={true} />
    </>
  )
}

export default App
