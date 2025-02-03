import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

// Define types for user data and session
interface UserMetadata {
  [key: string]: any; // Adjust this according to the actual structure
}

interface UserData {
  id: string | undefined;
  email: string | undefined;
  password_hash?: string | undefined; // Optional if not used directly
  user_type?: string | undefined; // Make user_type optional
  created_at?: string | undefined; // Optional if not used directly
  [key: string]: any; // For additional properties
}

interface SessionUser {
  id: string;
  email?: string;
  user_metadata: UserMetadata;
}

interface SessionData {
  session: {
    user: SessionUser;
  } | null;
}

export const useAuthUserStore = defineStore('authUser', () => {
  // States
  const userData: Ref<UserData | null> = ref(null)
  const authPages: Ref<string[]> = ref([])
  const authBranchIds: Ref<number[]> = ref([])
  const toast = useToast();
  const router = useRouter();

  // Getters
  const userRole = computed(() => {
    return userData.value?.user_type === 'admin' ? 'Admin' : 'Teacher'
  })

  // Reset State Action
  function $reset() {
    userData.value = null
    authPages.value = []
    authBranchIds.value = []
  }

  // Actions
  async function getUserInformation(): Promise<void> {
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error fetching user information:', response.statusText);
        return;
      }

      const data = await response.json();
      userData.value = data;
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  }

  async function getAuthBranchIds(): Promise<void> {
    // Implement your own logic to get authorized branch IDs
  }

  async function updateUserInformation(updatedData: Partial<UserData>): Promise<{ data?: UserData; error?: any }> {
    // Implement your own logic to update user information
    return {}
  }

  async function updateUserImage(file: File): Promise<{ error?: any }> {
    if (!userData.value) return { error: 'User data is not available' }

    // Implement your own logic to update user image
    return {}
  }

  async function registerUser(email: string, password: string, userType: string): Promise<{ data?: UserData; error?: any }> {
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          user_type: userType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error during sign up:', errorData.message);
        return { error: errorData };
      }

      const data = await response.json();
      const { id, email: userEmail, user_type } = data;
      userData.value = { id, email: userEmail, user_type };

      return { data: userData.value };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error };
    }
  }

  async function signIn(email: string, password: string): Promise<{ user?: SessionUser; error?: any }> {
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error during sign in:', errorData.message);
        return { error: errorData };
      }

      const data = await response.json();
      const { access_token, user_type, id } = data;

      // Store the access token in local storage or a state management solution
      localStorage.setItem('access_token', access_token);
      console.log(access_token);
      localStorage.setItem('user_type', user_type);
      console.log(user_type);
      localStorage.setItem('user_id', id);
      console.log(id);
      // Update userData with id and user_type
      userData.value = { id, email, user_type };

      router.push('/home');

      return { user: { id, email, user_metadata: {} } }; // Adjust as needed
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error };
    }
  }

  const isAuthenticated = async (): Promise<boolean> => {
    // Implement your own logic to check if the user is authenticated
    return false
  }

  return {
    userData,
    userRole,
    authPages,
    authBranchIds,
    $reset,
    isAuthenticated,
    getUserInformation,
    getAuthBranchIds,
    updateUserInformation,
    updateUserImage,
    registerUser,
    signIn,
  }
})
