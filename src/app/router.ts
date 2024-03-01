import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/banned-word'
    }, {
        path: '/banned-word',
        component: () => import('./components/BannedWord')
    },
    {
        path: '/setting',
        component: () => import('./components/Setting')
    }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})

