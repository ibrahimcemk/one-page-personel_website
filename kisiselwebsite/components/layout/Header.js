'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Burada gerçek karanlık mod değişimini etkinleştirebilirsiniz
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed w-full z-30 dark:bg-[#2F2E2E]">
      {/* 12 kolonlu grid container */}
      <div className="max-w-[1335px] mx-auto grid grid-cols-12 gap-x-[15px] px-[15px]">
        {/* Navbar 2-12 kolonlar arası (ortalanıyor) */}
        <div className="col-span-10 col-start-2 col-end-12 bg-white dark:bg-black rounded-full shadow-md my-4 px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative h-10 w-20">
                <Image
                  src="/images/minilogo-01.png"
                  alt="Logo"
                  fill
                  sizes="(max-width: 768px) 64px, 80px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              id="mobile-menu-button"
              onClick={toggleMobileMenu}
              className="md:hidden ml-2 p-2 text-gray-700 dark:text-white focus:outline-none"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
            </button>
            
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {/* Hesap Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className={`flex items-center text-sm font-medium ${pathname.startsWith('/auth') ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'} hover:text-blue-600`}
                >
                  <span>Hesap</span>
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {accountDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      {status === 'authenticated' ? (
                        // Kullanıcı giriş yapmışsa
                        <>
                          <div className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                            Merhaba, {session.user.name}
                          </div>
                          {session.user.role === 'admin' && (
                            <Link 
                              href="/admin/dashboard"
                              className="flex items-center text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 dark:hover:bg-gray-700"
                              role="menuitem"
                            >
                              Admin Paneli
                            </Link>
                          )}
                          <Link 
                            href="/profile"
                            className="flex items-center text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 dark:hover:bg-gray-700"
                            role="menuitem"
                          >
                            Profilim
                          </Link>
                          <div 
                            onClick={() => signOut()}
                            className="flex items-center text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 cursor-pointer"
                            role="menuitem"
                          >
                            Çıkış Yap
                          </div>
                        </>
                      ) : (
                        // Kullanıcı giriş yapmamışsa
                        <>
                          <Link 
                            href="/auth/login"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:text-blue-600 dark:hover:bg-gray-700"
                            role="menuitem"
                          >
                            Giriş Yap
                          </Link>
                          <Link 
                            href="/auth/register"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:text-blue-600 dark:hover:bg-gray-700"
                            role="menuitem"
                          >
                            Kayıt Ol
                          </Link>
                          <Link 
                            href="/auth/forgot-password"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:text-blue-600 dark:hover:bg-gray-700"
                            role="menuitem"
                          >
                            Şifremi Unuttum
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Link 
                href="/#hakkimda" 
                className={`text-sm font-medium ${pathname === '/#hakkimda' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
              >
                Hakkımda
              </Link>
              <Link 
                href="/#projelerim" 
                className={`text-sm font-medium ${pathname === '/#projelerim' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
              >
                Projelerim
              </Link>
              <Link 
                href="/#hizmetlerim" 
                className={`text-sm font-medium ${pathname === '/#hizmetlerim' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
              >
                Hizmetlerim
              </Link>
              <Link 
                href="/#referanslar" 
                className={`text-sm font-medium ${pathname === '/#referanslar' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
              >
                Referanslar
              </Link>
              <Link 
                href="/#sikca-sorulan-sorular" 
                className={`text-sm font-medium ${pathname === '/#sikca-sorulan-sorular' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
              >
                Sıkça Sorulan Sorular
              </Link>
              <Link 
                href="/#iletisim" 
                className={`text-sm font-medium ${pathname === '/#iletisim' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
              >
                İletişim
              </Link>
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className="col-span-12">
        <div 
          id="mobile-menu"
          className={`md:hidden absolute w-full transition-all duration-300 ease-in-out transform ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
        >
          <div className="bg-white dark:bg-black shadow-lg mx-4 mt-2 rounded-xl p-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/#hakkimda" 
                className={`text-sm font-medium ${pathname === '/#hakkimda' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Hakkımda
              </Link>
              <Link 
                href="/#projelerim" 
                className={`text-sm font-medium ${pathname === '/#projelerim' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Projelerim
              </Link>
              <Link 
                href="/#hizmetlerim" 
                className={`text-sm font-medium ${pathname === '/#hizmetlerim' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Hizmetlerim
              </Link>
              <Link 
                href="/#referanslar" 
                className={`text-sm font-medium ${pathname === '/#referanslar' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Referanslar
              </Link>
              <Link 
                href="/#sikca-sorulan-sorular" 
                className={`text-sm font-medium ${pathname === '/#sikca-sorulan-sorular' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sıkça Sorulan Sorular
              </Link>
              <Link 
                href="/#iletisim" 
                className={`text-sm font-medium ${pathname === '/#iletisim' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                İletişim
              </Link>
              
              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm mr-3 text-gray-700 dark:text-white">Karanlık Mod</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
