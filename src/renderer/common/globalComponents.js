import Vue from 'vue'
import VHeader from './VHeader'
import Breathing from './Breathing'
import {
  Button,
  Input,
  Select,
  Option,
  Progress,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Dialog,
  InputNumber,
  Checkbox,
  Message,
  Loading,
  MessageBox,
  Table, TableColumn, Link
} from 'element-ui'

export const MyLoading = Loading

let elList = [Button, Input, Select, Option, Progress, Dropdown, DropdownMenu, DropdownItem, Dialog, InputNumber, Checkbox, Table, TableColumn, Link]

let componentList = [VHeader, Breathing, ...elList]

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = Message
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.use(Loading.directive)
Vue.use({
  install(Vue) {
    componentList.forEach(item => {
      Vue.component(item.name, item)
    })
  }
})
