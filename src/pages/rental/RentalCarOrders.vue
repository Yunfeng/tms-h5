<template>
	<div id="order" class="row">
    <div class="col-12 bg-info text-center text-white">
        <span class="fa-2">租车</span>
    </div>
    <div class="card col-12 d-none d-md-block">
        <form class="form-inline">
          <select class="form-control form-control-sm col-3" v-model.number="status">
            <option value="-1">所有订单</option>
            <option value="1">待处理</option>
            <option value="2">处理中</option>
            <option value="4">已取消</option>
            <option value="8">已完成</option>
          </select>
          <input type="textfield" class="form-control form-control-sm" size="10" placeholder="订单号" v-model.trim="orderNo">
          <input type="textfield" class="form-control form-control-sm" size="10" placeholder="联系人" v-model.trim="linkman">
          <input type="textfield" class="form-control form-control-sm" size="10" placeholder="手机号" v-model.trim="mobile">
          <my-date-picker id="ddate" v-model="ddate" class="form-control form-control-sm" placeholder="用车日期"></my-date-picker>
          <button type="button" class="btn btn-primary mr-2" @click.stop="search()">查找</button>
          <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset()">重置</button>
          <router-link class="btn btn-success ml-auto" to="/rentalcar">询价</router-link>
        </form>        
    </div> 
    <div class="card col-12 d-block d-md-none">
        <form class="form-inline">
          <button type="button" class="btn btn-primary mr-2" @click.stop="showSearch()">查找</button>
          <router-link class="btn btn-success ml-auto" to="/rentalcar">询价</router-link>
        </form>        
    </div>    

    <div class="card col-12 mt-2">
      <table class="table table-striped table-sm table-hover">
        <thead class="thead-light">
          <tr>
            <th class="d-none d-md-table-cell">订单号</th>
            <th class="d-none d-md-table-cell">类型</th>
            <th>起点</th>
            <th class="d-none d-md-table-cell">终点</th>
            <th>用车时间</th>
            <th>状态</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="info in orders" @click="showDetail(info)" :class="changeBgByStatus(info.status)">
            <td class="d-none d-md-table-cell">{{info.orderNo}}</td>
            <td class="d-none d-md-table-cell">{{showUseTypeDesc(info.useType)}}</td>
            <td>
              <span>{{info.departureAddress}}</span>
            </td>
            <td class="d-none d-md-table-cell">
              <span>{{info.arrivalAddress}}</span>
            </td>
            <td>{{info.useTime}}</td>
            <td>{{showStatusDesc(info.status)}}</td>
            <td><i class="fa fa-angle-right text-warningfa-2" aria-hidden="true"></i></td>
          </tr>
        </tbody>
      </table>
      <div class="card-body">
        <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
      </div>
    </div>

    <!-- New Request Modal -->
    <div class="modal" id="modalSearch" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">查找</h4>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                </div>
                <div class="modal-body">
                    <form role="form" class="form-horizontal">
                      <div class="form-group">
                        <label>订单状态</label>
                        <select class="form-control" v-model.number="status">
                        <option value="-1">所有订单</option>
                        <option value="1">待处理</option>
                        <option value="2">处理中</option>
                        <option value="4">已取消</option>
                        <option value="8">已完成</option>
                      </select>
                      </div>
                      
                      <div class="form-group">
                        <label>订单号</label>
                        <input type="text" class="form-control" v-model.trim="orderNo">
                      </div>
                      <div class="form-group">
                        <label>联系人</label>
                        <input type="text" class="form-control" v-model.trim="linkman">
                      </div>
                      <div class="form-group">
                        <label>手机号</label>
                        <input type="text" class="form-control" v-model.trim="mobile">
                      </div>
                      <div class="form-group">
                        <label>用车日期</label>
                        <input type="text" class="form-control" v-model.trim="ddate">
                      </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary mr-2" @click.stop="search()">查找</button>
                    <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset()">重置</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import MyPagination from '../../components/my-pagination.vue'
import MyDatePicker from '../../components/my-datepicker.vue'

import { searchRentalCarOrders, showOrderStatusDesc, showUseTypeDesc } from '../../api/rentalcar.js'
import $ from 'jquery'

export default {
  components: {
    MyPagination,
    MyDatePicker
  },
  data () {
    return {
      detailShowing: false,
      orders: [],
      sc: {
        pageNo: 1,
        pageSize: 10,
        rowCount: 0,
        pageTotal: 0
      },
      status: -1,
      orderNo: '',
      mobile: '',
      ddate: '',
      linkman: ''
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showLoading: function (loadingText) {
      this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
    },
    hideLoading: function () {
      this.$store.commit('showLoading', { 'loading': false })
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    changeBgByStatus: function (orderStatus) {
      switch (orderStatus) {
        case 0: return 'text-muted'
        case 1: return 'bg-success text-white'
        case 4: return 'table-dark'
      }
    },
    search: function () {
      $('#modalSearch').modal('hide')

      const params = {
        'pageNo': this.sc.pageNo,
        'pageSize': this.sc.pageSize,
        'status': this.status,
        'orderNo': this.orderNo,
        'mobile': this.mobile,
        'useDate': this.ddate,
        'linkman': this.linkman
      }

      this.showLoading()

      searchRentalCarOrders(params,
        v => {
          this.orders = v.dataList
          this.sc = v.page
        },
        () => this.hideLoading()
      )
    },
    reset: function () {
      this.status = -1
      this.orderNo = ''
      this.mobile = ''
      this.ddate = ''
      this.linkman = ''
    },
    showDetail: function (orderInfo) {
      this.$router.push('/rental/car/orders/' + orderInfo.id)
    },
    showStatusDesc: function (status) {
      return showOrderStatusDesc(status)
    },
    showUseTypeDesc: function (status) {
      return showUseTypeDesc(status)
    },
    showSearch: function () {
      $('#modalSearch').modal()
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
