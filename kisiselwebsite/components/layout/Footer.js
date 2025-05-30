export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white py-4" style={{ backgroundColor: '#001045' }}>
      {/* 12 kolonlu grid container */}
      <div className="max-w-[1335px] mx-auto grid grid-cols-12 gap-x-[15px] px-[15px]">
        {/* Footer içeriği tüm genişlik */}
        <div className="col-span-12">
          <p className="text-center text-sm">
            Copyright © {currentYear} Tüm Hakları Saklıdır. Bu Sayfa İbrahim Cem Keleş Tarafından Yapılmıştır Sayfa Ve Diğer Haklar İçin İletişime Geçebilirsiniz...
          </p>
        </div>
      </div>
    </footer>
  );
}
