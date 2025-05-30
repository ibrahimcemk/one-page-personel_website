import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import { connect } from '@/lib/mongodb';

/**
 * Kullanıcının belirli bir izne sahip olup olmadığını kontrol eder
 * @param {Object} req - Next.js request nesnesi
 * @param {string} permission - Kontrol edilecek izin (örn. 'canViewUsers')
 * @returns {Promise<Object>} - {success: boolean, message: string} formatında sonuç
 */
export async function checkUserPermission(req, permission) {
  try {
    // Oturum bilgisini al
    const session = await getServerSession(authOptions);
    
    // Oturum yoksa veya kullanıcı yoksa erişim engellenir
    if (!session || !session.user) {
      return { 
        success: false, 
        message: 'Bu işlem için giriş yapmalısınız',
        status: 401 
      };
    }
    
    // Veritabanı bağlantısı
    await connect();
    
    // Güncel kullanıcı bilgilerini veritabanından al
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return { 
        success: false, 
        message: 'Kullanıcı bulunamadı',
        status: 404 
      };
    }
    
    // Süper admin her şeye erişebilir
    if (user.role === 'superadmin') {
      return { success: true };
    }
    
    // Kullanıcının istenilen izne sahip olup olmadığını kontrol et
    if (!user.permissions || !user.permissions[permission]) {
      return { 
        success: false, 
        message: 'Bu işlem için yeterli yetkiniz bulunmuyor',
        status: 403 
      };
    }
    
    // İzin varsa başarılı sonuç döndür
    return { success: true };
  } catch (error) {
    console.error('Yetki kontrolü hatası:', error);
    return { 
      success: false, 
      message: 'Yetki kontrolü sırasında bir hata oluştu',
      status: 500 
    };
  }
}

/**
 * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
 * @param {Object} req - Next.js request nesnesi
 * @param {Array<string>} roles - İzin verilen roller dizisi (örn. ['admin', 'superadmin'])
 * @returns {Promise<Object>} - {success: boolean, message: string} formatında sonuç
 */
export async function checkUserRole(req, roles) {
  try {
    // Oturum bilgisini al
    const session = await getServerSession(authOptions);
    
    // Oturum yoksa veya kullanıcı yoksa erişim engellenir
    if (!session || !session.user) {
      return { 
        success: false, 
        message: 'Bu işlem için giriş yapmalısınız',
        status: 401 
      };
    }
    
    // Veritabanı bağlantısı
    await connect();
    
    // Güncel kullanıcı bilgilerini veritabanından al
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return { 
        success: false, 
        message: 'Kullanıcı bulunamadı',
        status: 404 
      };
    }
    
    // Kullanıcının rolünün izin verilen roller içinde olup olmadığını kontrol et
    if (!roles.includes(user.role)) {
      return { 
        success: false, 
        message: 'Bu işlem için yeterli yetkiniz bulunmuyor',
        status: 403 
      };
    }
    
    // İzin varsa başarılı sonuç döndür
    return { success: true };
  } catch (error) {
    console.error('Rol kontrolü hatası:', error);
    return { 
      success: false, 
      message: 'Rol kontrolü sırasında bir hata oluştu',
      status: 500 
    };
  }
}

/**
 * Kullanıcının kendisiyle ilgili bir işlem yapıp yapmadığını kontrol eder
 * @param {Object} req - Next.js request nesnesi
 * @param {string} userId - Hedef kullanıcı ID'si
 * @returns {Promise<Object>} - {success: boolean, message: string} formatında sonuç
 */
export async function checkSelfAction(req, userId) {
  try {
    // Oturum bilgisini al
    const session = await getServerSession(authOptions);
    
    // Oturum yoksa veya kullanıcı yoksa erişim engellenir
    if (!session || !session.user) {
      return { 
        success: false, 
        message: 'Bu işlem için giriş yapmalısınız',
        status: 401 
      };
    }
    
    // Veritabanı bağlantısı
    await connect();
    
    // Güncel kullanıcı bilgilerini veritabanından al
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return { 
        success: false, 
        message: 'Kullanıcı bulunamadı',
        status: 404 
      };
    }
    
    // Admin veya süper admin her kullanıcıya erişebilir
    if (['admin', 'superadmin'].includes(user.role)) {
      return { success: true };
    }
    
    // Kullanıcı kendi profiline erişim sağlıyorsa izin ver
    if (user._id.toString() === userId) {
      return { success: true };
    }
    
    // Başka bir kullanıcının bilgilerine erişmeye çalışıyorsa engelle
    return { 
      success: false, 
      message: 'Yalnızca kendi hesabınızı yönetebilirsiniz',
      status: 403 
    };
  } catch (error) {
    console.error('Kullanıcı kontrolü hatası:', error);
    return { 
      success: false, 
      message: 'Kullanıcı kontrolü sırasında bir hata oluştu',
      status: 500 
    };
  }
}
