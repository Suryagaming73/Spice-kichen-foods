import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import './Cart.css'

export default function Cart() {
  const { cartItems, incrementQuantity, decrementQuantity, removeFromCart, subtotal, deliveryFee, total, totalItems, FREE_DELIVERY_ABOVE } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/', { replace: true })
    }
  }, [cartItems.length, navigate])

  if (cartItems.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart <span className="cart-count">({totalItems} items)</span></h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-img">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} />
                ) : (
                  <div className="cart-item-placeholder">🍽️</div>
                )}
              </div>
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">₹{Number(item.price).toFixed(0)}</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-group">
                  <button onClick={() => decrementQuantity(item.id)} className="qty-btn">
                    <Minus size={14} />
                  </button>
                  <span className="qty-val">{item.quantity}</span>
                  <button onClick={() => incrementQuantity(item.id)} className="qty-btn">
                    <Plus size={14} />
                  </button>
                </div>
                <p className="cart-item-total">₹{(item.price * item.quantity).toFixed(0)}</p>
                <button onClick={() => removeFromCart(item.id)} className="remove-btn" title="Remove item">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          {subtotal < FREE_DELIVERY_ABOVE && (
            <div className="free-delivery-hint">
              <Truck size={16} />
              <span>Add ₹{(FREE_DELIVERY_ABOVE - subtotal).toFixed(0)} more for <strong>free delivery</strong></span>
            </div>
          )}

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? 'free-text' : ''}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
          </div>

          {user ? (
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/auth" className="checkout-btn">
              Sign In to Order <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
