import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfoy');
  } catch (error) {
    console.error('Veritabanu0131 bau011flantu0131 hatasu0131:', error);
    throw new Error('Veritabanu0131na bau011flanu0131lamadu0131');
  }
}

// Tu00fcm projeleri getirme
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');
  const category = searchParams.get('category');
  const authorId = searchParams.get('author');

  const query = {};
  
  if (featured === 'true') {
    query.featured = true;
  }
  
  if (category) {
    query.category = category;
  }
  
  if (authorId) {
    query.author = authorId;
  }

  try {
    await connectToDatabase();
    const projects = await Project.find(query)
      .populate('author', 'name email profilePicture')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projeler getirilemedi:', error);
    return NextResponse.json({ error: 'Projeler getirilemedi' }, { status: 500 });
  }
}

// Yeni proje oluu015fturma
export async function POST(request) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Lu00fctfen giriu015f yapu0131n' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, category, imageUrl, projectUrl, githubUrl, tags, featured } = body;
    
    // Slug oluu015ftur
    const slug = title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    
    // Admin kontrolu00fc - featured u00f6zelliu011fi iu00e7in
    if (featured && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'u00d6ne u00e7u0131kan proje oluu015fturmak iu00e7in admin yetkileri gerekli' }, { status: 403 });
    }
    
    await connectToDatabase();
    
    const project = await Project.create({
      title,
      slug,
      description,
      category,
      imageUrl,
      projectUrl,
      githubUrl,
      tags: tags || [],
      featured: featured && session.user.role === 'admin' ? featured : false,
      author: session.user.id,
    });
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Proje oluu015fturma hatasu0131:', error);
    return NextResponse.json({ error: 'Proje oluu015fturulamadu0131' }, { status: 500 });
  }
}
