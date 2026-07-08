import React from 'react'
import './Static.css'

export default function Privacy() {
  return (
    <div className="static-page">
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last Updated: October 2023</p>

      <h2>1. Information We Collect</h2>
      <p>
        When you use our services, we may collect personal information such as your name, email address, phone number, and delivery address. We also collect order history and payment information to facilitate your transactions securely.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>Your information is used to:</p>
      <ul>
        <li>Process and deliver your food orders accurately</li>
        <li>Communicate with you regarding your order status</li>
        <li>Improve our menu offerings and website experience</li>
        <li>Send promotional offers and updates (only if you opt-in)</li>
      </ul>

      <h2>3. Data Security</h2>
      <p>
        We implement robust security measures to protect your personal information. Payment processing is handled by secure, third-party payment gateways, and we do not store your credit card details on our servers.
      </p>

      <h2>4. Third-Party Sharing</h2>
      <p>
        We do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted service providers who assist us in operating our website and delivering your orders, as long as those parties agree to keep this information confidential.
      </p>

      <h2>5. Contact Us</h2>
      <p>If you have any questions regarding this Privacy Policy, please contact us at privacy@spicekitchen.com.</p>
    </div>
  )
}
