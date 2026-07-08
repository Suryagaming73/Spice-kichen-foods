import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Save, MapPin, Trash2, Plus, LogOut, Mail, Phone, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import './Profile.css'

export default function Profile() {
  const { user, profile, displayName, avatarUrl, updateProfile, uploadAvatar, signOut } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    full_name: profile?.full_name || displayName || '',
    phone: profile?.phone || '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // New address form
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    street: '', area: '', city: '', state: '', pincode: '',
  })

  function handleChange(e) {
    if (e.target.name === 'phone') {
      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, phone: value });
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateProfile({
        full_name: form.full_name,
        phone: form.phone,
      })
      setEditing(false)
      toast.success('Profile updated!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }

    setUploading(true)
    try {
      await uploadAvatar(file)
      toast.success('Profile picture updated!')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  async function handleAddAddress() {
    if (!newAddress.street || !newAddress.city) {
      toast.error('Please enter street and city')
      return
    }

    try {
      const addresses = profile?.saved_addresses || []
      await updateProfile({
        saved_addresses: [...addresses, newAddress],
      })
      setNewAddress({ street: '', area: '', city: '', state: '', pincode: '' })
      setShowAddAddress(false)
      toast.success('Address saved!')
    } catch (error) {
      toast.error('Failed to save address')
    }
  }

  async function handleDeleteAddress(index) {
    try {
      const addresses = [...(profile?.saved_addresses || [])]
      addresses.splice(index, 1)
      await updateProfile({ saved_addresses: addresses })
      toast.success('Address removed')
    } catch (error) {
      toast.error('Failed to remove address')
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const savedAddresses = profile?.saved_addresses || []

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-layout">
        {/* Profile Card */}
        <div className="profile-card">
          {/* Avatar */}
          <div className="profile-avatar-section">
            <div className="avatar-large" onClick={() => fileInputRef.current?.click()}>
              {uploading ? (
                <div className="avatar-uploading">
                  <span className="btn-spinner" />
                </div>
              ) : avatarUrl ? (
                <img src={avatarUrl} alt={displayName} referrerPolicy="no-referrer" />
              ) : (
                <div className="avatar-fallback">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="avatar-overlay">
                <Camera size={20} />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              hidden
            />
            <h2>{displayName}</h2>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-role-badge">{profile?.role === 'admin' ? '👑 Admin' : '🍽️ Customer'}</span>
          </div>

          {/* Profile Info */}
          <div className="profile-info-section">
            <div className="info-header">
              <h3>Personal Information</h3>
              {!editing ? (
                <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
              ) : (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? <span className="btn-spinner small" /> : <><Save size={14} /> Save</>}
                  </button>
                </div>
              )}
            </div>

            <div className="info-grid">
              <div className="info-field">
                <label><User size={14} /> Full Name</label>
                {editing ? (
                  <input name="full_name" value={form.full_name} onChange={handleChange} />
                ) : (
                  <p>{profile?.full_name || displayName || '—'}</p>
                )}
              </div>

              <div className="info-field">
                <label><Mail size={14} /> Email</label>
                <p>{user?.email || '—'}</p>
              </div>

              <div className="info-field">
                <label><Phone size={14} /> Phone</label>
                {editing ? (
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" pattern="[0-9]{10}" maxLength="10" minLength="10" />
                ) : (
                  <p>{profile?.phone || '—'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="addresses-card">
          <div className="addresses-header">
            <h3><MapPin size={18} /> Saved Addresses</h3>
            <button className="add-address-btn" onClick={() => setShowAddAddress(!showAddAddress)}>
              <Plus size={16} /> Add Address
            </button>
          </div>

          {showAddAddress && (
            <div className="new-address-form">
              <input placeholder="Street / House No. *" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
              <input placeholder="Area / Locality" value={newAddress.area} onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })} />
              <div className="addr-row">
                <input placeholder="City *" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                <input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                <input placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
              </div>
              <div className="addr-actions">
                <button className="save-addr-btn" onClick={handleAddAddress}>Save Address</button>
                <button className="cancel-addr-btn" onClick={() => setShowAddAddress(false)}>Cancel</button>
              </div>
            </div>
          )}

          {savedAddresses.length > 0 ? (
            <div className="saved-addresses-list">
              {savedAddresses.map((addr, idx) => (
                <div key={idx} className="saved-address-item">
                  <div className="addr-info">
                    <MapPin size={16} />
                    <p>
                      {[addr.street, addr.area, addr.city, addr.state, addr.pincode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                  <button className="delete-addr-btn" onClick={() => handleDeleteAddress(idx)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !showAddAddress && (
              <p className="no-addresses">No saved addresses yet. Add one for faster checkout!</p>
            )
          )}
        </div>

        {/* Sign Out */}
        <button className="signout-btn" onClick={handleSignOut}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  )
}
