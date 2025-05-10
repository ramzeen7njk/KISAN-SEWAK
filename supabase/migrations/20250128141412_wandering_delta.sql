/*
  # Initial Schema for Kisan Sewak

  1. Tables
    - users (base table for all user types)
    - farmers (extends users)
    - marketplaces (extends users)
    - logistics (extends users)
    - admins (extends users)

  2. Security
    - RLS policies for each table
    - Authentication setup
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_type AS ENUM ('farmer', 'marketplace', 'logistics', 'admin');
CREATE TYPE company_type AS ENUM ('ration', 'corporation', 'restaurant', 'hotel', 'wholesale', 'retail', 'contract');

-- Base users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_type user_type NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  mobile TEXT NOT NULL,
  state TEXT NOT NULL,
  region TEXT NOT NULL
);

-- Farmers table
CREATE TABLE farmers (
  id uuid PRIMARY KEY REFERENCES users(id),
  passbook_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  mobile TEXT NOT NULL,
  aadhar_number TEXT UNIQUE NOT NULL,
  state TEXT NOT NULL,
  region TEXT NOT NULL,
  crops_cultivated TEXT NOT NULL,
  land_acres DECIMAL NOT NULL,
  verification_status verification_status DEFAULT 'pending'
);

-- Marketplaces table
CREATE TABLE marketplaces (
  id uuid PRIMARY KEY REFERENCES users(id),
  company_type company_type NOT NULL,
  company_name TEXT NOT NULL,
  iso_number TEXT UNIQUE NOT NULL,
  verification_status TEXT DEFAULT 'pending'
);

-- Logistics table
CREATE TABLE logistics (
  id uuid PRIMARY KEY REFERENCES users(id),
  company_name TEXT NOT NULL,
  logistics_type TEXT NOT NULL,
  quantity_available INTEGER NOT NULL,
  license_number TEXT UNIQUE NOT NULL
);

-- Admins table
CREATE TABLE admins (
  id uuid PRIMARY KEY REFERENCES users(id),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Farmers can view their own data"
  ON farmers
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Marketplaces can view their own data"
  ON marketplaces
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Logistics can view their own data"
  ON logistics
  FOR SELECT
  USING (auth.uid() = id);

-- Insert admin user
INSERT INTO users (id, user_type, name, age, mobile, state, region)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin', 'Admin', 0, '0000000000', 'All', 'All');

INSERT INTO admins (id, username, password)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin', 'admin');