import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase";

export const useUserInfoStore = defineStore("userInfo", () => {
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
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      console.error("Authentication failed:", authError);
      userInfo.value = null;
      return null;
    }

    const userId = authData.user.id;
    console.log("Fetching data for user ID:", userId);

    const { data, error } = await supabase
      .from("users")
      .select(
        "firstname, lastname, email, phone, complete_address, user_type, image_path"
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user info:", error);
      userInfo.value = null;
      return null;
    }

    if (!data) {
      console.warn("No user found for the given ID.");
      return null;
    }

    userInfo.value = data;
    return data;
  }

  function setProfileImage(newImagePath: string) {
    if (userInfo.value) {
      userInfo.value.image_path = newImagePath;
    }
  }

  return {
    userInfo,
    fetchUserInfo,
    setProfileImage,
  };
});
