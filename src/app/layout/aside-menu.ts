import { ElMenu, ElMenuItem } from 'element-plus'
import { defineComponent, h } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'aside-menu',
  methods: {
    changeRoute(route: string) {
      this.$router.push(route)
    }
  },
  render(_ctx: any) {
    return h(ElMenu, { defaultActive: useRoute().path, class: 'menu' }, () => [
      h(
        ElMenuItem,
        {
          index: '/banned-word',
          onClick: () => _ctx.changeRoute('/banned-word')
        },
        () => h('span', { class: 'non-selected' }, '违禁词管理')
      ),
      h(
        ElMenuItem,
        {
          index: '/setting',
          onClick: () => _ctx.changeRoute('/setting')
        },
        () => h('span', { class: 'non-selected' }, '扩展设置')
      )
    ])
  }
})
