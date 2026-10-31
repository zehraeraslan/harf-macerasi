const MIC_KEY = 'harf-macerasi:mic'

/** Mikrofonla okuma ayarı. Varsayılan: kapalı (ebeveyn açar). */
export function loadMicEnabled(): boolean {
  try {
    return localStorage.getItem(MIC_KEY) === '1'
  } catch {
    return false
  }
}

export function saveMicEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(MIC_KEY, enabled ? '1' : '0')
  } catch {
    // depolama kapalıysa ayar sadece bu oturumda geçerli olur
  }
}
