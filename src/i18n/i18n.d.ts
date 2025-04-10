import 'react-i18next'
import en from './translations.en.json'

declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'Home';
        resources: typeof en;
    }
}
