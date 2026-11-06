import { themes } from "../lib/themes.js";
import { i18n as translations } from "../lib/i18n.js";
import { renderStatsCard } from "../lib/card.js";
import { aggregateUserStats, normalizeUser } from "../lib/stats.js";
const API_BASE_URL = new URL("/api/stats", location.origin).href;

const interfaceStrings = {
  en: {
    interfaceTheme: "Interface theme",
    interfaceLanguage: "Interface language",
    builder: "GreasyFork card builder",
    displayOptions: "Display options",
    embedFormat: "Embed format",
    secondaryLinks: "Secondary links",
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    eyebrow: "Card generator",
    headline: "Showcase your GreasyFork statistics.",
    intro:
      "Configure your card, preview it instantly, then copy the format you need.",
    settings: "Settings",
    settingsHelp: "Customize the content and appearance.",
    userLabel: "GreasyFork user",
    cardTheme: "Card theme",
    cardLanguage: "Card language",
    hideTitle: "Hide title",
    hideBorder: "Hide border",
    openCard: "Open card",
    copy: "Copy",
    copied: "Copied",
    layout: "Card layout",
    compact: "Compact",
    grid: "Grid",
    download: "Download SVG",
    share: "Copy settings link",
    retry: "Try again",
    shared: "Settings link copied",
    copyError: "Copy failed. Select and copy the code manually.",
    exportPending: "Load a valid profile to export your card.",
    userInvalid: "Enter a numeric ID or a greasyfork.org profile URL.",
    userIdle: "Profile ID or URL.",
    userChecking: "Checking GreasyFork…",
    userValid: (name) => `${name} · data loaded`,
    userError: "User not found or unavailable.",
    localNote:
      "Preview uses the latest fetched data. Embedded cards are cached for up to 6 hours; GitHub may also cache images.",
  },
  fr: {
    interfaceTheme: "Thème de l’interface",
    interfaceLanguage: "Langue de l’interface",
    builder: "Configurateur de carte GreasyFork",
    displayOptions: "Options d’affichage",
    embedFormat: "Format d’intégration",
    secondaryLinks: "Liens secondaires",
    themeAuto: "Auto",
    themeLight: "Clair",
    themeDark: "Sombre",
    eyebrow: "Générateur de carte",
    headline: "Présentez vos statistiques GreasyFork.",
    intro:
      "Configurez votre carte, contrôlez son rendu instantanément, puis copiez le format dont vous avez besoin.",
    settings: "Paramètres",
    settingsHelp: "Personnalisez le contenu et l’apparence.",
    userLabel: "Utilisateur GreasyFork",
    cardTheme: "Thème de la carte",
    cardLanguage: "Langue de la carte",
    hideTitle: "Masquer le titre",
    hideBorder: "Masquer la bordure",
    openCard: "Ouvrir la carte",
    copy: "Copier",
    copied: "Copié",
    layout: "Disposition",
    compact: "Compacte",
    grid: "Grille",
    download: "Télécharger le SVG",
    share: "Copier le lien des réglages",
    retry: "Réessayer",
    shared: "Lien des réglages copié",
    copyError:
      "Échec de la copie. Sélectionnez et copiez le code manuellement.",
    exportPending: "Chargez un profil valide pour exporter votre carte.",
    userInvalid:
      "Saisissez un identifiant numérique ou une URL de profil greasyfork.org.",
    userIdle: "Identifiant ou URL du profil.",
    userChecking: "Vérification sur GreasyFork…",
    userValid: (name) => `${name} · données chargées`,
    userError: "Utilisateur introuvable ou indisponible.",
    localNote:
      "L’aperçu utilise les dernières données récupérées. Les cartes intégrées sont mises en cache jusqu’à 6 heures ; GitHub peut aussi conserver les images en cache.",
  },
};

// Interface translations are independent from the language used on the card.
Object.assign(interfaceStrings, {
  es: {
    interfaceTheme: "Tema de la interfaz",
    interfaceLanguage: "Idioma de la interfaz",
    builder: "Generador de tarjetas GreasyFork",
    displayOptions: "Opciones de visualización",
    embedFormat: "Formato de inserción",
    secondaryLinks: "Enlaces secundarios",
    themeAuto: "Automático",
    themeLight: "Claro",
    themeDark: "Oscuro",
    eyebrow: "Generador de tarjetas",
    headline: "Muestra tus estadísticas de GreasyFork.",
    intro:
      "Configura tu tarjeta, previsualízala y copia el formato que necesites.",
    settings: "Ajustes",
    settingsHelp: "Personaliza el contenido y la apariencia.",
    userLabel: "Usuario de GreasyFork",
    cardTheme: "Tema de la tarjeta",
    cardLanguage: "Idioma de la tarjeta",
    hideTitle: "Ocultar título",
    hideBorder: "Ocultar borde",
    openCard: "Abrir tarjeta",
    copy: "Copiar",
    copied: "Copiado",
    layout: "Diseño de la tarjeta",
    compact: "Compacto",
    grid: "Cuadrícula",
    download: "Descargar SVG",
    share: "Copiar enlace de ajustes",
    retry: "Reintentar",
    shared: "Enlace de ajustes copiado",
    copyError: "No se pudo copiar. Selecciona y copia el código manualmente.",
    exportPending: "Carga un perfil válido para exportar tu tarjeta.",
    userInvalid:
      "Introduce un ID numérico o una URL de perfil de greasyfork.org.",
    userIdle: "ID o URL del perfil.",
    userChecking: "Consultando GreasyFork…",
    userValid: (name) => `${name} · datos cargados`,
    userError: "Usuario no encontrado o no disponible.",
    localNote:
      "La vista previa usa los últimos datos obtenidos. Las tarjetas insertadas se guardan en caché hasta 6 horas; GitHub también puede guardar las imágenes.",
  },
  pt: {
    interfaceTheme: "Tema da interface",
    interfaceLanguage: "Idioma da interface",
    builder: "Gerador de cartões GreasyFork",
    displayOptions: "Opções de exibição",
    embedFormat: "Formato de incorporação",
    secondaryLinks: "Links secundários",
    themeAuto: "Automático",
    themeLight: "Claro",
    themeDark: "Escuro",
    eyebrow: "Gerador de cartões",
    headline: "Mostre suas estatísticas do GreasyFork.",
    intro: "Configure seu cartão, visualize-o e copie o formato desejado.",
    settings: "Configurações",
    settingsHelp: "Personalize o conteúdo e a aparência.",
    userLabel: "Usuário do GreasyFork",
    cardTheme: "Tema do cartão",
    cardLanguage: "Idioma do cartão",
    hideTitle: "Ocultar título",
    hideBorder: "Ocultar borda",
    openCard: "Abrir cartão",
    copy: "Copiar",
    copied: "Copiado",
    layout: "Layout do cartão",
    compact: "Compacto",
    grid: "Grade",
    download: "Baixar SVG",
    share: "Copiar link das configurações",
    retry: "Tentar novamente",
    shared: "Link das configurações copiado",
    copyError: "Falha ao copiar. Selecione e copie o código manualmente.",
    exportPending: "Carregue um perfil válido para exportar seu cartão.",
    userInvalid:
      "Digite um ID numérico ou uma URL de perfil do greasyfork.org.",
    userIdle: "ID ou URL do perfil.",
    userChecking: "Consultando o GreasyFork…",
    userValid: (name) => `${name} · dados carregados`,
    userError: "Usuário não encontrado ou indisponível.",
    localNote:
      "A prévia usa os dados mais recentes. Cartões incorporados ficam em cache por até 6 horas; o GitHub também pode armazenar imagens em cache.",
  },
  zh: {
    interfaceTheme: "界面主题",
    interfaceLanguage: "界面语言",
    builder: "GreasyFork 卡片生成器",
    displayOptions: "显示选项",
    embedFormat: "嵌入格式",
    secondaryLinks: "其他链接",
    themeAuto: "自动",
    themeLight: "浅色",
    themeDark: "深色",
    eyebrow: "卡片生成器",
    headline: "展示你的 GreasyFork 统计数据。",
    intro: "配置卡片，立即预览，然后复制所需格式。",
    settings: "设置",
    settingsHelp: "自定义内容和外观。",
    userLabel: "GreasyFork 用户",
    cardTheme: "卡片主题",
    cardLanguage: "卡片语言",
    hideTitle: "隐藏标题",
    hideBorder: "隐藏边框",
    openCard: "打开卡片",
    copy: "复制",
    copied: "已复制",
    layout: "卡片布局",
    compact: "紧凑",
    grid: "网格",
    download: "下载 SVG",
    share: "复制设置链接",
    retry: "重试",
    shared: "设置链接已复制",
    copyError: "复制失败，请手动选择并复制代码。",
    exportPending: "请加载有效的用户资料以导出卡片。",
    userInvalid: "请输入数字 ID 或 greasyfork.org 用户资料链接。",
    userIdle: "用户 ID 或资料链接。",
    userChecking: "正在查询 GreasyFork…",
    userValid: (name) => `${name} · 数据已加载`,
    userError: "未找到用户或用户不可用。",
    localNote:
      "预览使用最新获取的数据。嵌入的卡片缓存最长 6 小时；GitHub 也可能缓存图片。",
  },
  hi: {
    interfaceTheme: "इंटरफ़ेस थीम",
    interfaceLanguage: "इंटरफ़ेस भाषा",
    builder: "GreasyFork कार्ड जनरेटर",
    displayOptions: "प्रदर्शन विकल्प",
    embedFormat: "एम्बेड प्रारूप",
    secondaryLinks: "अन्य लिंक",
    themeAuto: "स्वचालित",
    themeLight: "हल्का",
    themeDark: "गहरा",
    eyebrow: "कार्ड जनरेटर",
    headline: "अपने GreasyFork आँकड़े दिखाएँ।",
    intro:
      "अपना कार्ड बनाएँ, उसका पूर्वावलोकन देखें और मनचाहा प्रारूप कॉपी करें।",
    settings: "सेटिंग्स",
    settingsHelp: "सामग्री और रूप बदलें।",
    userLabel: "GreasyFork उपयोगकर्ता",
    cardTheme: "कार्ड थीम",
    cardLanguage: "कार्ड भाषा",
    hideTitle: "शीर्षक छिपाएँ",
    hideBorder: "बॉर्डर छिपाएँ",
    openCard: "कार्ड खोलें",
    copy: "कॉपी करें",
    copied: "कॉपी हुआ",
    layout: "कार्ड लेआउट",
    compact: "संक्षिप्त",
    grid: "ग्रिड",
    download: "SVG डाउनलोड करें",
    share: "सेटिंग्स लिंक कॉपी करें",
    retry: "फिर कोशिश करें",
    shared: "सेटिंग्स लिंक कॉपी हुआ",
    copyError: "कॉपी नहीं हुआ। कोड चुनकर स्वयं कॉपी करें।",
    exportPending: "कार्ड निर्यात करने के लिए मान्य प्रोफ़ाइल लोड करें।",
    userInvalid: "संख्यात्मक ID या greasyfork.org प्रोफ़ाइल URL दर्ज करें।",
    userIdle: "प्रोफ़ाइल ID या URL।",
    userChecking: "GreasyFork जाँचा जा रहा है…",
    userValid: (name) => `${name} · डेटा लोड हुआ`,
    userError: "उपयोगकर्ता नहीं मिला या उपलब्ध नहीं है।",
    localNote:
      "पूर्वावलोकन नवीनतम डेटा दिखाता है। एम्बेड किए गए कार्ड 6 घंटे तक कैश होते हैं; GitHub भी छवियाँ कैश कर सकता है।",
  },
});

const additionalInterfaceStrings = {
  de: {
    interfaceTheme: "Oberflächendesign",
    interfaceLanguage: "Sprache der Oberfläche",
    builder: "GreasyFork-Kartengenerator",
    displayOptions: "Anzeigeoptionen",
    embedFormat: "Einbettungsformat",
    secondaryLinks: "Weitere Links",
    themeAuto: "Automatisch",
    themeLight: "Hell",
    themeDark: "Dunkel",
    eyebrow: "Kartengenerator",
    headline: "Zeige deine GreasyFork-Statistiken.",
    intro:
      "Konfiguriere deine Karte, sieh dir die Vorschau an und kopiere das gewünschte Format.",
    settings: "Einstellungen",
    settingsHelp: "Inhalt und Aussehen anpassen.",
    userLabel: "GreasyFork-Benutzer",
    cardTheme: "Kartendesign",
    cardLanguage: "Kartensprache",
    hideTitle: "Titel ausblenden",
    hideBorder: "Rahmen ausblenden",
    openCard: "Karte öffnen",
    copy: "Kopieren",
    copied: "Kopiert",
    layout: "Kartenlayout",
    compact: "Kompakt",
    grid: "Raster",
    download: "SVG herunterladen",
    share: "Einstellungslink kopieren",
    retry: "Erneut versuchen",
    shared: "Einstellungslink kopiert",
    copyError: "Kopieren fehlgeschlagen. Kopiere den Code manuell.",
    exportPending: "Lade ein gültiges Profil, um die Karte zu exportieren.",
    userInvalid:
      "Gib eine numerische ID oder eine greasyfork.org-Profil-URL ein.",
    userIdle: "Profil-ID oder URL.",
    userChecking: "GreasyFork wird abgefragt…",
    userValidText: "Daten geladen",
    userError: "Benutzer nicht gefunden oder nicht verfügbar.",
    localNote:
      "Die Vorschau verwendet die neuesten Daten. Eingebettete Karten werden bis zu 6 Stunden zwischengespeichert; GitHub kann Bilder ebenfalls zwischenspeichern.",
    galleryTitle: "Designs entdecken",
    gallerySample: "Beispieldaten · Design auswählen",
    galleryProfile: "Dein Profil · Design auswählen",
    edit: "Bearbeiten",
    contributing: "Mitwirken",
  },
  it: {
    interfaceTheme: "Tema dell’interfaccia",
    interfaceLanguage: "Lingua dell’interfaccia",
    builder: "Generatore di schede GreasyFork",
    displayOptions: "Opzioni di visualizzazione",
    embedFormat: "Formato di incorporamento",
    secondaryLinks: "Altri collegamenti",
    themeAuto: "Automatico",
    themeLight: "Chiaro",
    themeDark: "Scuro",
    eyebrow: "Generatore di schede",
    headline: "Mostra le tue statistiche GreasyFork.",
    intro:
      "Configura la scheda, visualizza l’anteprima e copia il formato desiderato.",
    settings: "Impostazioni",
    settingsHelp: "Personalizza contenuto e aspetto.",
    userLabel: "Utente GreasyFork",
    cardTheme: "Tema della scheda",
    cardLanguage: "Lingua della scheda",
    hideTitle: "Nascondi titolo",
    hideBorder: "Nascondi bordo",
    openCard: "Apri scheda",
    copy: "Copia",
    copied: "Copiato",
    layout: "Layout della scheda",
    compact: "Compatto",
    grid: "Griglia",
    download: "Scarica SVG",
    share: "Copia link delle impostazioni",
    retry: "Riprova",
    shared: "Link delle impostazioni copiato",
    copyError: "Copia non riuscita. Seleziona e copia il codice manualmente.",
    exportPending: "Carica un profilo valido per esportare la scheda.",
    userInvalid:
      "Inserisci un ID numerico o un URL del profilo greasyfork.org.",
    userIdle: "ID o URL del profilo.",
    userChecking: "Verifica su GreasyFork…",
    userValidText: "dati caricati",
    userError: "Utente non trovato o non disponibile.",
    localNote:
      "L’anteprima usa i dati più recenti. Le schede incorporate sono memorizzate nella cache fino a 6 ore; anche GitHub può memorizzare le immagini.",
    galleryTitle: "Esplora i temi",
    gallerySample: "Dati di esempio · scegli un tema",
    galleryProfile: "Il tuo profilo · scegli un tema",
    edit: "Modifica",
    contributing: "Contribuisci",
  },
  ja: {
    interfaceTheme: "インターフェースのテーマ",
    interfaceLanguage: "インターフェースの言語",
    builder: "GreasyForkカード作成ツール",
    displayOptions: "表示オプション",
    embedFormat: "埋め込み形式",
    secondaryLinks: "その他のリンク",
    themeAuto: "自動",
    themeLight: "ライト",
    themeDark: "ダーク",
    eyebrow: "カード作成",
    headline: "GreasyForkの統計を紹介しましょう。",
    intro: "カードを設定してプレビューし、必要な形式をコピーします。",
    settings: "設定",
    settingsHelp: "内容と外観をカスタマイズします。",
    userLabel: "GreasyForkユーザー",
    cardTheme: "カードのテーマ",
    cardLanguage: "カードの言語",
    hideTitle: "タイトルを非表示",
    hideBorder: "枠線を非表示",
    openCard: "カードを開く",
    copy: "コピー",
    copied: "コピーしました",
    layout: "カードのレイアウト",
    compact: "コンパクト",
    grid: "グリッド",
    download: "SVGをダウンロード",
    share: "設定リンクをコピー",
    retry: "再試行",
    shared: "設定リンクをコピーしました",
    copyError: "コピーできませんでした。コードを手動でコピーしてください。",
    exportPending:
      "カードを出力するには有効なプロフィールを読み込んでください。",
    userInvalid:
      "数値IDまたはgreasyfork.orgのプロフィールURLを入力してください。",
    userIdle: "プロフィールIDまたはURL。",
    userChecking: "GreasyForkを確認中…",
    userValidText: "データを読み込みました",
    userError: "ユーザーが見つからないか利用できません。",
    localNote:
      "プレビューには最新の取得データを使用します。埋め込みカードは最大6時間キャッシュされ、GitHubも画像をキャッシュする場合があります。",
    galleryTitle: "テーマを見る",
    gallerySample: "サンプルデータ · テーマを選択",
    galleryProfile: "あなたのプロフィール · テーマを選択",
    edit: "編集",
    contributing: "貢献する",
  },
  ko: {
    interfaceTheme: "인터페이스 테마",
    interfaceLanguage: "인터페이스 언어",
    builder: "GreasyFork 카드 생성기",
    displayOptions: "표시 옵션",
    embedFormat: "삽입 형식",
    secondaryLinks: "기타 링크",
    themeAuto: "자동",
    themeLight: "라이트",
    themeDark: "다크",
    eyebrow: "카드 생성기",
    headline: "GreasyFork 통계를 보여 주세요.",
    intro: "카드를 설정하고 미리 본 다음 원하는 형식을 복사하세요.",
    settings: "설정",
    settingsHelp: "내용과 모양을 변경하세요.",
    userLabel: "GreasyFork 사용자",
    cardTheme: "카드 테마",
    cardLanguage: "카드 언어",
    hideTitle: "제목 숨기기",
    hideBorder: "테두리 숨기기",
    openCard: "카드 열기",
    copy: "복사",
    copied: "복사됨",
    layout: "카드 레이아웃",
    compact: "간결하게",
    grid: "격자",
    download: "SVG 다운로드",
    share: "설정 링크 복사",
    retry: "다시 시도",
    shared: "설정 링크가 복사됨",
    copyError: "복사하지 못했습니다. 코드를 직접 선택해 복사하세요.",
    exportPending: "카드를 내보내려면 유효한 프로필을 불러오세요.",
    userInvalid: "숫자 ID 또는 greasyfork.org 프로필 URL을 입력하세요.",
    userIdle: "프로필 ID 또는 URL.",
    userChecking: "GreasyFork 확인 중…",
    userValidText: "데이터 불러옴",
    userError: "사용자를 찾을 수 없거나 사용할 수 없습니다.",
    localNote:
      "미리보기에는 최신 데이터를 사용합니다. 삽입된 카드는 최대 6시간 캐시되며 GitHub도 이미지를 캐시할 수 있습니다.",
    galleryTitle: "테마 둘러보기",
    gallerySample: "예시 데이터 · 테마 선택",
    galleryProfile: "내 프로필 · 테마 선택",
    edit: "편집",
    contributing: "기여하기",
  },
  nl: {
    interfaceTheme: "Interfacethema",
    interfaceLanguage: "Interfacetaal",
    builder: "GreasyFork-kaartgenerator",
    displayOptions: "Weergaveopties",
    embedFormat: "Insluitformaat",
    secondaryLinks: "Overige links",
    themeAuto: "Automatisch",
    themeLight: "Licht",
    themeDark: "Donker",
    eyebrow: "Kaartgenerator",
    headline: "Laat je GreasyFork-statistieken zien.",
    intro:
      "Stel je kaart in, bekijk het voorbeeld en kopieer het gewenste formaat.",
    settings: "Instellingen",
    settingsHelp: "Pas de inhoud en vormgeving aan.",
    userLabel: "GreasyFork-gebruiker",
    cardTheme: "Kaartthema",
    cardLanguage: "Kaarttaal",
    hideTitle: "Titel verbergen",
    hideBorder: "Rand verbergen",
    openCard: "Kaart openen",
    copy: "Kopiëren",
    copied: "Gekopieerd",
    layout: "Kaartindeling",
    compact: "Compact",
    grid: "Raster",
    download: "SVG downloaden",
    share: "Instellingenlink kopiëren",
    retry: "Opnieuw proberen",
    shared: "Instellingenlink gekopieerd",
    copyError: "Kopiëren mislukt. Selecteer en kopieer de code handmatig.",
    exportPending: "Laad een geldig profiel om je kaart te exporteren.",
    userInvalid: "Voer een numerieke ID of een greasyfork.org-profiel-URL in.",
    userIdle: "Profiel-ID of URL.",
    userChecking: "GreasyFork controleren…",
    userValidText: "gegevens geladen",
    userError: "Gebruiker niet gevonden of niet beschikbaar.",
    localNote:
      "Het voorbeeld gebruikt de meest recente gegevens. Ingesloten kaarten worden maximaal 6 uur gecachet; GitHub kan afbeeldingen ook cachen.",
    galleryTitle: "Thema’s bekijken",
    gallerySample: "Voorbeeldgegevens · kies een thema",
    galleryProfile: "Je profiel · kies een thema",
    edit: "Bewerken",
    contributing: "Bijdragen",
  },
  pl: {
    interfaceTheme: "Motyw interfejsu",
    interfaceLanguage: "Język interfejsu",
    builder: "Generator kart GreasyFork",
    displayOptions: "Opcje wyświetlania",
    embedFormat: "Format osadzania",
    secondaryLinks: "Pozostałe linki",
    themeAuto: "Automatyczny",
    themeLight: "Jasny",
    themeDark: "Ciemny",
    eyebrow: "Generator kart",
    headline: "Pokaż swoje statystyki GreasyFork.",
    intro: "Skonfiguruj kartę, zobacz podgląd i skopiuj wybrany format.",
    settings: "Ustawienia",
    settingsHelp: "Dostosuj treść i wygląd.",
    userLabel: "Użytkownik GreasyFork",
    cardTheme: "Motyw karty",
    cardLanguage: "Język karty",
    hideTitle: "Ukryj tytuł",
    hideBorder: "Ukryj obramowanie",
    openCard: "Otwórz kartę",
    copy: "Kopiuj",
    copied: "Skopiowano",
    layout: "Układ karty",
    compact: "Kompaktowy",
    grid: "Siatka",
    download: "Pobierz SVG",
    share: "Kopiuj link do ustawień",
    retry: "Spróbuj ponownie",
    shared: "Skopiowano link do ustawień",
    copyError: "Nie udało się skopiować. Zaznacz i skopiuj kod ręcznie.",
    exportPending: "Wczytaj poprawny profil, aby wyeksportować kartę.",
    userInvalid:
      "Wpisz numeryczny identyfikator lub adres profilu greasyfork.org.",
    userIdle: "Identyfikator lub adres profilu.",
    userChecking: "Sprawdzanie GreasyFork…",
    userValidText: "dane wczytane",
    userError: "Nie znaleziono użytkownika lub jest niedostępny.",
    localNote:
      "Podgląd używa najnowszych danych. Osadzone karty są buforowane do 6 godzin; GitHub również może buforować obrazy.",
    galleryTitle: "Przeglądaj motywy",
    gallerySample: "Przykładowe dane · wybierz motyw",
    galleryProfile: "Twój profil · wybierz motyw",
    edit: "Edytuj",
    contributing: "Współtwórz",
  },
  ru: {
    interfaceTheme: "Тема интерфейса",
    interfaceLanguage: "Язык интерфейса",
    builder: "Генератор карточек GreasyFork",
    displayOptions: "Параметры отображения",
    embedFormat: "Формат вставки",
    secondaryLinks: "Другие ссылки",
    themeAuto: "Автоматически",
    themeLight: "Светлая",
    themeDark: "Тёмная",
    eyebrow: "Генератор карточек",
    headline: "Покажите свою статистику GreasyFork.",
    intro:
      "Настройте карточку, посмотрите результат и скопируйте нужный формат.",
    settings: "Настройки",
    settingsHelp: "Настройте содержимое и оформление.",
    userLabel: "Пользователь GreasyFork",
    cardTheme: "Тема карточки",
    cardLanguage: "Язык карточки",
    hideTitle: "Скрыть заголовок",
    hideBorder: "Скрыть рамку",
    openCard: "Открыть карточку",
    copy: "Копировать",
    copied: "Скопировано",
    layout: "Макет карточки",
    compact: "Компактный",
    grid: "Сетка",
    download: "Скачать SVG",
    share: "Копировать ссылку на настройки",
    retry: "Повторить",
    shared: "Ссылка на настройки скопирована",
    copyError: "Не удалось скопировать. Выделите и скопируйте код вручную.",
    exportPending: "Загрузите действительный профиль для экспорта карточки.",
    userInvalid: "Введите числовой ID или ссылку на профиль greasyfork.org.",
    userIdle: "ID или ссылка на профиль.",
    userChecking: "Проверка GreasyFork…",
    userValidText: "данные загружены",
    userError: "Пользователь не найден или недоступен.",
    localNote:
      "Предпросмотр использует последние полученные данные. Встроенные карточки кэшируются до 6 часов; GitHub также может кэшировать изображения.",
    galleryTitle: "Обзор тем",
    gallerySample: "Пример данных · выберите тему",
    galleryProfile: "Ваш профиль · выберите тему",
    edit: "Изменить",
    contributing: "Участвовать",
  },
  tr: {
    interfaceTheme: "Arayüz teması",
    interfaceLanguage: "Arayüz dili",
    builder: "GreasyFork kart oluşturucu",
    displayOptions: "Görüntüleme seçenekleri",
    embedFormat: "Gömme biçimi",
    secondaryLinks: "Diğer bağlantılar",
    themeAuto: "Otomatik",
    themeLight: "Açık",
    themeDark: "Koyu",
    eyebrow: "Kart oluşturucu",
    headline: "GreasyFork istatistiklerinizi gösterin.",
    intro: "Kartınızı ayarlayın, önizleyin ve istediğiniz biçimi kopyalayın.",
    settings: "Ayarlar",
    settingsHelp: "İçeriği ve görünümü özelleştirin.",
    userLabel: "GreasyFork kullanıcısı",
    cardTheme: "Kart teması",
    cardLanguage: "Kart dili",
    hideTitle: "Başlığı gizle",
    hideBorder: "Kenarlığı gizle",
    openCard: "Kartı aç",
    copy: "Kopyala",
    copied: "Kopyalandı",
    layout: "Kart düzeni",
    compact: "Kompakt",
    grid: "Izgara",
    download: "SVG indir",
    share: "Ayarlar bağlantısını kopyala",
    retry: "Tekrar dene",
    shared: "Ayarlar bağlantısı kopyalandı",
    copyError: "Kopyalama başarısız. Kodu seçip elle kopyalayın.",
    exportPending: "Kartı dışa aktarmak için geçerli bir profil yükleyin.",
    userInvalid: "Sayısal bir ID veya greasyfork.org profil URL’si girin.",
    userIdle: "Profil ID’si veya URL’si.",
    userChecking: "GreasyFork kontrol ediliyor…",
    userValidText: "veriler yüklendi",
    userError: "Kullanıcı bulunamadı veya kullanılamıyor.",
    localNote:
      "Önizleme son alınan verileri kullanır. Gömülü kartlar 6 saate kadar önbelleğe alınır; GitHub da görselleri önbelleğe alabilir.",
    galleryTitle: "Temaları keşfet",
    gallerySample: "Örnek veriler · tema seçin",
    galleryProfile: "Profiliniz · tema seçin",
    edit: "Düzenle",
    contributing: "Katkıda bulun",
  },
  uk: {
    interfaceTheme: "Тема інтерфейсу",
    interfaceLanguage: "Мова інтерфейсу",
    builder: "Генератор карток GreasyFork",
    displayOptions: "Параметри відображення",
    embedFormat: "Формат вставлення",
    secondaryLinks: "Інші посилання",
    themeAuto: "Автоматично",
    themeLight: "Світла",
    themeDark: "Темна",
    eyebrow: "Генератор карток",
    headline: "Покажіть свою статистику GreasyFork.",
    intro: "Налаштуйте картку, перегляньте її та скопіюйте потрібний формат.",
    settings: "Налаштування",
    settingsHelp: "Налаштуйте вміст і вигляд.",
    userLabel: "Користувач GreasyFork",
    cardTheme: "Тема картки",
    cardLanguage: "Мова картки",
    hideTitle: "Приховати заголовок",
    hideBorder: "Приховати рамку",
    openCard: "Відкрити картку",
    copy: "Копіювати",
    copied: "Скопійовано",
    layout: "Макет картки",
    compact: "Компактний",
    grid: "Сітка",
    download: "Завантажити SVG",
    share: "Копіювати посилання на налаштування",
    retry: "Спробувати знову",
    shared: "Посилання на налаштування скопійовано",
    copyError: "Не вдалося скопіювати. Виділіть і скопіюйте код вручну.",
    exportPending: "Завантажте дійсний профіль для експорту картки.",
    userInvalid: "Введіть числовий ID або посилання на профіль greasyfork.org.",
    userIdle: "ID або посилання на профіль.",
    userChecking: "Перевірка GreasyFork…",
    userValidText: "дані завантажено",
    userError: "Користувача не знайдено або він недоступний.",
    localNote:
      "Попередній перегляд використовує останні отримані дані. Вбудовані картки кешуються до 6 годин; GitHub також може кешувати зображення.",
    galleryTitle: "Огляд тем",
    gallerySample: "Приклад даних · виберіть тему",
    galleryProfile: "Ваш профіль · виберіть тему",
    edit: "Редагувати",
    contributing: "Долучитися",
  },
  id: {
    interfaceTheme: "Tema antarmuka",
    interfaceLanguage: "Bahasa antarmuka",
    builder: "Pembuat kartu GreasyFork",
    displayOptions: "Opsi tampilan",
    embedFormat: "Format sematan",
    secondaryLinks: "Tautan lainnya",
    themeAuto: "Otomatis",
    themeLight: "Terang",
    themeDark: "Gelap",
    eyebrow: "Pembuat kartu",
    headline: "Tampilkan statistik GreasyFork Anda.",
    intro: "Atur kartu, lihat pratinjau, lalu salin format yang Anda perlukan.",
    settings: "Pengaturan",
    settingsHelp: "Sesuaikan isi dan tampilan.",
    userLabel: "Pengguna GreasyFork",
    cardTheme: "Tema kartu",
    cardLanguage: "Bahasa kartu",
    hideTitle: "Sembunyikan judul",
    hideBorder: "Sembunyikan bingkai",
    openCard: "Buka kartu",
    copy: "Salin",
    copied: "Tersalin",
    layout: "Tata letak kartu",
    compact: "Ringkas",
    grid: "Kisi",
    download: "Unduh SVG",
    share: "Salin tautan pengaturan",
    retry: "Coba lagi",
    shared: "Tautan pengaturan disalin",
    copyError: "Gagal menyalin. Pilih dan salin kode secara manual.",
    exportPending: "Muat profil yang valid untuk mengekspor kartu.",
    userInvalid: "Masukkan ID angka atau URL profil greasyfork.org.",
    userIdle: "ID atau URL profil.",
    userChecking: "Memeriksa GreasyFork…",
    userValidText: "data dimuat",
    userError: "Pengguna tidak ditemukan atau tidak tersedia.",
    localNote:
      "Pratinjau menggunakan data terbaru. Kartu sematan disimpan dalam cache hingga 6 jam; GitHub juga dapat menyimpan gambar dalam cache.",
    galleryTitle: "Jelajahi tema",
    gallerySample: "Data contoh · pilih tema",
    galleryProfile: "Profil Anda · pilih tema",
    edit: "Edit",
    contributing: "Berkontribusi",
  },
};
for (const [language, strings] of Object.entries(additionalInterfaceStrings)) {
  const { userValidText, ...labels } = strings;
  interfaceStrings[language] = {
    ...labels,
    userValid: (name) => `${name} · ${userValidText}`,
  };
}

const galleryStrings = {
  en: [
    "Explore themes",
    "Example data · select a theme",
    "Your profile · select a theme",
    "Edit",
  ],
  fr: [
    "Explorer les thèmes",
    "Données d’exemple · choisissez un thème",
    "Votre profil · choisissez un thème",
    "Modifier",
  ],
  es: [
    "Explorar temas",
    "Datos de ejemplo · elige un tema",
    "Tu perfil · elige un tema",
    "Editar",
  ],
  pt: [
    "Explorar temas",
    "Dados de exemplo · escolha um tema",
    "Seu perfil · escolha um tema",
    "Editar",
  ],
  zh: ["浏览主题", "示例数据 · 选择主题", "你的资料 · 选择主题", "编辑"],
  hi: [
    "थीम देखें",
    "उदाहरण डेटा · थीम चुनें",
    "आपकी प्रोफ़ाइल · थीम चुनें",
    "संपादित करें",
  ],
};
for (const [language, values] of Object.entries(galleryStrings)) {
  [
    interfaceStrings[language].galleryTitle,
    interfaceStrings[language].gallerySample,
    interfaceStrings[language].galleryProfile,
    interfaceStrings[language].edit,
  ] = values;
}

const contributingLabels = {
  en: "Contributing",
  fr: "Contribuer",
  es: "Contribuir",
  pt: "Contribuir",
  zh: "参与贡献",
  hi: "योगदान दें",
};
for (const [language, label] of Object.entries(contributingLabels)) {
  interfaceStrings[language].contributing = label;
}

const form = document.querySelector(".builder-form");
const themeMenu = document.querySelector("#themeMenu");
const languageMenu = document.querySelector("#languageMenu");
const userInput = document.querySelector("#user");
const userStatus = document.querySelector("#userStatus");
const cardThemeMenu = document.querySelector("#cardThemeMenu");
const cardLanguageMenu = document.querySelector("#cardLanguageMenu");
const hideTitleInput = document.querySelector("#hideTitle");
const hideBorderInput = document.querySelector("#hideBorder");
const previewStage = document.querySelector("#preview-stage");
const localNote = document.querySelector("#localNote");
const codeOutput = document.querySelector("#code-output");
const copyButton = document.querySelector("#copyButton");
const openCard = document.querySelector("#openCard");
const layoutMenu = document.querySelector("#layoutMenu");
const downloadButton = document.querySelector("#downloadButton");
const shareButton = document.querySelector("#shareButton");
const retryButton = document.querySelector("#retryButton");
const feedback = document.querySelector("#actionFeedback");
const tabs = [...document.querySelectorAll(".tab")];
let activeFormat = "markdown";
let interfaceLanguage = "en";
let cardThemeValue = "github_dark";
let cardLanguageValue = "en";
let userStatusState = "idle";
let verifiedUsername = "";
let fetchController;
let fetchTimer;
let copyTimer;
let previewStats = null;
let requestVersion = 0;
const statsCache = new Map();

function setMenuValue(menu, value) {
  const options = [...menu.options];
  const selected =
    options.find((option) => option.value === value) || options[0];
  menu.value = selected.value;
  if (menu._syncMenu) menu._syncMenu();
}

function initializeMenu(menu, onSelect) {
  menu.addEventListener("change", () => onSelect(menu.value));
  if (!menu.parentElement) return;
  const wrapper = document.createElement("div");
  wrapper.className = `custom-select ${menu.classList.contains("menu-select") ? "custom-select-header" : ""}`;
  menu.before(wrapper);
  wrapper.appendChild(menu);
  menu.hidden = true;
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-select-trigger";
  trigger.setAttribute("aria-expanded", "false");
  const list = document.createElement("div");
  list.className = "custom-select-list";
  list.hidden = true;
  const flags = {
    fr: "fr",
    en: "gb",
    es: "es",
    pt: "pt",
    zh: "cn",
    hi: "in",
    de: "de",
    it: "it",
    ja: "jp",
    ko: "kr",
    nl: "nl",
    pl: "pl",
    ru: "ru",
    tr: "tr",
    uk: "ua",
    id: "id",
  };
  function content(option, node) {
    node.replaceChildren();
    if (menu.id.toLowerCase().includes("language") && flags[option.value]) {
      const flag = document.createElement("img");
      flag.src = `assets/flags/${flags[option.value]}.svg`;
      flag.alt = "";
      flag.className = "language-flag";
      node.appendChild(flag);
    }
    const label = document.createElement("span");
    label.textContent = option.textContent;
    node.appendChild(label);
  }
  function close(focus = false) {
    list.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (focus) trigger.focus();
  }
  menu._syncMenu = () => {
    const selected = [...menu.options].find(
      (option) => option.value === menu.value,
    );
    content(selected, trigger);
    trigger.setAttribute(
      "aria-label",
      `${menu.getAttribute("aria-label") || document.querySelector(`label[for="${menu.id}"]`)?.textContent.trim() || ""}: ${selected.textContent}`,
    );
    list.querySelectorAll("button").forEach((button, index) => {
      content(menu.options[index], button);
      button.setAttribute(
        "aria-pressed",
        String(menu.options[index].value === menu.value),
      );
    });
  };
  [...menu.options].forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.addEventListener("click", () => {
      menu.value = option.value;
      menu.dispatchEvent(new Event("change", { bubbles: true }));
      menu._syncMenu();
      close(true);
    });
    list.appendChild(button);
  });
  trigger.addEventListener("click", () => {
    const opening = list.hidden;
    document.querySelectorAll(".custom-select-list").forEach((other) => {
      if (other !== list) {
        other.hidden = true;
        other.previousElementSibling.setAttribute("aria-expanded", "false");
      }
    });
    list.hidden = !opening;
    trigger.setAttribute("aria-expanded", String(opening));
  });
  wrapper.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !list.hidden) {
      event.preventDefault();
      close(true);
    }
    if (
      !list.hidden &&
      ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
    ) {
      event.preventDefault();
      const buttons = [...list.querySelectorAll("button")];
      const index = buttons.indexOf(document.activeElement);
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? buttons.length - 1
            : event.key === "ArrowDown"
              ? (index + 1) % buttons.length
              : index <= 0
                ? buttons.length - 1
                : index - 1;
      buttons[next].focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!wrapper.contains(event.target)) close();
  });
  wrapper.append(trigger, list);
  menu._syncMenu();
}

function applySiteTheme(value, persist = true) {
  const theme = ["light", "dark"].includes(value) ? value : "auto";
  if (theme === "auto") {
    document.documentElement.removeAttribute("data-site-theme");
  } else {
    document.documentElement.dataset.siteTheme = theme;
  }

  setMenuValue(themeMenu, theme);
  const isDark =
    theme === "dark" ||
    (theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.querySelector('meta[name="theme-color"]').content = isDark
    ? "#111311"
    : "#f6f6f4";
  if (persist) {
    try {
      localStorage.setItem("greasyfork-stats-site-theme", theme);
    } catch {
      /* Storage is optional. */
    }
  }
}

function applyInterfaceLanguage(value, persist = true) {
  interfaceLanguage = Object.hasOwn(interfaceStrings, value) ? value : "en";
  const strings = interfaceStrings[interfaceLanguage];
  document.documentElement.lang = interfaceLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = strings[element.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-menu]").forEach((element) => {
    element.textContent = strings[element.dataset.i18nMenu];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", strings[element.dataset.i18nAria]);
  });
  setMenuValue(themeMenu, document.documentElement.dataset.siteTheme || "auto");
  if (cardThemeMenu._syncMenu) cardThemeMenu._syncMenu();
  if (cardLanguageMenu._syncMenu) cardLanguageMenu._syncMenu();
  if (layoutMenu._syncMenu) layoutMenu._syncMenu();
  setMenuValue(languageMenu, interfaceLanguage);
  updateUserStatus();
  render();
  if (persist) {
    try {
      localStorage.setItem("greasyfork-stats-site-language", interfaceLanguage);
    } catch {
      /* Storage is optional. */
    }
  }
}

function updateUserStatus() {
  const strings = interfaceStrings[interfaceLanguage];
  userStatus.dataset.state = userStatusState;
  if (userStatusState === "checking") {
    userStatus.textContent = strings.userChecking;
  } else if (userStatusState === "valid") {
    userStatus.textContent = strings.userValid(verifiedUsername);
  } else if (userStatusState === "invalid") {
    userStatus.textContent = strings.userInvalid;
  } else if (userStatusState === "error") {
    userStatus.textContent = strings.userError;
  } else {
    userStatus.textContent = strings.userIdle;
  }
}

function updateLocalNote() {
  localNote.textContent = interfaceStrings[interfaceLanguage].localNote;
}

function invalidatePreview() {
  requestVersion += 1;
  fetchController?.abort();
  clearTimeout(fetchTimer);
  previewStats = null;
  verifiedUsername = "";
  userStatusState = userInput.value.trim() ? "checking" : "idle";
  render();
}

async function fetchUserStats() {
  const version = requestVersion;
  const user = normalizeUser(userInput.value);
  if (!user) {
    userStatusState = userInput.value.trim() ? "invalid" : "idle";
    render();
    return;
  }
  userStatusState = "checking";
  render();
  const controller = new AbortController();
  fetchController = controller;
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    let stats = statsCache.get(user);
    if (!stats) {
      const response = await fetch(
        `https://api.greasyfork.org/en/users/${user}.json`,
        { headers: { Accept: "application/json" }, signal: controller.signal },
      );
      if (!response.ok) throw new Error("Unavailable profile");
      const data = await response.json();
      stats = aggregateUserStats(data);
      statsCache.set(user, stats);
    }
    if (version !== requestVersion) return;
    previewStats = stats;
    verifiedUsername = stats.username;
    userStatusState = "valid";
  } catch {
    if (version !== requestVersion) return;
    previewStats = null;
    userStatusState = "error";
  } finally {
    clearTimeout(timeout);
    if (version === requestVersion) render();
  }
}

function scheduleUserFetch() {
  invalidatePreview();
  fetchTimer = setTimeout(fetchUserStats, 650);
}

function getState() {
  return {
    user: normalizeUser(userInput.value),
    layout: layoutMenu.value,
    theme: cardThemeValue,
    lang: cardLanguageValue,
    hideTitle: hideTitleInput.checked,
    hideBorder: hideBorderInput.checked,
  };
}

function buildUrl(state) {
  const url = new URL(API_BASE_URL);
  url.searchParams.set("user", state.user);
  url.searchParams.set("theme", state.theme);
  url.searchParams.set("lang", state.lang);
  if (state.layout === "grid") url.searchParams.set("layout", "grid");
  if (state.hideTitle) url.searchParams.set("hide_title", "true");
  if (state.hideBorder) url.searchParams.set("hide_border", "true");
  return url.href;
}

function getOutput(url) {
  if (activeFormat === "url") return url;
  if (activeFormat === "html") {
    return `<img src="${url.replaceAll("&", "&amp;")}" alt="GreasyFork Stats">`;
  }
  return `![GreasyFork Stats](${url})`;
}

function render() {
  const state = getState();
  const ready = userStatusState === "valid" && previewStats !== null;
  const strings = interfaceStrings[interfaceLanguage];
  updateUserStatus();
  updateLocalNote();
  previewStage.setAttribute(
    "aria-busy",
    String(userStatusState === "checking"),
  );
  if (ready) {
    previewStage.innerHTML = renderStatsCard(previewStats, state);
    previewStage.querySelector("svg").id = "card-preview";
  } else {
    previewStage.textContent =
      strings[
        userStatusState === "checking"
          ? "userChecking"
          : userStatusState === "invalid"
            ? "userInvalid"
            : userStatusState === "error"
              ? "userError"
              : "userIdle"
      ];
  }
  const galleryNote = document.querySelector("#galleryNote");
  galleryNote.textContent = ready
    ? strings.galleryProfile
    : strings.gallerySample;
  document.querySelectorAll(".gallery-card").forEach((button) => {
    const name = button.dataset.theme;
    button.setAttribute("aria-pressed", String(name === state.theme));
    const stats = ready
      ? previewStats
      : {
          username: "GreasyFork",
          totalInstalls: 125000,
          dailyInstalls: 120,
          scriptCount: 12,
          goodRatings: 95,
          okRatings: 3,
          badRatings: 2,
        };
    button.querySelector(".gallery-card-art").innerHTML = renderStatsCard(
      stats,
      {
        ...state,
        theme: name,
      },
    )
      .replace('id="card-title"', "")
      .replace('id="card-description"', "")
      .replace(
        'aria-labelledby="card-title card-description"',
        'aria-hidden="true" focusable="false"',
      );
  });
  copyButton.disabled = !ready;
  downloadButton.disabled = !ready;
  shareButton.disabled = !ready;
  retryButton.hidden = userStatusState !== "error";
  codeOutput.textContent = ready
    ? getOutput(buildUrl(state))
    : strings.exportPending;
  if (ready) openCard.href = buildUrl(state);
  else openCard.removeAttribute("href");
  openCard.setAttribute("aria-disabled", String(!ready));
  document.querySelectorAll(".theme-swatch").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.theme === state.theme),
    );
  });
  try {
    localStorage.setItem(
      "greasyfork-stats-builder-v2",
      JSON.stringify({ ...state, user: userInput.value }),
    );
  } catch {
    /* Storage is optional. */
  }
}

function restoreState() {
  try {
    const state = JSON.parse(
      localStorage.getItem("greasyfork-stats-builder-v2"),
    );
    if (!state) return;
    userInput.value = state.user || "1259433";
    setMenuValue(layoutMenu, state.layout === "grid" ? "grid" : "compact");
    if (Object.hasOwn(themes, state.theme)) cardThemeValue = state.theme;
    if (Object.hasOwn(translations, state.lang)) cardLanguageValue = state.lang;
    setMenuValue(cardThemeMenu, cardThemeValue);
    setMenuValue(cardLanguageMenu, cardLanguageValue);
    hideTitleInput.checked = Boolean(state.hideTitle);
    hideBorderInput.checked = Boolean(state.hideBorder);
  } catch {
    /* Stored state may be unavailable or malformed. */
  }
}

initializeMenu(themeMenu, applySiteTheme);
initializeMenu(languageMenu, applyInterfaceLanguage);
initializeMenu(layoutMenu, render);
initializeMenu(cardThemeMenu, (value) => {
  cardThemeValue = themes[value] ? value : "github_dark";
  render();
});
initializeMenu(cardLanguageMenu, (value) => {
  cardLanguageValue = translations[value] ? value : "en";
  render();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeFormat = tab.dataset.format;
    tabs.forEach((item) =>
      item.setAttribute("aria-selected", String(item === tab)),
    );
    tabs.forEach((item) => {
      item.tabIndex = item === tab ? 0 : -1;
    });
    document
      .querySelector("#exportPanel")
      .setAttribute("aria-labelledby", tab.id);
    render();
  });
  tab.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(tab);
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (index + tabs.length - 1) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : -1;
    if (next < 0) return;
    event.preventDefault();
    tabs[next].focus();
    tabs[next].click();
  });
});

form.addEventListener("input", (event) => {
  if (event.target !== userInput) render();
});
form.addEventListener("change", render);
userInput.addEventListener("input", scheduleUserFetch);

copyButton.addEventListener("click", async () => {
  const value = codeOutput.textContent;

  try {
    await copyText(value);
  } catch {
    feedback.textContent = interfaceStrings[interfaceLanguage].copyError;
    return;
  }

  clearTimeout(copyTimer);
  copyButton.classList.add("success");
  copyButton.querySelector("span").textContent =
    interfaceStrings[interfaceLanguage].copied;
  copyTimer = setTimeout(() => {
    copyButton.classList.remove("success");
    copyButton.querySelector("span").textContent =
      interfaceStrings[interfaceLanguage].copy;
  }, 1600);
});

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Copy failed");
  }
}

downloadButton.addEventListener("click", () => {
  if (!previewStats || userStatusState !== "valid") return;
  const url = URL.createObjectURL(
    new Blob([renderStatsCard(previewStats, getState())], {
      type: "image/svg+xml;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `greasyfork-${getState().user}.svg`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
shareButton.addEventListener("click", async () => {
  const url = new URL(location.pathname, location.origin);
  url.search = new URL(buildUrl(getState())).search;
  try {
    await copyText(url.href);
    feedback.textContent = interfaceStrings[interfaceLanguage].shared;
  } catch {
    feedback.textContent = interfaceStrings[interfaceLanguage].copyError;
  }
});
retryButton.addEventListener("click", () => {
  invalidatePreview();
  fetchUserStats();
});

const galleryTrack = document.querySelector("#themeGallery");
const galleryScroll = document.querySelector(".gallery-scroll");
galleryScroll.addEventListener("focusout", (event) => {
  if (!galleryScroll.contains(event.relatedTarget))
    galleryScroll.scrollLeft = 0;
});
// Move the existing looping animation, so dragging and playback share one position.
let galleryDrag = null;
let suppressGalleryClick = false;
galleryScroll.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary || event.button !== 0) return;
  const animation = galleryTrack
    .getAnimations()
    .find((item) => item.animationName === "gallery-drift");
  if (!animation) return; // Reduced motion keeps the native, scrollable gallery.
  galleryDrag = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    lastX: event.clientX,
    animation,
    moved: false,
  };
  suppressGalleryClick = false;
});
galleryScroll.addEventListener("pointermove", (event) => {
  if (!galleryDrag || galleryDrag.pointerId !== event.pointerId) return;
  const dx = event.clientX - galleryDrag.x;
  const dy = event.clientY - galleryDrag.y;
  if (!galleryDrag.moved) {
    if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
      galleryDrag = null;
      return;
    }
    if (Math.abs(dx) < 8) return;
    galleryDrag.moved = true;
    suppressGalleryClick = true;
    galleryScroll.setPointerCapture(event.pointerId);
    galleryScroll.classList.add("is-dragging");
  }
  const width = galleryTrack.scrollWidth / 2;
  const duration = Number(galleryDrag.animation.effect.getTiming().duration);
  if (width && duration) {
    const time = Number(galleryDrag.animation.currentTime) || 0;
    const next =
      time + ((event.clientX - galleryDrag.lastX) / width) * duration;
    galleryDrag.animation.currentTime =
      ((next % duration) + duration) % duration;
  }
  galleryDrag.lastX = event.clientX;
});
function endGalleryDrag(event) {
  if (!galleryDrag || galleryDrag.pointerId !== event.pointerId) return;
  galleryScroll.classList.remove("is-dragging");
  if (galleryScroll.hasPointerCapture(event.pointerId))
    galleryScroll.releasePointerCapture(event.pointerId);
  galleryDrag = null;
}
galleryScroll.addEventListener("pointerup", endGalleryDrag);
galleryScroll.addEventListener("pointercancel", endGalleryDrag);
galleryScroll.addEventListener(
  "click",
  (event) => {
    if (!suppressGalleryClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressGalleryClick = false;
  },
  true,
);
const galleryGroups = [
  document.createElement("div"),
  document.createElement("div"),
];
galleryGroups.forEach((group, index) => {
  group.className = "gallery-group";
  if (index === 1) group.setAttribute("aria-hidden", "true");
  galleryTrack.appendChild(group);
});

for (const [name, theme] of Object.entries(themes)) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-swatch";
  button.dataset.theme = name;
  button.title = [...cardThemeMenu.options].find(
    (option) => option.value === name,
  ).textContent;
  button.setAttribute("aria-label", button.title);
  button.style.setProperty("--swatch-bg", theme.bg);
  button.style.setProperty("--swatch-ink", theme.title);
  button.innerHTML = '<span aria-hidden="true">Aa</span>';
  button.addEventListener("click", () => {
    cardThemeValue = name;
    setMenuValue(cardThemeMenu, name);
    render();
  });
  document.querySelector("#themeSwatches").appendChild(button);

  galleryGroups.forEach((group, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card";
    card.dataset.theme = name;
    if (index === 1) card.tabIndex = -1;
    const label = document.createElement("span");
    label.className = "gallery-card-name";
    label.textContent = button.title;
    const art = document.createElement("span");
    art.className = "gallery-card-art";
    card.appendChild(label);
    card.appendChild(art);
    card.addEventListener("click", () => {
      cardThemeValue = name;
      setMenuValue(cardThemeMenu, name);
      render();
    });
    group.appendChild(card);
  });
}

function restoreSharedState() {
  const params = new URLSearchParams(location.search);
  if (!params.has("user")) return;
  userInput.value = params.get("user");
  cardThemeValue = Object.hasOwn(themes, params.get("theme"))
    ? params.get("theme")
    : "github_dark";
  cardLanguageValue = Object.hasOwn(translations, params.get("lang"))
    ? params.get("lang")
    : "en";
  setMenuValue(cardThemeMenu, cardThemeValue);
  setMenuValue(cardLanguageMenu, cardLanguageValue);
  setMenuValue(
    layoutMenu,
    params.get("layout") === "grid" ? "grid" : "compact",
  );
  hideTitleInput.checked = ["true", "1"].includes(params.get("hide_title"));
  hideBorderInput.checked = ["true", "1"].includes(params.get("hide_border"));
}

let savedTheme = "auto";
let savedLanguage = "en";
try {
  savedTheme = localStorage.getItem("greasyfork-stats-site-theme") || "auto";
  savedLanguage =
    localStorage.getItem("greasyfork-stats-site-language") || "en";
} catch {
  /* Storage is optional. */
}

restoreState();
restoreSharedState();
applySiteTheme(savedTheme, false);
applyInterfaceLanguage(savedLanguage, false);
render();
fetchUserStats();
