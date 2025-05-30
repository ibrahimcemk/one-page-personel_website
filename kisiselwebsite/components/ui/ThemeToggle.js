'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde mevcut tema durumunu kontrol et
    if (typeof window !== 'undefined') {
      // LocalStorage'dan tema tercihini al
      const savedTheme = localStorage.getItem('theme');
      // Sistem tercihini kontrol et
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // Dark mode'u belirle (localStorage'da varsa ona göre, yoksa sistem tercihine göre)
      const darkModeEnabled = savedTheme === 'dark' || (!savedTheme && prefersDark);
      
      setIsDarkMode(darkModeEnabled);
      
      // Dark mode'u ayarla
      if (darkModeEnabled) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.style.backgroundColor = '#2F2E2E';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.style.backgroundColor = '#ffffff';
      }
      
      // Dark mode değişimini takip et
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleDarkModeChange = (e) => {
        // Eğer localStorage'da tema tercihi yoksa, sistem tercihini uygula
        if (!localStorage.getItem('theme')) {
          const newDarkMode = e.matches;
          setIsDarkMode(newDarkMode);
          
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.style.backgroundColor = '#2F2E2E';
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.style.backgroundColor = '#ffffff';
          }
        }
      };
      
      darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
      
      return () => {
        darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
      };
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Dark mode class'ını güncelle
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#2F2E2E';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.style.backgroundColor = '#ffffff';
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="flex items-center dark-mode-toggle">
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isDarkMode}
          onChange={toggleTheme}
        />
        <div 
          className="w-11 h-6 rounded-full peer toggle-slider relative"
          style={{ backgroundColor: isDarkMode ? '#000000' : 'var(--slider-bg)' }}
        >
          <span className="absolute text-white text-xs top-1.5 left-2 toggle-emoji">
            {isDarkMode ? '☀️' : '🌙'}
          </span>
        </div>
      </label>
    </div>
  );
}
