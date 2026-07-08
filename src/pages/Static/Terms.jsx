import React from 'react'
import './Static.css'

export default function Terms() {
  return (
    <div className="static-page">
      <h1>Terms of Service</h1>
      <p className="last-updated">Last Updated: October 2023</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using our website and services, you accept and agree to be bound by the terms and provision of this agreement.
      </p>

      <h2>2. Order and Delivery Policy</h2>
      <p>
        We strive to deliver your food within the estimated time frame, but delivery times may vary due to traffic, weather, and restaurant preparation times. Orders cannot be cancelled once the restaurant has started preparing the food.
      </p>

      <h2>3. Pricing and Payments</h2>
      <ul>
        <li>All prices are subject to change without notice.</li>
        <li>Applicable taxes and delivery fees will be added at checkout.</li>
        <li>Payments must be made through our authorized payment gateways or cash on delivery where available.</li>
      </ul>

      <h2>4. User Conduct</h2>
      <p>
        You agree not to use the website for any unlawful purpose or in any way that might harm, damage, or disparage any other party. Any abusive language towards our delivery personnel or staff will lead to account suspension.
      </p>

      <h2>5. Refund Policy</h2>
      <p>
        Refunds are processed only for cancelled orders before food preparation begins, or in cases of incorrect or missing items. Please contact support within 24 hours of delivery for any disputes.
      </p>
    </div>
  )
}
