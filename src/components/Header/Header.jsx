import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, MapPin, Search, Menu, X, ChefHat, LayoutDashboard, Package } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import './Header.css'

export default function Header() {
  const { user, displayName, avatarUrl, signOut, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const profileRef = useRef(null)

  // Close profile dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false)
     
    setProfileOpen(false)
  }, [location])

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <ChefHat size={32} strokeWidth={2.5} />
          <div className="logo-text">
            <span className="logo-name">Spice</span>
            <span className="logo-accent">Kitchen</span>
          </div>
        </Link>

        {/* Search Bar (desktop) */}
        <form className="header-search" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Nav Links */}
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>
            Menu
          </Link>
          {user && (
            <Link to="/my-orders" className={`nav-link ${location.pathname === '/my-orders' ? 'active' : ''}`}>
              My Orders
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/dashboard" className="nav-link admin-link">
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}

          {/* Mobile-only auth links */}
          <div className="mobile-auth">
            {user ? (
              <>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button onClick={handleSignOut} className="nav-link sign-out-link">
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" className="nav-link login-link-mobile">Sign In</Link>
            )}
          </div>
        </nav>

        {/* Right Section */}
        <div className="header-actions">
          {/* Cart */}
          <Link to="/cart" className="cart-btn" aria-label="View cart">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          {/* Profile / Login */}
          {user ? (
            <div className="profile-dropdown" ref={profileRef}>
              <button
                className="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Profile menu"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="avatar-img" referrerPolicy="no-referrer" />
                ) : (
                  <div className="avatar-placeholder">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {profileOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{displayName}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item">
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/my-orders" className="dropdown-item">
                    <Package size={16} /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="dropdown-item">
                      <LayoutDashboard size={16} /> Admin Panel
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button onClick={handleSignOut} className="dropdown-item sign-out">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="login-btn">
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  )
}
