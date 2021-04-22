import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'aside-menu',
  methods: {
    changeRoute(route: string) {
      this.$router.push(route)
    }
  },
  render() {
    return (
      <el-menu default-active={useRoute().path} class="menu">
        <el-menu-item
          index="/banned-word"
          onClick={() => this.changeRoute('/banned-word')}
        >
          <span class="non-selected">违禁词管理</span>
        </el-menu-item>
        {/* <el-menu-item
          index="/setting"
          onClick={() => this.changeRoute('/setting')}
        >
          <span class="non-selected">设置中心</span>
        </el-menu-item> */}
      </el-menu>
    )
  }
})
