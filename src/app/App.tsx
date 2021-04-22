import { defineComponent } from 'vue'
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
    return (
      <el-container>
        <el-aside>
          <aside-menu />
        </el-aside>
        <el-container id="app-body">
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    )
  }
})
