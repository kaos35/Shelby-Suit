/**
 * Shelby Protocol - Temel Tip Tanımları
 *
 * @package shelby-shared-types
 * @version 1.0.0
 */

// ============================================================================
// TEMEL TİPLER
// ============================================================================

/**
 * Shelby ağ türü
 */
export type ShelbyNetwork = 'local' | 'shelbynet' | 'mainnet'

/**
 * Blob durumu
 */
export type BlobStatus = 'active' | 'expiring' | 'expired' | 'deleted'

/**
 * Upload durumu
 */
export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'failed' | 'retrying'

/**
 * İş durumu
 */
export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

// ============================================================================
// ACCOUNT TİPLERİ
// ============================================================================

/**
 * Hesap bilgisi
 */
export interface Account {
  /** Hesap adı (benzersiz tanımlayıcı) */
  name: string

  /** Kullanılan ağ */
  network: ShelbyNetwork

  /** Hesap cüzdan adresi */
  address: string

  /** Özel anahtar (şifrelenmiş) */
  privateKey?: string

  /** Günlük yükleme limiti */
  maxDaily?: number

  /** Günlük sayaç */
  dailyCount: number

  /** Token bakiyeleri */
  balances: {
    /** Aptos bakiyesi */
    apt: number
    /** ShelbyUSD bakiyesi */
    shelbyUSD: number
  }

  /** Hesap durum bayrağı */
  enabled: boolean

  /** Son çalıştırma zamanı */
  lastUsed?: Date

  /** API key */
  apiKey?: string

  /** Hesap ağırlığı */
  weight?: number
}

// ============================================================================
// BLOB TİPLERİ
// ============================================================================

/**
 * Blob metadatası
 */
export interface BlobMetadata {
  /** Blob benzersiz tanımlayıcısı */
  blobId: string

  /** Blob adı */
  name: string

  /** Dosya boyutu (byte) */
  size: number

  /** MIME tipi */
  mimeType: string

  /** Upload zamanı */
  uploadedAt: Date

  /** Son kullanma zamanı */
  lastAccessed?: Date

  /** Sona erme zamanı */
  expiresAt: Date

  /** Blob durumu */
  status: BlobStatus

  /** Yükleyen hesap */
  uploadedBy: string

  /** CRC32 checksum */
  checksum?: string

  /** Etiketler */
  tags?: string[]

  /** Özel veriler */
  metadata?: Record<string, any>
}

/**
 * Blob listesi filtre options
 */
export interface BlobListOptions {
  /** Durum filtresi */
  status?: BlobStatus[]

  /** Hesap filtresi */
  uploadedBy?: string

  /** Sona erme tarihi filtresi */
  expiresBefore?: Date

  /** Sona erme tarihi filtresi */
  expiresAfter?: Date

  /** Minimum boyut */
  minSize?: number

  /** Maksimum boyut */
  maxSize?: number

  /** Etiket filtresi */
  tags?: string[]

  /** Sayfalama (varsayılan: 50) */
  limit?: number

  /** Offset */
  offset?: number
}

// ============================================================================
// UPLOAD TİPLERİ
// ============================================================================

/**
 * Upload seçenekleri
 */
export interface UploadOptions {
  /** Blob adı */
  name: string

  /** Yüklenecek dosya */
  file: File | string

  /** Sona erme tarihi */
  expiresAt?: Date | string

  /** Otomatik onay (varsayılan: true) */
  assumeYes?: boolean

  /** İlerleme callback'i */
  onProgress?: (progress: number) => void

  /** Chunk boyutu (varsayılan: 10MB) */
  chunkSize?: number

  /** Paralel upload sayısı */
  parallelism?: number

  /** Yeniden deneme sayısı */
  maxRetries?: number

  /** Yeniden deneme arası (ms) */
  retryDelay?: number

  /** Özel metadata */
  metadata?: Record<string, any>

  /** Etiketler */
  tags?: string[]
}

/**
 * Upload ilerleme durumu
 */
export interface UploadProgress {
  /** Yükleme yüzdesi (0-100) */
  percent: number

  /** Yükleneb byte sayısı */
  uploaded: number

  /** Toplam boyut */
  total: number

  /** Hız (byte/saniye) */
  speed?: number

  /** Kalan zaman (saniye) */
  remaining?: number

  /** Durum */
  status: UploadStatus
}

/**
 * Upload sonucu
 */
export interface UploadResult {
  /** Başarılı mı? */
  success: boolean

  /** Blob ID */
  blobId?: string

  /** Blob URL'i */
  blobUrl?: string

  /** Hata mesajı */
  error?: string

  /** Yükleme detayları */
  progress?: UploadProgress

  /** İşlem süresi (ms) */
  duration: number
}

// ============================================================================
// DOWNLOAD TİPLERİ
// ============================================================================

/**
 * Download seçenekleri
 */
export interface DownloadOptions {
  /** İndirilecek blob ID veya adı */
  blob: string

  /** Kaydedilecek dosya yolu */
  destination?: string

  /** Paralel indirme sayısı */
  parallelism?: number

  /** Chunk boyutu */
  chunkSize?: number

  /** Yeniden deneme sayısı */
  maxRetries?: number

  /** Yeniden deneme arası (ms) */
  retryDelay?: number

  /** İlerleme callback'i */
  onProgress?: (progress: number) => void
}

/**
 * Download ilerleme durumu
 */
export interface DownloadProgress {
  /** İndirme yüzdesi (0-100) */
  percent: number

  /** İnenen byte sayısı */
  downloaded: number

  /** Toplam boyut */
  total: number

  /** Hız (byte/saniye) */
  speed?: number

  /** Kalan zaman (saniye) */
  remaining?: number
}

/**
 * Download sonucu
 */
export interface DownloadResult {
  /** Dosya yolu */
  path?: string

  /** Dosya içeriği (buffer) */
  data?: Buffer

  /** Hata mesajı */
  error?: string

  /** İndirme detayları */
  progress?: DownloadProgress

  /** İşlem süresi (ms) */
  duration: number
}

// ============================================================================
// BAKIYE TİPLERİ
// ============================================================================

/**
 * Bakiye bilgisi
 */
export interface BalanceInfo {
  /** Token sembüli */
  token: 'APT' | 'ShelbyUSD'

  /** Bakiye miktarı */
  amount: number

  /** Ham birim */
  rawAmount: number

  /** Ondalık sayısı */
  decimals: number
}

/**
 * Hesap bakiyesi
 */
export interface AccountBalance {
  /** Hesap adı */
  account: string

  /** Cüzdan adresi */
  address: string

  /** Bakiyeler */
  balances: BalanceInfo[]

  /** Son güncelleme */
  lastUpdated: Date
}

// ============================================================================
// HATA TİPLERİ
// ============================================================================

/**
 * Shelby hatası
 */
export class ShelbyError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ShelbyError'
  }

  /** Hata kodu */
  code?: string

  /** Detaylı bilgi */
  details?: Record<string, any>
}

/**
 * API hatası
 */
export class APIError extends ShelbyError {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: Record<string, any>
  ) {
    super(message, 'API_ERROR', details)
    this.name = 'APIError'
  }

  /** HTTP durum kodu */
  statusCode?: number
}

/**
 * Upload hatası
 */
export class UploadError extends ShelbyError {
  constructor(
    message: string,
    public blobId?: string,
    public details?: Record<string, any>
  ) {
    super(message, 'UPLOAD_ERROR', details)
    this.name = 'UploadError'
  }

  /** Blob ID */
  blobId?: string
}

/**
 * Download hatası
 */
export class DownloadError extends ShelbyError {
  constructor(
    message: string,
    public blobId?: string,
    public details?: Record<string, any>
  ) {
    super(message, 'DOWNLOAD_ERROR', details)
    this.name = 'DownloadError'
  }

  /** Blob ID */
  blobId?: string
}

/**
 * Bakiye hatası
 */
export class BalanceError extends ShelbyError {
  constructor(
    message: string,
    public details?: Record<string, any>
  ) {
    super(message, 'BALANCE_ERROR', details)
    this.name = 'BalanceError'
  }
}

// ============================================================================
// NETWORK TİPLERİ
// ============================================================================

/**
 * RPC sunucu bilgisi
 */
export interface RPCServer {
  /** Sunucu URL'i */
  url: string

  /** Adı */
  name: string

  /** Durum bayrağı */
  healthy: boolean

  /** Yanıt süresi (ms) */
  latency?: number

  /** Son kontrol */
  lastCheck?: Date
}

/**
 * Ağ durumu
 */
export interface NetworkStatus {
  /** Genel durum */
  healthy: boolean

  /** Aktif RPC sunucuları */
  rpcServers: RPCServer[]

  /** Aktif depolama sayısı */
  activeProviders: number

  /** Toplam depolama sayısı */
  totalProviders: number
}

// ============================================================================
// CONFIG TİPLERİ
// ============================================================================

/**
 * Ana yapılandırma
 */
export interface ShelbyConfig {
  /** Varsayılan ağ */
  defaultNetwork: ShelbyNetwork

  /** Varsayılan hesap */
  defaultAccount?: string

  /** API anahtarı */
  apiKey?: string

  /** RPC sunucu URL'i */
  rpcUrl?: string

  /** İndexer URL'i */
  indexerUrl?: string

  /** Faucet URL'i */
  faucetUrl?: string

  /** Zaman aşımı (ms) */
  timeout?: number

  /** Yeniden deneme sayısı */
  maxRetries?: number

  /** Log seviyesi */
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent'
}

// ============================================================================
// EVENTS TİPLERİ
// ============================================================================

/**
 * Olay tipi
 */
export type EventType =
  | 'upload:start'
  | 'upload:progress'
  | 'upload:complete'
  | 'upload:error'
  | 'download:start'
  | 'download:progress'
  | 'download:complete'
  | 'download:error'
  | 'balance:update'
  | 'blob:expire'
  | 'network:change'

/**
 * Olay verisi
 */
export interface ShelbyEvent<T = EventType> {
  /** Olay tipi */
  type: T

  /** Olay zamanı */
  timestamp: Date

  /** Olay verisi */
  data: any

  /** İlgili hesap */
  account?: string

  /** İlgili blob */
  blob?: string
}

/**
 * Olay dinleyici
 */
export type EventListener<T = EventType> = (event: ShelbyEvent<T>) => void

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Dosya boyutu formatlama
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Tarih formatlama
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * Kalan zaman hesaplama
 */
export function getRemainingTime(expiry: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const now = new Date()
  const diff = expiry.getTime() - now.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}
