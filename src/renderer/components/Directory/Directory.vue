<template>
  <div class="directory">
    <div class="left">
      <div class="left-title">
        通讯录（<span style="color: #0078EF">{{ userList.length }}</span>人）
        <el-input class="search-input" v-model.trim="searchKey" placeholder="搜索" size="mini"
                  prefix-icon="el-icon-search"></el-input>
      </div>
      <el-table
        :data="FilterUserList"
        ref="multipleTable"
        style="width: 100%; padding: 0 20px"
        @selection-change="selectionChange"
        height="calc(100% - 55px)"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column width="40">
          <template slot="header" slot-scope="scope">
            <el-button type="text" size="mini" @click="reverse">反选</el-button>
          </template>
        </el-table-column>
        <el-table-column label="昵称" min-width=180 show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="user-icon" :style="{background: scope.row.iconBg}">{{ scope.row.remark.slice(0, 1) }}</span>
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="标识" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :style="{color: scope.row.mark === '已操作' ? '#62C232' : ''}">{{ scope.row.mark }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="right" :style="{width: selectionList.length ? '200px' : 0}">
      <div class="wrapper">
        <p class="title">已经选择{{selectionList.length}}个联系人</p>
        <div class="main">
          <div class="user-item" v-for="(item, i) of selectionList" :key="i">
            <div class="user-name">{{item.nickname}}</div>
            <div class="close-user" @click="$refs.multipleTable.toggleRowSelection(item)">
              <i class="el-icon-circle-close"></i>
            </div>
          </div>
        </div>
        <el-button class="footer-btn" @click="checkUser" size="mini" type="primary">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {MyLoading} from "../../common/globalComponents"

  export default {
    name: "Directory",
    data() {
      return {
        loadUserList: false,
        params: {
          peopleNum: 5,
          second: 4
        },
        userList: [],
        selectionList: [],
        copySelectionList: [],
        searchKey: ''
      }
    },
    watch: {
      searchKey(val, old) {
        if (val && !old) {
          this.copySelectionList = this.selectionList.slice()
        }
      },
      FilterUserList() {
        this.$nextTick(() => {
          this.copySelectionList.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        })
      }
    },
    computed: {
      FilterUserList() {
        if (this.searchKey) {
          return this.userList.filter(el => {
            return ['nickname', 'remark', 'mark'].some(key => el[key].indexOf(this.searchKey) > -1)
          })
        }
        return this.userList
      }
    },
    sockets: {
      userList({data}) {
        if (Array.isArray(data)) {
          const arr = ['#2196F3', '#9C27B0', '#00BCD4', '#FF9800', '#4CAF50']
          let operatedList = JSON.parse(localStorage.getItem('operatedList')) || []
          let iconIndex = 0
          data.forEach(el => {
            el.iconBg = arr[iconIndex]
            el.mark = operatedList.includes(el.wxid) ? '已操作' : '未操作'
            iconIndex === 4 ? iconIndex = 0 : iconIndex++
          })
          this.userList = data
          sessionStorage.setItem('userList', JSON.stringify(data))
          this.loadUserList.close()
        }
      },
      checkUser({cmd}) {
        if (cmd) {
          this.$router.push({path: '/SendInfo', query: {userList: this.selectionList}})
        } else {
          // #a3adb7 #0078EF #F5AC40
          this.$alert(`<div style="font-size: 14px"><p>当前版本：<span style="color: #0078EF">V5版长期</span></p><p>最多可登录5个账户，可联系销售人员升级</p></div>`, '账户限制提醒', {
            dangerouslyUseHTMLString: true,
            callback: () => {
              this.$router.push('/Login')
            }
          })
        }
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        // const list = [
        //   {
        //     'account': '54541',
        //     'nickname': 'www',
        //     'remark': '111',
        //     'wxid': 'wxid_www'
        //   }, {
        //     'account': '54541',
        //     'nickname': 'qqq',
        //     'remark': '222',
        //     'wxid': 'wxid_qqq'
        //   }, {
        //     'account': '54541',
        //     'nickname': '睡不醒🌙1',
        //     'remark': '333',
        //     'wxid': 'wxid_eee'
        //   }
        // ]
        // sessionStorage.setItem('userList', JSON.stringify(list))
        let userList = JSON.parse(sessionStorage.getItem('userList'))
        if (userList) {
          let operatedList = JSON.parse(localStorage.getItem('operatedList')) || []
          userList.forEach(el => {
            el.mark = operatedList.includes(el.wxid) ? '已操作' : '未操作'
          })
          this.userList = userList
        }

        !this.userList.length && (this.loadUserList = MyLoading.service({
          target: '.directory',
          text: '好友加载中，请稍后...'
        }))

        // const arr = ['#2196F3', '#9C27B0', '#00BCD4', '#FF9800', '#4CAF50']
        // let iconIndex = 0
        // this.userList.forEach(el => {
        //   el.iconBg = arr[iconIndex]
        //   iconIndex === 4 ? iconIndex = 0 : iconIndex++
        // })
      },
      selectionChange(val) {
        this.$nextTick(() => {
          this.selectionList = val
          this.copySelectionList = val.slice()
        })
      },
      reverse() {
        const list = this.FilterUserList.filter(el => !this.selectionList.some(item => item.wxid === el.wxid))
        this.$refs.multipleTable.clearSelection()
        list.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      },
      checkUser() {
        this.$socket.emit('check_user')
        // this.$router.push({path: '/SendInfo', query: {userList: this.selectionList}})
      }
    }
  }
</script>

<style lang="less" scoped>
  .directory {
    display: flex;
    height: calc(100% - 48px);
    overflow: hidden;

    /deep/ .el-input-number.is-controls-right .el-input__inner {
      text-align: left;
    }

    /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
      display: none;
    }

    /deep/ .el-table th:nth-child(3) > .cell {
      padding-left: 43px;
    }

    .title-icon {
      vertical-align: bottom;
      margin-right: 10px;
    }

    .params-log {
      /deep/ .el-dialog {
        .el-dialog__header {
          padding: 10px 20px;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        .el-dialog__headerbtn {
          top: 10px;
        }

        .el-dialog__body {
          padding: 20px 40px;
        }

        .el-dialog__footer {
          padding: 10px 20px;
          border-top: 1px solid #eee;
        }

        .log-title {
          margin-bottom: 21px;
        }

        .log-input {
          padding: 0 15px;

          &:not(:last-child) {
            margin-bottom: 24px;
          }

          .input-tips {
            padding-left: 75px;
            line-height: 2;
            font-size: 12px;
            color: #909699;
          }
        }
      }
    }

    .left {
      flex: 1;
      height: 100%;
      overflow: auto;
      background: #fff;

      .left-title {
        padding: 0 25px;
        line-height: 43px;
        font-size: 12px;
        color: #606366;

        .search-input {
          float: right;
          width: 150px;
        }
      }

      .user-icon {
        display: inline-block;
        width: 25px;
        height: 25px;
        margin-right: 5px;
        text-align: center;
        color: #fff;
      }

      .left-item {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 56px;
        line-height: 32px;
        padding: 12px 16px;
        border-top: 1px solid #EBEBEB;
        font-size: 14px;
        color: #303233;

        .username {
          vertical-align: top;
          margin-left: 5px;
        }
      }
    }

    .right {
      white-space: nowrap;
      line-height: 3;
      font-size: 12px;
      color: #303233;
      transition: all .3s;

      .wrapper {
        overflow: hidden;
        padding: 0 13px 15px;
        height: 100%;
        border-left: 1px solid #ddd;

        .title {
          height: 36px;
        }

        .main {
          overflow: auto;
          height: calc(100% - 75px);

          &::-webkit-scrollbar {
            display: none;
          }

          .user-item {
            display: flex;

            .user-name {
              overflow: hidden;
              width: 155px;
              text-overflow: ellipsis;
            }

            .close-user {
              flex: 1;
              text-align: right;
              cursor: pointer;
            }
          }
        }

        .footer-btn {
          margin-top: 10px;
          width: 100%;
        }
      }
    }
  }
</style>
