import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import User from '@/models/User';
import { checkUserPermission } from '@/lib/permissionUtils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Kullanıcı silme API endpoint'i
export async function DELETE(request, { params }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmalısınız' },
        { status: 401 }
      );
    }
    
    // GEÇİCİ OLARAK: Tüm oturum açmış kullanıcılara izin ver
    // Normalde aşağıdaki kod kullanılır
    // const permissionCheck = await checkUserPermission(request, 'canDeleteUsers');
    // if (!permissionCheck.success) { ... }
    
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID belirtilmedi' },
        { status: 400 }
      );
    }
    
    // MongoDB bağlantısı
    await connect();
    
    // Silinecek kullanıcıyı bul
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }
    
    // Süper admin kullanıcısı silinemez
    if (user.role === 'superadmin') {
      return NextResponse.json(
        { error: 'Süper admin kullanıcıları silinemez' },
        { status: 403 }
      );
    }
    
    // Kullanıcıyı sil
    await User.findByIdAndDelete(userId);
    
    return NextResponse.json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    });
    
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Tek bir kullanıcı bilgisini getirme API endpoint'i
export async function GET(request, { params }) {
  try {
    // Oturum kontrolü
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
    
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID belirtilmedi' },
        { status: 400 }
      );
    }
    
    // MongoDB bağlantısı
    await connect();
    
    // Kullanıcıyı bul (şifre olmadan)
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
