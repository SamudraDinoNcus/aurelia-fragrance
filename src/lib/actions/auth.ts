"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function createUser(email: string, password: string, fullName: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, userId: data.user?.id };
}
