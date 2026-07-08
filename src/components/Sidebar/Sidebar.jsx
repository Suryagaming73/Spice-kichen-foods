import { NavLink } from 'react-router-dom'
import { PlusCircle, List, Package, LayoutDashboard, Settings, LogOut, LayoutGrid } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/admin/dashboard" className="sidebar-option">
          <div className="option-icon"><LayoutDashboard size={20} /></div>
          <p>Dashboard</p>
        </NavLink>

        <NavLink to="/admin/add" className="sidebar-option">
          <div className="option-icon"><PlusCircle size={20} /></div>
          <p>Add Items</p>
        </NavLink>

        <NavLink to="/admin/categories" className="sidebar-option">
          <div className="option-icon"><LayoutGrid size={20} /></div>
          <p>Categories</p>
        </NavLink>

        <NavLink to="/admin/list" className="sidebar-option">
          <div className="option-icon"><List size={20} /></div>
          <p>List Items</p>
        </NavLink>

        <NavLink to="/admin/orders" className="sidebar-option">
          <div className="option-icon"><Package size={20} /></div>
          <p>Orders</p>
        </NavLink>

        <NavLink to="/admin/settings" className="sidebar-option">
          <div className="option-icon"><Settings size={20} /></div>
          <p>Settings</p>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleSignOut}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
