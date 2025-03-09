'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, Home, MessageSquare, User, LogIn, LogOut, Crown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      name: 'হোম',
      href: '/',
      icon: <Home className="h-5 w-5 mr-2" />,
    },
    {
      name: 'চ্যাট',
      href: '/chat',
      icon: <MessageSquare className="h-5 w-5 mr-2" />,
    },
    {
      name: 'প্রিমিয়াম',
      href: '/premium',
      icon: <Crown className="h-5 w-5 mr-2" />,
    },
    ...(session
      ? [
          {
            name: 'প্রোফাইল',
            href: '/profile',
            icon: <User className="h-5 w-5 mr-2" />,
          },
        ]
      : []),
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold bangla-text bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">উইজার এআই</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bangla-text transition-colors duration-200',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent/10 hover:text-accent-foreground'
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {session.user?.name?.[0] || session.user?.email?.[0] || 'ই'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bangla-text">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">প্রোফাইল</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/premium">প্রিমিয়াম</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                      event.preventDefault();
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    লগ আউট
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn()} size="sm" className="bangla-text">
                <LogIn className="h-4 w-4 mr-2" />
                লগ ইন
              </Button>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent/10 hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bangla-text">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-3 py-2 text-base font-medium flex items-center',
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent/10 hover:text-accent-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            {session ? (
              <button
                className="w-full text-left block px-3 py-2 text-base font-medium text-foreground hover:bg-accent/10 hover:text-accent-foreground flex items-center"
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                লগ আউট
              </button>
            ) : (
              <button
                className="w-full text-left block px-3 py-2 text-base font-medium text-foreground hover:bg-accent/10 hover:text-accent-foreground flex items-center"
                onClick={() => {
                  signIn();
                  setMobileMenuOpen(false);
                }}
              >
                <LogIn className="h-5 w-5 mr-2" />
                লগ ইন
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 