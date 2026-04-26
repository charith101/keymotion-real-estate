import { NextResponse } from 'next/server'
import { getLawyers } from '@/lib/queries/lawyers'

export async function GET() {
  try {
    const data = await getLawyers()
    return NextResponse.json({ data })
  } catch (e) {
    return NextResponse.json({ data: [] }, { status: 500 })
  }
}