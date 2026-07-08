-- ============================================
-- Spice Kitchen — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. PROFILES TABLE (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  email TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '🍽️',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FOOD ITEMS TABLE
CREATE TABLE IF NOT EXISTS food_items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  is_veg BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  rating NUMERIC(2,1) DEFAULT 0,
  total_ratings INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 40.00,
  total_amount NUMERIC(10,2) NOT NULL,
  address JSONB NOT NULL,
  status TEXT DEFAULT 'Food Processing' CHECK (status IN ('Food Processing', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled')),
  payment_method TEXT DEFAULT 'COD',
  payment_status BOOLEAN DEFAULT false,
  delivery_lat NUMERIC(10,7),
  delivery_lng NUMERIC(10,7),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  food_item_id BIGINT REFERENCES food_items(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, food_item_id)
);

-- 6. HOTEL SETTINGS TABLE
CREATE TABLE IF NOT EXISTS hotel_settings (
  id BIGSERIAL PRIMARY KEY,
  hotel_name TEXT DEFAULT 'Spice Kitchen',
  description TEXT DEFAULT 'Authentic Indian Cuisine delivered to your doorstep',
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  opening_time TIME DEFAULT '09:00',
  closing_time TIME DEFAULT '23:00',
  delivery_radius_km NUMERIC(5,2) DEFAULT 10.00,
  min_order_amount NUMERIC(10,2) DEFAULT 99.00,
  delivery_fee NUMERIC(10,2) DEFAULT 40.00,
  free_delivery_above NUMERIC(10,2) DEFAULT 499.00,
  gst_percentage NUMERIC(4,2) DEFAULT 5.00,
  is_open BOOLEAN DEFAULT true,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_settings ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- CATEGORIES policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- FOOD ITEMS policies (public read, admin write)
CREATE POLICY "Anyone can view food items" ON food_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage food items" ON food_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ORDERS policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- REVIEWS policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- HOTEL SETTINGS policies (public read, admin write)
CREATE POLICY "Anyone can view hotel settings" ON hotel_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage hotel settings" ON hotel_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP (TRIGGER)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  -- Check if this is the very first profile
  SELECT NOT EXISTS(SELECT 1 FROM public.profiles) INTO is_first_user;

  INSERT INTO public.profiles (id, full_name, avatar_url, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    NEW.email,
    CASE WHEN is_first_user THEN 'admin' ELSE 'customer' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ADMIN ROLE MANAGEMENT (RPC)
-- ============================================

-- 1. Check if admin exists
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS BOOLEAN AS $$
DECLARE
  has_admin BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE role = 'admin') INTO has_admin;
  RETURN has_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Claim admin role (only works if no admin exists)
CREATE OR REPLACE FUNCTION public.claim_admin_role()
RETURNS BOOLEAN AS $$
DECLARE
  has_admin BOOLEAN;
BEGIN
  -- Check if an admin already exists
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE role = 'admin') INTO has_admin;
  
  IF NOT has_admin THEN
    -- Upsert the current user to admin (creates profile if missing)
    INSERT INTO public.profiles (id, role, email, full_name, avatar_url)
    SELECT 
      id,
      'admin',
      email,
      COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
      COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', '')
    FROM auth.users WHERE id = auth.uid()
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();



-- ============================================
-- STORAGE BUCKET SETUP (run separately if needed)
-- ============================================
-- Go to Supabase Dashboard → Storage → Create bucket:
--   Name: food-images
--   Public: true
--
-- Then add this policy in SQL:
-- CREATE POLICY "Public food images" ON storage.objects FOR SELECT USING (bucket_id = 'food-images');
-- CREATE POLICY "Admins can upload food images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'food-images');
-- CREATE POLICY "Admins can update food images" ON storage.objects FOR UPDATE USING (bucket_id = 'food-images');
-- CREATE POLICY "Admins can delete food images" ON storage.objects FOR DELETE USING (bucket_id = 'food-images');
