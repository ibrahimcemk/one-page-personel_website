'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll olayını takip eden fonksiyon
  const toggleVisibility = () => {
    // 300px'den fazla aşağı kaydırılmışsa butonu göster
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Sayfa en üstüne çıkma fonksiyonu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Scroll olayını dinle
    window.addEventListener('scroll', toggleVisibility);
    
    // Component kaldırıldığında event listener'ı temizle
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-transform hover:scale-110 focus:outline-none"
        aria-label="Sayfanın üstüne çık"
      >
        <Image 
          src="/images/upbutton.png" 
          alt="Yukarı Çık" 
          width={40} 
          height={40}
          priority
        />
      </button>
    </div>
  );
}
