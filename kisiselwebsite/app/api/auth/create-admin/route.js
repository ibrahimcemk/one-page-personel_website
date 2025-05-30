import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '@/models/User';

// Bu API endpoint'i, ilk admin hesabını oluşturmak için kullanılır.
// Güvenlik nedeniyle, sadece development ortamında veya ilk kurulumda kullanılmalıdır.
export async function POST(request) {
  try {
    const { name, email, password, secretKey } = await request.json();

    // Güvenlik kontrolü - Bu secretKey'i kendi belirlediğiniz bir değerle değiştirin
    const validSecretKey = process.env.ADMIN_SECRET_KEY || 'adminGizliAnahtar123';
    if (secretKey !== validSecretKey) {
      return NextResponse.json({ error: 'Geçersiz güvenlik anahtarı' }, { status: 403 });
    }

    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfoy');

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Bu email adresi zaten kullanılıyor' }, { status: 400 });
    }

    // Şifre şifreleme
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Admin kullanıcısı oluşturma
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin', // Admin rolü atanıyor
      createdAt: new Date(),
      profilePicture: '',
      bio: 'Site Yöneticisi',
      social: {
        twitter: '',
        linkedin: '',
        github: ''
      }
    });

    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Admin hesabı başarıyla oluşturuldu'
    }, { status: 201 });
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
    return NextResponse.json({
      error: 'Admin hesabı oluşturulurken bir hata oluştu',
      details: error.message
    }, { status: 500 });
  }
}
