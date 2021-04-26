import { ElAside, ElContainer, ElMain } from 'element-plus'
import { defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'
import AsideMenu from './layout/aside-menu'
export default defineComponent({
  methods: {
    changeRoute(route: string) {
      this.$router.push(route)
    }
  },
  name: 'app',
  components: { AsideMenu },
  render() {
    return h(ElContainer, {}, () => [
      h(ElAside, {}, () => h(AsideMenu)),
      h(ElContainer, { id: 'app-body' }, () =>
        h(ElMain, {}, () => h(RouterView))
      )
    ])
  }
})
