import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { SettingsProvider } from './contexts/SettingsContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'

// Customer Pages
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import OnlinePayment from './pages/Checkout/OnlinePayment'
import MyOrders from './pages/MyOrders/MyOrders'
import Profile from './pages/Profile/Profile'
import Auth from './pages/Auth/Auth'

// Static/Legal Pages
import About from './pages/Static/About'
import Contact from './pages/Static/Contact'
import Privacy from './pages/Static/Privacy'
import Terms from './pages/Static/Terms'
import Reviews from './pages/Static/Reviews'

// Admin Pages
import Dashboard from './pages/Dashboard/Dashboard'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Categories from './pages/Categories/Categories'
import Orders from './pages/Orders/Orders'
import Settings from './pages/Settings/Settings'
import Offers from './pages/Offers/Offers'

import './App.css'

// Layout for customer pages (Header + Footer)
function CustomerLayout() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// Layout for admin pages (Navbar + Sidebar)
function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <ProtectedRoute adminOnly>
      <div className="admin-layout">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <hr className="admin-hr" />
        <div className="admin-content">
          {isSidebarOpen && (
            <div 
              className="sidebar-overlay"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <Sidebar isOpen={isSidebarOpen} />
          <div className="admin-page">
            <Outlet />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function RootRoute() {
  const { isAdmin, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Home />
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <SettingsProvider>
            <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(26, 26, 35, 0.95)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                fontSize: '14px',
                fontFamily: 'Outfit, sans-serif',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />

          <Routes>
            {/* Customer Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<RootRoute />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/online-payment" element={
                <ProtectedRoute>
                  <OnlinePayment />
                </ProtectedRoute>
              } />
              <Route path="/my-orders" element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/reviews" element={<Reviews />} />
            </Route>

            {/* Auth Routes (no header/footer) */}
            <Route path="/auth" element={<Auth />} />

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/add" element={<Add />} />
              <Route path="/admin/edit/:id" element={<Add />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/list" element={<List />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/offers" element={<Offers />} />
            </Route>
          </Routes>
          </SettingsProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
