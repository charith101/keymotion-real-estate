import { NextResponse } from 'next/server'
import { deleteProperty } from '@/lib/actions/properties'

export async function DELETE(req: Request, context: any) {
  try {
    // context.params may be a Promise in some Runtime typings — normalize it
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params
    const id = params?.id
    const res = await deleteProperty(id)
    if (res.error) return NextResponse.json({ error: res.error }, { status: 400 })
    return NextResponse.json({ data: null }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
