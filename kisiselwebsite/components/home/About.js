'use client';

import Image from 'next/image';
import { FaCode, FaPalette, FaMobile, FaShieldAlt } from 'react-icons/fa';

export default function About() {
  const services = [
    {
      id: 1,
      title: 'Sosyal Medya Yönetimi',
      description: 'Markalar için sosyal medya hesaplarının yönetimi, içerik planlama ve etkileşim stratejileri oluşturma hizmetleri.',
      icon: <FaPalette className="h-10 w-10 text-blue-600" />,
      image: '/images/Sosyal Medya 531.jpg'
    },
    {
      id: 2,
      title: 'Siber Güvenlik',
      description: 'Web siteleriniz ve uygulamalarınız için güvenlik denetimleri, saldırı tespit ve önleme sistemleri kurulumu.',
      icon: <FaShieldAlt className="h-10 w-10 text-blue-600" />,
      image: '/images/sibergüven531.jpg'
    },
    {
      id: 3,
      title: 'Mobil Uygulama Geliştirme',
      description: 'iOS ve Android platformları için modern, kullanıcı dostu ve performanslı mobil uygulamalar tasarlayıp geliştirme.',
      icon: <FaMobile className="h-10 w-10 text-blue-600" />,
      image: '/images/MobilUygulamaGeliştirme531.jpg'
    },
    {
      id: 4,
      title: 'Web Geliştirme',
      description: 'Modern teknolojiler kullanarak responsive ve performanslı web siteleri ve web uygulamaları geliştirme.',
      icon: <FaCode className="h-10 w-10 text-blue-600" />,
      image: '/images/coderesmi531.jpg'
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#2F2E2E]" id="hizmetlerim">
      {/* 12 kolonlu grid container */}
      <div className="max-w-[1335px] mx-auto grid grid-cols-12 gap-x-[15px] px-[15px]">
        {/* Başlık alanı - tüm genişlik */}
        <div className="col-span-12 mb-16 text-center">
          <h2 className="text-3xl font-bold mb-2 inline-block">Hizmetlerim</h2>
          <div className="w-full h-0.5 bg-black dark:bg-[#2F2E2E] mb-12"></div>
        </div>
        
        {/* İçerik alanı - 3-11 kolonlar arası */}
        <div className="col-span-12 col-start-3 col-end-11 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Sosyal Medya */}
          <div className="relative group rounded-lg overflow-hidden shadow-md w-full aspect-square h-52 md:h-60 lg:h-72">
            <div className="relative h-full">
              <Image 
                src={services[0].image}
                alt={services[0].title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                className="transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2">
                <h3 className="text-base font-bold text-white mb-1 z-10">{services[0].title}</h3>
                
                <div className="overflow-hidden">
                  <p className="text-white text-xs transform translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {services[0].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Siber Güvenlik */}
          <div className="relative group rounded-lg overflow-hidden shadow-md w-full aspect-square h-52 md:h-60 lg:h-72">
            <div className="relative h-full">
              <Image 
                src={services[1].image}
                alt={services[1].title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                className="transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-black/80 to-transparent flex flex-col justify-end p-2">
                <h3 className="text-sm sm:text-base font-bold text-white mb-1 z-10">{services[1].title}</h3>
                
                <div className="overflow-hidden">
                  <p className="text-white text-xs transform translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {services[1].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobil */}
          <div className="relative group rounded-lg overflow-hidden shadow-md w-full aspect-square h-52 md:h-60 lg:h-72">
            <div className="relative h-full">
              <Image 
                src={services[2].image}
                alt={services[2].title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                className="transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-black/80 to-transparent flex flex-col justify-end p-2">
                <h3 className="text-sm sm:text-base font-bold text-white mb-1 z-10">{services[2].title}</h3>
                
                <div className="overflow-hidden">
                  <p className="text-white text-xs transform translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {services[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Web */}
          <div className="relative group rounded-lg overflow-hidden shadow-md w-full aspect-square h-52 md:h-60 lg:h-72">
            <div className="relative h-full">
              <Image 
                src={services[3].image}
                alt={services[3].title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                className="transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-black/80 to-transparent flex flex-col justify-end p-2">
                <h3 className="text-sm sm:text-base font-bold text-white mb-1 z-10">{services[3].title}</h3>
                
                <div className="overflow-hidden">
                  <p className="text-white text-xs transform translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {services[3].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
