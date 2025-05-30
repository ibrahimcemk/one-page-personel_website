'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Gerçek uygulamada, şifre sıfırlama için bir API çağrısı yapacaksınız
      // Şu anda simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.');
      setEmail('');
      
    } catch (error) {
      setError('Şifre sıfırlama işlemi sırasında bir hata oluştu');
      console.error('Şifre sıfırlama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black px-4 py-12">
      <div className="relative max-w-md w-full">
        {/* Arka plan dekoratif elemanlar */}
        <div className="absolute -top-12 -left-8 w-32 h-32 bg-yellow-400 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-30 dark:opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-30 dark:opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Ana kart */}
        <div className="relative backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 space-y-8 z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Şifremi Unuttum
            </h2>
            <p className="mt-2 text-center text-base text-gray-600 dark:text-gray-400">
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı göndereceğiz
            </p>
          </div>
          
          {message && (
            <div className="bg-green-50 dark:bg-green-900/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">{message}</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm"
                  placeholder="E-posta adresiniz"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition duration-150 ease-in-out
                  ${loading ? 'bg-yellow-400 dark:bg-yellow-500' : 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transform hover:scale-[1.01] active:scale-[0.99]`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-yellow-500 dark:text-white/80 group-hover:text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                )}
                <span className="ml-2">Bağlantı Gönder</span>
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">veya</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Link 
                href="/auth/login"
                className="flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-white bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.01] active:scale-[0.99] transition duration-150 ease-in-out"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  Giriş Yap
                </span>
              </Link>
              <Link 
                href="/auth/register"
                className="flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-white bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-[1.01] active:scale-[0.99] transition duration-150 ease-in-out"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  Kayıt Ol
                </span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-6">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition duration-150 ease-in-out">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
