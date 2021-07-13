import { locale, Locale } from "../i18n"

const FEEDBACK_LINKS: { [locale in Locale]: string } = {
    // Cant open
    en: 'https://www.wjx.cn/vj/ep7PISC.aspx',
    zh_CN: 'https://www.wjx.cn/vj/tbof3Mk.aspx'
}

export const FEEDBACK_LINK = FEEDBACK_LINKS[locale]