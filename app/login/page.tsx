import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoginForm } from './components/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Key Motion Real Estate account to save properties and manage your inquiries.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          
          <div className="mt-8">
            <LoginForm />
          </div>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </main>
      <div className="p-8">
      </div>
      <Footer />
    </div>
  );
}
