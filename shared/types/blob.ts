/**
 * @package shelby-shared-types
 * @version 1.0.0
 */

/**
 * Blob yönetimi ile ilgili tip tanımları
 */

import type { ShelbyNetwork } from './shelby'

// ============================================================================
// BLOB TİPLERİ
// ============================================================================

/**
 * Blob durumu
 */
export type BlobStatus = 'active' | 'expiring' | 'expired' | 'deleted'

/**
 * Blob storage türü
 */
export type BlobStorageType = 'hot' | 'cold' | 'archive'

/**
 * Blob etiketleri
 */
export type BlobTag = string

/**
 * Blob metadata girişi
 */
export interface BlobMetadata {
  /** Blob açıklaması */
  description?: string

  /** Oluşturma tarihi */
  createdAt?: Date

  /** Oluşturan hesap */
  createdBy?: string

  /** Proje adı */
  projectName?: string

  /** Kategori */
  category?: string

  /** Etiketler */
  tags?: BlobTag[]

  /** Özel veriler */
  custom?: Record<string, any>
}

/**
 * Blob detayları
 */
export interface BlobDetails {
  /** Blob ID'si */
  blobId: string

  /** Blob adı */
  name: string

  /** Tam blob adı (yol ile) */
  fullName: string

  /** Dosya boyutu (byte) */
  size: number

  /** MIME tipi */
  mimeType: string

  /** Yükleme tarihi */
  uploadedAt: Date

  /** Son erişim tarihi */
  lastAccessedAt?: Date

  /** Son kullanma tarihi */
  lastUsedAt?: Date

  /** Sona erime tarihi */
  expiresAt: Date

  /** Blob durumu */
  status: BlobStatus

  /** Yükleyen hesap */
  uploadedBy: string

  /** Yükleyen ağ */
  network: ShelbyNetwork

  /** CRC32 checksum */
  checksum?: string

  /** Etiketler */
  tags?: BlobTag[]

  /** Storage türü */
  storageType?: BlobStorageType

  /** Erişim sayısı */
  accessCount?: number

  /** CRC32 doğrulanma sayısı */
  crcCheckCount?: number

  /** Blob metadata'ı */
  metadata?: BlobMetadata

  /** Yüklenme URL'i (geçici erişim için) */
  downloadUrl?: string

  /** CDN URL'si (varsa) */
  cdnUrl?: string
}

/**
 * Blob listesi için sayfalama ayarları
 */
export interface BlobListOptions {
  /** Durum filtresi */
  status?: BlobStatus[]

  /** Yükleyen hesap filtresi */
  uploadedBy?: string

  /** Ağ filtresi */
  network?: ShelbyNetwork

  /** Etiket filtresi */
  tags?: BlobTag[]

  /** Sona erime tarihi filtresi (öncesi/sonrası) */
  expiresBefore?: Date

  /** Sona erime tarihi filtresi (sonrası/öncesi) */
  expiresAfter?: Date

  /** Minimum boyut filtresi */
  minSize?: number

  /** Maksimum boyut filtresi */
  maxSize?: number

  /** Arama terimi */
  search?: string

  /** Sayfa boyutu (varsayılan: 50) */
  limit?: number

  /** Offset (ata sayfa için) */
  offset?: number

  /** Sıralama (asc/desc) */
  order?: 'asc' | 'desc'

  /** Sıralama alanı */
  sortBy?: 'name' | 'size' | 'uploadedAt' | 'expiresAt' | 'lastAccessedAt'
}

/**
 * Blob listesi sonucu
 */
export interface BlobListResult {
  /** Toplam blob sayısı */
  total: number

  /** Bu sayfadaki blob sayısı */
  count: number

  /** Sayfa boyutu */
  limit: number

  /** Offset */
  offset: number

  /** Sonraki sayfa var mı? */
  hasMore: boolean

  /** Blob listesi */
  blobs: BlobDetails[]
}

/**
 * Blob silme isteği
 */
export interface DeleteBlobRequest {
  /** Blob adı veya ID'si */
  blob: string

  /** Silmeden önce onay iste */
  confirm?: boolean
}

/**
 * Blob silme sonucu
 */
export interface DeleteBlobResult {
  /** Başarılı mı? */
  success: boolean

  /** Silinen blob ID'si */
  blobId?: string

  /** Hata mesajı */
  error?: string
}

/**
 * Blob metadata güncelleme isteği
 */
export interface UpdateBlobMetadataRequest {
  /** Blob adı veya ID'si */
  blob: string

  /** Güncellenecek metadata */
  metadata: Partial<BlobMetadata>

  /** Yeni etiketler (mevcutlerin yerine) */
  replaceTags?: boolean
}

/**
 * Blob yenileme isteği
 */
export interface RenewBlobRequest {
  /** Blob adı veya ID'si (veya hepsi için '*') */
  blob: string | string[]

  /** Yeni sona erime tarihi */
  expiresAt: Date

  /** Tüm bloblar için mi? */
  all?: boolean

  /** Onaysız istekleri */
  confirm?: boolean
}

/**
 * Blob yenileme sonucu
 */
export interface RenewBlobResult {
  /** Başarılı yenilenmeler */
  renewed: string[]

  /** Başarısız yenilenmeler */
  failed: {
    blob: string
    error: string
  }[]

  /** Toplam maliyet (ShelbyUSD) */
  totalCost?: number

  /** Bilgi mesajı */
  message?: string
}

/**
 * Blob arama sonucu
 */
export interface BlobSearchResult {
  /** Aranan bloblar */
  results: BlobDetails[]

  /** Toplam sayı */
  total: number

  /** Arama süresi (ms) */
  duration: number
}

/**
 * Blob istatistikleri
 */
export interface BlobStats {
  /** Toplam blob sayısı */
  totalBlobs: number

  /** Toplam boyut (byte) */
  totalSize: number

  /** Duruma göre blob sayısı */
  byStatus: Record<BlobStatus, number>

  /** Storage türüne göre blob sayısı */
  byStorageType: Record<BlobStorageType, number>

  /** Ağa göre blob sayısı */
  byNetwork: Record<ShelbyNetwork, number>

  /** Ortalama blob boyutu (byte) */
  averageSize: number

  /** Toplam erişim sayısı */
  totalAccesses: number

  /** En çok erişilen blob */
  mostAccessed?: BlobDetails
}

/**
 * Blob geçmişi
 */
export interface BlobFilter {
  /** Durum filtresi */
  status?: BlobStatus[]

  /** Storage türü filtresi */
  storageType?: BlobStorageType[]

  /** Ağ filtresi */
  network?: ShelbyNetwork

  /** Etiket filtresi */
  tags?: BlobTag[]

  /** Aranan etiket (veya herhangi biri) */
  hasAnyTag?: boolean

  /** Oluşturma tarihi aralığı */
  createdAfter?: Date

  /** Oluşturma tarihi aralığı */
  createdBefore?: Date

  /** Sona erime aralığı (gün) */
  expiringWithinDays?: number
}
