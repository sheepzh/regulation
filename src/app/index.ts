import './style/index'
import { createApp } from 'vue'
import AppMain from './app'
import 'element-plus/theme-chalk/index.css'
import installRouter from './router'
import { t2Chrome } from "@util/i18n/chrome/t"
import { Locale, locale } from '@util/i18n'
import ElementPlus from "element-plus"

const locales: { [locale in Locale]: any } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    en: () => import('element-plus/lib/locale/lang/en'),
}

function main() {
    const app = createApp(AppMain)
    document.title = t2Chrome(msg => msg.app.name)
    installRouter(app)
    app.mount('#app')
    app.use(ElementPlus, { locale: locales[locale].default })
}

main()