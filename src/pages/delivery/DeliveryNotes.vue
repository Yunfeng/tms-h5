  <template>
  <div id="hotelOrders">
    <nav aria-label="breadcrumb" role="navigation" class="bg-white">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to='/delivery/notes'>配送单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">列表</li>

        <router-link to='/flt/orders/delivery' class="ms-auto me-auto">原待送票订单</router-link>
        <span class="ms-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>       

    <div class="card">
      <div class="card-body py-1">
        <form class="form-inline" id="frmSearch">
          <input type="hidden" id="frmSearch_sc_pageNo" name="sc.pageNo" v-model="sc.pageNo">
          <input type="hidden" id="frmSearch_sc_pageSize" name="sc.pageSize" value="50" v-model="sc.pageSize">
          <div class="row mb-2">      
            <my-date-picker id="beginDate" v-model="beginDate" name="sc.beginDate" placeholder="开始日期"></my-date-picker>
            <my-date-picker id="endDate" v-model="endDate" name="sc.endDate" placeholder="截止日期"></my-date-picker>
          </div>
          <div class="row mb-2">
              <button type="button" class="btn btn-primary ml-1" @click.stop="search()">查找</button>
              <button type="button" class="btn btn-sm btn-secondary ml-1" @click.stop="reset()">重置</button>
          </div> 

          <router-link to='/delivery/note' class="btn btn-success ms-auto">新建</router-link>
        </form>
      </div>
      <table class="table table-striped table-sm">
        <thead>
            <tr>
                <th>单号</th>
                <th>内容</th>
                <th>配送日期</th>
                <th>收件人</th>
                <th>电话</th>
                <th>地址</th>
                <th>备注</th>
                <th>生成时间</th>
                <th>状态</th>
                <th></th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
          <template v-for="info in dataList" >
            <tr :class="{'table-dark': info.status === 4}" style="color: black">
                <td>{{info.orderNo}}</td>
                <td>
                    {{info.deliveredContent}}  
                </td>
                <td>{{info.deliveryDate}}</td>
                <td>{{info.receiver}}</td>
                <td>{{info.mobile}}</td>
                <td>{{info.address}}</td>
                <td>{{info.remark}}</td>
                <td>{{info.createTime}}</td>
                <td>{{getStatusDesc(info.status)}}</td>
                <td>
                  <template v-if="info.deliveredOrderType === '1001' && info.deliveryOrderId">
                    <router-link :to="`/flt/order/` + info.deliveryOrderId + `/print`" target="_blank" class="float-right">打印</router-link>
                  </template>
                  
                </td>
                <td class="">
                  <router-link :to="`/delivery/note/` + info.id">详情<i class="mdi mdi-arrow-right"></i></router-link>
                </td>

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
  </div>	
</template>

<script>
  import { searchDeliveryNotes, showDeliveryNoteStatus } from '../../api/delivery.js'
  import MyDatePicker from '../../components/my-datepicker.vue'
  import MyPagination from '../../components/my-pagination.vue'

  import MySelectCustomer from '../../components/my-select2-customer.vue'

  export default {
    components: {
      MyDatePicker,
      MyPagination,
      MySelectCustomer
    },
    data () {
      return {
        dataList: [],
        customers: [],
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 20,
          pageTotal: 0
        },
        beginDate: '',
        endDate: ''
      }
    },
    mounted: function () {
      // this.search()
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
          'sc.endDate': this.endDate,
          'sc.customerId': this.customerId,
          'sc.name': this.name,
          'sc.hotelName': this.hotelName
        }
        searchDeliveryNotes(params,
          v => {
            this.dataList = v.dataList
            this.sc = v.page
          },
          () => { this.hideLoading() }
        )
      },
      reset: function () {
        this.beginDate = ''
        this.endDate = ''
        this.customerId = -1
        this.name = ''
        this.hotelName = ''
      },
      getStatusDesc: function (status) {
        return showDeliveryNoteStatus(status)
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