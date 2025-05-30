import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { connect } from '@/lib/mongodb';
import User from '@/models/User';
import { checkUserRole } from '@/lib/permissionUtils';

// Kullanıcı rollerini ve izinlerini güncelleme API endpoint'i
export async function PUT(request) {
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
    // const roleCheck = await checkUserRole(request, ['admin', 'superadmin']);
    // if (!roleCheck.success) { ... }
    
    // Veriyi al
    const data = await request.json();
    const { userId, role, permissions } = data;
    
    // Gerekli alanların kontrolü
    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID belirtilmedi' },
        { status: 400 }
      );
    }
    
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
    
    // Süper admin dışındaki roller, süper adminleri düzenleyemez
    if (user.role === 'superadmin' && session.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Süper admin kullanıcılarını sadece süper adminler düzenleyebilir' },
        { status: 403 }
      );
    }
    
    // Kendi rolünüz düşüremezsiniz
    if (user._id.toString() === session.user.id && role && role !== user.role) {
      return NextResponse.json(
        { error: 'Kendi kullanıcı rolünüzü değiştiremezsiniz' },
        { status: 403 }
      );
    }
    
    // Rol güncelleme
    if (role) {
      // Normal admin, süper admin rolü atayamaz
      if (role === 'superadmin' && session.user.role !== 'superadmin') {
        return NextResponse.json(
          { error: 'Süper admin rolünü sadece mevcut süper adminler atayabilir' },
          { status: 403 }
        );
      }
      
      user.role = role;
      
      // Varsayılan rol izinlerini ayarla
      switch (role) {
        case 'user':
          user.permissions = {
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
          user.permissions = {
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
          user.permissions = {
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
            canCreateProjects: true,  // Food Pattern, Ride Service, Travel App projelerini yönetebilir
            canEditProjects: true,
            canDeleteProjects: false,
            canManageSettings: false,
            canManageSecurity: false,
            canAccessLogs: false,
            canViewStats: true
          };
          break;
          
        case 'admin':
          user.permissions = {
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
          user.permissions = {
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
    }
    
    // Özel izinleri güncelle (eğer belirtilmişse)
    if (permissions) {
      // Sadece süper admin özel izinleri atayabilir
      if (session.user.role !== 'superadmin') {
        return NextResponse.json(
          { error: 'Özel izinleri sadece süper adminler atayabilir' },
          { status: 403 }
        );
      }
      
      // Her izni ayrı ayrı kontrol et ve güncelle
      Object.keys(permissions).forEach(key => {
        if (user.permissions.hasOwnProperty(key)) {
          user.permissions[key] = permissions[key];
        }
      });
    }
    
    // Değişiklikleri kaydet
    await user.save();
    
    // Güncellenmiş kullanıcıyı döndür (şifre olmadan)
    const updatedUser = { ...user.toJSON() };
    delete updatedUser.password;
    
    return NextResponse.json({
      success: true,
      message: 'Kullanıcı yetkileri başarıyla güncellendi',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Kullanıcı yetkileri güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı yetkileri güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Varsayılan rol izinlerini getiren API endpoint'i
export async function GET(request) {
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
    // const roleCheck = await checkUserRole(request, ['admin', 'superadmin']);
    // if (!roleCheck.success) { ... }
    
    // Varsayılan rol izinlerini döndür
    const defaultPermissions = {
      user: {
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
      },
      editor: {
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
      },
      manager: {
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
      },
      admin: {
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
      },
      superadmin: {
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
      }
    };
    
    return NextResponse.json(defaultPermissions);
    
  } catch (error) {
    console.error('Varsayılan izinleri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Varsayılan izinler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
