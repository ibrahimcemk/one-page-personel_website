'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  FaFolder, FaFile, FaFileImage, FaFilePdf, FaFileWord, 
  FaFileExcel, FaFileAlt, FaTrash, FaUpload, FaFolderPlus
} from 'react-icons/fa';

export default function FileManager() {
  const { data: session } = useSession();
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('/');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState([{ name: 'Ana Klasör', path: '/' }]);

  useEffect(() => {
    // Gerçek uygulamada, dosyaları API'den çekersiniz
    const fetchFiles = async () => {
      try {
        setLoading(true);
        
        // Örnek dosyalar ve klasörler
        const demoFiles = [
          {
            id: '1',
            name: 'Tasarımlar',
            type: 'folder',
            path: '/Tasarımlar',
            size: null,
            lastModified: '2025-05-20T10:30:00',
          },
          {
            id: '2',
            name: 'Dökümanlar',
            type: 'folder',
            path: '/Dökümanlar',
            size: null,
            lastModified: '2025-05-15T14:45:00',
          },
          {
            id: '3',
            name: 'logo.png',
            type: 'image',
            path: '/logo.png',
            size: 1024 * 1024 * 2.5, // 2.5 MB
            lastModified: '2025-05-25T09:15:00',
          },
          {
            id: '4',
            name: 'sunum.pdf',
            type: 'pdf',
            path: '/sunum.pdf',
            size: 1024 * 1024 * 3.2, // 3.2 MB
            lastModified: '2025-05-22T16:20:00',
          },
          {
            id: '5',
            name: 'müşteri-listesi.xlsx',
            type: 'excel',
            path: '/müşteri-listesi.xlsx',
            size: 1024 * 1024 * 1.1, // 1.1 MB
            lastModified: '2025-05-18T11:45:00',
          },
        ];

        setFiles(demoFiles);
        setLoading(false);
      } catch (error) {
        console.error('Dosyaları getirirken hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchFiles();
  }, [currentFolder]);

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'folder':
        return <FaFolder className="text-yellow-500" />;
      case 'image':
        return <FaFileImage className="text-green-500" />;
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'excel':
        return <FaFileExcel className="text-green-700" />;
      case 'word':
        return <FaFileWord className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0 || bytes === null) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      setCurrentFolder(file.path);
      setBreadcrumbs([...breadcrumbs, { name: file.name, path: file.path }]);
      // Gerçek uygulamada, yeni klasördeki dosyaları API'den çekersiniz
    } else {
      // Dosya önizleme veya indirme işlemleri
      console.log('Dosya seçildi:', file);
    }
  };

  const handleBreadcrumbClick = (index) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1].path);
    // Gerçek uygulamada, yeni klasördeki dosyaları API'den çekersiniz
  };

  const handleFileSelection = (file) => {
    const isSelected = selectedFiles.some(f => f.id === file.id);
    
    if (isSelected) {
      setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleDeleteSelected = () => {
    // Gerçek uygulamada, seçili dosyaları API üzerinden silersiniz
    const selectedIds = selectedFiles.map(file => file.id);
    setFiles(files.filter(file => !selectedIds.includes(file.id)));
    setSelectedFiles([]);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    // Gerçek uygulamada, dosya yükleme API çağrısı yaparsınız
    setUploadModalOpen(false);
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    
    if (newFolderName.trim() === '') return;
    
    // Gerçek uygulamada, yeni klasör oluşturma API çağrısı yaparsınız
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: 'folder',
      path: `${currentFolder === '/' ? '' : currentFolder}/${newFolderName}`,
      size: null,
      lastModified: new Date().toISOString(),
    };
    
    setFiles([...files, newFolder]);
    setNewFolderName('');
    setNewFolderModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Dosya Yöneticisi</h2>
          <div className="space-x-2">
            <button 
              onClick={() => setNewFolderModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <FaFolderPlus className="mr-2" /> Yeni Klasör
            </button>
            <button 
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaUpload className="mr-2" /> Dosya Yükle
            </button>
            {selectedFiles.length > 0 && (
              <button 
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <FaTrash className="mr-2" /> Seçilenleri Sil ({selectedFiles.length})
              </button>
            )}
          </div>
        </div>
        
        {/* Breadcrumbs */}
        <nav className="flex mt-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-gray-400">/</span>
                )}
                <button 
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`text-sm font-medium ${
                    index === breadcrumbs.length - 1 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {crumb.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <FaFolder className="text-5xl mb-4 text-yellow-500" />
            <p className="text-xl">Bu klasör boş</p>
            <p className="text-sm mt-2">Dosya yükleyin veya yeni bir klasör oluşturun</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles(files);
                        } else {
                          setSelectedFiles([]);
                        }
                      }}
                      checked={selectedFiles.length === files.length}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İsim
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Boyut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Değiştirilme Tarihi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className={selectedFiles.some(f => f.id === file.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        onChange={() => handleFileSelection(file)}
                        checked={selectedFiles.some(f => f.id === file.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="ml-4">
                          <div 
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                            onClick={() => handleFileClick(file)}
                          >
                            {file.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatSize(file.size)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(file.lastModified)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Dosya Yükle</h3>
                <button onClick={() => setUploadModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Kapat</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleUploadSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosyalar
                </label>
                <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Dosya seçin</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">veya sürükleyip bırakın</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF, DOCX, XLSX - 10MB'a kadar
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Yükle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* New Folder Modal */}
      {newFolderModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Yeni Klasör</h3>
                <button onClick={() => setNewFolderModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Kapat</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateFolder} className="p-6">
              <div className="mb-4">
                <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Klasör Adı
                </label>
                <input
                  type="text"
                  id="folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setNewFolderModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
