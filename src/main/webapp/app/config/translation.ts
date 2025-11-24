import { Storage, TranslatorContext } from 'react-jhipster';

import { setLocale } from 'app/shared/reducers/locale';

TranslatorContext.setDefaultLocale('en');
TranslatorContext.setRenderInnerTextForMissingKeys(false);

export const languages: any = {
  en: { name: 'English', flag: '🇺🇸' },
  al: { name: 'Shqip', flag: '🇦🇱' },
  'ar-ly': { name: 'العربية', rtl: true, flag: '🇱🇾' },
  hy: { name: 'Հայերեն', flag: '🇦🇲' },
  'az-Latn-az': { name: 'Azərbaycan dili', flag: '🇦🇿' },
  by: { name: 'Беларускі', flag: '🇧🇾' },
  bn: { name: 'বাংলা', flag: '🇧🇩' },
  bg: { name: 'Български', flag: '🇧🇬' },
  ca: { name: 'Català', flag: '🇪🇸' },
  'zh-cn': { name: '中文（简体）', flag: '🇨🇳' },
  'zh-tw': { name: '繁體中文', flag: '🇹🇼' },
  hr: { name: 'Hrvatski', flag: '🇭🇷' },
  cs: { name: 'Český', flag: '🇨🇿' },
  da: { name: 'Dansk', flag: '🇩🇰' },
  nl: { name: 'Nederlands', flag: '🇳🇱' },
  et: { name: 'Eesti', flag: '🇪🇪' },
  fa: { name: 'فارسی', rtl: true, flag: '🇮🇷' },
  fi: { name: 'Suomi', flag: '🇫🇮' },
  fr: { name: 'Français', flag: '🇫🇷' },
  gl: { name: 'Galego', flag: '🇪🇸' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  el: { name: 'Ελληνικά', flag: '🇬🇷' },
  he: { name: 'עברית', rtl: true, flag: '🇮🇱' },
  hi: { name: 'हिंदी', flag: '🇮🇳' },
  hu: { name: 'Magyar', flag: '🇭🇺' },
  id: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
  mr: { name: 'मराठी', flag: '🇮🇳' },
  my: { name: 'မြန်မာ', flag: '🇲🇲' },
  pl: { name: 'Polski', flag: '🇵🇱' },
  'pt-br': { name: 'Português (Brasil)', flag: '🇧🇷' },
  'pt-pt': { name: 'Português', flag: '🇵🇹' },
  pa: { name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ro: { name: 'Română', flag: '🇷🇴' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  sk: { name: 'Slovenský', flag: '🇸🇰' },
  sr: { name: 'Srpski', flag: '🇷🇸' },
  si: { name: 'සිංහල', flag: '🇱🇰' },
  es: { name: 'Español', flag: '🇪🇸' },
  sv: { name: 'Svenska', flag: '🇸🇪' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  ta: { name: 'தமிழ்', flag: '🇮🇳' },
  te: { name: 'తెలుగు', flag: '🇮🇳' },
  th: { name: 'ไทย', flag: '🇹🇭' },
  ua: { name: 'Українська', flag: '🇺🇦' },
  'uz-Cyrl-uz': { name: 'Ўзбекча', flag: '🇺🇿' },
  'uz-Latn-uz': { name: 'O`zbekcha', flag: '🇺🇿' },
  vi: { name: 'Tiếng Việt', flag: '🇻🇳' },
  'kr-Latn-kr': { name: 'Qaraqalpaqsha', flag: '🇺🇿' },
  // jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
};

export const locales = Object.keys(languages).sort();

export const isRTL = (lang: string): boolean => languages[lang] && languages[lang].rtl;

export const setTextDirection = (lang: string) => {
  document.querySelector('html').setAttribute('dir', isRTL(lang) ? 'rtl' : 'ltr');
};

export const registerLocale = store => {
  store.dispatch(setLocale(Storage.session.get('locale', 'en')));
};
