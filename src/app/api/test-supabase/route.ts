import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  try {
    const res = await fetch(`${url}/rest/v1/juegos?select=id&limit=1`, {
      headers: {
        apikey: key as string,
        Authorization: `Bearer ${key}`,
      },
    })

    const text = await res.text()

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      url,
      anonLength: key?.length,
      body: text,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        stage: 'direct-fetch-failed',
        message: err?.message || String(err),
        stack: err?.stack,
        url,
        anonLength: key?.length,
      },
      { status: 500 },
    )
  }
}
