import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  await supabase.auth.signOut({ scope: "global" });

  if (error) {
    throw new Error(error.message)
  }

  return new Response(null, { status: 302, headers: {
    Location: '/login',
  }});
}
