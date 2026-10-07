-- ====================================================================
-- DecorReach Database Schema
-- Production-Ready PostgreSQL Schema for Supabase
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Seller Profiles Table
CREATE TABLE IF NOT EXISTS public.seller_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    website TEXT,
    description TEXT,
    product_categories TEXT[] DEFAULT '{}',
    target_market TEXT DEFAULT 'United States',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Searches Table
CREATE TABLE IF NOT EXISTS public.searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    search_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_category TEXT NOT NULL,
    product_description TEXT,
    keywords TEXT[] DEFAULT '{}',
    target_country TEXT DEFAULT 'United States',
    target_states TEXT[] DEFAULT '{}',
    target_cities TEXT[] DEFAULT '{}',
    buyer_types TEXT[] DEFAULT '{}',
    min_score INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Buyers Table
CREATE TABLE IF NOT EXISTS public.buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    business_name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    website TEXT,
    domain TEXT,
    business_email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'United States',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    industry TEXT,
    buyer_type TEXT NOT NULL,
    employee_count INTEGER,
    social_profiles JSONB DEFAULT '{}'::jsonb,
    source_providers TEXT[] DEFAULT '{}',
    email_status TEXT DEFAULT 'unverified' CHECK (email_status IN ('verified', 'unverified', 'invalid', 'risky')),
    verification_details JSONB DEFAULT '{}'::jsonb,
    match_score INTEGER DEFAULT 0,
    match_reasons TEXT[] DEFAULT '{}',
    ai_pitch TEXT,
    pipeline_status TEXT DEFAULT 'discovered' CHECK (pipeline_status IN ('discovered', 'qualified', 'contact_verified', 'added_to_campaign', 'contacted', 'opened', 'replied', 'interested', 'customer')),
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Search Buyers Junction Table
CREATE TABLE IF NOT EXISTS public.search_buyers (
    search_id UUID REFERENCES public.searches(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.buyers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (search_id, buyer_id)
);

-- 7. Email Templates Table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    variables TEXT[] DEFAULT '{"businessName", "city", "buyerType", "sellerName", "companyName", "website"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'paused')),
    sender_name TEXT NOT NULL,
    reply_to TEXT NOT NULL,
    personalization_enabled BOOLEAN DEFAULT true,
    daily_limit INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Campaign Buyers Table
CREATE TABLE IF NOT EXISTS public.campaign_buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.buyers(id) ON DELETE CASCADE,
    personalized_subject TEXT,
    personalized_body TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'failed', 'unsubscribed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(campaign_id, buyer_id)
);

-- 10. Email Events Table (Audit & Webhooks)
CREATE TABLE IF NOT EXISTS public.email_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.buyers(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'unsubscribed', 'complaint')),
    provider_event_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. Suppression List Table
CREATE TABLE IF NOT EXISTS public.suppression_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('unsubscribed', 'bounced', 'manual', 'complaint')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, email)
);

-- 12. API Usage Table (Telemetry & Rate Monitoring)
CREATE TABLE IF NOT EXISTS public.api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    provider TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    duration_ms INTEGER DEFAULT 0,
    status_code INTEGER DEFAULT 200,
    status TEXT DEFAULT 'success' CHECK (status IN ('success', 'rate_limited', 'error', 'cached')),
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_buyers_normalized_name ON public.buyers(normalized_name);
CREATE INDEX IF NOT EXISTS idx_buyers_domain ON public.buyers(domain);
CREATE INDEX IF NOT EXISTS idx_buyers_state ON public.buyers(state);
CREATE INDEX IF NOT EXISTS idx_buyers_buyer_type ON public.buyers(buyer_type);
CREATE INDEX IF NOT EXISTS idx_buyers_match_score ON public.buyers(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_buyers_pipeline_status ON public.buyers(pipeline_status);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_timestamp ON public.api_usage(timestamp DESC);

-- Row Level Security (RLS)
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppression_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
