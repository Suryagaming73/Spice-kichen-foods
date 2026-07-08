import React from 'react'
import './Static.css'

export default function About() {
  return (
    <div className="static-page">
      <h1>About Spice Kitchen</h1>
      <p className="last-updated">Serving authentic flavors since 2010</p>
      
      <h2>Our Story</h2>
      <p>
        Spice Kitchen was born out of a love for authentic Indian cuisine and a desire to bring the rich, vibrant flavors of our heritage to your dining table. What started as a small family-run kitchen has blossomed into a beloved local culinary destination, dedicated to serving freshly prepared, mouth-watering dishes that evoke the comforts of home.
      </p>

      <h2>Our Philosophy</h2>
      <p>
        We believe that great food starts with great ingredients. That's why we source our spices directly from trusted farmers and use only the freshest produce available. Every dish is crafted with care, combining traditional cooking techniques with a touch of modern flair to ensure every bite is a memorable experience.
      </p>

      <h2>Why Choose Us?</h2>
      <ul>
        <li>Authentic recipes passed down through generations</li>
        <li>100% fresh, locally-sourced ingredients</li>
        <li>Fast, reliable delivery straight to your door</li>
        <li>Unwavering commitment to quality and hygiene</li>
      </ul>
      
      <p>Thank you for letting us be a part of your culinary journey. We look forward to serving you!</p>
    </div>
  )
}
