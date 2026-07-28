import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AdminSession = {
  id: string;
  email: string | null;
};

export async function isSoleAdmin(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 2,
  });

  if (error) {
    throw new Error("Unable to verify the site administrator.", {
      cause: error,
    });
  }

  return data.users.length === 1 && data.users[0]?.id === userId;
}

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims.sub) {
    return null;
  }

  if (!(await isSoleAdmin(data.claims.sub))) {
    return null;
  }

  return {
    id: data.claims.sub,
    email:
      typeof data.claims.email === "string" ? data.claims.email : null,
  };
});

export async function requireAdmin() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
