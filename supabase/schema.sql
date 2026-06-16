-- ========================================
-- USERS (Todos os usuários)
-- ========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('buyer', 'vendor', 'admin')),
  full_name VARCHAR(255),
  avatar_url TEXT,
  buyer_readiness_score INT CHECK (buyer_readiness_score >= 0 AND buyer_readiness_score <= 100),
  buyer_readiness_updated_at TIMESTAMP,
  seller_readiness_score INT CHECK (seller_readiness_score >= 0 AND seller_readiness_score <= 100),
  seller_readiness_updated_at TIMESTAMP,
  preferred_language VARCHAR(10) DEFAULT 'en',
  stripe_customer_id VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- BUSINESSES (Negócios publicados)
-- ========================================
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  canton VARCHAR(50),
  city VARCHAR(100),
  description TEXT,
  price_min INT,
  price_max INT,
  annual_revenue INT,
  established_year INT,
  photos JSONB DEFAULT '[]'::jsonb,
  seller_readiness_score INT CHECK (seller_readiness_score >= 0 AND seller_readiness_score <= 100),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'archived')),
  visibility VARCHAR(50) DEFAULT 'public',
  confidentiality_level INT CHECK (confidentiality_level >= 1 AND confidentiality_level <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- BUYER PROFILES
-- ========================================
CREATE TABLE buyer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  capital_min INT,
  capital_max INT,
  sectors_interested TEXT[] DEFAULT '{}',
  region_main VARCHAR(50),
  radius_km INT DEFAULT 20,
  explore_other_regions BOOLEAN DEFAULT false,
  experience_background VARCHAR(100),
  involvement_type VARCHAR(50) CHECK (involvement_type IN ('operator', 'investor', 'unknown')),
  hours_available_per_week INT,
  timeline_months INT,
  languages TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- INTERACTIONS (Like / Pass / Save)
-- ========================================
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL CHECK (action IN ('like', 'pass', 'save')),
  succession_fit_score INT CHECK (succession_fit_score >= 0 AND succession_fit_score <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(buyer_id, business_id, action)
);

-- ========================================
-- SWIPE COUNTERS (Limite 5-6/dia)
-- ========================================
CREATE TABLE swipe_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  date_counter DATE,
  count INT DEFAULT 0 CHECK (count >= 0 AND count <= 6),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- SUBSCRIPTIONS (Stripe)
-- ========================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255),
  tier VARCHAR(50) CHECK (tier IN ('pro_buyer', 'pro_vendor')),
  status VARCHAR(50) CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- RLS POLICIES (Row Level Security)
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users: Cada um vê apenas seus dados
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Businesses: Vendedor vê seu negócio
CREATE POLICY "Vendors can read own business"
  ON businesses FOR SELECT
  USING (vendor_id = auth.uid());

-- Businesses: Buyers veem negócios aprovados
CREATE POLICY "Buyers can see approved businesses"
  ON businesses FOR SELECT
  USING (status = 'approved');

-- Interactions: Usuários veem suas próprias interações
CREATE POLICY "Users can read own interactions"
  ON interactions FOR SELECT
  USING (buyer_id = auth.uid());

-- Interactions: Vendedor vê quantos likes recebeu (blur)
CREATE POLICY "Vendors can see interaction count"
  ON interactions FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE vendor_id = auth.uid()
    ) AND action = 'like'
  );

-- Swipe counters: Usuários veem suas contagens
CREATE POLICY "Users can read own swipe counter"
  ON swipe_counters FOR SELECT
  USING (buyer_id = auth.uid());

-- Buyer profiles: Apenas o próprio usuário vê
CREATE POLICY "Users can read own buyer profile"
  ON buyer_profiles FOR SELECT
  USING (user_id = auth.uid());

-- ========================================
-- INDEXES (Performance)
-- ========================================

CREATE INDEX idx_businesses_vendor_id ON businesses(vendor_id);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_interactions_buyer_id ON interactions(buyer_id);
CREATE INDEX idx_interactions_business_id ON interactions(business_id);
CREATE INDEX idx_swipe_counters_buyer_id ON swipe_counters(buyer_id);
CREATE INDEX idx_swipe_counters_date ON swipe_counters(date_counter);
