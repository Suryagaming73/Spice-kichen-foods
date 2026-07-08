import { Link } from 'react-router-dom'
import { ChefHat, MapPin, Phone, Mail, Clock, Globe, Heart, MessageCircle } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <ChefHat size={28} />
              <div>
                <span className="footer-name">Spice Kitchen</span>
                <span className="footer-tagline">Authentic Indian Cuisine</span>
              </div>
            </div>
            <p className="footer-desc">
              Fresh ingredients, traditional recipes, and flavors that remind you of home. 
              Order now and get it delivered hot to your doorstep!
            </p>
            <div className="social-links">
              <Link to="/about" className="social-link" aria-label="Website"><Globe size={18} /></Link>
              <Link to="/contact" className="social-link" aria-label="Chat"><MessageCircle size={18} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/menu">Full Menu</Link>
            <Link to="/cart">Your Cart</Link>
            <Link to="/my-orders">Track Orders</Link>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <MapPin size={16} />
              <span>123 MG Road, Bangalore, Karnataka 560001</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>contact@spicekitchen.com</span>
            </div>
            <div className="contact-item">
              <Clock size={16} />
              <span>9:00 AM – 11:00 PM (All days)</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Spice Kitchen. All rights reserved.</p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  )
}
