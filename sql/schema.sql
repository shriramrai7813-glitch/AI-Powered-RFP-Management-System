-- Enable extension for gen_random_uuid (for Postgres with pgcrypto)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS rfps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  structured jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  contact_name text,
  email text,
  phone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rfp_vendor_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id uuid REFERENCES rfps(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  sent_at timestamptz,
  reply_token text,
  status text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id uuid REFERENCES rfps(id) ON DELETE SET NULL,
  vendor_email text,
  raw_email text,
  parsed jsonb,
  score integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proposals_rfp ON proposals(rfp_id);
CREATE INDEX IF NOT EXISTS idx_vendor_email ON proposals(vendor_email);
