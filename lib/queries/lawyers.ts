import { createClient } from '../supabase/server'
import type { Lawyer } from '../../types/property'

export async function getLawyers(): Promise<Lawyer[]> {
  try {
    const supabase = (await createClient()) as any
    const { data, error } = await supabase
      .from('lawyers')
      .select('id,full_name,firm_name,phone,email,address,notes,active')
      .eq('active', true)
      .order('full_name', { ascending: true })

    if (error || !data) return []
    return data as Lawyer[]
  } catch (err) {
    return []
  }
}

export default { getLawyers }
