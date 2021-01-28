<template>
  <div class="app-header">
    <img width="181" :src="imgSrc" alt="" style="vertical-align: middle;">
    <img src="../assets/version2.png" style="vertical-align: middle" width="60" alt="">
    <div title="关闭" class="right-icon" :class="logoName === '2' ? 'close-b' : 'close-w'" @click="isDeleteDialog = isClose = true"></div>
    <div title="最小化" class="right-icon" :class="logoName === '2' ? 'line-b' : 'line-w'" @click="setWin('min')"></div>
    <el-dropdown class="user-info" :style="{color: logoName ? '#333' : ''}" v-if="$route.name === 'Directory'" size="small">
      <span>
        <img class="user-avatar" src="@/assets/avatar.png" alt="">
<!--        已登录<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
<!--        <el-dropdown-item @click.native="$router.push({path: '/Login', query: {type: 'change'}})">切换账号</el-dropdown-item>-->
      </el-dropdown-menu>
    </el-dropdown>
    <div v-show="isLogin" :style="{color: this.$route.name === 'SendInfo' ? '#fff' : ''}" @click="jumpUrl" class="app-center">
      <img style="vertical-align: middle;" src="../assets/app-center.png" width="19" alt="">
      名冠应用中心
    </div>
    <el-dialog
        title="提示"
        :visible.sync="isDeleteDialog"
        width="450px"
        :closed="() => isDeleteDialog = isClose = false">
      <span>{{isClose ? '确认退出？' : '是否退出当前微信并重新登录？'}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exit(false)">取消</el-button>
        <el-button type="primary" @click="exit(true)">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {miniWindow} from "../utils/miniWindow"

export default {
  name: 'VHeader',
  data() {
    return {
      isDeleteDialog: false,
      isClose: false,
      logoName: ''
    }
  },
  computed: {
    imgSrc() {
      const logo2 = ['Directory', 'Login']
      if (logo2.includes(this.$route.name)) {
        this.logoName = '2'
      } else if (this.$route.name === 'SendInfo') {
        this.logoName = '3'
      } else {
        this.logoName = ''
      }
      return require(`../assets/logo${this.logoName}.png`)
    },
    isLogin() {
      return ['Directory', 'SendInfo'].includes(this.$route.name)
    }
  },
  methods: {
    setWin(type) {
      if (type === 'close') {
        this.$socket.emit('con_exit')
        setTimeout(() => {
          miniWindow && miniWindow.close()
          this.$electron.ipcRenderer.send(type)
        }, 1000)
      } else {
        this.$electron.ipcRenderer.send(type)
      }
    },
    jumpUrl() {
      const { shell } = require('electron')
      shell.openExternal('https://www.mgtx.cn')
    },
    logout() {
      this.isClose = false
      this.isDeleteDialog = true
    },
    exit(type) {
      type && (this.isClose ? this.setWin('close') : this.$router.push('/Login'))
      this.isDeleteDialog = false
    }
  }
}
</script>

<style lang="less" scoped>
.app-header {
  height: 48px;
  padding: 10px 0 0 20px;
  border-bottom: 1px solid #EBEBEB;
  box-shadow: 0 2px 4px rgba(180, 180, 180, 0.1);
  -webkit-app-region: drag;

  .app-title {
    vertical-align: super;
    margin-left: 10px;
    font-size: 15px;
    font-weight: 400;
    color: #303233;
  }

  .app-center {
    float: right;
    display: inline-block;
    margin-right: 20px;
    line-height: 25px;
    font-size: 12px;
    text-decoration: none;
    color: #4D4D4D;
    cursor: pointer;
    -webkit-app-region: no-drag;
  }

  .user-info {
    float: right;
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    color: #fff;
    -webkit-app-region: no-drag;

    .user-avatar {
      vertical-align: middle;
      margin-right: 5px;
    }
  }

  .right-icon {
    float: right;
    display: inline-block;
    margin-right: 10px;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto;
    cursor: pointer;
    -webkit-app-region: no-drag;

    &.line-w {
      background-image: url("../assets/line.png");
    }
    &.line-b {
      background-image: url("../assets/line2.png");
    }
    &.rectangle {
      background-image: url("../assets/rectangle.png");
    }
    &.close-w {
      background-image: url("../assets/close.png");
    }
    &.close-b {
      background-image: url("../assets/close2.png");
    }
  }
}
</style>
