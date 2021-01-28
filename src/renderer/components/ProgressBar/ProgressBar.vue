<template>
  <div class="container">
    <div v-if="!sendBegin" class="preparing">
      好友名片准备中 <i class="el-icon-loading" style="margin-right: 15px"></i> <span>发送名片时，准备时间可能较缓慢，请耐心等待~</span>
    </div>
    <div v-else-if="sendEnd" class="send-end">
      <img style="vertical-align: middle; margin-right: 10px" width="30" src="@/assets/send-end.png" alt=""> 发送完成
    </div>
    <div v-else-if="showFinish" class="send-end">
      <img style="vertical-align: middle; margin-right: 10px" width="30" src="@/assets/finish.svg" alt=""> 已结束发送
    </div>
    <div v-else class="progress-bar">
      <div class="left">
        <div v-if="sending">
          <img class="left-icon" width="50" src="@/assets/send.png" alt="">发送中
        </div>
        <div v-else>
          <img class="left-icon" width="50" src="@/assets/stop-send.png" alt="">已暂停
        </div>
      </div>
      <div class="middle">
        <div class="bar-tips">您选择了{{addNum}}名联系人，大概需要{{Math.ceil(addNum * 5 / 60)}}分钟</div>
        <el-progress :percentage="schedule" :show-text="false"></el-progress>
      </div>
      <div class="right">
        <span v-if="sending">快捷键 <span style="font-weight: bold">F11</span> 暂停</span>
        <div v-else>
          <el-button @click="finish" :loading="isFinish">结束</el-button>
          <el-button @click="keepOn" type="primary" :disabled="isFinish">继续</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "ProgressBar",
    data() {
      return {
        sending: true,
        isFinish: false,
        showFinish: false,
        addNum: 0,
        second: 0,
        isEnd: false,
        completedNum: 0,
        timer: null
      }
    },
    computed: {
      ...mapState(['sendBegin', 'sendEnd', 'readyList']),
      schedule() {
        return !this.addNum && !this.completedNum ? 0 : Math.ceil(this.completedNum / this.addNum * 100)
      }
    },
    watch: {
      sendBegin(val) {
        val && this.timerFun()
      },
      completedNum(val) {
        val >= this.addNum && clearInterval(this.timer)
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      clearInterval(this.timer)
      this.$socket.emit('run_over')
    },
    methods: {
      init() {
        const {peopleNum, second} = JSON.parse(this.$route.query.params)
        this.addNum = parseInt(peopleNum)
        // this.addNum = 10
        // setTimeout(() => this.$store.dispatch('socket_begin'), 2000)
        this.second = parseInt(second)
        document.getElementsByClassName('app-header')[0].style.display = 'none'
        // document.getElementsByClassName('qr-code')[0].style.display = 'none'
        this.$electron.remote.globalShortcut.unregister('F11')
        this.$electron.remote.globalShortcut.register('F11', this.stop)
      },
      stop() {
        if (this.sending) {
          this.$socket.emit('run_stop')
          this.sending = !this.sending
          setTimeout(() => {
            clearInterval(this.timer)
          }, 5000)
        }
      },
      finish() {
        this.isFinish = true
        this.$socket.emit('run_over')
        this.$store.dispatch('set_completed_num', this.completedNum)
        setTimeout(() => {
          this.showFinish = true
        }, 500)
      },
      timerFun() {
        this.timer = setInterval(() => {
          const operatedList = [...JSON.parse(localStorage.getItem('operatedList')) || [], this.readyList[this.completedNum]]
          localStorage.setItem('operatedList', JSON.stringify([...new Set(operatedList)]))
          this.completedNum++
        }, this.second * 1000)
      },
      keepOn() {
        this.$socket.emit('run_go')
        this.sending = !this.sending
        this.timerFun()
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    -webkit-app-region: drag;
    height: 100%;
    opacity: .8;
    border-radius: 10px;
    background: linear-gradient(180deg, #0046D1 0%, #002369 100%);
    color: #F5F7FA;

    .send-end {
      line-height: 62px;
      text-align: center;
      font-size: 14px;
    }

    .preparing {
      width: 100%;
      line-height: 62px;
      text-align: center;
      font-size: 14px;
    }

    .progress-bar {
      white-space: nowrap;
      height: 100%;
      padding: 8px 0;

      /deep/ .el-progress-bar__outer {
        background: #5c5c5c;
      }

      /deep/ .el-progress-bar__inner {
        background: #fff;
      }

      &>div {
        display: inline-block;
        vertical-align: top;
      }

      .left {
        width: 113px;
        line-height: 46px;
        border-right: 1px solid #ddd;
        font-size: 14px;

        .left-icon {
          vertical-align: middle;
        }
      }

      .middle {
        width: 363px;
        padding: 8px 20px 0 20px;
        font-size: 14px;

        .bar-tips {
          margin-bottom: 7px;
        }
      }

      .right {
        width: 148px;
        padding-left: 16px;
        line-height: 46px;
        border-left: 1px solid #ddd;
        text-align: center;
        font-size: 12px;
        -webkit-app-region: no-drag;
      }
    }
  }

</style>
