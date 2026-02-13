/**
 * @package shelby-shared-types
 * @version 1.0.0
 */

/**
 * Yapılandırma ile ilgili tip tanımları
 */

import type { ShelbyNetwork, AccountConfig, LogLevel } from './shelby'

// ============================================================================
// GENEL YAPILANDIRMA TİPLERİ
// ============================================================================

/**
 * Ana yapılandırma
 */
export interface Config {
  /** Varsayılan ağ */
  defaultNetwork: ShelbyNetwork

  /** Varsayılan hesap */
  defaultAccount?: string

  /** RPC sunucu URL'i */
  rpcUrl?: string

  /** Indexer URL'i */
  indexerUrl?: string

  /** Faucet URL'i */
  faucetUrl?: string

  /** API anahtarı */
  apiKey?: string

  /** Zaman aşımı (saniye) */
  timeout?: number

  /** Yeniden deneme sayısı */
  maxRetries?: number

  /** Yeniden deneme aralığı (ms) */
  retryDelay?: number

  /** Log seviyesi */
  logLevel?: LogLevel

  /** Çalışan dizini */
  cwd?: string

  /** Veri dizini */
  dataDir?: string

  /** Önbellek dosyası */
  cacheDir?: string

  /** Debug modu */
  debug?: boolean
}

/**
 * Hesap yönetimi yapılandırması
 */
export interface AccountManagerConfig {
  /** Hesap dosyası yolu */
  accountsFile?: string

  /** Hesap dizini */
  accountsDir?: string

  /** Varsayılan günlük limit */
  defaultMaxDaily?: number

  /** Varsayılan ağırlık */
  defaultWeight?: number

  /** Otomatik hesap geçişi */
  autoSwitchOnLimit?: boolean

  /** Otomatik bakiye kontrolü */
  autoBalanceCheck?: boolean
}

/**
 * Batch yükleme yapılandırması
 */
export interface BatchConfig {
  /** Kaynak dosya veya dizini */
  source: string

  /** Blob adı öneki */
  blobPrefix?: string

  /** Paralel yükleme sayısı */
  parallel?: number

  /** Parça boyutu (byte) */
  chunkSize?: number

  /** Sona erime (gün, saat, 'never') */
  expires?: string | number

  /** Otomatik onay (varsayılan: false) */
  assumeYes?: boolean

  /** İlerleme callback'i */
  onProgress?: (file: string, progress: number) => void

  /** Hata callback'i */
  onError?: (file: string, error: Error) => void

  /** Tamamlandığında callback */
  onComplete?: (results: BatchResult) => void
}

/**
 * Batch sonucu
 */
export interface BatchResult {
  /** Başarılı yüklenenler */
  uploaded: string[]

  /** Başarısız yüklenenler */
  failed: {
    file: string
    error: string
  }[]

  /** Toplam süres (ms) */
  duration: number

  /** Ortalama hızı (byte/s) */
  averageSpeed?: number
}

/**
 * Monitor yapılandırması
 */
export interface MonitorConfig {
  /** Güncelleme aralığı (saniye) */
  refreshInterval?: number

  /** Grafik veri nokta sayısı */
  chartDataPoints?: number

  /** Alert eşikleri */
  alerts?: AlertConfig

  /** Bildirim ayarları */
  notifications?: NotificationConfig
}

/**
 * Alert yapılandırması
 */
export interface AlertConfig {
  /** Düşük bakiye uyarısı */
  lowBalanceThreshold?: {
    apt?: number
    shelbyUSD?: number
  }

  /** Yaklaşan sona erime uyarısı */
  expiringSoonThreshold?: number // gün

  /** Başarısız upload oranı */
  failedUploadAlert?: boolean

  /** Ağ sağlık uyarısı */
  networkHealthAlert?: boolean
}

/**
 * Bildirim yapılandırması
 */
export interface NotificationConfig {
  /** Discord webhook */
  discord?: {
    enabled: boolean
    webhookUrl: string
  }

  /** E-mail ayarları */
  email?: {
    enabled: boolean
    smtp: {
      host: string
      port: number
      secure: boolean
      auth: {
        user: string
        pass: string
      }
    }
    from: string
    to: string[]
  }

  /** Console bildirimleri */
  console?: {
    enabled: boolean
    level?: 'log' | 'info' | 'warn' | 'error'
  }
}

/**
 * Expiry guard yapılandırması
 */
export interface ExpiryGuardConfig {
  /** Kontrol aralığı (dakika) */
  checkInterval?: number

  /** Bildirim eşikleri (gün) */
  warningThreshold?: number

  /** Otomatik yenileme */
  autoRenew?: boolean

  /** Yenileme için yeterli bakiye kontrolü */
  checkBalanceBeforeRenew?: boolean

  /** Otomatik silme */
  autoDeleteExpired?: boolean

  /** Rapor ayarları */
  reports?: {
    enabled: boolean
    format: 'csv' | 'json' | 'html'
    outputDir: string
  }
}

/**
 * Yükleme işçisi yapılandırması
 */
export interface WorkerConfig {
  /** İş havuzu boyutu */
  poolSize?: number

  /** İş zaman aşımı (saniye) */
  jobTimeout?: number

  /** Başarısız iş maksimum deneme sayısı */
  maxRetries?: number

  /** Hata ayarları */
  errorHandling?: 'retry' | 'fail' | 'queue'

  /** Ölümleme modu */
  verbose?: boolean
}

/**
 * CLI renk temasleri
 */
export type ColorTheme = 'light' | 'dark' | 'auto'

/**
 * CLI yapılandırması
 */
export interface CliConfig {
  /** Renk teması */
  theme?: ColorTheme

  /** JSON çıktı */
  json?: boolean

  **sessiz modu */
  quiet?: boolean

  **ayrntlı modu */
  verbose?: boolean

  /** Zaman damgası */
  timestamp?: boolean
}

/**
 * Sunucu yapılandırması
 */
export interface ServerConfig {
  /** Dinlenen port */
  port?: number

  /** Dinlenen adres */
  host?: string

  /** CORS ayarları */
  cors?: {
    enabled: boolean
    origin: string[]
  }

  /** API rate limiting */
  rateLimit?: {
    enabled: boolean
    maxRequests?: number
    windowMs?: number
  }

  /** HTTPS ayarları */
  https?: {
    enabled: boolean
    key: string
    cert: string
  }
}

/**
 * Tüm yapılandıma birleştirilmiş konfigürasyon
 */
export interface FullConfig extends Config {
  /** Hesap yönetimi yapılandırması */
  accounts?: AccountManagerConfig

  /** Batch yapılandırması */
  batch?: BatchConfig

  /** Monitor yapılandırması */
  monitor?: MonitorConfig

  /** Alert yapılandırması */
  alerts?: AlertConfig

  /** Bildirim yapılandırması */
  notifications?: NotificationConfig

  /** Expiry guard yapılandırması */
  expiryGuard?: ExpiryGuardConfig

  /** İşçi yapılandırması */
  worker?: WorkerConfig

  /** CLI yapılandırması */
  cli?: CliConfig

  /** Sunucu yapılandırması */
  server?: ServerConfig
}

/**
 * Konfigürasyon dosyası (YAML)
 */
export interface ConfigFile {
  /** Ana yapılandırma */
  config?: FullConfig

  /** Hesap listesi */
  accounts?: AccountConfig[]

  **Ortam ayarlar */
  settings?: {
    logLevel?: LogLevel
    dataDir?: string
    autoStart?: boolean
  }
}

/**
 * Konfigürasyon yükleme seçenekleri
 */
export interface ConfigLoadOptions {
  /** Konfigürasyon dosyası yolu */
  configPath?: string

  **Ortam dosya yolu */
  override?: Partial<Config>

  **Çevresiz modu */
  silent?: boolean
}
