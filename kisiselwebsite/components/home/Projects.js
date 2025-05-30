'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Projects() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Sabit proje verileri
  const projects = [
    {
      id: 1,
      title: 'Food Pattern',
      description: 'Mobil uygulama UI tasarımı',
      imageUrl: '/images/food.png',
      category: 'Mobil Uygulama'
    },
    {
      id: 2,
      title: 'Ride Service',
      description: 'Araç çağırma uygulaması arayüzü',
      imageUrl: '/images/Order ride-pana.png',
      category: 'Mobil Uygulama'
    },
    {
      id: 3,
      title: 'Travel App',
      description: 'Seyahat planlama uygulaması',
      imageUrl: '/images/travelappdesign.png',
      category: 'Mobil Uygulama'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-24 dark:bg-[#2F2E2E]" id="calismalarim">
      {/* 12 kolonlu grid container */}
      <div className="max-w-[1335px] mx-auto grid grid-cols-12 gap-x-[15px] px-[15px]">
        {/* Başlık - tüm genişlik */}
        <div className="col-span-12 mb-16 text-center">
          <h2 className="text-3xl font-bold mb-2 inline-block">Projelerim</h2>
          <div className="w-full h-0.5 bg-black dark:bg-white mb-12"></div>
          
          <p className="text-lg text-gray-800 dark:text-white mx-auto text-center mb-12">
            Tasarımın estetik yönüyle yazılımın işlevsellig̟ini bir araya getirmeyi seviyorum. Ög̏rencilik
            sürecinde edindig̏im bilgilerle, kullanıcı dostu ve anlamlı arayüzler tasarlamaya odaklandım.
            React ve JavaScript gibi teknolojileri kullanarak geliştirdig̏im bu projelerde, sade ama etkili
            çözümler üretmeye çalıştım. Aşag̏ıda yer alan UI/UX çalışmalarım; sadece görsel olarak
            deg̏il, aynı zamanda kullanıcı deneyimi açısından da deg̏er üretmeyi hedefleyen
            tasarımlardır. Her biri, ög̏renme yolculug̏umun ve gelişim sürecimin somut birer
            yansımasıdır.
          </p>
        </div>
        
        {/* Proje Slider - 2-12 kolonlar arası (ortalanıyor) */}
        <div className="col-span-10 col-start-2 col-end-12 bg-gray-100 dark:bg-gray-800 rounded-2xl p-12 shadow-md relative">
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide} 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-3 shadow-md z-10 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            aria-label="Önceki proje"
          >
            <FaChevronLeft className="text-gray-800 dark:text-white" />
          </button>
          
          <button 
            onClick={nextSlide} 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-3 shadow-md z-10 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            aria-label="Sonraki proje"
          >
            <FaChevronRight className="text-gray-800 dark:text-white" />
          </button>
          
          {/* Slider Content */}
          <div className="flex justify-center items-center">
            <div className="relative w-72 h-[500px] flex justify-center">
              {projects.map((project, index) => (
                <div 
                  key={project.id} 
                  className={`absolute transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  style={{ display: index === currentSlide ? 'block' : 'none' }}
                >
                  <div className="w-72 overflow-hidden shadow-lg">
                    <div className="relative" style={{ height: '500px' }}>
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="100%"
                        style={{ objectFit: 'contain', objectPosition: 'center' }}
                        priority
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300?text=Proje+Görseli';
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-3">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Proje ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
