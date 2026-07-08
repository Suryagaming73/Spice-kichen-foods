import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, AlertCircle, ArrowLeft } from 'lucide-react'
import './OnlinePayment.css'

export default function OnlinePayment() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/checkout', { replace: true })
    }, 4000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="online-payment-page">
      <div className="coming-soon-card">
        <div className="icon-wrapper pulse-animation">
          <CreditCard size={56} className="icon" />
        </div>
        
        <h1 className="title">Online Payment</h1>
        <p className="subtitle">Coming Soon!</p>
        
        <div className="alert-box">
          <AlertCircle size={22} className="alert-icon" />
          <p>We are currently integrating our secure payment gateway (UPI, Cards, Net Banking). Please use Cash on Delivery for now.</p>
        </div>
        
        <div className="redirect-info">
          <div className="loader-line"></div>
          <p>Redirecting back to checkout...</p>
        </div>

        <button className="back-btn" onClick={() => navigate('/checkout', { replace: true })}>
          <ArrowLeft size={16} /> Go Back Now
        </button>
      </div>
    </div>
  )
}
