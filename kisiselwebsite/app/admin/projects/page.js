'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import axios from 'axios';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'delete'
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Tasarım',
    imageUrl: '',
    projectUrl: '',
    githubUrl: '',
    tags: '',
    featured: false
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Örnek veri
      setTimeout(() => {
        const dummyProjects = [
          { 
            id: '1', 
            title: 'E-Ticaret Web Sitesi', 
            description: 'Modern bir e-ticaret platformu. Responsive tasarım, ödeme entegrasyonu ve yönetim paneli içerir.',
            category: 'Web Tasarım',
            imageUrl: 'https://via.placeholder.com/300',
            projectUrl: 'https://example.com',
            githubUrl: 'https://github.com',
            tags: ['React', 'Node.js', 'MongoDB'],
            featured: true,
            author: { name: 'Ahmet Yılmaz' },
            createdAt: '2025-05-10'
          },
          { 
            id: '2', 
            title: 'Mobil Uygulama UI', 
            description: 'Bir sağlık uygulaması için kullanıcı arayüzü tasarımı.',
            category: 'Mobil Uygulama',
            imageUrl: 'https://via.placeholder.com/300',
            projectUrl: 'https://example.com',
            githubUrl: '',
            tags: ['UI Design', 'Adobe XD', 'Mobile'],
            featured: false,
            author: { name: 'Ayşe Demir' },
            createdAt: '2025-05-15'
          },
          { 
            id: '3', 
            title: 'Sosyal Medya Dashboard', 
            description: 'Sosyal medya istatistiklerini takip etmek için kullanılan bir dashboard uygulaması.',
            category: 'Web Tasarım',
            imageUrl: 'https://via.placeholder.com/300',
            projectUrl: '',
            githubUrl: 'https://github.com',
            tags: ['Vue.js', 'Chart.js', 'API'],
            featured: false,
            author: { name: 'Mehmet Kaya' },
            createdAt: '2025-05-20'
          }
        ];
        setProjects(dummyProjects);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Projeler yüklenirken hata oluştu:', error);
      setError('Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Web Tasarım',
      imageUrl: '',
      projectUrl: '',
      githubUrl: '',
      tags: '',
      featured: false
    });
    setModalType('add');
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      imageUrl: project.imageUrl,
      projectUrl: project.projectUrl || '',
      githubUrl: project.githubUrl || '',
      tags: project.tags ? project.tags.join(', ') : '',
      featured: project.featured
    });
    setModalType('edit');
    setShowModal(true);
  };

  const openDeleteModal = (project) => {
    setCurrentProject(project);
    setModalType('delete');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      handleAddProject();
    } else if (modalType === 'edit') {
      handleEditProject();
    }
  };

  const handleAddProject = async () => {
    try {
      // Örnek işlem:
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const newProject = {
        id: Date.now().toString(),
        ...formData,
        tags: tagsArray,
        author: { name: 'Admin Kullanıcı' },
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProjects([...projects, newProject]);
      setShowModal(false);
      
    } catch (error) {
      console.error('Proje eklenirken hata oluştu:', error);
      alert('Proje eklenirken bir hata oluştu.');
    }
  };

  const handleEditProject = async () => {
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      setProjects(projects.map(project => project.id === currentProject.id ? {
        ...project,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl: formData.imageUrl,
        projectUrl: formData.projectUrl,
        githubUrl: formData.githubUrl,
        tags: tagsArray,
        featured: formData.featured
      } : project));
      setShowModal(false);
      
    } catch (error) {
      console.error('Proje güncellenirken hata oluştu:', error);
      alert('Proje güncellenirken bir hata oluştu.');
    }
  };

  const handleDeleteProject = async () => {
    try {
      setProjects(projects.filter(project => project.id !== currentProject.id));
      setShowModal(false);
      
    } catch (error) {
      console.error('Proje silinirken hata oluştu:', error);
      alert('Proje silinirken bir hata oluştu.');
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
        <h2 className="text-2xl font-bold">Proje Yönetimi</h2>
        <button
          onClick={openAddModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
        >
          <FaPlus className="mr-2" /> Yeni Proje
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Proje ara..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300?text=Görsel+Yok";
                  }}
                />
                {project.featured && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Öne Çıkan
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 truncate">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags && project.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{project.category}</span>
                  <span className="text-gray-500">{project.createdAt}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <button
                    onClick={() => openEditModal(project)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit className="inline mr-1" /> Düzenle
                  </button>
                  <button
                    onClick={() => openDeleteModal(project)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="inline mr-1" /> Sil
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              Aranan kriterlere uygun proje bulunamadı.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {modalType === 'delete' ? (
              <>
                <h3 className="text-lg font-bold mb-4">Projeyi Sil</h3>
                <p className="mb-6 text-gray-600">
                  <strong>{currentProject.title}</strong> projesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Sil
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">
                  {modalType === 'add' ? 'Yeni Proje Ekle' : 'Projeyi Düzenle'}
                </h3>
                <form onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proje Başlığı
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Açıklama
                      </label>
                      <textarea
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Web Tasarım">Web Tasarım</option>
                        <option value="Mobil Uygulama">Mobil Uygulama</option>
                        <option value="Grafik Tasarım">Grafik Tasarım</option>
                        <option value="Diğer">Diğer</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Görsel URL
                      </label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proje URL (opsiyonel)
                      </label>
                      <input
                        type="text"
                        name="projectUrl"
                        value={formData.projectUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub URL (opsiyonel)
                      </label>
                      <input
                        type="text"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Etiketler (virgülle ayırın)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="React, UI Design, Web, vb."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Öne Çıkan Proje</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {modalType === 'add' ? 'Ekle' : 'Güncelle'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
