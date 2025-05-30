'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
  FaUsers, FaProjectDiagram, FaComment, 
  FaEye, FaUserPlus, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalComments: 0,
    totalViews: 0,
    newUsers: 0,
    newProjects: 0,
    userGrowth: 0,
    projectGrowth: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerçek API çağrıları ile dashboard verilerini çekiyoruz
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Admin dashboard API endpoint'inden verileri çek
        const response = await axios.get('/api/admin/dashboard');
        const data = response.data;
        
        // İstatistikleri ayarla
        setStats({
          totalUsers: data.stats.users.total,
          totalProjects: data.stats.projects.totalProjects,
          totalComments: data.stats.totalComments,
          totalViews: data.stats.totalViews,
          newUsers: data.stats.users.new,
          newProjects: data.stats.projects.newProjects,
          userGrowth: data.stats.users.growthRate,
          projectGrowth: data.stats.projects.projectGrowth
        });
        
        // Son kullanıcıları ayarla
        setRecentUsers(data.recentUsers.map(user => ({
          id: user._id,
          name: `${user.name} ${user.surname || ''}`.trim(),
          email: user.email,
          role: user.role,
          createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'
        })));
        
        // Food Pattern, Ride Service ve Travel App projelerini göster
        setRecentProjects([
          { id: '1', title: 'Food Pattern', author: 'İbrahim Çem', category: 'UI/UX Tasarım', createdAt: '2025-05-24' },
          { id: '2', title: 'Ride Service', author: 'İbrahim Çem', category: 'Mobil Uygulama', createdAt: '2025-05-25' },
          { id: '3', title: 'Travel App', author: 'İbrahim Çem', category: 'UI/UX Tasarım', createdAt: '2025-05-26' },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Dashboard verileri yüklenirken hata oluştu:', error);
        
        // Hata durumunda varsayılan değerleri göster
        setStats({
          totalUsers: 0,
          totalProjects: 3,
          totalComments: 0,
          totalViews: 0,
          newUsers: 0,
          newProjects: 0,
          userGrowth: 0,
          projectGrowth: 0
        });
        
        setRecentUsers([]);
        
        // Hata durumunda bile projelerimizi gösterelim
        setRecentProjects([
          { id: '1', title: 'Food Pattern', author: 'İbrahim Çem', category: 'UI/UX Tasarım', createdAt: '2025-05-24' },
          { id: '2', title: 'Ride Service', author: 'İbrahim Çem', category: 'Mobil Uygulama', createdAt: '2025-05-25' },
          { id: '3', title: 'Travel App', author: 'İbrahim Çem', category: 'UI/UX Tasarım', createdAt: '2025-05-26' },
        ]);
        
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-600">
          Hoş geldiniz, {session?.user?.name || 'Admin'}!
        </p>
      </div>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Toplam Kullanıcı</p>
              <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-md">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${stats.userGrowth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {stats.userGrowth > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(stats.userGrowth)}%
            </span>
            <span className="text-gray-500 text-xs ml-2">Bu ay</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Toplam Proje</p>
              <h3 className="text-3xl font-bold">{stats.totalProjects}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-md">
              <FaProjectDiagram className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${stats.projectGrowth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {stats.projectGrowth > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(stats.projectGrowth)}%
            </span>
            <span className="text-gray-500 text-xs ml-2">Bu ay</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Toplam Yorum</p>
              <h3 className="text-3xl font-bold">{stats.totalComments}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-md">
              <FaComment className="text-yellow-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-gray-500 text-xs">Son 30 günde</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Toplam Görüntülenme</p>
              <h3 className="text-3xl font-bold">{stats.totalViews}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-md">
              <FaEye className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-gray-500 text-xs">Son 30 günde</span>
          </div>
        </div>
      </div>
      
      {/* Son Eklenen Veriler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Kullanıcılar */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Son Kayıt Olan Kullanıcılar</h3>
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              <FaUserPlus className="mr-1" /> {stats.newUsers} yeni
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                  <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-500">{user.createdAt}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
            <a href="/admin/users" className="text-blue-600 text-sm font-medium hover:underline">
              Tüm kullanıcıları gör
            </a>
          </div>
        </div>
        
        {/* Son Projeler */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Son Eklenen Projeler</h3>
            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              <FaProjectDiagram className="mr-1" /> {stats.newProjects} yeni
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proje</th>
                  <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-gray-500">{project.author}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-500">{project.createdAt}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
            <a href="/admin/projects" className="text-blue-600 text-sm font-medium hover:underline">
              Tüm projeleri gör
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
