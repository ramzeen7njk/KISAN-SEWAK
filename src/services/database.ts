import { supabase } from '../config/supabase';

export interface FarmerProfile {
  id: string;
  name: string;
  age: number;
  mobile: string;
  aadhar_number: string;
  state: string;
  region: string;
  crops_cultivated: string;
  land_acres: number;
}

export interface LogisticsProfile {
  id: string;
  name: string;
  age: number;
  company_name: string;
  logistics_type: string;
  mobile: string;
  quantity_available: number;
  license_number: string;
  state: string;
  region: string;
}

export const databaseService = {
  // Farmer related queries
  async createFarmerProfile(profile: Omit<FarmerProfile, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('farmers')
        .insert([profile])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating farmer profile:', error);
      return { data: null, error };
    }
  },

  async getFarmerProfile(id: string) {
    try {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching farmer profile:', error);
      return { data: null, error };
    }
  },

  async updateFarmerProfile(id: string, updates: Partial<FarmerProfile>) {
    try {
      const { data, error } = await supabase
        .from('farmers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating farmer profile:', error);
      return { data: null, error };
    }
  },

  // Logistics related queries
  async createLogisticsProfile(profile: Omit<LogisticsProfile, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('logistics')
        .insert([profile])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating logistics profile:', error);
      return { data: null, error };
    }
  },

  async getLogisticsProfile(id: string) {
    try {
      const { data, error } = await supabase
        .from('logistics')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching logistics profile:', error);
      return { data: null, error };
    }
  },

  async verifyLogisticsCredentials(company_name: string, license_number: string) {
    try {
      const { data, error } = await supabase
        .from('logistics')
        .select('id, company_name, license_number')
        .eq('company_name', company_name)
        .eq('license_number', license_number)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return { data: null, error: new Error('Invalid credentials') };
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error verifying logistics credentials:', error);
      return { data: null, error };
    }
  },

  async updateLogisticsProfile(id: string, updates: Partial<LogisticsProfile>) {
    try {
      const { data, error } = await supabase
        .from('logistics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating logistics profile:', error);
      return { data: null, error };
    }
  }
};