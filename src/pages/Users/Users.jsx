import { useState, useEffect } from 'react'
import { Users as UsersIcon, Mail, Phone, Calendar } from 'lucide-react'
import api from '../../lib/api'
import './Users.css'

export default function Users() {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        api.get('users/'),
        api.get('orders/')
      ])
      
      setUsers(usersRes.data || [])
      setOrders(ordersRes.data || [])
    } catch (error) {
      console.error('Error fetching users/orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats for each user based on orders
  const usersWithStats = users.map(user => {
    const userOrders = orders.filter(o => o.user_id === user.id || o.user === user.id)
    return {
      ...user,
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    }
  })

  return (
    <div className="users-page">
      <h2 className="page-title">Registered Users</h2>

      <div className="users-list-card">
        {loading ? (
          <div className="empty-state">
            <p>Loading users...</p>
          </div>
        ) : usersWithStats.length === 0 ? (
          <div className="empty-state">
            <UsersIcon size={48} strokeWidth={1.5} />
            <p>No registered users yet</p>
          </div>
        ) : (
          <div className="users-table">
            <div className="table-head">
              <span>Name</span>
              <span>Contact</span>
              <span>Orders</span>
              <span>Total Spent</span>
              <span>Joined</span>
            </div>
            
            {usersWithStats.map(user => (
              <div key={user.id} className="table-row">
                <div className="user-name-col">
                  <div className="user-avatar">
                    {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-name-info">
                    <strong>{user.first_name} {user.last_name}</strong>
                    <span className="user-role">{user.is_superuser ? 'Admin' : 'Customer'}</span>
                  </div>
                </div>
                
                <div className="user-contact-col">
                  <span><Mail size={12} /> {user.email || 'N/A'}</span>
                  {user.profile?.phone && <span><Phone size={12} /> {user.profile.phone}</span>}
                </div>
                
                <div className="user-orders-col">
                  {user.totalOrders}
                </div>
                
                <div className="user-spent-col">
                  ₹{user.totalSpent.toFixed(0)}
                </div>
                
                <div className="user-date-col">
                  {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
