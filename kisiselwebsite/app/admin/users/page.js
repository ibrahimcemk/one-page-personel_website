'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaGlobe, FaTimes, FaPlus, FaShieldAlt, FaUserCog, FaCheck, FaUserPlus, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    isActive: true,
    bio: '',
    website: ''
  });
  
  // Yetki yönetimi için state değişkenleri
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [defaultPermissions, setDefaultPermissions] = useState({});
  const [permissionData, setPermissionData] = useState({
    userId: '',
    role: 'user',
    permissions: {}
  });
  const [permissionLoading, setPermissionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    // Varsayılan yetkileri getir
    fetchDefaultPermissions();
  }, []);
  
  // Varsayılan izinleri getir
  const fetchDefaultPermissions = async () => {
    try {
      const response = await axios.get('/api/admin/users/permissions');
      setDefaultPermissions(response.data);
    } catch (error) {
      console.error('Varsayılan izinler yüklenirken hata oluştu:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // API çağrısı ile gerçek kullanıcıları getiriyoruz
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
      setLoading(false);
      
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata oluştu:', error);
      setError('Kullanıcılar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      surname: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      isActive: true,
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
      education: [{
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: ''
      }]
    });
    setShowAddModal(true);
  };

  // Yetki düzenleme modalını aç
  const openPermissionModal = (user) => {
    setCurrentUser(user);
    setPermissionData({
      userId: user._id,
      role: user.role || 'user',
      permissions: user.permissions || {}
    });
    setShowPermissionModal(true);
  };
  
  // Yetki güncelleme fonksiyonu
  const handlePermissionUpdate = async (e) => {
    e.preventDefault();
    setPermissionLoading(true);
    
    try {
      const response = await axios.put('/api/admin/users/permissions', permissionData);
      
      if (response.data.success) {
        // Başarılı güncelleme
        fetchUsers(); // Kullanıcı listesini yenile
        setShowPermissionModal(false);
        
        // Başarı mesajı göster
        alert('Kullanıcı yetkileri başarıyla güncellendi');
      }
    } catch (error) {
      console.error('Yetki güncelleme hatası:', error);
      alert(error.response?.data?.error || 'Yetki güncellenirken bir hata oluştu');
    } finally {
      setPermissionLoading(false);
    }
  };
  
  // Rol değiştiğinde varsayılan izinleri ayarla
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setPermissionData({
      ...permissionData,
      role: selectedRole,
      // Varsayılan izinleri seçilen role göre ayarla
      permissions: defaultPermissions[selectedRole] || {}
    });
  };
  
  // İzin değişikliklerini ele al
  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissionData({
      ...permissionData,
      permissions: {
        ...permissionData.permissions,
        [name]: checked
      }
    });
  };
  
  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name || '',
      surname: user.surname || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      role: user.role || 'user',
      isActive: user.isActive !== undefined ? user.isActive : true,
      bio: user.bio || '',
      website: user.website || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || ''
      },
      company: {
        name: user.company?.name || '',
        position: user.company?.position || ''
      },
      social: {
        twitter: user.social?.twitter || '',
        linkedin: user.social?.linkedin || '',
        github: user.social?.github || '',
        instagram: user.social?.instagram || ''
      },
      skills: user.skills || [],
      education: user.education && user.education.length > 0 ? user.education : [{
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: ''
      }]
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Gerçek API çağrısı ile kullanıcı ekleme
      const response = await axios.post('/api/admin/users', formData);
      
      // Başarılı olduysa kullanıcı listesini güncelle
      if (response.status === 201 || response.status === 200) {
        await fetchUsers(); // Kullanıcı listesini yeniden yükle
        setShowAddModal(false);
        alert('Kullanıcı başarıyla eklendi!');
      }
      
    } catch (error) {
      console.error('Kullanıcı eklenirken hata oluştu:', error);
      alert('Kullanıcı eklenirken bir hata oluştu: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      // Gerçek API çağrısı ile kullanıcı güncelleme
      const response = await axios.put(`/api/admin/users/${currentUser._id}`, formData);
      
      // Başarılı olduysa kullanıcı listesini güncelle
      if (response.status === 200) {
        await fetchUsers(); // Kullanıcı listesini yeniden yükle
        setShowEditModal(false);
        alert('Kullanıcı başarıyla güncellendi!');
      }
      
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata oluştu:', error);
      alert('Kullanıcı güncellenirken bir hata oluştu: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      // Gerçek API çağrısı ile kullanıcı silme
      const response = await axios.delete(`/api/admin/users/delete?userId=${currentUser._id}`);
      
      // Başarılı olduysa kullanıcı listesini güncelle
      if (response.status === 200) {
        await fetchUsers(); // Kullanıcı listesini yeniden yükle
        setShowDeleteModal(false);
        alert('Kullanıcı başarıyla silindi!');
      }
      
    } catch (error) {
      console.error('Kullanıcı silinirken hata oluştu:', error);
      alert('Kullanıcı silinirken bir hata oluştu: ' + (error.response?.data?.error || error.message));
    }
  };

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
        <h2 className="text-2xl font-bold">Kullanıcı Yönetimi</h2>
        <button
          onClick={openAddModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
        >
          <FaUserPlus className="mr-2" /> Yeni Kullanıcı
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user._id || user.id || `user-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-yellow-600 hover:text-yellow-800 mr-2"
                        title="Düzenle"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => openPermissionModal(user)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        title="Yetkiler"
                      >
                        <FaShieldAlt />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Sil"
                      >
                        <FaTrash />
                      </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Aranan kriterlere uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yetki Düzenleme Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    {currentUser ? `${currentUser.name} ${currentUser.surname} - Yetki Yönetimi` : 'Yetki Yönetimi'}
                  </h3>
                  <button
                    onClick={() => setShowPermissionModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handlePermissionUpdate} className="mt-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Rol
                    </label>
                    <div className="relative">
                      <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="role"
                        value={permissionData.role}
                        onChange={handleRoleChange}
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="editor">Editör</option>
                        <option value="manager">Yönetici</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Süper Admin</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Kullanıcı İzinleri</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {/* Temel izinler */}
                      <div className="p-3 border rounded-md">
                        <h5 className="font-medium mb-2">Temel İzinler</h5>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canViewDashboard"
                            name="canViewDashboard"
                            checked={permissionData.permissions?.canViewDashboard || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canViewDashboard">Panel Görüntüleme</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canManageOwnProfile"
                            name="canManageOwnProfile"
                            checked={permissionData.permissions?.canManageOwnProfile || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canManageOwnProfile">Profil Yönetimi</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canViewStats"
                            name="canViewStats"
                            checked={permissionData.permissions?.canViewStats || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canViewStats">İstatistikleri Görüntüleme</label>
                        </div>
                      </div>
                      
                      {/* İçerik izinleri */}
                      <div className="p-3 border rounded-md">
                        <h5 className="font-medium mb-2">İçerik Yönetimi</h5>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canCreateContent"
                            name="canCreateContent"
                            checked={permissionData.permissions?.canCreateContent || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canCreateContent">İçerik Oluşturma</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canEditContent"
                            name="canEditContent"
                            checked={permissionData.permissions?.canEditContent || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canEditContent">İçerik Düzenleme</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canDeleteContent"
                            name="canDeleteContent"
                            checked={permissionData.permissions?.canDeleteContent || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canDeleteContent">İçerik Silme</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canPublishContent"
                            name="canPublishContent"
                            checked={permissionData.permissions?.canPublishContent || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canPublishContent">İçerik Yayınlama</label>
                        </div>
                      </div>
                      
                      {/* Kullanıcı yönetimi izinleri */}
                      <div className="p-3 border rounded-md">
                        <h5 className="font-medium mb-2">Kullanıcı Yönetimi</h5>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canViewUsers"
                            name="canViewUsers"
                            checked={permissionData.permissions?.canViewUsers || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canViewUsers">Kullanıcıları Görüntüleme</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canCreateUsers"
                            name="canCreateUsers"
                            checked={permissionData.permissions?.canCreateUsers || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canCreateUsers">Kullanıcı Oluşturma</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canEditUsers"
                            name="canEditUsers"
                            checked={permissionData.permissions?.canEditUsers || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canEditUsers">Kullanıcı Düzenleme</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canDeleteUsers"
                            name="canDeleteUsers"
                            checked={permissionData.permissions?.canDeleteUsers || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canDeleteUsers">Kullanıcı Silme</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canChangeUserRoles"
                            name="canChangeUserRoles"
                            checked={permissionData.permissions?.canChangeUserRoles || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canChangeUserRoles">Kullanıcı Rollerini Değiştirme</label>
                        </div>
                      </div>
                      
                      {/* Proje yönetimi izinleri */}
                      <div className="p-3 border rounded-md">
                        <h5 className="font-medium mb-2">Proje Yönetimi</h5>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canViewProjects"
                            name="canViewProjects"
                            checked={permissionData.permissions?.canViewProjects || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canViewProjects">Projeleri Görüntüleme</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canCreateProjects"
                            name="canCreateProjects"
                            checked={permissionData.permissions?.canCreateProjects || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canCreateProjects">Proje Oluşturma</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canEditProjects"
                            name="canEditProjects"
                            checked={permissionData.permissions?.canEditProjects || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canEditProjects">Proje Düzenleme</label>
                        </div>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="canDeleteProjects"
                            name="canDeleteProjects"
                            checked={permissionData.permissions?.canDeleteProjects || false}
                            onChange={handlePermissionChange}
                            className="mr-2"
                          />
                          <label htmlFor="canDeleteProjects">Proje Silme</label>
                        </div>
                      </div>
                      
                      {/* Ayarlar ve sistem izinleri */}
                      <div className="p-3 border rounded-md col-span-1 md:col-span-2">
                        <h5 className="font-medium mb-2">Sistem ve Ayarlar</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id="canManageSettings"
                              name="canManageSettings"
                              checked={permissionData.permissions?.canManageSettings || false}
                              onChange={handlePermissionChange}
                              className="mr-2"
                            />
                            <label htmlFor="canManageSettings">Site Ayarları Yönetimi</label>
                          </div>
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id="canManageSecurity"
                              name="canManageSecurity"
                              checked={permissionData.permissions?.canManageSecurity || false}
                              onChange={handlePermissionChange}
                              className="mr-2"
                            />
                            <label htmlFor="canManageSecurity">Güvenlik Ayarları Yönetimi</label>
                          </div>
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id="canAccessLogs"
                              name="canAccessLogs"
                              checked={permissionData.permissions?.canAccessLogs || false}
                              onChange={handlePermissionChange}
                              className="mr-2"
                            />
                            <label htmlFor="canAccessLogs">Log Erişimi</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setShowPermissionModal(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                      disabled={permissionLoading}
                    >
                      {permissionLoading ? (
                        <span className="mr-2 inline-block w-4 h-4 border-2 border-white border-t-blue-500 rounded-full animate-spin"></span>
                      ) : (
                        <FaCheck className="mr-2" />
                      )}
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Kullanıcı Ekleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Yeni Kullanıcı Ekle</h3>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kişisel Bilgiler */}
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-700 mb-2">Kişisel Bilgiler</h4>
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              
              {/* Hesap Bilgileri */}
              <div className="md:col-span-2 mt-2">
                <h4 className="font-medium text-gray-700 mb-2">Hesap Bilgileri</h4>
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="user">Kullanıcı</option>
                  <option value="editor">Editör</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              {/* Profil Bilgileri */}
              <div className="md:col-span-2 mt-2">
                <h4 className="font-medium text-gray-700 mb-2">Profil Bilgileri</h4>
              </div>
              
              <div className="mb-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biyografi
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Web Sitesi
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Aktif Kullanıcı
                  </label>
                </div>
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kullanıcı Düzenleme Modal */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Kullanıcı Düzenle</h3>
            <form onSubmit={handleEditUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kişisel Bilgiler */}
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-700 mb-2">Kişisel Bilgiler</h4>
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              
              {/* Hesap Bilgileri */}
              <div className="md:col-span-2 mt-2">
                <h4 className="font-medium text-gray-700 mb-2">Hesap Bilgileri</h4>
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre (Boş bırakırsanız değişmez)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="user">Kullanıcı</option>
                  <option value="editor">Editör</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              {/* Profil Bilgileri */}
              <div className="md:col-span-2 mt-2">
                <h4 className="font-medium text-gray-700 mb-2">Profil Bilgileri</h4>
              </div>
              
              <div className="mb-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biyografi
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Web Sitesi
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-900">
                    Aktif Kullanıcı
                  </label>
                </div>
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kullanıcı Silme Modal */}
      {showDeleteModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Kullanıcıyı Sil</h3>
            <p className="mb-6 text-gray-600">
              <strong>{currentUser.name}</strong> adlı kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
