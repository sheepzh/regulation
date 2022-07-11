import './style/index'
import { createApp } from 'vue'
import AppMain from './app'
import './element-plus'
import installRouter from './router'
import { t2Chrome } from "@util/i18n/chrome/t"

const app = createApp(AppMain)

installRouter(app)

app.mount('#app')

document.title = t2Chrome(msg => msg.app.name)
