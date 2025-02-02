import { ref, onMounted } from 'vue';

export function useUserInfo() {
  const userEmail = ref('Guest');
  const userId = localStorage.getItem('user_id');

  onMounted(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/users');
      const users: Array<{ id: number; email: string }> = await response.json();

      const user = users.find((user) => user.id === Number(userId));

      if (user) {
        userEmail.value = user.email || 'Guest';
      }
    } catch (error) {
      console.error('Error fetching user email:', error);
    }
  });

  return {
    userEmail,
  };
} 