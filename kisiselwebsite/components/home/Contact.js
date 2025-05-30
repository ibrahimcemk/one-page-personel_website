'use client';

import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form gönderme işlemi burada yapılacak
    console.log('Form gönderildi:', formData);
    // Formu sıfırla
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="py-24 dark:bg-[#2F2E2E]" id="referanslar">
      {/* 12 kolonlu grid container */}
      <div className="max-w-[1335px] mx-auto grid grid-cols-12 gap-x-[15px] px-[15px]">
        {/* Başlık - tüm genişlik */}
        <div className="col-span-12 mb-16 text-center">
          <h2 className="text-3xl font-bold mb-2 inline-block">Referanslar</h2>
          <div className="w-full h-0.5 bg-black dark:bg-white mb-12"></div>
        </div>
        
        {/* Referanslar */}
        <div className="col-span-10 col-start-2 col-end-12">
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-sm flex items-center justify-center h-32 md:h-40">
                <img src="/images/Trendyol.com.svg" alt="Trendyol" className="h-20 md:h-24 lg:h-28 object-contain" />
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-sm flex items-center justify-center h-32 md:h-40">
                <img src="/images/Rockstar Games.svg" alt="Rockstar Games" className="h-20 md:h-24 lg:h-28 object-contain" />
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-sm flex items-center justify-center h-32 md:h-40">
                <img src="/images/Trendyol.com.svg" alt="Trendyol" className="h-20 md:h-24 lg:h-28 object-contain" />
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-sm flex items-center justify-center h-32 md:h-40">
                <img src="/images/Rockstar Games.svg" alt="Rockstar Games" className="h-20 md:h-24 lg:h-28 object-contain" />
              </div>
            </div>
          </div>
          
          {/* Sıkça Sorulan Sorular */}
          <div className="mt-16 text-center" id="sikca-sorulan-sorular">
            <h3 className="text-xl font-bold mb-2 inline-block dark:text-white">Sıkça Sorulan Sorular</h3>
            <div className="w-full h-0.5 bg-black dark:bg-white mb-6"></div>
            <div className="space-y-4">
              <details className="bg-white dark:bg-gray-700 p-4 rounded shadow-sm">
                <summary className="font-medium cursor-pointer dark:text-white">Soru 1</summary>
                <p className="mt-2 text-gray-600 dark:text-gray-200">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam in tincidunt vestibulum, nisl nunc ultricies nunc.</p>
              </details>
              
              <details className="bg-white dark:bg-gray-700 p-4 rounded shadow-sm">
                <summary className="font-medium cursor-pointer dark:text-white">Soru 2</summary>
                <p className="mt-2 text-gray-600 dark:text-gray-200">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam in tincidunt vestibulum, nisl nunc ultricies nunc.</p>
              </details>
              
              <details className="bg-white dark:bg-gray-700 p-4 rounded shadow-sm">
                <summary className="font-medium cursor-pointer dark:text-white">Soru 3</summary>
                <p className="mt-2 text-gray-600 dark:text-gray-200">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam in tincidunt vestibulum, nisl nunc ultricies nunc.</p>
              </details>
              
              <details className="bg-white dark:bg-gray-700 p-4 rounded shadow-sm">
                <summary className="font-medium cursor-pointer dark:text-white">Soru 4</summary>
                <p className="mt-2 text-gray-600 dark:text-gray-200">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam in tincidunt vestibulum, nisl nunc ultricies nunc.</p>
              </details>
            </div>
          </div>
          
          {/* İletişim Formu */}
          <div className="mt-16" id="iletisim">
            <h3 className="text-xl font-bold mb-2 text-center dark:text-white">İletişim</h3>
            <div className="w-full h-0.5 bg-black dark:bg-white mb-6"></div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Adınız"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-posta Adresiniz"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Konu"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mesajınız"
                  rows="6"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 transition duration-300"
                >
                  Gönder
                </button>
              </div>
            </form>
            
            {/* İletişim Bilgisi ve Adres */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-700 p-5 rounded-md shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                    <FaPhone className="text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-white">Telefon</h4>
                    <p className="text-gray-600 dark:text-gray-300">+90 555 123 45 67</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-white">E-posta</h4>
                    <p className="text-gray-600 dark:text-gray-300">info@example.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-5 rounded-md shadow-sm">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-white">Adres</h4>
                    <p className="text-gray-600 dark:text-gray-300">İstanbul, Türkiye</p>
                    <p className="text-gray-600 dark:text-gray-300">Ataşehir, 34750</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sosyal Medya İkonları */}
            <div className="mt-10 text-center">
              <h5 className="font-medium mb-4 dark:text-white">Beni Sosyal Medyada Takip Edin</h5>
              <div className="flex justify-center space-x-6">
                <a href="#" className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                  <FaInstagram className="text-xl text-gray-800 dark:text-white" />
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                  <FaFacebookF className="text-xl text-gray-800 dark:text-white" />
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                  <FaTwitter className="text-xl text-gray-800 dark:text-white" />
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                  <FaLinkedinIn className="text-xl text-gray-800 dark:text-white" />
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                  <FaGithub className="text-xl text-gray-800 dark:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
