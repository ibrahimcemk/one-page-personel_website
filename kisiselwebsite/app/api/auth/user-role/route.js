import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// Kullanıcının rol bilgisini döndüren API endpoint'i
export async function GET() {
  try {
    // Next.js 13.4 ve sonrasında getServerSession parametresiz kullanılabilir
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Oturum açılmamış" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        image: session.user.image
      }
    });
  } catch (error) {
    console.error("Kullanıcı rolü alınırken hata:", error);
    return NextResponse.json(
      { error: "Rol sorgulanırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
