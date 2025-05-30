import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth';

// Bağlantı fonksiyonu
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfoy');
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
    throw new Error('Veritabanına bağlanılamadı');
  }
}

// Tüm kullanıcıları getirme (sadece admin için)
export async function GET(request) {
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const users = await User.find().select('-password');
    return NextResponse.json(users);
  } catch (error) {
    console.error('Kullanıcılar getirilemedi:', error);
    return NextResponse.json({ error: 'Kullanıcılar getirilemedi' }, { status: 500 });
  }
}

// Yeni kullanıcı oluşturma
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;
    
    // Admin rolü ataması için kontrol
    if (role === 'admin') {
      const session = await getServerSession();
      if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Admin rolü atama yetkiniz yok' }, { status: 403 });
      }
    }
    
    await connectToDatabase();
    
    // Email kullanımda mı kontrol et
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: 'Bu email adresi zaten kullanımda' }, { status: 400 });
    }
    
    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Kullanıcıyı oluştur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });
    
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    return NextResponse.json({ error: 'Kullanıcı oluşturulamadı' }, { status: 500 });
  }
}
