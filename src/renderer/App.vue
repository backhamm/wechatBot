<template>
  <div id="app">
    <v-header />
    <router-view></router-view>
    <!-- <div class="qr-code" :style="{right: showQrCode ? 0 : '-100px'}" @mouseenter="showQrCode = true" @mouseleave="showQrCode = false">
      <div class="pack-up">
        <img width="14" src="@/assets/qr-code-small.png" alt="">
        联系客服
      </div>
      <img width="90" src="@/assets/qr-code.jpg" alt="">
    </div> -->
  </div>
</template>

<script>
  import {miniWindow} from "./utils/miniWindow"

  export default {
    name: 'App',
    data() {
      return {
        showHeader: true,
        showQrCode: false
      }
    },
    mounted() {
      // this.$router.push('/Directory')
      // this.$router.push('/SendInfo')
    },
    beforeDestroy() {
      miniWindow && miniWindow.close()
    }
  }
</script>

<style lang="less">
  *, body, html {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
  }

  body, html {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .qr-code {
      position: absolute;
      right: 0;
      bottom: 30px;
      width: 132px;
      font-size: 14px;
      border-radius: 4px 0 0 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
      background: #fff;
      color: #6A6A6A;
      cursor: pointer;
      transition: all .3s;

      .pack-up {
        display: inline-block;
        width: 32px;
        padding: 10px 9px;
      }
    }
  }

  @keyframes enterFade {
    from {
      opacity: 0;
      transform: translateX(50px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .enter-fade {
    animation: enterFade .5s;
  }
</style>
