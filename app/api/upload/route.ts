import { NextRequest, NextResponse } from "next/server";
import { put } from '@vercel/blob'
import { createClient } from "@supabase/supabase-js";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  let total = 0;
  let buffer = undefined;
  const blobs = [];
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
  const { data } = await supabase.auth.getUser();
  for (const [key, value] of formData.entries()) {
          if (key.includes("image")) {
              if (value instanceof File) {
                  total += 1;
                  const file = value as File;
                  
                  buffer = Buffer.from(await file.arrayBuffer());
                  const extension =  "." + formData.get("format");
                  const safeName = "IMG_" + Date.now() + extension;
                  const { url } = await put('images/' + data?.user?.id + "/" + safeName, buffer, {
                      access: 'public',
                      contentType: file.type
                      })
                  blobs.push(url);
              }
          }
  }
  let length;

  if (buffer === undefined) {
      length = 0;
  } else {
      length = buffer.length
  }
  return NextResponse.json({
      success: true,
      size: length,
      blobs: blobs
  });
}

