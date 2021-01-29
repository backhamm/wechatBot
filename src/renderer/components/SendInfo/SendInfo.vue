<template>
  <div class="send-info">
    <img class="send-bg2" width="162" src="@/assets/send-bg2.png" alt="">
    <p class="title enter-fade">选择了{{userList.length}}名联系人，大概需要{{Math.ceil(userList.length * 5 / 60)}}分钟；</p>
    <p>请使用您的企业微信并打开要被转移好的微信聊天窗口发送“开始”</p>
    <div class="tips">
      <p style="margin-bottom: 16px">重要提示</p>
      <p>1、企业微信聊天窗口需要关闭侧边栏及聊天记录窗口</p>
      <p style="margin-bottom: 34px">2、原始窗口打字栏需要拉到最下</p>
      <p>开始后，系统将自动操作，在此期间，请不要随意移动鼠标或操作键盘</p>
      <p>添加完成后，系统会自动弹出窗口进行提示</p>
      <div class="operate-btn enter-fade">
        <el-button class="start-btn" type="success" @click="sendCard" :disabled="sending">开始</el-button>
        <br>
        <el-button @click="$router.push('/Directory')">取消</el-button>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showLog" class="mask">
        <div class="send-tips">
          <img src="../../assets/success.png" width="52" alt="">
          <p class="tips-title">发送完成</p>
          <p style="padding: 12px 0 18px">已为您发送“添加邀请”<span style="color: #62C232;">{{$store.state.completedNum || userList.length}}</span>人</p>
          <el-link type="primary" @click="$router.push('/Directory')">返回首页</el-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {createMiniWindow, miniWindow} from "../../utils/miniWindow"

  export default {
    name: "SendInfo",
    data() {
      return {
        userList: [],
        sending: false,
        showLog: false
      }
    },
    sockets: {
      workLog({cmd, msg}) {
        !cmd && this.$message.error(msg)
      },
      sendEnd() {
        this.sending = false
        this.showLog = true
        this.$socket.emit('work_log')
        this.$store.dispatch('send_end', true)
        setTimeout(() => {
          miniWindow.close()
          this.$store.dispatch('socket_begin', false)
        }, 2000)
      }
    },
    mounted() {
      this.userList = this.$route.query.userList || []
    },
    methods: {
      sendCard() {
        // this.showLog = true
        this.sending = true
        const data = this.userList.map(el => el.wxid)
        this.$socket.emit('run_log', JSON.stringify(data))
        this.$store.dispatch('set_ready_list', data)
        this.$store.dispatch('send_end', false)
        this.$store.dispatch('set_completed_num', 0)
        const params = {peopleNum: this.userList.length, second: 5}
        createMiniWindow(JSON.stringify(params))
      }
    }
  }
</script>

<style lang="less" scoped>
  .send-info {
    margin-top: -48px;
    padding: 172px 50px 0;
    height: 100%;
    background: #0085DD url("../../assets/send-bg.png") no-repeat top right / 550px 530px;
    color: #fff;

    .send-bg2 {
      position: absolute;
      top: 92px;
      right: 46px;
    }

    .title {
      margin-bottom: 12px;
      font-size: 32px;
    }

    .tips {
      position: relative;
      margin-top: 110px;
      padding: 23px 22px;
      height: 200px;
      font-size: 14px;
      background: #fff;
      color: #333;

      .operate-btn {
        position: absolute;
        top: 50px;
        right: 28px;

        .start-btn {
          margin-bottom: 10px;
          box-shadow: 0 3px 6px rgba(98, 194, 50, 0.6);
        }

        button {
          width: 103px;
          height: 48px;
          font-size: 18px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }
      }
    }

    .mask {
      position: fixed;
      z-index: 99;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .5);
      opacity: 1;
      transition: all .3s;

      .send-tips {
        position: fixed;
        top: calc(50% - 110px);
        left: calc(50% - 180px);
        width: 360px;
        height: 220px;
        padding-top: 40px;
        font-size: 14px;
        text-align: center;
        background: #fff;
        color: #303233;
        transition: all .3s;

        .tips-title {
          padding-top: 12px;
          font-size: 16px;
        }
      }

      &.fade-enter, &.fade-leave-to {
        opacity: 0;

        .send-tips {
          transform: translateY(-15px);
        }
      }
    }
  }
</style>
