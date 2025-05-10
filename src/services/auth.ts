import { supabase } from '../config/supabase';

export interface SignupData {
  userType: 'farmer' | 'marketplace' | 'logistics';
  email?: string;
  password?: string;
  userData: any;
}

interface AuthError {
  message?: string;
  status?: number;
}

const generatePassbookNumber = () => {
  // Generate a random 10-digit number
  const min = 1000000000;
  const max = 9999999999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const exponentialBackoff = async (retryCount: number) => {
  const baseDelay = 2000; // 2 seconds
  const maxDelay = 10000; // 10 seconds
  const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  await new Promise(resolve => setTimeout(resolve, delay));
};

export const authService = {
  async signup({ userType, email, password, userData }: SignupData): Promise<{ user: any; error: AuthError | null; message?: string; passbookNumber?: string }> {
    try {
      // Generate passbook number for farmers
      const passbookNumber = userType === 'farmer' ? generatePassbookNumber() : null;

      // Insert profile data
      let table;
      let profileData;

      switch (userType) {
        case 'farmer':
          table = 'farmers';
          profileData = {
            ...userData,
            passbook_number: passbookNumber,
            verification_status: 'pending',
            selected_district: userData.district
          };
          break;
        case 'marketplace':
          table = 'marketplaces';
          profileData = {
            ...userData,
            verification_status: 'pending'
          };
          break;
        case 'logistics':
          table = 'logistics';
          profileData = {
            name: userData.name,
            age: userData.age || 0,
            company_name: userData.company_name,
            logistics_type: userData.logistics_type || 'general',
            mobile: userData.mobile || '',
            quantity_available: userData.quantity_available || 0,
            license_number: userData.license_number,
            state: userData.state || '',
            region: userData.region || '',
            verification_status: 'pending'
          };
          break;
        default:
          throw new Error('Invalid user type');
      }

      const { data, error: insertError } = await supabase
        .from(table)
        .insert([profileData])
        .select()
        .single();

      if (insertError) {
        console.error('Profile data insertion error:', insertError);
        throw insertError;
      }

      return { 
        user: data, 
        error: null,
        passbookNumber: passbookNumber || undefined,
        message: userType === 'farmer' 
          ? 'Registration successful! Please save your passbook number.'
          : 'Registration successful!'
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        user: null, 
        error: { 
          message: error.message || 'An unknown error occurred' 
        } 
      };
    }
  },

  retrievePassbookNumber: async (name: string, mobile: string) => {
    try {
      // Log the search parameters
      console.log('Searching for farmer with:', { name, mobile });

      const { data: farmers, error: searchError } = await supabase
        .from('farmers')
        .select('passbook_number')
        .eq('name', name)
        .eq('mobile', mobile);

      // Log the query results
      console.log('Query results:', { farmers, searchError });

      if (searchError) {
        console.error('Database error:', searchError);
        throw searchError;
      }

      if (!farmers || farmers.length === 0) {
        throw new Error('No farmer found with the provided name and mobile number. Please check your details and try again.');
      }

      const farmer = farmers[0];

      if (!farmer.passbook_number) {
        throw new Error('Passbook number not found for this farmer.');
      }

      return {
        passbookNumber: farmer.passbook_number,
        error: null
      };
    } catch (error: any) {
      console.error('Error retrieving passbook number:', error);
      return {
        passbookNumber: null,
        error: error.message || 'Failed to retrieve passbook number'
      };
    }
  },

  farmerLogin: async (name: string, passbookNumber: string) => {
    try {
      // Validate inputs
      if (!name || !passbookNumber) {
        return { user: null, error: 'Name and passbook number are required.' };
      }

      // Log the login attempt
      console.log('Attempting farmer login:', { name, passbookNumber });

      const { data: farmers, error: searchError } = await supabase
        .from('farmers')
        .select('*')
        .eq('name', name)
        .eq('passbook_number', passbookNumber);

      if (searchError) {
        console.error('Database error during farmer login:', searchError);
        return { user: null, error: 'Database error occurred. Please try again.' };
      }

      if (!farmers || farmers.length === 0) {
        return { user: null, error: 'Invalid name or passbook number. Please check your details and try again.' };
      }

      const farmer = farmers[0];
      console.log('Farmer login successful:', { farmerId: farmer.id });

      return { user: farmer, error: null };
    } catch (error: any) {
      console.error('Farmer login error:', error);
      return { 
        user: null, 
        error: error.message || 'Login failed. Please check your name and passbook number.'
      };
    }
  },

  logisticsLogin: async (company_name: string, license_number: string) => {
    try {
      console.log('Attempting login with:', { company_name, license_number });
      
      // Find the logistics user
      const { data: logisticsUser, error: searchError } = await supabase
        .from('logistics')
        .select('*')
        .eq('company_name', company_name.trim())
        .eq('license_number', license_number.trim())
        .maybeSingle();
  
      if (searchError) {
        console.error('Supabase error:', searchError);
        return { user: null, error: 'Database error occurred' };
      }
  
      if (!logisticsUser) {
        return { user: null, error: 'Invalid credentials' };
      }

      // Update the logistics user to be approved (for testing)
      const { error: updateError } = await supabase
        .from('logistics')
        .update({ verification_status: 'approved' })
        .eq('id', logisticsUser.id);

      if (updateError) {
        console.error('Error updating verification status:', updateError);
      }

      // Create a simple session object
      const session = {
        user: {
          id: logisticsUser.id,
          user_metadata: {
            user_type: 'logistics',
            company_name: logisticsUser.company_name,
            license_number: logisticsUser.license_number,
            contact_number: logisticsUser.mobile, // Add contact number
            verification_status: 'approved'
          }
        },
        access_token: btoa(JSON.stringify({
          id: logisticsUser.id,
          timestamp: Date.now(),
          type: 'logistics'
        }))
      };

      // Store the session in localStorage
      localStorage.setItem('logistics_session', JSON.stringify(session));
  
      return { user: logisticsUser, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'Login failed' };
    }
  },

  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // If login successful, fetch the marketplace profile
      if (data.user) {
        const { data: marketplaceData, error: marketplaceError } = await supabase
          .from('marketplaces')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (marketplaceError) {
          console.error('Error fetching marketplace profile:', marketplaceError);
          throw marketplaceError;
        }

        if (!marketplaceData) {
          throw new Error('Marketplace profile not found');
        }

        // Create a session object for marketplace users
        const session = {
          user: {
            id: data.user.id,
            email: data.user.email,
            user_metadata: {
              user_type: 'marketplace',
              company_name: marketplaceData.company_name,
              company_type: marketplaceData.company_type,
              iso_number: marketplaceData.iso_number,
              verification_status: marketplaceData.verification_status
            }
          },
          access_token: data.session?.access_token
        };

        // Store the session in localStorage
        localStorage.setItem('marketplace_session', JSON.stringify(session));

        return { 
          user: session.user, 
          error: null,
          session: session
        };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error };
    }
  },

  async logout() {
    try {
      // Clear marketplace session
      localStorage.removeItem('marketplace_session');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Logout error:', error);
      return { error };
    }
  },

  async getCurrentUser() {
    try {
      // First check for marketplace session
      const marketplaceSession = localStorage.getItem('marketplace_session');
      if (marketplaceSession) {
        const session = JSON.parse(marketplaceSession);
        return { user: session.user, error: null };
      }

      // If no marketplace session, check auth session
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        // Fetch marketplace profile if it's a marketplace user
        const { data: marketplaceData } = await supabase
          .from('marketplaces')
          .select('*')
          .eq('id', user.id)
          .single();

        if (marketplaceData) {
          const session = {
            user: {
              id: user.id,
              email: user.email,
              user_metadata: {
                user_type: 'marketplace',
                company_name: marketplaceData.company_name,
                company_type: marketplaceData.company_type,
                iso_number: marketplaceData.iso_number,
                verification_status: marketplaceData.verification_status
              }
            }
          };
          return { user: session.user, error: null };
        }
      }

      return { user, error: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error };
    }
  }
};