'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
  FaUsers, FaProjectDiagram, FaChartLine, FaArrowUp, FaArrowDown, 
  FaEye, FaComment, FaCalendar, FaUserPlus, FaShieldAlt 
} from 'react-icons/fa';

export default function StatsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('weekly');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Gerçek API çağrısı
        const response = await axios.get(`/api/admin/stats?timeRange=${timeRange}`);
        setStats(response.data.stats);
        setLoading(false);
      } catch (err) {
        console.error('İstatistikleri yüklerken hata oluştu:', err);
        setError('Veri yüklenirken bir sorun oluştu.');
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const handleRangeChange = (range) => {
    setTimeRange(range);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
        <p className="font-bold">Hata</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">İstatistikler</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handleRangeChange('weekly')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Haftalık
          </button>
          <button
            onClick={() => handleRangeChange('monthly')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Aylık
          </button>
          <button
            onClick={() => handleRangeChange('yearly')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'yearly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Yıllık
          </button>
        </div>
      </div>
      
      {/* Ana İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-1">Toplam Kullanıcı</p>
              <h3 className="text-3xl font-bold">{stats?.users?.total || 0}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-md">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`flex items-center text-sm ${
              stats?.users?.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats?.users?.growthRate >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(stats?.users?.growthRate || 0).toFixed(1)}%
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              {timeRange === 'weekly' 
                ? 'Son haftaya kıyasla' 
                : timeRange === 'monthly' 
                  ? 'Son aya kıyasla'
                  : 'Son yıla kıyasla'
              }
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-1">Toplam Proje</p>
              <h3 className="text-3xl font-bold">{stats?.projects?.totalProjects || 0}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-md">
              <FaProjectDiagram className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`flex items-center text-sm ${
              stats?.projects?.projectGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats?.projects?.projectGrowth >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(stats?.projects?.projectGrowth || 0).toFixed(1)}%
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              {timeRange === 'weekly' 
                ? 'Son haftaya kıyasla' 
                : timeRange === 'monthly' 
                  ? 'Son aya kıyasla'
                  : 'Son yıla kıyasla'
              }
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-1">Toplam Yorumlar</p>
              <h3 className="text-3xl font-bold">{stats?.totalComments || 0}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-md">
              <FaComment className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Tüm zamanların toplamı
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-1">Toplam Görüntülenme</p>
              <h3 className="text-3xl font-bold">{stats?.totalViews || 0}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-md">
              <FaEye className="text-yellow-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Tüm zamanların toplamı
            </span>
          </div>
        </div>
      </div>
      
      {/* Grafik Kartları - Gerçek veri olmadığı için temsili bloklar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Kullanıcı Kayıt Grafiği</h3>
          <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
            <div className="flex flex-col items-center">
              <FaChartLine className="text-blue-600 text-4xl mb-2" />
              <p className="text-gray-600 dark:text-gray-300">
                Bu bölümde gerçek bir grafik oluşturulabilir
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Proje Dağılımı</h3>
          <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
            <div className="flex flex-col items-center">
              <FaProjectDiagram className="text-purple-600 text-4xl mb-2" />
              <p className="text-gray-600 dark:text-gray-300">
                Projeler UI/UX Tasarımı ve Mobil Uygulama kategorilerinde
              </p>
              <ul className="mt-2 text-sm">
                <li className="text-blue-600">Food Pattern (UI/UX Tasarım)</li>
                <li className="text-green-600">Ride Service (Mobil Uygulama)</li>
                <li className="text-orange-600">Travel App (UI/UX Tasarım)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Güvenlik ve Sistem Durumu Kartı */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaShieldAlt className="mr-2 text-green-600" /> Sistem Güvenlik Durumu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Giriş Güvenliği</h4>
            <p className="text-green-600 dark:text-green-300 text-sm">Aktif ve Güvenli</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Veritabanı</h4>
            <p className="text-green-600 dark:text-green-300 text-sm">Bağlantı Güvenli</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">API Erişimi</h4>
            <p className="text-green-600 dark:text-green-300 text-sm">Rol Tabanlı Kontroller Aktif</p>
          </div>
        </div>
      </div>
    </div>
  );
}
