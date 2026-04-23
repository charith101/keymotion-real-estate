import { NextResponse } from 'next/server'
import { createProperty } from '@/lib/actions/properties'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await createProperty(body)

    if (res.error) {
      return NextResponse.json({ error: res.error }, { status: 400 })
    }

    return NextResponse.json({ data: res.data ?? null }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
