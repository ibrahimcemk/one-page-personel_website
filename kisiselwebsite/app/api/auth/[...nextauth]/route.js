import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '@/models/User';
import clientPromise from '@/lib/mongodb';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfoy');
        
        // Find user by email
        const user = await User.findOne({ email: credentials.email }).select('+password');
        
        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error('Email veya şifre hatalı');
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.profilePicture,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // İlk oturum açma sırasında kullanıcı nesnesi mevcut olacaktır
      if (user) {
        token.id = user.id;
        token.role = 'admin';  // GEÇİCİ: Tüm kullanıcılar admin
        token.email = user.email;
        token.name = user.name;
        
        // Gerekli tüm izinleri ekle
        token.permissions = {
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
      }
      return token;
    },
    async session({ session, token }) {
      // JWT token'dan session nesnesine bilgileri aktar
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.permissions = token.permissions;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'portfoy-gizli-anahtar',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
