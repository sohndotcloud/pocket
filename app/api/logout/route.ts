import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.cookies.get("sb-access-token")?.value;

  if (authHeader === undefined) {
    return NextResponse.json(authHeader, { status: 401 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${authHeader}`,
        },
      },
    }
  )

  await supabase.auth.admin.signOut((await supabase.auth.getUser()).data.user!.id)
  const res = NextResponse.redirect(new URL("/login", req.url), 302);

  return res;
}
