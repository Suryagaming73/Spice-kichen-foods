import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext({})

export function useCart() {
  return useContext(CartContext)
}

const CART_STORAGE_KEY = 'spice_kitchen_cart'
const DELIVERY_FEE = 40
const FREE_DELIVERY_ABOVE = 499

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  // Add item to cart
  function addToCart(item) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  // Remove item from cart
  function removeFromCart(itemId) {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  // Update item quantity
  function updateQuantity(itemId, quantity) {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    )
  }

  // Increment quantity
  function incrementQuantity(itemId) {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      )
    )
  }

  // Decrement quantity
  function decrementQuantity(itemId) {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === itemId)
      if (item && item.quantity <= 1) {
        return prev.filter((i) => i.id !== itemId)
      }
      return prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      )
    })
  }

  // Clear cart
  function clearCart() {
    setCartItems([])
  }

  // Get item quantity in cart
  function getItemQuantity(itemId) {
    const item = cartItems.find((i) => i.id === itemId)
    return item ? item.quantity : 0
  }

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getItemQuantity,
    subtotal,
    deliveryFee,
    total,
    totalItems,
    FREE_DELIVERY_ABOVE,
    DELIVERY_FEE,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
