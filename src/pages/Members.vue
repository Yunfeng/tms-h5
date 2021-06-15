<template>
  <div id="members">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item active">会员管理</li>
      </ol>
    </nav>

    <div class="card">
      <div class="card-body">
        <form class="">
          <div class="row mb-2">
            <input type="text" class="form-control mr-sm-2" size="11" placeholder="用户名" v-model.trim="username">
          </div>
          <div class="row mb-2">
            <input type="text" class="form-control mr-sm-2" size="11" placeholder="手机" v-model.trim="mobile">
          </div>
          <select class="form-control form-control mr-sm-2" v-model.number="userType">
            <option value="-1">所有会员</option>
            <option value="0">散客</option>
            <option value="1">企业</option>
          </select>

          <div class="row mb-2">
            <button type="button" class="btn btn-primary  mr-sm-2" @click.stop="search()">查找</button>
            <button type="button" class="btn btn-secondary btn-sm" @click.stop="reset()">重置</button>
          </div>
        </form>
      </div>
      <table class="table table-striped table-hover table-sm small">
          <thead>
              <tr>
                  <th>用户名</th>
                  <th>全名</th>
                  <th>用户类型</th>
                  <th>手机</th>
                  <th>邮件</th>
                  <th>企业微信id</th>
                  <th>openid</th>
                  <th>企业名称</th>
                  <th>企业详情</th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(user, index) in userList" :key="user.username">
                  <td>{{user.username}}</td>
                  <td>{{user.empname}}</td>
                  <td>
                    <template v-if="user.userType === 0">散客</template>
                    <template v-else-if="user.userType === 1">企业</template>
                  </td>
                  <td>{{user.mobileNo}}</td>
                  <td>{{user.email}}</td>
                  <td>{{user.wwUserId}}</td>
                  <td>{{user.openId}}</td>
                  <td>{{user.corpName}}</td>
                  <td>
                    <template v-if="user.enterpriseId > 0">
                      <router-link :to="`/admin/member/enterprise/` + user.enterpriseId">详情</router-link>
                    </template>
                  </td>
              </tr>

          </tbody>
      </table>
    </div>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>
  </div>	
</template>

<script>
  import { searchMembers, createUser, searchDepartments, deleteWwUser } from '../api/admin.js'
  import MyPagination from '../components/my-pagination.vue'

  export default {
    name: 'Members',
    components: {
      MyPagination
    },
    data () {
      return {
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        },
        username: '',
        mobile: '',
        userType: -1,

        userList: [],
        user: {
          'id': 0,
          'username': '',
          'empname': '',
          'mobileNo': '',
          'email': '',
          'etermUsername': ''
        }
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },      
      search: function () {
        this.showLoading()
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.username': this.username,
          'sc.mobile': this.mobile,
          'sc.type': this.userType
        }
        searchMembers(params,
          v => {
            this.userList = v.dataList
            this.sc = v.page
          },
          () => this.hideLoading()
        )
      },
      reset: function () {
        this.username = ''
        this.mobile = ''
        this.userType = -1
      },
      prevPage: function () {
        this.sc.pageNo = this.sc.pageNo - 1
        if (this.sc.pageNo < 1) this.sc.pageNo = 1
        this.search()
      },
      nextPage: function () {
        this.sc.pageNo = this.sc.pageNo + 1
        this.search()
      },
      directPage: function (pageNo) {
        this.sc.pageNo = pageNo
        this.search()
      }
    }
  }
</script>