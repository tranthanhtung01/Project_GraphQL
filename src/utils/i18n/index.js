import i18next from 'i18next';
import i18nextMiddleware from 'i18next-express-middleware';

import localeEN from './en';
import localeNL from './nl';

i18next.use(i18nextMiddleware.LanguageDetector).init({
	detection: {
		order: ['header'],
		lookupHeader: 'accept-language'
	},
	preload: ['en', 'nl'],
	whitelist: ['en', 'nl'],
	fallbackLng: 'en',
	resources: {
		en: { translation: localeEN },
		ge: { translation: localeNL }
	}
});

module.exports = {
	i18next,
	i18nextMiddleware
};
