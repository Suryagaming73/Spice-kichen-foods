import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import { TrendingUp, Users, ShoppingBag, IndianRupee } from 'lucide-react'
import api from '../../lib/api'
import './Analytics.css'

export default function Analytics() {
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        api.get('orders/'),
        api.get('users/')
      ])
      
      setOrders(ordersRes.data || [])
      setUsers(usersRes.data || [])
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Process data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const revenueData = last7Days.map(date => {
    const dayOrders = orders.filter(o => o.created_at.startsWith(date) && o.status !== 'Cancelled')
    return {
      date: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
      revenue: dayOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
      orders: dayOrders.length
    }
  })

  const orderStatusData = [
    { name: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
    { name: 'Processing', count: orders.filter(o => ['Food Processing', 'Preparing'].includes(o.status)).length },
    { name: 'Out for delivery', count: orders.filter(o => o.status === 'Out for delivery').length },
    { name: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length },
  ]

  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

  return (
    <div className="analytics-page">
      <h2 className="page-title">Analytics Overview</h2>

      {/* Summary Cards */}
      <div className="analytics-summary">
        <div className="summary-card">
          <div className="sc-icon" style={{ color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)' }}>
            <IndianRupee size={24} />
          </div>
          <div className="sc-info">
            <p className="sc-label">Total Revenue</p>
            <p className="sc-value">₹{totalRevenue.toFixed(0)}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="sc-icon" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="sc-info">
            <p className="sc-label">Total Orders</p>
            <p className="sc-value">{orders.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="sc-icon" style={{ color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)' }}>
            <Users size={24} />
          </div>
          <div className="sc-info">
            <p className="sc-label">Registered Users</p>
            <p className="sc-value">{users.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="sc-icon" style={{ color: '#FF6B35', background: 'rgba(255, 107, 53, 0.1)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="sc-info">
            <p className="sc-label">Avg. Order Value</p>
            <p className="sc-value">₹{orders.length ? (totalRevenue / orders.length).toFixed(0) : 0}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Revenue Chart */}
        <div className="chart-container">
          <h3>Revenue & Orders (Last 7 Days)</h3>
          <div className="chart-wrapper">
            {loading ? <p className="chart-loading">Loading chart...</p> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#1a1a25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="chart-container">
          <h3>Orders by Status</h3>
          <div className="chart-wrapper">
            {loading ? <p className="chart-loading">Loading chart...</p> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderStatusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#1a1a25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="count" name="Orders" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
