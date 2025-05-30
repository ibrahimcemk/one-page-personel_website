'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaUser, FaEnvelope, FaKey, 
  FaTwitter, FaLinkedin, 
  FaGithub, FaInstagram, 
  FaSave, FaSpinner 
} from 'react-icons/fa';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form alanları
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    company: {
      name: '',
      position: ''
    },
    social: {
      twitter: '',
      linkedin: '',
      github: '',
      instagram: ''
    },
    skills: [],
    education: [
      {
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: ''
      }
    ],
    preferences: {
      theme: 'system',
      emailNotifications: true
    },
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // İlk yükleme için oturum kontrolü
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/profile');
    } else if (status === 'authenticated' && session.user) {
      // Kullanıcı bilgilerini forma doldur
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/user/profile');
          const userData = await response.json();
          
          if (!response.ok) {
            throw new Error(userData.error || 'Kullanıcı bilgileri yüklenemedi');
          }
          
          setFormData(prevState => ({
            ...prevState,
            name: userData.name || '',
            surname: userData.surname || '',
            email: userData.email || '',
            phone: userData.phone || '',
            bio: userData.bio || '',
            website: userData.website || '',
            address: {
              street: userData.address?.street || '',
              city: userData.address?.city || '',
              state: userData.address?.state || '',
              postalCode: userData.address?.postalCode || '',
              country: userData.address?.country || ''
            },
            company: {
              name: userData.company?.name || '',
              position: userData.company?.position || ''
            },
            social: {
              twitter: userData.social?.twitter || '',
              linkedin: userData.social?.linkedin || '',
              github: userData.social?.github || '',
              instagram: userData.social?.instagram || ''
            },
            skills: userData.skills || [],
            education: userData.education && userData.education.length > 0 
              ? userData.education 
              : [{
                  institution: '',
                  degree: '',
                  field: '',
                  startYear: '',
                  endYear: ''
                }],
            preferences: {
              theme: userData.preferences?.theme || 'system',
              emailNotifications: userData.preferences?.emailNotifications !== undefined ? 
                userData.preferences.emailNotifications : true
            }
          }));
          
          setLoading(false);
        } catch (error) {
          console.error('Kullanıcı bilgileri yüklenirken hata:', error);
          setErrorMessage('Kullanıcı bilgileri yüklenemedi: ' + error.message);
          setLoading(false);
        }
      };
      
      fetchUserData();
    }
  }, [status, session, router]);

  // Formu güncelle
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Nested object (sosyal medya)
      const [parent, child] = name.split('.');
      setFormData(prevState => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Profil güncelleme
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mesajları temizle
    setSuccessMessage('');
    setErrorMessage('');
    
    // Şifre kontrolü
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Yeni şifreler eşleşmiyor');
      return;
    }
    
    if ((formData.newPassword || formData.confirmPassword) && !formData.currentPassword) {
      setErrorMessage('Şifre değiştirmek için mevcut şifrenizi girmelisiniz');
      return;
    }
    
    setUpdating(true);
    
    try {
      // API'ye gönderilecek veri
      const updateData = {
        name: formData.name,
        bio: formData.bio,
        social: formData.social
      };
      
      // Şifre değiştirme isteği varsa ekle
      if (formData.newPassword && formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Profil güncellenirken bir hata oluştu');
      }
      
      // Şifre alanlarını temizle
      setFormData(prevState => ({
        ...prevState,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccessMessage('Profil başarıyla güncellendi');
      
      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        
        {/* Profil Başlık */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl mr-4 overflow-hidden">
                {session?.user?.image ? (
                  <Image 
                    src={session.user.image}
                    alt={session.user.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
                <p className="text-blue-100">{session?.user?.email}</p>
                {session?.user?.role === 'admin' && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded mt-1 inline-block">
                    Admin
                  </span>
                )}
              </div>
            </div>
            
            {session?.user?.role === 'admin' && (
              <Link 
                href="/admin/dashboard" 
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Admin Paneline Git
              </Link>
            )}
          </div>
        </div>
        
        {/* Ana İçerik */}
        <div className="p-6">
          
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 dark:bg-green-900 dark:border-green-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 dark:bg-red-900 dark:border-red-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FaUser className="mr-2" /> Kişisel Bilgiler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Soyad
                  </label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white bg-gray-100"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    E-posta adresiniz güncellenemez
                  </p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hakkımda
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Kendinizi tanıtın..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Sosyal Medya */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FaTwitter className="mr-2" /> Sosyal Medya Hesapları
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTwitter className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="twitter"
                      name="social.twitter"
                      value={formData.social.twitter}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="@kullaniciadi"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLinkedin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="linkedin"
                      name="social.linkedin"
                      value={formData.social.linkedin}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="linkedin.com/in/kullaniciadi"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGithub className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="github"
                      name="social.github"
                      value={formData.social.github}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="github.com/kullaniciadi"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Instagram
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaInstagram className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="instagram"
                      name="social.instagram"
                      value={formData.social.instagram}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="https://www.instagram.com/ibrahimcemmk/"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Adres Bilgileri */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FaUser className="mr-2" /> Adres Bilgileri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sokak/Cadde
                  </label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Şehir
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    İlçe/Bölge
                  </label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Posta Kodu
                  </label>
                  <input
                    type="text"
                    id="address.postalCode"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ülke
                  </label>
                  <input
                    type="text"
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            {/* İş Bilgileri */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FaUser className="mr-2" /> İş Bilgileri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company.name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    id="company.name"
                    name="company.name"
                    value={formData.company.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="company.position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pozisyon
                  </label>
                  <input
                    type="text"
                    id="company.position"
                    name="company.position"
                    value={formData.company.position}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            {/* Yetenekler */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FaUser className="mr-2" /> Yetenekler
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yetenekleriniz (HTML, CSS, JavaScript vb.)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 py-1 px-3 rounded-full flex items-center">
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        onClick={() => {
                          const newSkills = [...formData.skills];
                          newSkills.splice(index, 1);
                          setFormData({...formData, skills: newSkills});
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    id="newSkill"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Yeni yetenek ekleyin"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const newSkill = e.target.value.trim();
                        if (newSkill && !formData.skills.includes(newSkill)) {
                          setFormData({
                            ...formData,
                            skills: [...formData.skills, newSkill]
                          });
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
                    onClick={(e) => {
                      const input = document.getElementById('newSkill');
                      const newSkill = input.value.trim();
                      if (newSkill && !formData.skills.includes(newSkill)) {
                        setFormData({
                          ...formData,
                          skills: [...formData.skills, newSkill]
                        });
                        input.value = '';
                      }
                    }}
                  >
                    Ekle
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Yetenek eklemek için yazıp Enter'a basın veya Ekle butonuna tıklayın
                </p>
              </div>
            </div>
            
            {/* Eğitim Bilgileri */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FaUser className="mr-2" /> Eğitim Bilgileri
              </h2>
              
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-6 border-b border-gray-200 dark:border-gray-600 pb-6 last:border-0 last:pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`education[${index}].institution`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kurum
                      </label>
                      <input
                        type="text"
                        id={`education[${index}].institution`}
                        name={`education[${index}].institution`}
                        value={edu.institution}
                        onChange={(e) => {
                          const newEducation = [...formData.education];
                          newEducation[index].institution = e.target.value;
                          setFormData({...formData, education: newEducation});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`education[${index}].degree`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Derece/Program
                      </label>
                      <input
                        type="text"
                        id={`education[${index}].degree`}
                        name={`education[${index}].degree`}
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...formData.education];
                          newEducation[index].degree = e.target.value;
                          setFormData({...formData, education: newEducation});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor={`education[${index}].field`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Alan/Bölüm
                      </label>
                      <input
                        type="text"
                        id={`education[${index}].field`}
                        name={`education[${index}].field`}
                        value={edu.field}
                        onChange={(e) => {
                          const newEducation = [...formData.education];
                          newEducation[index].field = e.target.value;
                          setFormData({...formData, education: newEducation});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`education[${index}].startYear`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Başlangıç Yılı
                      </label>
                      <input
                        type="number"
                        id={`education[${index}].startYear`}
                        name={`education[${index}].startYear`}
                        value={edu.startYear}
                        onChange={(e) => {
                          const newEducation = [...formData.education];
                          newEducation[index].startYear = e.target.value;
                          setFormData({...formData, education: newEducation});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`education[${index}].endYear`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bitiş Yılı
                      </label>
                      <input
                        type="number"
                        id={`education[${index}].endYear`}
                        name={`education[${index}].endYear`}
                        value={edu.endYear}
                        onChange={(e) => {
                          const newEducation = [...formData.education];
                          newEducation[index].endYear = e.target.value;
                          setFormData({...formData, education: newEducation});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Devam ediyorsa boş bırakabilirsiniz"
                      />
                    </div>
                  </div>
                  
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      className="mt-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                      onClick={() => {
                        const newEducation = [...formData.education];
                        newEducation.splice(index, 1);
                        setFormData({...formData, education: newEducation});
                      }}
                    >
                      Eğitimi Kaldır
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => {
                  setFormData({
                    ...formData,
                    education: [...formData.education, {
                      institution: '',
                      degree: '',
                      field: '',
                      startYear: '',
                      endYear: ''
                    }]
                  });
                }}
              >
                Yeni Eğitim Ekle
              </button>
            </div>
            
            {/* Kullanıcı Tercihleri */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FaUser className="mr-2" /> Tercihler
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="preferences.theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tema Tercihi
                  </label>
                  <select
                    id="preferences.theme"
                    name="preferences.theme"
                    value={formData.preferences.theme}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="light">Açık Tema</option>
                    <option value="dark">Karanlık Tema</option>
                    <option value="system">Sistem Ayarına Göre</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preferences.emailNotifications"
                    name="preferences.emailNotifications"
                    checked={formData.preferences.emailNotifications}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          emailNotifications: e.target.checked
                        }
                      });
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="preferences.emailNotifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    E-posta bildirimleri almak istiyorum
                  </label>
                </div>
              </div>
            </div>
            
            {/* Şifre Değiştirme */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FaKey className="mr-2" /> Şifre Değiştirme
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Yeni Şifre Tekrar
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakın.
                </p>
              </div>
            </div>
            
            {/* Kaydet Butonu */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white 
                  ${updating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {updating ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Profili Güncelle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
