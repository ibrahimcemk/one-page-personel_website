'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminAccess({ children }) {
  const { data: session, status } = useSession();
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Oturum yükleniyor
    if (status === 'loading') return;

    // Oturum yoksa login sayfasına yönlendir
    if (!session) {
      router.push('/auth/login');
      return;
    }

    // Admin rolü yoksa ana sayfaya yönlendir
    if (session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    // Admin yetkisi onaylandı
    setAuthorized(true);
  }, [session, status, router]);

  // Yükleniyor veya yetki kontrolü yapılıyor
  if (status === 'loading' || !authorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Admin yetkisi var, içeriği göster
  return <>{children}</>;
}
