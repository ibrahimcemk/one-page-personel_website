'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaHome, FaUsers, FaProjectDiagram, FaChartBar, 
  FaCog, FaSignOutAlt, FaBars, FaTimes, FaEnvelope, FaFolder 
} from 'react-icons/fa';
import AdminAccess from '@/components/AdminAccess';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yu00fcklenirken oturum kontrolu00fc
    if (status === 'loading') return;

    if (!session || session.user.role !== 'admin') {
      router.push('/auth/login?callback=/admin');
    } else {
      setIsLoading(false);
    }
  }, [session, status, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminAccess>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`bg-gray-900 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <h2 className="text-xl font-bold">Admin Panel</h2>
          ) : (
            <span className="font-bold text-lg">AP</span>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-md hover:bg-gray-700 transition-colors"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 pb-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              {isSidebarOpen && (
                <div>
                  <h4 className="font-medium">{session?.user?.name || 'Admin'}</h4>
                  <p className="text-xs text-gray-400">{session?.user?.email || 'admin@example.com'}</p>
                </div>
              )}
            </div>
          </div>
          
          <ul className="mt-6 space-y-2 px-4">
            <li>
              <Link 
                href="/admin/dashboard" 
                className="flex items-center p-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <FaHome className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Panel</span>}
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/users" 
                className="flex items-center p-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <FaUsers className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Kullanıcılar</span>}
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/projects" 
                className="flex items-center p-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <FaProjectDiagram className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Projeler</span>}
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/stats" 
                className="flex items-center p-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <FaChartBar className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">İstatistikler</span>}
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/messages" 
                className="flex items-center p-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <FaEnvelope className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Mesajlar</span>}
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/files" 
                className="flex items-center p-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <FaFolder className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Dosya Yöneticisi</span>}
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/settings" 
                className="flex items-center p-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <FaCog className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Ayarlar</span>}
              </Link>
            </li>
          </ul>
          
          <div className="absolute bottom-0 w-full pb-8 px-4">
            <Link 
              href="/" 
              className="flex items-center p-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-3">Ana sayfa</span>}
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Paneli</h1>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-600">{session?.user?.name || 'Admin'}</span>
              {/* Profil veya bildirim butonlaru0131 eklenebilir */}
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
    </AdminAccess>
  );
}
