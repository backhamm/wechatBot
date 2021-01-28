<template>
  <div class="tips-page">
    <breathing />
    <p class="title">初始化说明</p>
    <p class="title-tips">(在你操作该工具前，请确保已完成以下外部操作)</p>
    <div class="tips-container enter-fade">
      <div class="header">
        <div class="step">
          <span v-for="i of 4" :key="i" class="num" :class="{'active': currentStep === i}">{{ i }}</span>
        </div>
        <div class="step-text">
          <span v-for="i of ['安装微信客户端', '显示设置', '登录企业微信', '完成']" :key="i" class="text-item">{{ i }}</span>
        </div>
      </div>
      <div class="main">
        <div v-if="currentStep === 2" class="step-1">
          <p class="step-1-title">点击下方"安装电脑版微信"，手动完成安装，<span style="color: #F5AC40">安装后不启动微信；</span></p>
          <p>（若已安装其他版本，仍需要安装覆盖原版本）</p>
          <div class="install-wx" @click="$socket.emit('set_wx')">安装电脑端微信（V3.1.0.41）</div>
          <p>已安装此版本后可忽略</p>
        </div>
        <div v-else-if="currentStep === 1" class="step-2">
          <div class="left">
            <p class="left-title">win7设置方法</p>
            <p>桌面>右键>个性化>显示，将缩放与布局调整成100%</p>
            <p class="left-title" style="margin-top: 48px">win10设置方法</p>
            <p>桌面>右键>显示设置，将缩放与布局调整成100%</p>
          </div>
          <div class="right" @mouseleave="showBigImg = false">
            <img width="168px" src="@/assets/win7-set.png" @mouseenter="showBigFun(7)" title="单击查看大图" alt="">
            <img width="168px" src="@/assets/win10-set.png" @mouseenter="showBigFun(10)" title="单击查看大图" alt="">
            <transition name="show">
              <img v-if="showBigImg" class="big-img" :src="bigImg" alt="">
            </transition>
          </div>
        </div>
        <div v-else-if="currentStep === 3" class="step-3"></div>
        <div v-else class="step-4"></div>
      </div>
      <div class="footer">
        <div v-if="currentStep === 1">
          <el-button class="blue-btn w-360" @click="currentStep++" type="primary">下一步</el-button>
        </div>
        <div class="step-layout" v-else>
          <el-button type="text" style="color: #333" @click="notShow">{{currentStep === 4 ? '不再显示' : ''}}</el-button>
          <div>
            <el-button class="gray-btn w-96" type="text" @click="currentStep--">上一步</el-button>
            <el-button v-if="currentStep !== 4" class="blue-btn w-96" @click="currentStep++" type="primary">下一步</el-button>
            <el-button v-else class="blue-btn w-96" @click="$router.push('/Login')" type="primary">完成</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TipsPage",
  data() {
    return {
      checked: localStorage.getItem('showTips'),
      currentStep: 1,
      showBigImg: false,
      bigImg: null
    }
  },
  created() {
    this.checked > 0 && this.$router.push('/Login')
  },
  methods: {
    showBigFun(type) {
      this.showBigImg = true
      this.bigImg = require(`../../assets/win${type}-set-big.png`)
    },
    notShow() {
      if (this.currentStep === 4) {
        localStorage.setItem('showTips', '1')
        this.$router.push('/Login')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .tips-page {
    margin-top: -48px;
    padding-top: 68px;
    background: url("../../assets/verification-bg.jpg") no-repeat top center/ 100% 345px;

    .title {
      line-height: 40px;
      text-align: center;
      font-size: 24px;
      font-weight: 500;
      color: #fff;
    }

    .title-tips {
      margin-bottom: 15px;
      text-align: center;
      font-size: 14px;
      color: #C0C6CC;
    }

    .tips-container {
      width: 567px;
      height: 439px;
      margin: 0 auto;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.19);
      color: #303233;

      .header {
        height: 113px;
        padding: 36px 44px 0;
        border-radius: 8px 8px 0 0;
        background: #00164E url("../../assets/wave.png") no-repeat bottom center / 100% 74px;

        .step {
          position: relative;
          display: flex;
          justify-content: space-around;

          &:after {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            height: 2px;
            background: #0078EF;
          }

          .num {
            position: relative;
            z-index: 1;
            width: 22px;
            line-height: 20px;
            border: 1px solid #0078EF;
            text-align: center;
            border-radius: 50%;
            background: #00164E;
            color: #0078EF;

            &.active {
              background: #0078EF;
              color: #fff;
              transition: all .3s;
            }
          }
        }

        .step-text {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;

          .text-item {
            flex: 1;
            text-align: center;
            font-size: 12px;
            color: #fff;
          }
        }
      }

      .main {
        height: calc(439px - 113px - 76px);
        font-size: 14px;
        text-align: center;
        background: #fff;

        .step-1 {
          padding: 40px 70px 0;
          color: #666;

          .step-1-title {
            margin-bottom: 12px;
            font-weight: bold;
            color: #000;
          }

          .install-wx {
            margin: 47px 0 16px;
            line-height: 48px;
            border: 1px solid #0046D1;
            border-radius: 4px;
            cursor: pointer;
            color: #0046D1;
          }
        }

        .step-2 {
          display: flex;
          justify-content: space-between;
          height: 100%;
          padding: 0 35px;
          text-align: left;

          .left {
            width: 249px;
            padding-top: 33px;

            .left-title {
              margin-bottom: 10px;
              font-weight: bold;
            }
          }

          .right {
            width: 168px;
            padding-top: 11px;

            .big-img {
              position: fixed;
              z-index: 99;
              top: 5%;
              left: 5%;
              width: 90%;
              height: 90%;
              transform-origin: top;
              transform: perspective(700px) rotateX(0);
              transition: all .3s;

              &.show-enter, &.show-leave-to {
                transform: rotateX(40deg);
                opacity: 0;
              }
            }
          }
        }

        .step-3 {
          height: 100%;
          background: url("../../assets/step3-bg.png") no-repeat top center / 100% 100%;
        }

        .step-4 {
          height: 100%;
          background: url("../../assets/step4-bg.png") no-repeat top center / 100% 100%;
        }
      }

      .footer {
        height: 76px;
        padding: 20px 40px 0;
        border-top: 1px solid #DBDBDB;
        text-align: center;
        border-radius: 0 0 8px 8px;
        background: #fff;

        .w-96 {
          width: 96px;
        }

        .w-360 {
          width: 360px;
        }

        .gray-btn {
          background: #E6E6E6;
          color: #333;
        }

        .blue-btn {
          background: #0046D1;
        }

        .step-layout {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
</style>
