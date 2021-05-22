<template>
  <div id="customers">
    <div class="card">
      <div class="card-header bg-info text-white">
        客户信息
      </div>
      <div class="card-body">
        <form class="form-inline" id="frmSearchUser">
          <input type="hidden" name="sc.pageNo" v-model.number="sc.pageNo">
          <div class="row mb-2">
              <input type="textfield" class="form-control" placeholder="公司名称" name="sc.name" v-model.trim="name" size="15">
          </div>
          <div class="row mb-2">
            <select class="form-control form-control-sm ml-1" v-model.number="enterpriseType">
              <option value="-1">所有</option>
              <option value="0">企业散客</option>
              <option value="1">企业客户</option>
            </select>
          </div>
          <label>排序</label>
          <select class="form-control" v-model.number="orderBy">
              <option value="0">默认</option>
              <option value="1">协议截止日期（倒序）</option>
          </select>
          <label>状态</label>
          <select class="form-control" v-model.number="status">
              <option value="-1">全部</option>
              <option value="0">停用</option>
              <option value="1">启用</option>
          </select>
          <my-date-picker id="endDate" v-model="endDate" placeholder="协议截止日期" sizing="sm"></my-date-picker>
          <label>记录数</label>
          <select class="form-control" v-model.number="sc.pageSize">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
          </select>
          <div class="row mb-2">
              <button type="button" class="btn btn-primary ml-1" @click="search()">查找</button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button type="button" class="btn btn-secondary btn-sm" title="清空查找条件" @click="reset();">重置</button>
          </div>

          <router-link to="/customer" class="btn btn-success ml-auto">新建</router-link>
        </form>
      </div>
    </div>
    <table class="table table-striped table-sm small">
        <thead>
            <tr>
                <th>公司名称</th>
                <th>客户编号</th>
                <th>排序拼音</th>
                <th>联系人</th>
                <th>电话</th>
                <th>结算方式</th>
                <th>结算周期</th>
                <th>协议截止日期</th>
                <th>状态</th>
                <th  class="text-right"></th>
                <th  class="text-right"></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="info in dataList" :key="info.id" :class="{'table-dark text-white': info.status === 0}">
                <td>{{info.vipName}}
                  <span class="text-danger small" v-if="info.enterpriseType === 0">散客</span>
                </td>
                <td>{{info.customerCode}}</td>
                <td class="small">{{info.pinyin}}</td>
                <td>{{info.linkman}}</td>
                <td>{{info.phone}}</td>
                <td>{{getSettlementTypeDesc(info.settlementType)}} 
                  <span class="small" v-if="info.settlementMode !== null && info.settlementMode.length > 0">({{info.settlementMode}})</span>
                </td>
                <td>{{info.settlementPeriod}}</td>
                <td>{{info.agreementEndDate}}</td>
                <td>
                  <span v-if="info.status === 0" class="text-danger">
                    停用
                  </span>
                  <span v-if="info.status === 1" class="text-success">
                    启用
                  </span>
                </td>
                <td>
                  <router-link :to="`/customer/` + info.id">详情</router-link>
                </td>
                <td>
                  <router-link :to="`/customer?id=` + info.id">修改</router-link>
                </td>
            </tr>

        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

  </div>
</template>

<script>
  import { createCustomer, searchCustomerDetails, getSettlementTypeDesc, getApprovalTypeDesc, getItineraryTypeDesc } from '../api/customer.js'
  import MyPagination from '../components/my-pagination.vue'
  import MyDatePicker from '../components/my-datepicker.vue'

  export default {
    name: 'Customers',
    components: {
      MyPagination,
      MyDatePicker
    },
    data () {
      return {
        dataList: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        },
        name: '',
        enterpriseType: -1,
        orderBy: 0,
        status: -1,
        endDate: ''
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      showLoading: function (msg) {
        this.$store.dispatch('showLoading', { 'loadingText': msg })
      },
      hideLoading: function () {
        this.$store.dispatch('hideLoading')
      },
      search: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.name': this.name,
          'sc.enterpriseType': this.enterpriseType,
          'sc.orderBy': this.orderBy,
          'sc.status': this.status,
          'sc.endDate': this.endDate
        }
        this.showLoading('查询中...')
        searchCustomerDetails(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        }, () => {
          this.hideLoading()
        })
      },
      reset: function () {
        this.name = ''
        this.endDate = ''
        this.sc.pageNo = 1
        this.search()
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
      },
      getSettlementTypeDesc: function (val) {
        return getSettlementTypeDesc(val)
      },
      getApprovalTypeDesc: function (val) {
        return getApprovalTypeDesc(val)
      },
      getItineraryTypeDesc: function (val) {
        return getItineraryTypeDesc(val)
      }
    }
  }
</script>