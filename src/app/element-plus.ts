import { ElAside, ElButton, ElCol, ElContainer, ElDialog, ElEmpty, ElForm, ElFormItem, ElMain, ElMenu, ElMenuItem, ElInput, ElRow } from 'element-plus'
import 'element-plus/lib/theme-chalk/index'
import { App } from 'vue'

const toInstall = [ElAside, ElButton, ElCol, ElContainer, ElDialog, ElEmpty, ElForm, ElFormItem, ElMain, ElMenu, ElMenuItem, ElInput, ElRow]

export default function install(app: App): void {
    toInstall.forEach(i => app.component(i.name, i))
}