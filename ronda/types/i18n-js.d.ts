declare module "i18n-js" {
  export class I18n {
    translations: { [key: string]: any };
    defaultLocale: string;
    locale: string;
    fallbacks: boolean;
    t: (key: string, options?: any) => string;

    constructor();
  }
}
