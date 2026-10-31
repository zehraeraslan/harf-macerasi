import { Button } from '../../components/Button'
import { CONTACT_EMAIL, FEEDBACK_URL } from '../../config'

export function AboutScreen({ onBack }: { onBack: () => void }) {
  return (
    <section className="map about">
      <h1 className="map__title">👪 Ebeveynler için</h1>

      <p className="about__beta">
        🧪 <strong>Deneme sürümü.</strong> Harf Macerası geliştirilmeye devam ediyor. Görüşlerin
        bizim için çok değerli.
      </p>

      <h2>Bu uygulama nedir?</h2>
      <p>
        Okumaya yeni başlayan çocuklar için harf, hece ve kelime çalışması sunan, oyunlu bir
        uygulamadır. Harfler Türkiye'deki ilkokuma programının öğretim sırasına göre ilerler. Resmî
        bir MEB ürünü değildir ve MEB ile bağlantılı değildir.
      </p>

      <h2>Verileriniz</h2>
      <ul>
        <li>Hesap, ad, e-posta ya da yaş bilgisi istenmez.</li>
        <li>
          İlerleme (öğrenilen harfler, yıldızlar, çıkartmalar) ve ayarlar{' '}
          <strong>yalnızca bu cihazın tarayıcısında</strong> saklanır, bir sunucuya gönderilmez.
        </li>
        <li>Reklam, takip ve istatistik aracı yoktur.</li>
        <li>
          Siteyi barındıran hizmet, her web sitesinde olduğu gibi, teknik erişim kayıtları (örneğin
          IP adresi) tutabilir.
        </li>
        <li>
          Silmek için haritadaki “İlerlemeyi sıfırla” düğmesini ya da tarayıcının site verilerini
          temizleme ayarını kullanabilirsiniz.
        </li>
      </ul>

      <h2>Mikrofon</h2>
      <p>
        Mikrofonla okuma <strong>varsayılan olarak kapalıdır</strong> ve deneyseldir. Açarsanız
        çocuğun sesi, tarayıcının konuşma tanıma hizmeti tarafından işlenir. Tarayıcıya göre bu,
        sesin internet üzerindeki bir sunucuya gönderilmesi anlamına gelebilir. Uygulama sesi
        kaydetmez ve saklamaz. Kapalıyken mikrofon hiç kullanılmaz.
      </p>

      <h2>Sesler</h2>
      <p>
        Okunuşlar cihazın Türkçe sesiyle yapılır; kalite cihaza ve tarayıcıya göre değişir. Gerçek
        seslendirme üzerinde çalışıyoruz.
      </p>

      <h2>Uygulama gibi kurma</h2>
      <ul>
        <li>
          <strong>iPhone/iPad (Safari):</strong> Paylaş düğmesi, ardından “Ana Ekrana Ekle”.
        </li>
        <li>
          <strong>Android/bilgisayar (Chrome):</strong> Adres çubuğundaki “Yükle” simgesi ya da
          menüde “Uygulamayı yükle”.
        </li>
        <li>Kurulduktan sonra internet olmadan da çalışır (mikrofonla okuma hariç).</li>
      </ul>

      {(FEEDBACK_URL || CONTACT_EMAIL) && (
        <>
          <h2>Geri bildirim</h2>
          <ul>
            {FEEDBACK_URL && (
              <li>
                <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
                  Görüş ve önerinizi paylaşın
                </a>
              </li>
            )}
            {CONTACT_EMAIL && (
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
            )}
          </ul>
        </>
      )}

      <Button variant="ghost" className="btn--icon" aria-label="Geri dön" onClick={onBack}>
        🏠
      </Button>
    </section>
  )
}
