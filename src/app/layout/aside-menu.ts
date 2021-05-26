import { ElMenu, ElMenuItem } from 'element-plus'
import { defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent(
  () => {
    const router = useRouter()
    const changeRoute = (route: string) => router.push(route)
    return () => h(ElMenu, { defaultActive: useRoute().path, class: 'menu' }, () => [
      h(
        ElMenuItem,
        {
          index: '/banned-word',
          onClick: () => changeRoute('/banned-word')
        },
        () => h('span', { class: 'non-selected' }, '违禁词管理')
      ),
      h(
        ElMenuItem,
        {
          index: '/setting',
          onClick: () => changeRoute('/setting')
        },
        () => h('span', { class: 'non-selected' }, '扩展设置')
      )
    ])
  }
)
