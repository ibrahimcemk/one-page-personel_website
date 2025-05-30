import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lu00fctfen bau015flu0131k giriniz'],
      maxlength: [100, 'Bau015flu0131k 100 karakterden uzun olamaz'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Lu00fctfen au00e7u0131klama giriniz'],
      maxlength: [2000, 'Au00e7u0131klama 2000 karakterden uzun olamaz'],
    },
    category: {
      type: String,
      required: [true, 'Lu00fctfen kategori giriniz'],
      enum: ['Web Tasaru0131m', 'Mobil Uygulama', 'Grafik Tasaru0131m', 'Diu011fer'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Lu00fctfen resim URL\'si giriniz'],
    },
    projectUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
