'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="py-24 dark:bg-[#2F2E2E]" id="hakkimda">
      {/* 12 kolonlu grid container */}
      <div className="max-w-[1335px] mx-auto grid grid-cols-12 gap-x-[15px] px-[15px]">
        {/* Sol Taraf - Profil Resmi (1-6 kolonları) */}
        <div className="col-span-6 flex items-center justify-center md:justify-end">
          <div className="relative rounded-tl-[80px] rounded-br-[80px] overflow-hidden shadow-lg max-w-md">
            <Image
              src="/images/linkedlnlogos copy 2.png"
              alt="İbrahim Cem Keleş"
              width={400}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
        
        {/* Sağ Taraf - Metin İçeriği (7-12 kolonları) */}
        <div className="col-span-6 flex items-center">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-semibold mb-2 text-center md:text-left">Merhaba</h2>
            <div className="w-20 h-0.5 bg-black dark:bg-white mb-6 mx-auto md:mx-0"></div>
            
            <p className="text-lg text-gray-800 dark:text-white mb-6 text-center md:text-left">
              Merhaba, ben İbrahim Cem Keleş. Kırşehir Ahi Evran Üniversitesi Web Tasarım ve Kodlama bölümünde 2. sınıf öğrencisiyim. Teknolojiye olan merakım beni yazılım geliştirme, siber güvenlik ve frontend teknolojilerine yönlendirdi. Özellikle React ve JavaScript kullanarak kullanıcı dostu arayüzler geliştirmekten keyif alıyorum.
            </p>
            
            <div className="w-20 h-0.5 bg-black dark:bg-white mx-auto md:mx-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
