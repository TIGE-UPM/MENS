import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './english';
import es from './spanish';


i18n.fallbacks = true; // Si una traduccion no esta disponible en el fichero english.js buscara en spanish.js y viceversa
i18n.defaultLocale = 'en'; // Si el idioma predeterminado no es en o es, se usa en (ingles)
 
// Utiliza el idioma predeterminado por el dispositivo
i18n.locale = Localization.locale;

// Idiomas soportados (en los que se puede traducir la app)
i18n.translations = {
  en,
  es
};

export default i18n;