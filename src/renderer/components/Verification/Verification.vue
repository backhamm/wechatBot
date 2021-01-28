<template>
  <div class="verification">
    <breathing />
    <div class="init" v-if="isInit">
      <i class="el-icon-loading"></i> 加载中...
    </div>
    <div class="container enter-fade" v-else>
      <div class="header">
        <p class="product-name">名冠微信好友转移BOT</p>
        <p>微信客户资源一键转移至企业微信</p>
      </div>
      <div class="main">
        <p class="input-title">机器码</p>
        <el-input class="input-input" v-model="machineCode" readonly>
          <span class="copy" slot="suffix" @click="copy">复制</span>
        </el-input>
        <p class="input-title">软件密钥</p>
        <el-input @contextmenu.native="stickFun" class="input-input" v-model="key" placeholder="请输入软件密钥码"></el-input>
        <el-button style="width: 100%;" type="primary" size="medium" @click="checkKey">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {copy} from "../../utils/copy"
import {clipboard} from 'electron'

export default {
  name: "Verification",
  data() {
    return {
      isInit: true,
      machineCode: '',
      // key: localStorage.getItem('sk') || ''
      key: ''
    }
  },
  sockets: {
    connect() {
      this.$socket.emit('get_key')
    },
    getKey({data}) {
      this.isInit = false
      const {code, key} = data
      if (key) {
        // localStorage.setItem('sk', key)
        this.$router.push('/TipsPage')
      } else {
        this.machineCode = code
      }
    },
    checkKey({cmd}) {
      if (cmd) {
        this.$message.success('密钥验证成功！')
        this.$router.push('/TipsPage')
      } else {
        this.$message.error('密钥验证失败！')
      }
    }
  },
  mounted() {
    // !this.key ? this.$socket.emit('get_key') : this.$router.push('/TipsPage')
    this.$socket.emit('get_key')
  },
  methods: {
    copy() {
      this.machineCode.trim() && copy(this.machineCode, this.$message)
    },
    checkKey() {
      this.key.trim() && this.$socket.emit('check_key', this.key)
    },
    stickFun() {
      this.key = clipboard.readText()
    }
  }
}
</script>
<style lang="less" scoped>
.verification {
  margin-top: -48px;
  min-height: 345px;
  padding-top: 90px;
  background: url("../../assets/verification-bg.jpg") no-repeat top center/ 100% 345px;
  color: #fff;

  .init {
    padding-top: 100px;
    text-align: center;
  }

  .container {
    width: 337px;
    margin: 0 auto;

    .header {
      margin-bottom: 30px;
      line-height: 2;
      font-size: 14px;
      text-align: center;

      .product-name {
        font-size: 32px;
      }
    }

    .main {
      padding: 40px 35px;
      box-shadow: 0 1px 10px rgba(0, 0, 0, 0.16);
      border-radius: 4px;
      font-size: 14px;
      background: #fff;
      color: #000;

      .input-title {
        margin-bottom: 7px;
      }

      .input-input {
        margin-bottom: 24px;

        .copy {
          margin-right: 8px;
          line-height: 30px;
          color: #0078EF;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
