export type LetterKind = 'vowel' | 'consonant'

export interface Letter {
  /** Küçük harf, benzersiz kimlik olarak da kullanılır */
  lower: string
  /** Büyük harf. toUpperCase() Türkçe i/ı için yanlış sonuç verdiği için elle yazılır */
  upper: string
  kind: LetterKind
  /** MEB programındaki harf grubu (1-5) */
  group: number
  /** Hece başında durmayan harfler (ğ): sadece ünlü+harf heceleri üretilir */
  onlyAfterVowel?: boolean
}
