export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      farmers: {
        Row: {
          id: string
          created_at: string
          name: string
          age: number
          mobile: string
          aadhar_number: string
          state: string
          region: string
          crops_cultivated: string
          land_acres: number
          profile_status: string
          verification_status: string
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          age: number
          mobile: string
          aadhar_number: string
          state: string
          region: string
          crops_cultivated: string
          land_acres: number
          profile_status?: string
          verification_status?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          age?: number
          mobile?: string
          aadhar_number?: string
          state?: string
          region?: string
          crops_cultivated?: string
          land_acres?: number
          profile_status?: string
          verification_status?: string
        }
      }
      logistics: {
        Row: {
          id: string
          created_at: string
          name: string
          age: number
          company_name: string
          logistics_type: string
          mobile: string
          quantity_available: number
          license_number: string
          state: string
          region: string
          profile_status: string
          verification_status: string
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          age: number
          company_name: string
          logistics_type: string
          mobile: string
          quantity_available: number
          license_number: string
          state: string
          region: string
          profile_status?: string
          verification_status?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          age?: number
          company_name?: string
          logistics_type?: string
          mobile?: string
          quantity_available?: number
          license_number?: string
          state?: string
          region?: string
          profile_status?: string
          verification_status?: string
        }
      }
    }
  }
} 