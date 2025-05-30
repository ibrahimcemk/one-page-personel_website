'use client';

import { useEffect } from 'react';

// Dark mode işlevselliği
function setupDarkMode() {
  if (typeof window !== 'undefined') {
    // Dark mode durumunu kontrol et
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let isDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark);

    // Sayfa yüklendiğinde dark mode'u ayarla
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#2F2E2E';
      
      document.querySelectorAll('.dark-mode-toggle input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = true;
      });
      
      // Toggle butonlarındaki emojileri güncelle
      document.querySelectorAll(".toggle-emoji").forEach((span) => {
        span.textContent = "☀️";
      });
    }

    // Tüm toggle butonlarını güncelle
    function updateToggleButtons(isDark) {
      document.querySelectorAll('.dark-mode-toggle input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = isDark;
      });
      
      // Toggle butonlarındaki emojileri güncelle
      document.querySelectorAll(".toggle-emoji").forEach((span) => {
        span.textContent = isDark ? "☀️" : "🌙";
      });
    }

    // Mobil menü toggle fonksiyonu
    const setupMobileMenu = () => {
      const mobileMenuButton = document.getElementById("mobile-menu-button");
      const mobileMenu = document.getElementById("mobile-menu");
      
      if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
          const isOpen = mobileMenu.classList.contains("block");

          if (isOpen) {
            mobileMenu.classList.remove("block");
            mobileMenu.classList.add("hidden");
          } else {
            mobileMenu.classList.remove("hidden");
            mobileMenu.classList.add("block");
          }
        });
      }
    };

    // Sayfa tam olarak yüklendiğinde mobil menüyü ayarla
    if (document.readyState === 'complete') {
      setupMobileMenu();
    } else {
      window.addEventListener('load', setupMobileMenu);
    }
    
    // Dark mode değişikliklerini takip et
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeMediaQuery.addEventListener("change", (e) => {
      // Eğer localStorage'da tema tercihi yoksa, sistem tercihini uygula
      if (!localStorage.getItem("theme")) {
        const newDarkMode = e.matches;
        if (newDarkMode) {
          document.documentElement.classList.add("dark");
          document.documentElement.setAttribute('data-theme', 'dark');
          document.body.style.backgroundColor = '#2F2E2E';
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.setAttribute('data-theme', 'light');
          document.body.style.backgroundColor = '#ffffff';
        }
        updateToggleButtons(newDarkMode);
      }
    });
  }
}

// Component dışa aktarma
export default function DarkModeScript() {
  useEffect(() => {
    setupDarkMode();
  }, []);

  return null;
}
