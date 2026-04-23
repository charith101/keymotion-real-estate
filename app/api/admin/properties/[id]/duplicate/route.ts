import { NextResponse } from 'next/server'
import { duplicateProperty } from '@/lib/actions/properties'

export async function POST(req: Request, context: any) {
  try {
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params
    const id = params?.id
    const res = await duplicateProperty(id)
    if (res.error) return NextResponse.json({ error: res.error }, { status: 400 })
    return NextResponse.json({ data: res.data ?? null }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
