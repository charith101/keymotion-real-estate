import { NextResponse } from 'next/server'
import { uploadPropertyImage } from '@/lib/actions/images'

export async function POST(req: Request, context: any) {
  try {
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params
    const id = params?.id

    // parse multipart form data
    const form = await req.formData()
    const files = form.getAll('files') as File[]
    const alt = (form.get('alt') as string) || null
    const cover = form.get('isCover') === 'true' || false

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files' }, { status: 400 })
    }

    const results: any[] = []

    for (const file of files) {
      // call upload action which returns { data: { id, storage_path } } or { error }
      // Note: file is a File/Blob which supabase client can accept
      const res = await uploadPropertyImage(id, file, alt, cover)
      if (res.error) {
        return NextResponse.json({ error: res.error }, { status: 400 })
      }
      results.push(res.data)
    }

    return NextResponse.json({ data: results }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
