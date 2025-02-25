import { computed, ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";
import { useToast } from "vue-toastification";

const toast = useToast();

function customHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `HashPassword${hash.toString()}`;
}

interface UserData {
  id?: string;
  email?: string;
  user_type?: string;
  created_at?: string;
}

interface SessionUser {
  id: string;
  email?: string;
  user_metadata: Record<string, any>;
}

export const useAuthUserStore = defineStore("authUser", () => {
  const userData: Ref<UserData | null> = ref(null);
  const authPages: Ref<string[]> = ref([]);
  const authBranchIds: Ref<number[]> = ref([]);
  const router = useRouter();

  const userRole = computed(() =>
    userData.value?.user_type === "admin" ? "Admin" : "Teacher"
  );

  async function registerUser(
    email: string,
    password: string,
    userType: string
  ) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: { data: { user_type: userType } },
      }
    );

    if (signUpError) {
      return { error: signUpError };
    }

    if (!signUpData.user) {
      return { error: "Signup failed" };
    }

    const userId = signUpData.user.id;

    const hashedPassword = customHash(password);

    const { error: insertError } = await supabase.from("users").insert([
      {
        user_type: userType,
        email: email,
        password: hashedPassword,
        user_id: userId,
      },
    ]);

    if (insertError) {
      return { error: insertError };
    }

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      return { error: signInError };
    }

    if (!signInData.session) {
      return { error: "No session" };
    }

    const user = signInData.user;
    localStorage.setItem("access_token", signInData.session.access_token);
    localStorage.setItem("refresh_token", signInData.session.refresh_token);
    localStorage.setItem("auth_id", user.id);

    const { data: profiles, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      return { error: profileError };
    }

    localStorage.setItem("user_id", profiles.id);
    localStorage.setItem("Role", profiles.user_type);

    userData.value = {
      id: user.id,
      email: user.email,
      user_type: profiles.user_type,
    };

    // Redirect to /welcome
    router.push("/welcome");

    return { data: { id: userId, email, user_type: userType } };
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    if (!data.session) {
      return { error: "No session" };
    }

    const user = data.user;
    localStorage.setItem("access_token", data.session.access_token);
    localStorage.setItem("refresh_token", data.session.refresh_token);
    localStorage.setItem("auth_id", user.id);

    const { data: profiles, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      return { error: profileError };
    }

    localStorage.setItem("user_id", profiles.id);
    localStorage.setItem("Role", profiles.user_type);

    userData.value = {
      id: user.id,
      email: user.email,
      user_type: profiles.user_type,
    };

    return { user };
  }

  return {
    userData,
    userRole,
    authPages,
    authBranchIds,
    registerUser,
    signIn,
  };
});
