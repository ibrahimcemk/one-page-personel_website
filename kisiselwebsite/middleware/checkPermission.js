// Bu dosya artık kullanılmıyor, lütfen lib/permissionUtils.js kullanınız
// Uyumluluk için burada bırakılmıştır

import { NextResponse } from 'next/server';
import { checkUserPermission, checkUserRole, checkSelfAction } from '@/lib/permissionUtils';

/**
 * @deprecated Yerine lib/permissionUtils.js içindeki checkUserPermission kullanın
 * Kullanıcının belirli bir izne sahip olup olmadığını kontrol eder
 */
export async function checkPermission(req, permission) {
  // Yeni fonksiyonu çağır
  return await checkUserPermission(req, permission);
}

/**
 * @deprecated Yerine lib/permissionUtils.js içindeki checkUserRole kullanın
 * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
 */
export async function checkRole(req, roles) {
  // Yeni fonksiyonu çağır
  return await checkUserRole(req, roles);
}

/**
 * @deprecated Yerine lib/permissionUtils.js içindeki checkSelfAction kullanın
 * Kullanıcının kendisiyle ilgili bir işlem yapıp yapmadığını kontrol eder
 */
export async function checkSelfAction(req, userId) {
  // Yeni fonksiyonu çağır
  return await checkUserPermission(req, 'canManageOwnProfile');
}
