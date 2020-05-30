<template>
  <div id="ticketOrders">
    <nav aria-label="breadcrumb" role="navigation" class="bg-white">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to='/attractions/ticket/orders'>景点门票订单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">列表</li>

        <li class="breadcrumb-item ml-auto"><router-link to='/attractions'>景点</router-link></li>
      </ol>
    </nav>       

    <div class="card">
      <div class="card-body py-1">
        <form class="form-inline" id="frmSearch">
          <input type="hidden" id="frmSearch_sc_pageNo" name="sc.pageNo" v-model="sc.pageNo">
          <input type="hidden" id="frmSearch_sc_pageSize" name="sc.pageSize" value="50" v-model="sc.pageSize">
          <div class="form-group">      
            <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
            <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          </div>
          <input type="textfield" class="form-control" size="6" placeholder="订单号" v-model.trim="orderNo" />
          <select class="form-control" v-model.number="status" name="sc.status">
            <option value="-1">订单状态</option>
            <option value="0">待处理</option>
            <option value="1">处理中</option>
            <option value="2">已完成</option>
            <option value="4">已取消</option>
          </select>

          <div class="form-group">
              <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
              <button type="button" class="btn btn-sm btn-secondary ml-1" @click.stop="reset()">重置</button>
          </div> 

          <button type="button" class="btn btn-primary ml-auto" @click.stop="importExcel()">导入Excel</button>

          
        </form>
      </div>
      <table class="table table-striped table-sm small">
        <thead>
            <tr>
                <th>订单号</th>
                <th>景点名称</th>
                <th>门票日期</th>
                <th>价格</th>
                <th>张数</th>
                <th>预订人</th>
                <th>总金额</th>
                <th>生成时间</th>
                <th>状态</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
          <template v-for="info in dataList" >
            <tr :class="{'table-dark': info.status === 4}" style="color: black">
                <td>                  
                  {{info.orderNo}}
                </td>
                <td>
                    {{info.attractionName}}  
                </td>
                <td>{{info.travelDate}}</td>
                <td>{{info.price}}</td>
                <td>{{info.count}}</td>
                <td>{{info.operator}}</td>
                <td>{{info.total}}</td>
                <td>{{info.createTime}}</td>
                <td>{{getStatusDesc(info.status)}}</td>
                <td class="">
                  <router-link :to="`/attractions/ticket/order/` + info.id">详情</router-link>
                </td>
            </tr>
            <tr :class="{'table-dark': info.status === 4}" style="color: black" v-if="info.remark">                
                <td colspan="15" class="text-right">{{info.remark}}</td>
                <td colspan="2"></td>
            </tr>
            
          </template>
            <tr v-if="dataList.length ===0">
              <td colspan="18" class="text-center">未找到符合的数据</td>
            </tr>
        </tbody>
      </table>
    </div>

    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

    <modal-excel-upload ref="modalUploadExcel">
        用Excel导入门票订单
        <template v-slot:excelFormatDesc>Excel格式说明: 票号，销售日期(可空)</template>
    </modal-excel-upload>
  </div>	
</template>

<script>
  import { searchTicketOrders, showTicketOrderStatus, uploadTicketOrder } from '../../api/attraction.js'
  import MyDatePicker from '../../components/my-datepicker.vue'
  import MyPagination from '../../components/my-pagination.vue'
  import ModalExcelUpload from '../../components/my-modal-excel-upload-ticket-orders.vue'


  export default {
    components: {
      MyDatePicker,
      MyPagination,
      ModalExcelUpload
    },
    data () {
      return {
        dataList: [],
        customers: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 5,
          pageTotal: 0
        },
        beginDate: '',
        endDate: '',
        orderNo: '',
        customerId: -1,
        name: '',
        hotelName: '',
        status: -1
      }
    },
    mounted: function () {
      this.search()
    },
    activated: function () {
      this.search()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
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
          'sc.beginDate': this.beginDate,
          'sc.orderNo': this.orderNo,
          'sc.endDate': this.endDate,
          'sc.name': this.name,
          'sc.status': this.status
        }
        searchTicketOrders(params,
          v => {
            this.dataList = v.dataList
            this.sc = v.page

            // if (v.dataList.length === 0) {
            //   this.showErrMsg('没找到任何东西')
            // }
          },
          () => { this.hideLoading() }
        )
      },
      reset: function () {
        this.beginDate = ''
        this.endDate = ''
        this.orderNo = ''
        this.customerId = -1
        this.name = ''
        this.hotelName = ''
        this.status = -1
      },
      getStatusDesc: function (status) {
        return showTicketOrderStatus(status)
      }, 
      importExcel: function () {
        this.$refs.modalUploadExcel.modal().then((formData) => {
          this.showLoading('处理中......')
          uploadTicketOrder(formData.data, v => {
            if (v.status === 'OK') {
              this.showErrMsg('操作成功')
              this.search()
            } else {
              this.showErrMsg('操作失败:' + v.errmsg, 'danger')
            }
          }, () => {
            this.hideLoading()
          })
        }).catch((ex) => {})
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