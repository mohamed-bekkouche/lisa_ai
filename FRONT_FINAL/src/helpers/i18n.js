import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE } from '../configs';
import EN_TRANSLATIONS from "../translations/en.json";
import FR_TRANSLATIONS from "../translations/fr.json";

i18n
    .use(initReactI18next)
    .init({
        escapeValue: false,
        nsSeparator: false,
        keySeparator: false,
        lng: localStorage.getItem("locale") || DEFAULT_LOCALE,
        resources: {
            en: {
                translation: EN_TRANSLATIONS
            },
            fr: {
                translation: FR_TRANSLATIONS
            },
        }
    })

export default i18n