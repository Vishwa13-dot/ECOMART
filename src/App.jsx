import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Loader from './components/Loader'
import Toasts from './components/Toasts'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Contact from './pages/Contact'
import SellerRegistration from './pages/SellerRegistration'
import NotFound from './pages/NotFound'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminSellers from './pages/admin/AdminSellers'
import AdminCategories from './pages/admin/AdminCategories'
import AdminReviews from './pages/admin/AdminReviews'
import AdminImages from './pages/admin/AdminImages'

export default function App() {
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('ecomart.seen'))
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => { sessionStorage.setItem('ecomart.seen', '1'); setLoading(false) }, 900)
    return () => clearTimeout(t)
  }, [loading])
  if (loading) return <Loader full />
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sell" element={<SellerRegistration />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="images" element={<AdminImages />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
      <Toasts />
    </>
  )
}
