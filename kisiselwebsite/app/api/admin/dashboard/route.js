import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connect } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// Dashboard verileri için API endpoint
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
    
    // Admin rolü kontrolü
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekiyor' },
        { status: 403 }
      );
    }
    
    // MongoDB bağlantısı
    await connect();
    
    // Kullanıcı sayısı ve son kullanıcılar
    const totalUsers = await User.countDocuments({});
    const recentUsers = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Son 7 gündeki yeni kullanıcı sayısı
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newUsers = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    
    // Kullanıcı büyüme oranı (son bir hafta)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const previousWeekUsers = await User.countDocuments({
      createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });
    
    const userGrowthRate = previousWeekUsers > 0 
      ? ((newUsers - previousWeekUsers) / previousWeekUsers) * 100 
      : newUsers > 0 ? 100 : 0;
    
    // Proje sayıları ve istatistikler (kullanıcının çalışmalarım bölümünden örnek projeler)
    const projectStats = {
      totalProjects: 3,
      recentProjects: [
        { id: '1', title: 'Food Pattern', author: 'İbrahim Çem', category: 'UI/UX Tasarım', createdAt: '2025-05-24' },
        { id: '2', title: 'Ride Service', author: 'İbrahim Çem', category: 'Mobil Uygulama', createdAt: '2025-05-25' },
        { id: '3', title: 'Travel App', author: 'İbrahim Çem', category: 'UI/UX Tasarım', createdAt: '2025-05-26' },
      ],
      newProjects: 1,
      projectGrowth: 33.0
    };
    
    // İstatistikleri hazırla
    const stats = {
      users: {
        total: totalUsers,
        new: newUsers,
        growthRate: parseFloat(userGrowthRate.toFixed(1))
      },
      projects: projectStats,
      totalViews: 1245, 
      totalComments: 28
    };
    
    return NextResponse.json({
      stats: stats,
      recentUsers: recentUsers
    });
    
  } catch (error) {
    console.error('Dashboard verileri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Dashboard verileri getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
