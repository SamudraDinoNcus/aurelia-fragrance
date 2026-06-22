"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function confirmUser(userId: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
