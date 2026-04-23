import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProfileClient } from './components/ProfileClient';
import { createClient } from '@/lib/supabase/server'
import { getSavedProperties } from '@/lib/actions/saved'

export const metadata: Metadata = {
  title: 'My Profile | PropLanka',
  description: 'View your saved properties and manage your inquiries.',
};

export default async function ProfilePage() {
  const supabase = (await createClient()) as any
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user ?? null

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <ProfileClient />
        </main>
        <Footer />
      </div>
    )
  }

  const [saved, { data: inquiries }] = await Promise.all([
    getSavedProperties(user.id),
    supabase
      .from('inquiries')
      .select('id,property_id,name,email,phone,country,message,inquiry_type,status,admin_notes,created_at')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
  ])

  const mappedInquiries = (inquiries || []).map((iq: any) => ({
    id: iq.id,
    propertyId: iq.property_id,
    propertyTitle: '',
    propertySlug: '',
    type: iq.inquiry_type === 'site_visit' ? 'site_visit' : 'general',
    name: iq.name,
    email: iq.email,
    phone: iq.phone,
    country: iq.country,
    message: iq.message ?? '',
    status: iq.status,
    adminNotes: iq.admin_notes ?? undefined,
    createdAt: iq.created_at,
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ProfileClient initialSaved={saved} initialInquiries={mappedInquiries} />
      </main>
      <Footer />
    </div>
  )
}