'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAdmin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          secretKey
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Admin hesabı oluşturulurken bir hata oluştu');
      } else {
        setMessage('Admin hesabı başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...');
        setName('');
        setEmail('');
        setPassword('');
        setSecretKey('');
        
        // 2 saniye sonra giriş sayfasına yönlendir
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (error) {
      setError('İstek gönderilirken bir hata oluştu');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Hesabı Oluştur</h2>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              İsim
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Admin adı"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="En az 6 karakter"
              minLength={6}
            />
          </div>
          
          <div>
            <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
              Güvenlik Anahtarı
            </label>
            <input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="adminGizliAnahtar123"
            />
            <p className="mt-1 text-xs text-gray-500">
              Varsayılan güvenlik anahtarı: adminGizliAnahtar123 (üretim ortamında değiştirin)
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'İşleniyor...' : 'Admin Hesabı Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
