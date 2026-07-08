import React from 'react'
import './Static.css'

export default function Contact() {
  return (
    <div className="static-page">
      <h1>Contact Support</h1>
      <p>Need help with your order? Our team is available 24/7 to assist you.</p>

      <form className="support-form" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! Our team will get back to you shortly."); }}>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email Address" required />
        <input type="text" placeholder="Order ID (Optional)" />
        <textarea rows="6" placeholder="How can we help you?" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  )
}
