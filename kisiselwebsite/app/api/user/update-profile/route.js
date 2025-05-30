import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Kullanıcı profil güncelleme API endpoint'i
export async function PUT(request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmalısınız' },
        { status: 401 }
      );
    }
    
    // Kullanıcı verilerini al
    const { name, bio, currentPassword, newPassword, social } = await request.json();
    
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfoy');
    
    // Kullanıcıyı bul
    const user = await User.findById(session.user.id).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }
    
    // Güncellenecek alanları belirle
    const updateData = {};
    
    // İsim güncellemesi
    if (name) updateData.name = name;
    
    // Bio güncellemesi
    if (bio) updateData.bio = bio;
    
    // Sosyal medya hesapları güncellemesi
    if (social) {
      updateData.social = {
        ...(user.social || {}),
        ...social
      };
    }
    
    // Şifre güncellemesi istenmişse
    if (currentPassword && newPassword) {
      // Mevcut şifreyi kontrol et
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return NextResponse.json(
          { error: 'Mevcut şifre hatalı' },
          { status: 400 }
        );
      }
      
      // Yeni şifreyi şifrele
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }
    
    // Kullanıcıyı güncelle
    await User.findByIdAndUpdate(user._id, updateData, { new: true });
    
    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Profil güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
