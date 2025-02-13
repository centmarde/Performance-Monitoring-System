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
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      console.error("No user ID found in localStorage");
      return null;
    }

    console.log("Fetching user info for user ID:", userId);

    // Debugging: Check if the userId actually exists in Supabase
    const { data: debugData, error: debugError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId);

    console.log("Debug user query result:", debugData, debugError);

    const { data, error } = await supabase
      .from("users")
      .select(
        "firstname, lastname, email, phone, complete_address, user_type, image_path"
      )
      .eq("id", userId)
      .maybeSingle(); // Avoids hard failure

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
