<template>
  <div id="sms-list">
    <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb ">
          <li class="breadcrumb-item"><router-link to='/tool/sms'>短信</router-link></li>
          <span class="ms-auto" @click.stop="back()">返回</span>
        </ol>
      </nav>
    <div class="card">
      <div class="card-body py-1">
          <form class="">
              <input type="hidden" v-model.number="sc.pageNo">
              <input type="hidden" v-model.number="sc.pageSize">

              <input type="textfield" class="form-control" placeholder="手机号" size=11 v-model.trim="mobile">

              <input type="textfield" class="form-control ml-2" placeholder="内容" size=10 v-model.trim="remark">

              <div class="row mb-2">
                  <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
                  <button type="button" class="btn btn-secondary btn-sm ml-1" @click.stop="reset()">重置</button>
              </div>
          </form>
      </div>
    </div>
<!--     <table class="table table-striped table-sm small">
        <thead>
          <tr>
              <th>手机号</th>
              <th>内容</th>
              <th>发送人</th>
              <th>发送状态</th>
              <th></th>
              <th></th>
          </tr>          
        </thead>
        <tbody>
          <tr v-for="info in dataList" :key="info.id">
              <td>{{info.recvPhoneNo}}</td>
              <td>{{info.smsContent}}</td>
              <td>{{info.operator}}</td>
              <td>
                <template v-if="info.smsType === 1">
                  上行
                </template>
                <template v-else-if="info.sendStatus === '01'">
                  已发
                </template>
                <template v-else>
                  {{info.sendStatus}}
                </template>                
              </td>
              <td>{{info.createTime}}</td>
              <td>{{info.lastUpdate}}</td>
          </tr>          

        </tbody>
    </table>
 -->    <sms-detail-list :dataList="dataList"></sms-detail-list>
          
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
    </nav>
  </div>
</template>

<script>
  import { searchSms } from '../api/misc.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyPagination from '../components/my-pagination.vue'
  import SmsDetailList from '../components/list/sms-detail-list.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      SmsDetailList
    },
    data () {
      return {
        dataList: [],

        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 25,
          pageTotal: 0
        },
        mobile: '',
        remark: ''
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },      
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },      
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      search: function () {
        this.showLoading()
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.mobile': this.mobile,
          'sc.remark': this.remark
        }
        searchSms(params,
          (jsonResult) => {
            this.dataList = jsonResult.dataList
            this.sc = jsonResult.page
          },
          () => { this.hideLoading() }
        )
      },
      reset: function () {
        this.mobile = ''
        this.remark = ''
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