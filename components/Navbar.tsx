"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Heart, User, LogOut, LayoutDashboard, Settings, ChevronRight, Home, Info, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger,} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle,SheetDescription } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth-context';
import { ModeToggle } from './ModeToggle';


const navLinks = [
  { href: "/properties", label: "Properties", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="w-full flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logokey.svg"
            alt="Key Motion Real Estate"
            width={140}
            height={40}
            className="h-10 w-auto  rounded p-0.5"
            priority
          />
          <span className="text-xl font-semibold tracking-tight">Key Motion Real Estate</span>
        </Link>

        {/* Desktop Navigation */}
        <div className='-ml-20'>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-md font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              {/* <Link href="/profile">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {user && user.savedProperties.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {user.savedProperties.length}
                    </span>
                  )}
                  <span className="sr-only">Saved properties</span>
                </Button>
              </Link> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/auth/logout')} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                  <DropdownMenuItem className='w-full'>
                    <ModeToggle/>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full border-l-0 bg-background p-0 sm:max-w-md"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu with links and user options
          </SheetDescription>

          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-border/40 px-6 py-5">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logokey.svg"
                  alt="Key Motion Real Estate"
                  width={120}
                  height={36}
                  className="h-9 w-auto  rounded p-0.5"
                />
                <span className="text-lg font-semibold tracking-tight">Key Motion Real Estate</span>
              </div>
            </div>

            {/* User Profile Section */}
            {isAuthenticated && user && (
              <div className="border-b border-border/40 px-6 py-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-base font-medium">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 px-3 py-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-foreground transition-all hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                        <span>{link.label}</span>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </div>

              {isAuthenticated && (
                <>
                  <div className="my-4 h-px bg-border/40" />
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-all hover:bg-accent"
                    >
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span>My Profile</span>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-all hover:bg-accent"
                      >
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <span>Admin Dashboard</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    )}
                    <div className="my-4 h-px bg-border/40" />
                    <ModeToggle />
                  </div>
                </>
              )}
            </nav>

            {/* Footer Actions */}
            <div className="mt-auto border-t border-border/40 p-6">
              {isAuthenticated ? (
                <Button
                  onClick={() => router.push('/auth/logout')}
                  variant="outline"
                  className="w-full justify-center gap-2 rounded-lg py-5 text-base font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block">
                  <Button className="w-full rounded-lg py-5 text-base font-medium">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      </div>
    </header>
  );
}
