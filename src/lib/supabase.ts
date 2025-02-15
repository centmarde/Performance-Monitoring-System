import { createClient } from "@supabase/supabase-js";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import "@/assets/logout.css";
const toast = useToast();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function doLogout() {
  try {
    const result = await Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to log out? You will need to log in again to continue.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff4d4d",
      cancelButtonColor: "#6c757d",
      reverseButtons: true,
      allowOutsideClick: false,
      background: "rgba(255, 255, 255, 0.1)",
      color: "#fff",
      backdrop: "rgba(0, 0, 0, 0.6)",
      customClass: {
        popup: "glass-popup",
        title: "glass-title",
        confirmButton: "glass-confirm-btn",
        cancelButton: "glass-cancel-btn",
      },
    });

    // If user cancels, exit function
    if (!result.isConfirmed) return;

    // Perform logout with Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    // Show success toast
    toast.success("You have successfully logged out.", { timeout: 3000 });

    // Clear local storage and redirect to login page after a short delay
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/";
    }, 1500);
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Logout failed. Please try again.");
  }
}
