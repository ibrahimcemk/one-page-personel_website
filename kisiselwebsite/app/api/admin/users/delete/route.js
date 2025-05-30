import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { connect } from '@/lib/mongodb';
import User from '@/models/User';

// Kullanıcı silme API endpoint'i - sadece adminler için
export async function DELETE(request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmalısınız' },
        { status: 401 }
      );
    }
    
    // Admin rolü kontrolü
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekiyor' },
        { status: 403 }
      );
    }
    
    // URL'den userId parametresini al
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID parametresi gerekli' },
        { status: 400 }
      );
    }
    
    // MongoDB bağlantısı
    await connect();
    
    // Adminlerin kendilerini silemeyeceğini kontrol et
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Kendi hesabınızı silemezsiniz' },
        { status: 400 }
      );
    }
    
    // Silinecek kullanıcının varlığını kontrol et
    const userToDelete = await User.findById(userId);
    
    if (!userToDelete) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
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
