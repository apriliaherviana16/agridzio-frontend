"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * Primary navigation bar
 *
 * Displays a logo and a set of navigation links. On medium screens and up the
 * links are shown inline. On smaller screens they collapse into a hamburger
 * menu. The “إضافة إعلان” button is styled to stand out using the accent
 * colour. When the user is authenticated a link to the profile replaces the
 * login/register links.
 */
export default function NavBar() {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);

  /**
   * Defines the navigation items with labels and destinations. This allows us
   * to reuse the same list for both desktop and mobile menus. For the Add
   * Advertisement action we mark it as a primary call‑to‑action (cta) to apply
   * different styling.
   */
  const navItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/ads/new', label: 'إضافة إعلان', cta: true },
    { href: '/favorites', label: 'المفضلة' },
  ];

  const authItems = session
    ? [ { href: '/profile', label: 'حسابي' } ]
    : [ { href: '/login', label: 'تسجيل الدخول' }, { href: '/register', label: 'إنشاء حساب' } ];

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-wide">AGRIDZIO</Link>
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:underline ${item.cta ? 'bg-accent text-primary-dark px-3 py-1.5 rounded-full font-semibold hover:bg-accent-dark' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          {authItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>
        {/* Mobile toggle button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {/* Mobile menu */}
      <div className={`${open ? 'block' : 'hidden'} md:hidden bg-primary-dark text-white px-4 pb-4`}> 
        <div className="flex flex-col gap-3">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block py-2 ${item.cta ? 'bg-accent text-primary-dark rounded-full px-3 font-semibold' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          {authItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}