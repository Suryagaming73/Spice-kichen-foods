import React from 'react'
import './Static.css'

export default function Reviews() {
  return (
    <div className="static-page">
      <h1>Customer Reviews</h1>
      <p>See what our beloved customers are saying about Spice Kitchen.</p>

      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ff4757' }}>"The best Biryani in town!"</h3>
          <p style={{ margin: '0 0 10px 0', fontStyle: 'italic' }}>"I've ordered from Spice Kitchen at least five times this month. The food is always piping hot, the spices are perfectly balanced, and the delivery is incredibly fast."</p>
          <small style={{ fontWeight: 'bold' }}>- Rahul D.</small>
        </div>

        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ff4757' }}>"Just like home-cooked food"</h3>
          <p style={{ margin: '0 0 10px 0', fontStyle: 'italic' }}>"As someone living away from home, finding authentic paneer butter masala is tough. Spice Kitchen absolutely nailed it. Highly recommend!"</p>
          <small style={{ fontWeight: 'bold' }}>- Priya S.</small>
        </div>

        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ff4757' }}>"Exceptional Service"</h3>
          <p style={{ margin: '0 0 10px 0', fontStyle: 'italic' }}>"There was a small mixup with my order once, and their support team handled it instantly and even sent a complimentary dessert. Fantastic service."</p>
          <small style={{ fontWeight: 'bold' }}>- Amit K.</small>
        </div>
      </div>
    </div>
  )
}
