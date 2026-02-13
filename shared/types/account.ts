/**
 * @package shelby-shared-types
 * @version 1.0.0
 */

/**
 * Hesap ile ilgili tip tanımları
 */

import type { ShelbyNetwork, AccountBalance, BalanceInfo } from './shelby'

// ============================================================================
// HESAP TİPLERİ
// ============================================================================

/**
 * Hesap durumu
 */
export type AccountStatus = 'active' | 'inactive' | 'frozen' | 'banned'

/**
 * Hesap istatistikleri
 */
export interface AccountStats {
  /** Toplam upload sayısı */
  totalUploads: number

  /** Toplam indirilen blob sayısı */
  totalDownloads: number

  /** Toplam yüklenen veri (byte) */
  totalBytesUploaded: number

  /** Toplam indirilen veri (byte) */
  totalBytesDownloaded: number

  /** Başarılı upload sayısı */
  successfulUploads: number

  /** Başarısız upload sayısı */
  failedUploads: number

  /** Son çalışma zamanı */
  lastActivity?: Date

  /** Son 24 saat upload sayısı */
  uploadsLast24h: number

  /** Ortalama yüzdesi (%) */
  successRate: number
}

/**
 * Hesap yapılandırması
 */
export interface AccountConfig {
  /** Hesap adı (benzersiz tanımlayıcı) */
  name: string

  /** Kullanılan ağ */
  network: ShelbyNetwork

  /** Hesap cüzdanı */
  address: string

  /** Özel anahtar (şifrelenmiş, şifrelemek için opsiyonel) */
  privateKey?: string

  /** Günlük maksimum yükleme sayısı */
  maxDaily?: number

  /** API anahtarı */
  apiKey?: string

  /** Ağırlık (varsayılan: 1) */
  weight?: number

  /** Hesap aktif mi? */
  enabled?: boolean

  /** RPC sunucu URL'i */
  rpcUrl?: string

  /** Indexer URL'i */
  indexerUrl?: string

  /** Faucet URL'i */
  faucetUrl?: string
}

/**
 * Hesap bilgisi (backend'den gelen)
 */
export interface AccountInfo {
  /** Hesap adı */
  name: string

  /** Cüzdan adresi */
  address: string

  /** Kullanılan ağ */
  network: ShelbyNetwork

  /** Token bakiyeleri */
  balances: AccountBalance

  /** Günlük sayaç */
  dailyCount: number

  /** Günlük limit */
  maxDaily: number

  /** Hesap durumu */
  status: AccountStatus

  /** API anahtarı var mı? */
  hasApiKey: boolean

  /** Son kullanım zamanı */
  lastUsed?: Date

  /** Başlangıç zamanı */
  createdAt?: Date

  /** Hesap istatistikleri */
  stats?: AccountStats

  /** Hesap etkinleştirme ayarları */
  config?: Partial<AccountConfig>
}

/**
 * Çoklu hesap listesi
 */
export type AccountList = AccountInfo[]

/**
 * Hesap seçenekleri
 */
export interface AccountOptions {
  /** Hesap adı */
  name: string

  /** Şebeke ağ adı */
  network: ShelbyNetwork

  /** Özel anahtar oluştur */
  generateKey?: boolean

  /** Faucet'ten başlangıç token al */
  faucet?: boolean
}

/**
 * Hesap yükleme isteği
 */
export interface FundAccountRequest {
  /** Hesap adı veya adresi */
  account: string

  /** Yüklenecek Aptos miktarı */
  aptAmount?: number

  /** Yüklenecek ShelbyUSD miktarı */
  shelbyUSDAmount?: number
}

/**
 * Hesap yükleme sonucu
 */
export interface FundAccountResult {
  /** Başarılı mı? */
  success: boolean

  /** İşlem ID'si */
  txHash?: string

  /** Yüklenen miktar */
  amount?: number

  /** Hata mesajı */
  error?: string
}

/**
 * Hesap oluşturma sonucu
 */
export interface CreateAccountResult {
  /** Oluşturulan hesap bilgisi */
  account: AccountInfo

  /** Özel anahtar (şifrelenmişse) */
  privateKey?: string

  /** Kurtarma kelimeleri (12-24 kelime) */
  recoveryPhrase?: string[]
}

/**
 * Hesap geçmişi
 */
export interface AccountFilter {
  /** Durum filtresi */
  status?: AccountStatus

  /** Ağ filtresi */
  network?: ShelbyNetwork

  /** Sadece aktif hesaplar */
  activeOnly?: boolean

  /** Sadece API anahtarı olan hesaplar */
  withApiKeyOnly?: boolean

  /** Adres araması */
  addressSearch?: string
}

/**
 * Hesaplar için sayfalama ayarları
 */
export interface AccountPagination {
  /** Sayfa boyutu (varsayılan: 50) */
  limit?: number

  /** Offset (ata sayfa için) */
  offset?: number

  /** Sıralama (asc/desc) */
  order?: 'asc' | 'desc'

  /** Sıralama alanı */
  sortBy?: 'name' | 'createdAt' | 'lastUsed' | 'dailyCount'
}
