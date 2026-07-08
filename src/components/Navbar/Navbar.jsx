import { Link } from 'react-router-dom'
import { ChefHat, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { displayName, avatarUrl } = useAuth()

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className="back-to-site" title="Back to website">
          <ArrowLeft size={18} />
        </Link>
        <div className="navbar-logo">
          <ChefHat size={24} />
          <span className="logo-text">Spice</span>
          <span className="logo-accent">Kitchen</span>
          <span className="admin-badge">Admin</span>
        </div>
      </div>
      <Link to="/profile" className="navbar-profile" title="Edit Profile">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="admin-avatar" referrerPolicy="no-referrer" />
        ) : (
          <div className="profile-circle">{displayName.charAt(0).toUpperCase()}</div>
        )}
        <span className="profile-name">{displayName}</span>
      </Link>
    </div>
  )
}

export default Navbar
