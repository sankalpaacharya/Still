"use server";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export const signInWithGoogle = async () => {
  const local = "http://localhost:3000/auth/callback";
  const production = "https://fixyourspend.vercel.app/auth/callback";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        process.env.ENVIRONMENT === "development" ? local : production,
    },
  });
  if (error) {
    console.log(error);
  }
  if (data.url) {
    redirect(data.url);
  }
};
