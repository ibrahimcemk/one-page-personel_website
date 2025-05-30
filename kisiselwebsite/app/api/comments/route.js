import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Comment from '@/models/Comment';
import { getServerSession } from 'next-auth';

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfoy');
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
    throw new Error('Veritabanına bağlanılamadı');
  }
}

// Projeye ait yorumları getirme
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project');

  if (!projectId) {
    return NextResponse.json({ error: "'Proje ID'si gerekli" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const comments = await Comment.find({ project: projectId, parent: null })
      .populate('user', 'name email profilePicture')
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'name email profilePicture'
        }
      })
      .sort({ createdAt: -1 });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Yorumlar getirilemedi:', error);
    return NextResponse.json({ error: 'Yorumlar getirilemedi' }, { status: 500 });
  }
}

// Yeni yorum oluşturma
export async function POST(request) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Yorum yapmak için giriş yapın' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { content, projectId, parentId } = body;
    
    if (!content || !projectId) {
      return NextResponse.json({ error: "'İçerik ve proje ID'si gerekli" }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const commentData = {
      content,
      project: projectId,
      user: session.user.id,
    };
    
    // Eğer bir yoruma cevap ise
    if (parentId) {
      commentData.parent = parentId;
      
      // Yorum oluştur
      const comment = await Comment.create(commentData);
      
      // Üst yoruma cevabı ekle
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: comment._id }
      });
      
      return NextResponse.json(comment, { status: 201 });
    } else {
      // Yeni ana yorum
      const comment = await Comment.create(commentData);
      return NextResponse.json(comment, { status: 201 });
    }
  } catch (error) {
    console.error('Yorum oluşturma hatası:', error);
    return NextResponse.json({ error: 'Yorum oluşturulamadı' }, { status: 500 });
  }
}
