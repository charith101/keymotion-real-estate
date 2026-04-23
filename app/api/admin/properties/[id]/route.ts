import { NextResponse } from 'next/server'
import { updateProperty } from '@/lib/actions/properties'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request, context: any) {
  try {
    const supabase = (await createClient()) as any
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params
    const { id } = params

    const { data, error } = await supabase
      .from('properties')
      .select(`id,slug,title,description,property_type,listing_type,status,price_lkr,price_period,land_area_perches,land_area_acres,floor_area_sqft,bedrooms,bathrooms,district,city,address,latitude,longitude,featured,lawyer_id,created_at,updated_at`)
      .eq('id', id)
      .limit(1)

    if (error || !data || data.length === 0) return NextResponse.json({ error: error?.message ?? 'Not found' }, { status: 404 })

    // fetch facts & attractions
    const factsRes = await supabase.from('property_facts').select('id,label,value,icon,display_order').eq('property_id', id).order('display_order', { ascending: true })
    const atRes = await supabase.from('nearby_attractions').select('id,name,category,distance_km,display_order').eq('property_id', id).order('display_order', { ascending: true })

    const payload = {
      property: data[0],
      facts: factsRes.data ?? [],
      attractions: atRes.data ?? [],
    }

    return NextResponse.json({ data: payload }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, context: any) {
  try {
    const body = await req.json()
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params
    const { id } = params

    const res = await updateProperty(id, body)
    if (res.error) return NextResponse.json({ error: res.error }, { status: 400 })
    return NextResponse.json({ data: null }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
