import './style/index'
import { createApp } from 'vue'
import App from './App'
import 'element-plus/theme-chalk/index.css'
import router from './router'
import { t2Chrome } from "@util/i18n/chrome/t"
import { Locale, locale } from '@util/i18n'
import ElementPlus from "element-plus"

const locales: { [locale in Locale]: any } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    en: () => import('element-plus/lib/locale/lang/en'),
}

function main() {
    const app = createApp(App)
    document.title = t2Chrome(msg => msg.app.name)
    app.use(router)
    app.mount('#app')
    app.use(ElementPlus, { locale: locales[locale].default })
}

main()