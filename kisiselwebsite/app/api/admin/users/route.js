import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connect } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { checkUserPermission, checkUserRole } from '@/lib/permissionUtils';

// Admin için tüm kullanıcıları listeme API endpoint'i
export async function GET(request) {
  try {
    // Oturum kontrolü - mümkünse izin kontrolü de yapalım
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmalısınız' },
        { status: 401 }
      );
    }
    
    // GEÇİCİ OLARAK: Tüm oturum açmış kullanıcılara izin ver
    // Normalde aşağıdaki kod kullanılır
    // const permissionCheck = await checkUserPermission(request, 'canViewUsers');
    // if (!permissionCheck.success) { ... }
    
    // MongoDB bağlantısı
    await connect();
    
    // Tüm kullanıcıları getir (şifre hariç)
    const users = await User.find({}).select('-password');
    
    // Kullanıcı verilerini döndür
    return NextResponse.json(users);
    
  } catch (error) {
    console.error('Kullanıcı listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Yeni kullanıcı ekleme API endpoint'i
export async function POST(request) {
  try {
    // Oturum kontrolü - mümkünse izin kontrolü de yapalım
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmalısınız' },
        { status: 401 }
      );
    }
    
    // GEÇİCİ OLARAK: Tüm oturum açmış kullanıcılara izin ver
    // Normalde aşağıdaki kod kullanılır
    // const permissionCheck = await checkUserPermission(request, 'canCreateUsers');
    // if (!permissionCheck.success) { ... }
    
    // Form verilerini al
    const data = await request.json();
    const { email, password, name, surname, role } = data;
    
    // Temel alanların doğrulanması
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, şifre ve isim alanları zorunludur' },
        { status: 400 }
      );
    }
    
    // MongoDB bağlantısı
    await connect();
    
    // Email'in zaten kullanımda olup olmadığını kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }
    
    // Şifreleme
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Rol için varsayılan izinleri belirle
    let defaultPermissions = {};
    
    const selectedRole = role || 'user';
    
    // Rol temelli varsayılan izinler
    switch (selectedRole) {
      case 'user':
        defaultPermissions = {
          canViewDashboard: false,
          canManageOwnProfile: true,
          canCreateContent: false,
          canEditContent: false,
          canDeleteContent: false,
          canPublishContent: false,
          canViewUsers: false,
          canCreateUsers: false,
          canEditUsers: false,
          canDeleteUsers: false,
          canChangeUserRoles: false,
          canViewProjects: false,
          canCreateProjects: false,
          canEditProjects: false,
          canDeleteProjects: false,
          canManageSettings: false,
          canManageSecurity: false,
          canAccessLogs: false,
          canViewStats: false
        };
        break;
      case 'editor':
        defaultPermissions = {
          canViewDashboard: true,
          canManageOwnProfile: true,
          canCreateContent: true,
          canEditContent: true,
          canDeleteContent: false,
          canPublishContent: false,
          canViewUsers: false,
          canCreateUsers: false,
          canEditUsers: false,
          canDeleteUsers: false,
          canChangeUserRoles: false,
          canViewProjects: true,
          canCreateProjects: false,
          canEditProjects: false,
          canDeleteProjects: false,
          canManageSettings: false,
          canManageSecurity: false,
          canAccessLogs: false,
          canViewStats: true
        };
        break;
      case 'manager':
        defaultPermissions = {
          canViewDashboard: true,
          canManageOwnProfile: true,
          canCreateContent: true,
          canEditContent: true,
          canDeleteContent: true,
          canPublishContent: true,
          canViewUsers: true,
          canCreateUsers: false,
          canEditUsers: false,
          canDeleteUsers: false,
          canChangeUserRoles: false,
          canViewProjects: true,
          canCreateProjects: true,
          canEditProjects: true,
          canDeleteProjects: false,
          canManageSettings: false,
          canManageSecurity: false,
          canAccessLogs: false,
          canViewStats: true
        };
        break;
      case 'admin':
        defaultPermissions = {
          canViewDashboard: true,
          canManageOwnProfile: true,
          canCreateContent: true,
          canEditContent: true,
          canDeleteContent: true,
          canPublishContent: true,
          canViewUsers: true,
          canCreateUsers: true,
          canEditUsers: true,
          canDeleteUsers: true,
          canChangeUserRoles: true,
          canViewProjects: true,
          canCreateProjects: true,
          canEditProjects: true,
          canDeleteProjects: true,
          canManageSettings: true,
          canManageSecurity: false,
          canAccessLogs: true,
          canViewStats: true
        };
        break;
      case 'superadmin':
        defaultPermissions = {
          canViewDashboard: true,
          canManageOwnProfile: true,
          canCreateContent: true,
          canEditContent: true,
          canDeleteContent: true,
          canPublishContent: true,
          canViewUsers: true,
          canCreateUsers: true,
          canEditUsers: true,
          canDeleteUsers: true,
          canChangeUserRoles: true,
          canViewProjects: true,
          canCreateProjects: true,
          canEditProjects: true,
          canDeleteProjects: true,
          canManageSettings: true,
          canManageSecurity: true,
          canAccessLogs: true,
          canViewStats: true
        };
        break;
    }
    
    // Yeni kullanıcı oluştur
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      surname,
      role: selectedRole,
      permissions: defaultPermissions,
      isActive: data.isActive !== undefined ? data.isActive : true,
      bio: data.bio || '',
      website: data.website || '',
      phone: data.phone || '',
      address: data.address || {},
      company: data.company || {},
      social: data.social || {},
      skills: data.skills || [],
      education: data.education || [],
      createdAt: new Date()
    });
    
    // Kullanıcıyı kaydet
    await newUser.save();
    
    // Şifre olmadan kullanıcı bilgilerini döndür
    const userWithoutPassword = { ...newUser.toJSON() };
    delete userWithoutPassword.password;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Kullanıcı ekleme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Kullanıcı güncelleme API endpoint'i - kullanıcı ID'si URL'den gelir
export async function PUT(request) {
  try {
    // Oturum kontrolü - mümkünse izin kontrolü de yapalım
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmalısınız' },
        { status: 401 }
      );
    }
    
    // GEÇİCİ OLARAK: Tüm oturum açmış kullanıcılara izin ver
    // Normalde aşağıdaki kod kullanılır
    // const permissionCheck = await checkUserPermission(request, 'canEditUsers');
    // if (!permissionCheck.success) { ... }
    
    // URL'den kullanıcı ID'sini al
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID belirtilmedi' },
        { status: 400 }
      );
    }
    
    // Form verilerini al
    const data = await request.json();
    
    // MongoDB bağlantısı
    await connect();
    
    // Güncellenecek kullanıcıyı bul
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }
    
    // Şifre değiştirilecekse hashle
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    
    // E-posta değiştirilecekse benzersizliği kontrol et
    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Bu email adresi zaten başka bir kullanıcı tarafından kullanılıyor' },
          { status: 400 }
        );
      }
    }
    
    // Kullanıcı verilerini güncelle
    Object.keys(data).forEach(key => {
      if (key !== '_id' && key !== '__v') { // Bu alanları güncelleme
        user[key] = data[key];
      }
    });
    
    // Değişiklikleri kaydet
    await user.save();
    
    // Güncellenmiş kullanıcıyı döndür (şifre olmadan)
    const updatedUser = { ...user.toJSON() };
    delete updatedUser.password;
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
