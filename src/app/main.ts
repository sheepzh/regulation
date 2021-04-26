import 'vue-tsx-support/enable-check'
import './style/index'
import { createApp } from 'vue'
import App from './App'
import './element-plus'
import installRouter from './router'

const app = createApp(App)

installRouter(app)

app.mount('#app')
