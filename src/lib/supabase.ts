import { createClient } from "@supabase/supabase-js";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const toast = useToast();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function doLogout() {
  // SweetAlert2 Confirmation
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Logout",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  // If user cancels, stop here
  if (!result.isConfirmed) return;

  // Supabase Logout
  await supabase.auth.signOut();

  // Toast Notification for Success
  toast.success("Logged out successfully.");

  // Clear Local Storage
  localStorage.clear();

  // Redirect to Login Page
  window.location.href = "/";
}
