import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const inquirySchema = z.object({
  property_id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  inquiry_type: z.enum(['general', 'site_visit', 'document_request']).optional().default('general'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = inquirySchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const supabase = (await createClient()) as any

    // attach user if present
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id ?? null

    const insert = {
      property_id: parsed.data.property_id,
      user_id: userId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      country: parsed.data.country ?? null,
      message: parsed.data.message ?? null,
      inquiry_type: parsed.data.inquiry_type ?? 'general',
      status: 'new',
    }

  const { data, error } = await supabase.from('inquiries').insert([insert] as any).select('id').limit(1)

    if (error) {
      // DB trigger may raise a custom error for rate limits
      const msg = String(error.message ?? '')
      if (msg.toLowerCase().includes('too_many_requests') || (error.code && String(error.code).toLowerCase().includes('too_many_requests'))) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
      }

      return NextResponse.json({ error: error.message ?? 'Insert failed' }, { status: 500 })
    }

    return NextResponse.json({ data: data?.[0] ?? null }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
