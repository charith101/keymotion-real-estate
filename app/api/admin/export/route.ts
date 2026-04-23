import { createClient } from '@/lib/supabase/server'
import XLSX from 'xlsx'

async function isAdmin(supabaseClient: any): Promise<boolean> {
  try {
    const { data } = await supabaseClient.auth.getSession()
    const session = data?.session
    const token = session?.access_token
    if (!token) return false

    const parts = token.split('.')
    if (parts.length < 2) return false
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'))
    return payload?.user_role === 'admin'
  } catch {
    return false
  }
}

export async function GET(req: Request) {
  try {
    // verify admin from session JWT
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    // create admin client (service role) to bypass RLS
    const { createClient: createAdminClientFactory } = await import('@supabase/supabase-js')
    const admin = createAdminClientFactory(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    ) as any

    // fetch all properties (admin context — include all statuses)
    const { data: properties, error: propErr } = await admin
      .from('properties')
      .select(
        'id,slug,title,property_type,listing_type,status,price_lkr,price_period,district,city,bedrooms,bathrooms,land_area_perches,land_area_acres,floor_area_sqft,featured,views_count,created_at,lawyer_id'
      )
      .order('created_at', { ascending: false })

    if (propErr) {
      return new Response(JSON.stringify({ error: propErr.message ?? 'Failed to fetch properties' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }

    const rows: any[] = []

    // headers (Title Case)
    const headers = [
      'ID',
      'Slug',
      'Title',
      'Property Type',
      'Listing Type',
      'Status',
      'Price LKR',
      'Price Period',
      'District',
      'City',
      'Bedrooms',
      'Bathrooms',
      'Land Area Perches',
      'Land Area Acres',
      'Floor Area Sqft',
      'Featured',
      'Views Count',
      'Created At',
      'Lawyer',
    ]

    rows.push(headers)

    // fetch lawyer names for mapping (if any)
    const lawyerIds = Array.from(new Set((properties || []).map((p: any) => p.lawyer_id).filter(Boolean)))
    let lawyerMap: Record<string, string> = {}
    if (lawyerIds.length > 0) {
      const { data: lawyers } = await admin.from('lawyers').select('id,full_name').in('id', lawyerIds)
      if (lawyers && Array.isArray(lawyers)) {
        for (const l of lawyers) lawyerMap[l.id] = l.full_name
      }
    }

    for (const p of properties || []) {
      const created = p.created_at ? new Date(p.created_at).toISOString().slice(0, 10) : ''
      rows.push([
        p.id,
        p.slug,
        p.title,
        p.property_type,
        p.listing_type,
        p.status,
        // price as number
        typeof p.price_lkr === 'number' ? p.price_lkr : Number(p.price_lkr ?? 0),
        p.price_period ?? '',
        p.district ?? '',
        p.city ?? '',
        p.bedrooms ?? null,
        p.bathrooms ?? null,
        p.land_area_perches ?? null,
        p.land_area_acres ?? null,
        p.floor_area_sqft ?? null,
        p.featured ? true : false,
        // views_count may be numeric or string (bigint), coerce to number when possible
        typeof p.views_count === 'number' ? p.views_count : Number(p.views_count ?? 0),
        created,
        lawyerMap[p.lawyer_id] ?? '',
      ])
    }

    // build workbook and sheet
    const worksheet = XLSX.utils.aoa_to_sheet(rows)
    // ensure date column is stored as text in YYYY-MM-DD (spec requirement)
    // we already formatted created_at as string YYYY-MM-DD
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Properties')

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

    const date = new Date().toISOString().slice(0, 10)
    const filename = `properties-export-${date}.xlsx`

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

