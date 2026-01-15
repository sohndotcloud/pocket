import { del } from "@vercel/blob";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const filename = formData.get("url")?.toString();

  if (!filename) {
    return NextResponse.json({ error: "No file specified" }, { status: 400 });
  }

  const token = req.cookies.get("sb-access-token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  await del(filename);

  return NextResponse.json({
    message: `Deleted ${filename} for user ${user.id}`,
  }, { status: 200 });
}
