import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({email, password});
  if (error || !data.user) {
    return NextResponse.json(
      { error: "Invalid/expired token", details: error?.message },
      { status: 401 }
    );
  }

  const response = await supabase.auth.getUser();
  const result = await list({ prefix: `images/${response.data.user!.id}` });
  const listUrl = result.blobs.map(b => b.downloadUrl);
  return NextResponse.json(listUrl);
}
