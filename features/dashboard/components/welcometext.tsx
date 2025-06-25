import React from "react";
import { createClient } from "@/utils/supabase/server";

type Props = {};

export default async function WelcomeText({}: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div>
      <div className="flex items-center">
        <h2 className="text-3xl font-bold text-gradient capitalize">
          Welcome {user?.user_metadata.full_name.split(" ")[0]}
        </h2>
        <span className="text-3xl">👋</span>
      </div>{" "}
      <p className="mt-1 text-muted-foreground">
        Track your spending, build habits, save money
      </p>
    </div>
  );
}
