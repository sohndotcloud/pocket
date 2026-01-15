import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const authHeader = req.cookies.get("sb-access-token")?.value
  if (authHeader === undefined) {
    return NextResponse.json("Not logged in", { status: 401 });
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


  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return NextResponse.json(
      { error: "Invalid/expired token", details: error?.message },
      { status: 401 }
    );
  }
  const result = await list({ prefix: `images/${data.user.id}` });
  const listUrl = result.blobs.map(b => b.downloadUrl);
  return NextResponse.json(listUrl);
}
