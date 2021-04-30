import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/banned-word'
    }, {
        path: '/banned-word',
        component: () => import('./component/BannedWord')
    },
    {
        path: '/setting',
        component: () => import('./component/Setting')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default function installRouter(app: App): void {
    app.use(router)
}
