import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RegisterForm } from './components/RegisterForm';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a Key Motion Real Estate account to save properties and manage your inquiries.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
            <p className="mt-2 text-muted-foreground">
              Join Key Motion to save properties and more
            </p>
          </div>
          
          <div className="mt-8">
            <RegisterForm />
          </div>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
