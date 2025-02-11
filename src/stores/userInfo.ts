import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';

export const useUserInfoStore = defineStore('userInfo', () => {
  const userInfo = ref<{
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    complete_address: string;
    user_type: string;
    image_path: string;
  } | null>(null);

  async function fetchUserInfo() {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('No user ID found in localStorage');
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('firstname, lastname, email, phone, complete_address, user_type, image_path')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user info:', error);
      userInfo.value = null;
      return null;
    }

    userInfo.value = data;
   /*  console.log('Fetched user info:', data); */
    return data;
  }

  return {
    userInfo,
    fetchUserInfo,
  };
});
