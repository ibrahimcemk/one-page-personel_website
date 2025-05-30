'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaTrash, FaCheck, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';

export default function Messages() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    // Gerçek uygulamada, mesajları API'den çekersiniz
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Örnek mesajlar
        const demoMessages = [
          {
            id: '1',
            name: 'Ahmet Yılmaz',
            email: 'ahmet@example.com',
            subject: 'İşbirliği Teklifi',
            message: 'Merhaba, web sitemiz için bir yeniden tasarım düşünüyoruz ve sizinle çalışmak isteriz. Müsait olduğunuzda detayları konuşabilir miyiz?',
            date: '2025-05-28T14:30:00',
            read: true
          },
          {
            id: '2',
            name: 'Ayşe Demir',
            email: 'ayse@example.com',
            subject: 'Mobil Uygulama Geliştirme',
            message: 'Şirketimiz için bir mobil uygulama geliştirme hizmetiniz var mı? Eğer varsa, fiyat ve zaman çizelgenizi öğrenebilir miyim?',
            date: '2025-05-28T09:15:00',
            read: false
          },
          {
            id: '3',
            name: 'Mehmet Kaya',
            email: 'mehmet@example.com',
            subject: 'Teşekkür Mesajı',
            message: 'Geliştirdiğiniz web sitesi için çok teşekkür ederim. Müşterilerimizden çok olumlu geri dönüşler aldık. Harika bir iş çıkardınız!',
            date: '2025-05-27T16:45:00',
            read: false
          },
        ];

        setMessages(demoMessages);
        setLoading(false);
      } catch (error) {
        console.error('Mesajları getirirken hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleMessageClick = (message) => {
    // Mesajı okundu olarak işaretle
    if (!message.read) {
      // Gerçek uygulamada, bu değişikliği API'ye de gönderirsiniz
      setMessages(messages.map((m) => 
        m.id === message.id ? { ...m, read: true } : m
      ));
    }
    
    setSelectedMessage(message);
  };

  const handleDeleteMessage = (id) => {
    // Gerçek uygulamada, mesajı API üzerinden silersiniz
    setMessages(messages.filter((m) => m.id !== id));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
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

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Mesajlar <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{unreadCount} okunmamış</span>
          </h2>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* Mesaj Listesi */}
        <div className="w-1/3 border-r border-gray-200 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-gray-500">
              <FaEnvelope className="text-4xl mb-2" />
              <p>Henüz mesaj yok</p>
            </div>
          ) : (
            <ul>
              {messages.map((message) => (
                <li 
                  key={message.id}
                  className={`
                    flex items-start p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50
                    ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''}
                    ${!message.read ? 'font-semibold' : ''}
                  `}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="mr-3 mt-1">
                    {message.read ? 
                      <FaEnvelopeOpen className="text-gray-400" /> : 
                      <FaEnvelope className="text-blue-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="truncate">{message.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(message.date).split(' ')[0]}</p>
                    </div>
                    <p className="text-sm truncate">{message.subject}</p>
                    <p className="text-xs text-gray-500 truncate">{message.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mesaj İçeriği */}
        <div className="w-2/3 p-4">
          {selectedMessage ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-medium">{selectedMessage.subject}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <span className="font-medium">{selectedMessage.name}</span>
                    <span className="mx-2">&#8226;</span>
                    <span>{selectedMessage.email}</span>
                    <span className="mx-2">&#8226;</span>
                    <span>{formatDate(selectedMessage.date)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Mesajı Sil"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-gray-700 whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
              <div className="mt-6 flex space-x-4">
                <a 
                  href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Yanıtla
                </a>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-gray-500">
              <FaEnvelope className="text-5xl mb-4" />
              <p className="text-xl">Bir mesaj seçin</p>
              <p className="text-sm mt-2">Okumak için soldan bir mesaj seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
