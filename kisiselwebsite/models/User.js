import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lütfen isim giriniz'],
      maxlength: [60, 'İsim 60 karakterden uzun olamaz'],
    },
    surname: {
      type: String,
      required: [true, 'Lütfen soyisim giriniz'],
      maxlength: [60, 'Soyisim 60 karakterden uzun olamaz'],
    },
    email: {
      type: String,
      required: [true, 'Lütfen email giriniz'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email adresi giriniz'],
    },
    password: {
      type: String,
      required: [true, 'Lütfen şifre giriniz'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
      select: false,
    },
    phone: {
      type: String,
      match: [/^\+?[0-9]{10,14}$/, 'Geçerli bir telefon numarası giriniz'],
    },
    role: {
      type: String,
      enum: ['user', 'editor', 'manager', 'admin', 'superadmin'],
      default: 'user',
    },
    permissions: {
      // Temel kullanıcı izinleri
      canViewDashboard: { type: Boolean, default: false },
      canManageOwnProfile: { type: Boolean, default: true },
      
      // İçerik yönetimi izinleri
      canCreateContent: { type: Boolean, default: false },
      canEditContent: { type: Boolean, default: false },
      canDeleteContent: { type: Boolean, default: false },
      canPublishContent: { type: Boolean, default: false },
      
      // Kullanıcı yönetimi izinleri
      canViewUsers: { type: Boolean, default: false },
      canCreateUsers: { type: Boolean, default: false },
      canEditUsers: { type: Boolean, default: false },
      canDeleteUsers: { type: Boolean, default: false },
      canChangeUserRoles: { type: Boolean, default: false },
      
      // Proje yönetimi izinleri
      canViewProjects: { type: Boolean, default: false },
      canCreateProjects: { type: Boolean, default: false },  // Food Pattern, Ride Service, Travel App gibi projeler için
      canEditProjects: { type: Boolean, default: false },
      canDeleteProjects: { type: Boolean, default: false },
      
      // Site ayarları izinleri
      canManageSettings: { type: Boolean, default: false },
      canManageSecurity: { type: Boolean, default: false },
      
      // Sistem yönetimi izinleri
      canAccessLogs: { type: Boolean, default: false },
      canViewStats: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    profilePicture: {
      type: String,
      default: '/images/default-profile.png',
    },
    bio: {
      type: String,
      maxlength: [500, 'Biyografi 500 karakterden uzun olamaz'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    company: {
      name: String,
      position: String,
    },
    website: String,
    social: {
      twitter: String,
      facebook: String,
      instagram: String,
      linkedin: String,
      github: String,
    },
    skills: [String],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startYear: Number,
        endYear: Number,
      }
    ],
    experience: [
      {
        company: String,
        position: String,
        description: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
      }
    ],
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verificationToken: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Kullanıcının tam adını döndüren bir method
UserSchema.methods.getFullName = function() {
  return `${this.name} ${this.surname}`;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
