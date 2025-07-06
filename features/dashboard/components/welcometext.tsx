import React from "react";
import { createClient } from "@/utils/supabase/server";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export default async function WelcomeText() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const welcomeText = `Welcome ${user?.user_metadata.full_name.split(" ")[0]} 👋`;

  return (
    <div>
      <div className="flex items-center">
        <TextGenerateEffect
          className="text-3xl font-bold text-gradient capitalize"
          words={welcomeText}
          duration={0}
        />
      </div>
      <TextGenerateEffect
        words="Even $50 spent consciously can build a mindset of wealth. Let's stay intentional"
        className="text-md font-medium text-muted-foreground mt-1 [animation-delay:1.2s]"
        filter={false}
        duration={2}
      />
    </div>
  );
}
