import { createApp } from 'vue'
// import 'element-plus/packages/theme-chalk/src/base.scss'
import { ElButton } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';

createApp({})
    .component(ElButton.name, ElButton)
    .mount('#app')
