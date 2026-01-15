  import { NextRequest, NextResponse } from "next/server"

  export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const cookie = req.headers.get("cookie") ?? "";
    const url = new URL(formData.get("path") as string, req.url);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        cookie
      },
      body: formData,
    });   

    const data = await res.json().catch(() => null);

    return NextResponse.json({ data }, { status: res.status });
  } 
