<template>
  <div id="charter-flights">
    <div class="card">
      <div class="card-header bg-info text-white">
        包机信息
      </div>
      <div class="card-body">
        <form class="form-inline">
          <div class="row mb-2">
              <input type="textfield" class="form-control" placeholder="航司" v-model.trim="carrier" size="4">
          </div>
          <select class="form-control form-control-sm ml-1" v-model.number="status" name="sc.status">
            <option value="-1">所有状态</option>
            <option value="0">待申请</option>
            <option value="1">申请中</option>
            <option value="2">申请完成</option>
            <option value="4">已取消</option>
          </select>
          <div class="form-group ml-1">
              <button type="button" class="btn btn-primary" @click.stop="search()">查找</button>
          </div>
          <span class="ml-auto">
            <router-link to="/charter-flight/new" class="btn btn-success">新建</router-link>
          </span>
        </form>
      </div>
    </div>
    <table class="table table-striped table-hover table-sm small">
        <thead>
          <tr>
              <th>团名</th>
              <th>航司</th>
              <th>座位数</th>
              <th>航班详情</th>
              <th>联系人</th>
              <th>联系电话</th>
              <th>备注</th>
              <th>状态</th>
              <th></th>
              <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="info in dataList">
              <td>{{info.name}}</td>
              <td> {{info.carrier}}</td>
              <td> {{info.totalSeats}}</td>
              <td>
                <table class="table table-sm">
                  <tr v-for="flt in info.details">
                    <td>{{flt.flight.departureAirport}}</td>
                    <td>{{flt.flight.arrivalAirport}}</td>
                    <td>{{flt.flight.flightNo}}</td>
                    <td>{{flt.flight.departureDate}}</td>
                    <td>{{flt.flight.subclass}}</td>
                    <td>{{flt.flight.departureTime}}</td>
                    <td>{{flt.flight.arrivalTime}}</td>
                  </tr>
                </table>
              </td>
              <td>{{info.linkMan}}
              <td>{{info.contactMobile}}</td>
              <td>{{info.remark}}</td>
              <td>{{getStatusDesc(info.status)}}</td>
              <td>
                <button type="button" class="btn btn-sm btn-warning" @click.stop="copyOrder(info.id)">复制</button>
              </td>
              <td>
                

                <router-link :to="`/charter-flight/detail/` + info.id">详细</router-link>

                <button type="button" class="btn btn-sm btn-primary ml-2" @click.stop="applyOrder(info.id)" v-if="info.status === 0">申请中</button>

                <button type="button" class="btn btn-sm btn-danger float-right" @click.stop="deleteOrder(info.id)">删除</button>
              </td>
<!--                   <router-link :to="`/charter-flight/order/new?charterId=` + info.id" class="ml-2 btn btn-sm btn-danger hide">下单</router-link>
 -->          

          </tr>          
        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>    

    <my-modal-prompt ref="modalPrompt" :nullable="true">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>  
  </div>  
</template>

<script>
  import { searchCharterFlights, getStatusDesc, applyCharterOrder, deleteCharterFlightDetail } from '../api/charter-flight.js'
  import MyPagination from '../components/my-pagination.vue'
  import MyDatePicker from '../components/my-datepicker.vue'
  import MyModalPrompt from '../components/my-modal-prompt.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      MyModalPrompt
    },
    data () {
      return {
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 50,
          pageTotal: 0
        },
        carrier: '',
        dport: '',
        aport: '',
        status: -1,

        dataList: [],

        modalTitle: ''
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
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.carrier': this.carrier,
          'sc.dport': this.dport,
          'sc.aport': this.aport,
          'sc.status': this.status
        }
        searchCharterFlights(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      applyOrder: function (orderId) {
        this.showLoading()

        applyCharterOrder(orderId,
          v => {
            if (v.status === 'OK') {
              this.showErrMsg('操作成功')
              this.search()
            } else {
              this.showErrMsg('操作失败', 'danger')
            }
          },
          () => { this.hideLoading() }
        )
      },
      copyOrder: function (copyId) {
        this.$router.push('/charter-flight/new?copyId=' + copyId)
      },
      deleteOrder: function (id) {
        this.showLoading()
        deleteCharterFlightDetail(id,
          (jsonResult) => {
            if (jsonResult.status === 'OK') {
              this.showErrMsg('删除成功')
              this.search()
            } else {
              this.showErrMsg('删除失败: ' + jsonResult.errmsg)
            }
          },
          () => { this.hideLoading() }
        )          
      },
      getStatusDesc: function (val) {
        return getStatusDesc(val)
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