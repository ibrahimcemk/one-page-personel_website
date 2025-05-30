import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connect } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Yetkisiz erişim' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // MongoDB bağlantısı
    await connect();

    // Kullanıcı bilgilerini al
    const user = await User.findOne({ email: session.user.email }).select('-password');

    if (!user) {
      return new Response(JSON.stringify({ error: 'Kullanıcı bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Kullanıcı bilgilerini döndür (şifre dışında)
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Profil bilgileri getirme hatası:', error);
    return new Response(JSON.stringify({ error: 'Sunucu hatası: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Yetkisiz erişim' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // İstek verilerini al
    const data = await request.json();
    
    // MongoDB bağlantısı
    await connect();

    // Kullanıcıyı bul
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Kullanıcı bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Şifre değişikliği kontrolü
    if (data.currentPassword && data.newPassword) {
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(data.currentPassword, user.password);
      
      if (!isValidPassword) {
        return new Response(JSON.stringify({ error: 'Mevcut şifre hatalı' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Yeni şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(data.newPassword, salt);
    }

    // Kullanıcı bilgilerini güncelle (şifre alanları hariç)
    const updatableFields = [
      'name', 'surname', 'phone', 'bio', 'website',
      'address', 'company', 'social', 'skills', 'education', 'preferences'
    ];
    
    updatableFields.forEach(field => {
      if (data[field] !== undefined) {
        user[field] = data[field];
      }
    });

    // Değişiklikleri kaydet
    await user.save();

    return new Response(JSON.stringify({ success: true, message: 'Profil başarıyla güncellendi' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    return new Response(JSON.stringify({ error: 'Sunucu hatası: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
