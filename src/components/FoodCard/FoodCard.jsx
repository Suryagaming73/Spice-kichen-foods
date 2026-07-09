import { Plus, Minus, Star, Leaf } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useSettings } from '../../contexts/SettingsContext'
import toast from 'react-hot-toast'
import './FoodCard.css'

export default function FoodCard({ item }) {
  const { addToCart, getItemQuantity, incrementQuantity, decrementQuantity } = useCart()
  const { settings } = useSettings()
  const quantity = getItemQuantity(item.id)

  const handleAddToCart = () => {
    if (settings && !settings.is_open) {
      toast.error('The hotel is closed. Cannot add items.')
      return
    }
    addToCart(item)
  }

  const handleIncrement = (id) => {
    if (settings && !settings.is_open) {
      toast.error('The hotel is closed. Cannot add items.')
      return
    }
    incrementQuantity(id)
  }

  return (
    <div className="food-card">
      <div className="food-card-img-wrap">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="food-card-img" loading="lazy" />
        ) : (
          <div className="food-card-img-placeholder">🍽️</div>
        )}
        {item.is_veg !== undefined && (
          <span className={`veg-badge ${item.is_veg ? 'veg' : 'non-veg'}`}>
            {item.is_veg ? <Leaf size={12} /> : '●'}
            {item.is_veg ? 'Veg' : 'Non-Veg'}
          </span>
        )}
      </div>

      <div className="food-card-body">
        <div className="food-card-header">
          <h3 className="food-card-name">{item.name}</h3>
          {item.rating > 0 && (
            <div className="food-card-rating">
              <Star size={13} fill="#FFB800" stroke="#FFB800" />
              <span>{Number(item.rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        {item.description && (
          <p className="food-card-desc">{item.description}</p>
        )}

        <div className="food-card-footer">
          <span className="food-card-price">₹{Number(item.price).toFixed(0)}</span>

          {quantity === 0 ? (
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              <Plus size={16} />
              ADD
            </button>
          ) : (
            <div className="quantity-controls">
              <button onClick={() => decrementQuantity(item.id)} className="qty-btn minus">
                <Minus size={14} />
              </button>
              <span className="qty-count">{quantity}</span>
              <button onClick={() => handleIncrement(item.id)} className="qty-btn plus">
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
