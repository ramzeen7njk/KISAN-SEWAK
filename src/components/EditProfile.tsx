import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../config/supabase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const profileSchema = z.object({
  mobile: z.string().length(10, 'Mobile number must be 10 digits'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  profileImage: z.instanceof(File).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const EditProfile: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const { user, loading, error } = useUser();

  useEffect(() => {
    if (loading) {
      console.log('User data is still loading...');
      return;
    }

    if (error) {
      console.error('Error retrieving user:', error);
      return;
    }

    if (!user) {
      console.error('User is not defined');
      return;
    }

    console.log('User ID:', user.id);

    const fetchProfileImage = async () => {
      const { data, error } = await supabase
        .from('farmers')
        .select('profile_image_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile image:', error);
      } else if (data) {
        setProfileImageUrl(data.profile_image_url);
      }
    };

    fetchProfileImage();
  }, [user, loading, error]);

  const onSubmit = async (data: ProfileForm) => {
    try {
      setIsLoading(true);

      // Update profile in Supabase
      const updates: any = {
        mobile: data.mobile,
        age: data.age,
      };

      if (data.profileImage) {
        // Upload profile image to Supabase storage
        const file = data.profileImage;
        const { data: imageData, error: imageError } = await supabase.storage
          .from('profile-images')
          .upload(`public/${Date.now()}_${file.name}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (imageError) throw imageError;

        const publicUrl = supabase.storage.from('profile-images').getPublicUrl(imageData.path).data.publicUrl;
        updates.profile_image_url = publicUrl;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase
        .from('farmers')
        .update(updates)
        .eq('id', userData?.user?.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      navigate('/farmer/dashboard');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        console.log('Uploading file:', file.name);
        console.log('File type:', file.type);
        console.log('File size:', file.size);

        // Upload profile image to Supabase storage
        const { data: imageData, error: imageError } = await supabase.storage
          .from('profile_images')
          .upload(`public/${Date.now()}_${file.name}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (imageError) {
          console.error('Image upload error:', imageError);
          throw imageError;
        }

        console.log('Image uploaded, path:', imageData.path);
        const publicUrl = supabase.storage.from('profile_images').getPublicUrl(imageData.path).data.publicUrl;

        console.log('Updating profile with image URL:', publicUrl);

        // Ensure user is defined before proceeding
        if (!user) {
          console.error('User is not defined');
          return;
        }

        // Update the profile image URL in the database
        const { error: updateError } = await supabase
          .from('farmers')
          .update({ profile_image_url: publicUrl })
          .eq('id', user.id);

        if (updateError) {
          console.error('Profile update error:', updateError);
          throw updateError;
        }

        // Update the profile image URL in the state
        setProfileImageUrl(publicUrl);
        toast.success('Profile image updated successfully!');
      } catch (error: any) {
        console.error('Error updating profile image:', error);
        toast.error('Failed to update profile image. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              {...register('mobile')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your 10-digit mobile number"
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              {...register('age', { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <input
              type="file"
              {...register('profileImage')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 