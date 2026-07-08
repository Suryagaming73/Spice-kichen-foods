import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Star, Clock, Truck, ShieldCheck, ChefHat } from 'lucide-react'
import api from '../../lib/api'
import FoodCard from '../../components/FoodCard/FoodCard'
import './Home.css'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [popularItems, setPopularItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [catRes, foodRes] = await Promise.all([
        api.get('categories/'),
        api.get('food-items/')
      ])

      setCategories(catRes.data || [])
      // The API returns all items ordered by rating descending, just slice the top 8 and filter available
      const availableItems = foodRes.data?.filter(item => item.is_available) || []
      setPopularItems(availableItems.slice(0, 8))
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-particles">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`} />
            ))}
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <ChefHat size={16} />
            <span>#1 Indian Restaurant in Town</span>
          </div>
          <h1>
            Authentic <span className="gradient-text">Indian Flavours</span>
            <br />Delivered to Your Door
          </h1>
          <p className="hero-desc">
            From rich biryanis to crispy dosas, experience the taste of India 
            with fresh ingredients and traditional recipes.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search for biryani, dosa, paneer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="hero-search-input"
            />
            <button type="submit">Search</button>
          </form>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">500+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">50+</span>
              <span className="stat-label">Menu Items</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">4.8</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Clock size={24} /></div>
            <h3>Fast Delivery</h3>
            <p>30-45 mins average delivery time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={24} /></div>
            <h3>Fresh & Hygienic</h3>
            <p>100% fresh ingredients daily</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Truck size={24} /></div>
            <h3>Free Delivery</h3>
            <p>On orders above ₹499</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Star size={24} /></div>
            <h3>Top Rated</h3>
            <p>4.8★ with 500+ reviews</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Explore Categories</h2>
            <p className="section-subtitle">What are you craving today?</p>
          </div>
          <Link to="/menu" className="see-all-link">
            View Full Menu <ArrowRight size={16} />
          </Link>
        </div>

        <div className="categories-scroll">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="category-card"
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Items */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Popular Dishes</h2>
            <p className="section-subtitle">Most ordered by our customers</p>
          </div>
          <Link to="/menu" className="see-all-link">
            See All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="food-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="food-card-skeleton">
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line w70" />
                  <div className="skeleton-line w40" />
                  <div className="skeleton-line w50" />
                </div>
              </div>
            ))}
          </div>
        ) : popularItems.length > 0 ? (
          <div className="food-grid">
            {popularItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty-section">
            <p>🍽️ Menu items coming soon! Check back later.</p>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to Order?</h2>
          <p>Browse our complete menu and get your favourite food delivered in minutes</p>
          <Link to="/menu" className="cta-btn">
            Order Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
