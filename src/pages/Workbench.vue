<template>
  <div id="workbench">

    <div class="card mb-0">
      <div class="card-header bg-info text-white">
        我的工作台
      </div>
      <div class="card-body px-0 pt-0">
        <form>
          <div class="form-row">
            <div class="col">
              <input type="textfield" class="form-control" size="8" placeholder="乘客姓名" autocomplete="name" v-model="name">
            </div>
            <div class="col">
              <input type="textfield" class="form-control" size="8" placeholder="乘客电话" autocomplete="tel" v-model="phone">
            </div>
            <div class="col">
              <input type="textfield" class="form-control" size="10" placeholder="证件号" v-model="idno">
            </div>
            <div class="col">
              <input type="textfield" class="form-control" size="10" placeholder="票号" v-model="ticketNo">
            </div>            
            <div class="col">
              <my-date-picker id="beginDate" v-model="beginDate" placeholder="开始日期" ></my-date-picker>
            </div>
            <div class="col">
              <my-date-picker id="endDate" v-model="endDate" placeholder="截止日期" ></my-date-picker>
            </div>
            <div class="col">
              <input type="textfield" class="form-control" size="6" placeholder="联系人" v-model="linkman">
            </div>
            <div class="col">
              <input type="textfield" class="form-control" size="8" placeholder="联系电话" autocomplete="tel" v-model="linkPhone">
            </div>
            <div class="col">
              <input type="textfield" class="form-control" size="6" placeholder="编码" v-model="pnrNo">
            </div>
            <div class="col">
              <input type="textfield" class="form-control" size="6" placeholder="原订单号" v-model="orderNo">
            </div>
            <div class="col">
              <select class="form-control" v-model.number="sc.pageSize">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50">50</option>
              </select>
            </div>
          </div>
          <div class="form-row mt-1">
              <button type="button" class="btn btn-primary ml-2" @click.stop="search()">查找</button>
              <button type="button" class="btn btn-secondary btn-sm ml-2" @click.stop="reset()">重置</button>
          </div>
        </form>
      </div>
    </div>
    <ul class="nav nav-tabs nav-bordered mb-3" id="myTab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="home-tab" data-toggle="tab" href="#flightOrder" role="tab" aria-controls="home" aria-selected="true">机票订单({{dataList.length}})</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="profile-tab" data-toggle="tab" href="#refundOrder" role="tab" aria-controls="profile" aria-selected="false">退票单({{refundOrders.length}})</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="contact-tab" data-toggle="tab" href="#changeOrder" role="tab" aria-controls="contact" aria-selected="false">改签单({{changeOrders.length}})</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="contact-tab" data-toggle="tab" href="#passengers" role="tab" aria-controls="contact" aria-selected="false">乘机人({{passengerList.length}})</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="flightOrder" role="tabpanel" aria-labelledby="home-tab">
        <flight-order-list :dataList="dataList"></flight-order-list>
      </div>
      <div class="tab-pane fade" id="refundOrder" role="tabpanel" aria-labelledby="profile-tab">
        <flight-refund-list :dataList="refundOrders"></flight-refund-list>
      </div>
      <div class="tab-pane fade" id="changeOrder" role="tabpanel" aria-labelledby="contact-tab">
        <flight-change-list :dataList="changeOrders"></flight-change-list>
      </div>
      <div class="tab-pane fade" id="passengers" role="tabpanel" aria-labelledby="contact-tab">
        <passenger-list :dataList="passengerList"></passenger-list>
      </div>
    </div>              

    <div class="card bg-light small mt-5">
      <div class="card-header">更新日志</div>
      <div class="card-body">
        <p class="text-danger"><strong>2019-09-01</strong></p>
        <ul>
          <li>自定义账单导出模板（测试）</li>
        </ul>        
        <p><strong>2019-09-14</strong></p>
        <ul>
          <li><h5>新增：<span class="text-primary">对接机场服务系统（办理国内航班登机牌、选择座位等）</span></h5></li>
        </ul>        
        <p><strong>2019-09-02</strong></p>
        <ul>
          <li>修复：手工录入机票订单的航班信息时，到达时间+1的问题</li>
        </ul>        
        <p><strong>2019-08-27</strong></p>
        <ul>
          <li>乘机人资料：可以设置VIP级别</li>
        </ul>        
        <p><strong>2019-08-25</strong></p>
        <ul>
          <li>乘机人资料：可以保存港澳通行证和台胞证了</li>
        </ul>        
        <p><strong>2019-08-07</strong></p>
        <ul>
          <li>配送单：机票订单的配送单改进</li>
          <li>账单：根据供应商查询</li>
        </ul>        
        <p><strong>2019-08-02</strong></p>
        <ul>
          <li>火车票订单可以通过EXCEL导入</li>
        </ul>        
        <p><strong>2019-07-03</strong></p>
        <ul>
          <li>携程国内平台订单BSP、DPAY自动出票</li>
          <li>国内机票订单BSP自动出票</li>
        </ul>        
        <p><strong>2019-05-06</strong></p>
        <ul>
          <li>航空公司销售统计</li>
        </ul>        
        <p><strong>2019-04-25</strong></p>
        <ul>
          <li>国际政策比价改价（路径：平台 -> 携程国际政策-比价）</li>
          <li>火车票订单优化</li>
        </ul>        
        <p><strong>2019-04-15</strong></p>
        <ul>
          <li>携程国内政策的自动上传和比价 （路径：平台 -> 携程国内政策）</li>
        </ul>        
        <p><strong>2019-03-21</strong></p>
        <ul>
          <li>改进：超级管理员可以直接做销账操作</li>
        </ul>        
        <p><strong>2019-03-12</strong></p>
        <ul>
          <li>改进：可以设置客户的短信中是否带有短链接网址</li>
        </ul>        
        <p><strong>2019-02-15</strong></p>
        <ul>
          <li>+退票单可以发送短信客户</li>
        </ul>        
        <p><strong>2019-02-13</strong></p>
        <ul>
          <li>+通过上传Excel批量生成FD下载请求列表</li>
        </ul>        
        <p><strong>2019-02-11</strong></p>
        <ul>
          <li>+管理员可重置用户密码</li>
          <li>*服务订单：非管理员只允许查看自己的已完成订单</li>
        </ul>        
        <p><strong>2019-01-26</strong></p>
        <ul>
          <li>改进: 自助开通黑屏追位功能</li>
        </ul>        
        <p><strong>2019-01-24</strong></p>
        <ul>
          <li>改进：可以修改改签单中的航班信息</li>
        </ul>        
        <p><strong>2019-01-23</strong></p>
        <ul>
          <li>改进：允许管理员停用其它用户账号</li>
        </ul>        
      </div>
    </div>
  </div>
</template>

<script>
  import { searchFlightOrders } from '../api/flight.js'
  import { searchRefundOrders } from '../api/flight-refund.js'
  import { searchChangeOrders } from '../api/flight-change.js'
  import { searchPassengers } from '../api/user.js'
  import MyDatePicker from '../components/my-datepicker.vue'
  import FlightOrderList from '../components/flight-order-list.vue'
  import FlightRefundList from '../components/flight-order-refund-list.vue'
  import FlightChangeList from '../components/flight-order-change-list.vue'
  import PassengerList from '../components/list/passenger-list.vue'

  export default {
    name: 'MyWorkBench',
    components: {
      MyDatePicker,
      FlightOrderList,
      FlightRefundList,
      FlightChangeList,
      PassengerList
    },
    data () {
      return {
        dataList: [],
        refundOrders: [],
        changeOrders: [],
        passengerList: [],

        sc: {
          pageNo: 1,
          pageSize: 5
        },

        beginDate: '',
        endDate: '',
        name: '',
        phone: '',
        idno: '',
        ticketNo: '',
        status: -1,
        customerId: -1,
        intlTicket: -1,
        linkman: '',
        linkPhone: '',
        pnrNo: '',
        orderNo: ''
      }
    },
    computed: {
      sid () {
        return this.$store.state.sid
      },
      redmineUrl () {
        return this.$store.state.redmineUrl
      }
    },
    mounted: function () {
    },
    methods: {
      search: function () {
        this.searchFlightOrders()
        this.searchFlightRefundOrders()
        this.searchChangeOrders()
        this.searchPassengers()
      },
      searchFlightOrders: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.name': this.name,
          'sc.phone': this.phone,
          'sc.linkman': this.linkman,
          'sc.linkPhone': this.linkPhone,
          'sc.idno': this.idno,
          'sc.status': this.status,
          'sc.customerId': this.customerId,
          'sc.ticketNo': this.ticketNo,
          'sc.intlTicket': this.intlTicket,
          'sc.pnrNo': this.pnrNo,
          'sc.orderNo': this.orderNo
        }
        searchFlightOrders(params,
          (jsonResult) => {
            this.dataList = jsonResult.dataList
            this.sc = jsonResult.page
          }
        )
      },
      searchFlightRefundOrders: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.intlTicket': this.intlTicket,
          'sc.name': this.name,
          'sc.idno': this.idno,
          'sc.ticketNo': this.ticketNo,
          'sc.pnrNo': this.pnrNo,
          'sc.orderNo': this.orderNo
        }
        searchRefundOrders(params, (jsonResult) => {
          this.refundOrders = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      searchChangeOrders: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.beginDate': this.beginDate,
          'sc.endDate': this.endDate,
          'sc.intlTicket': this.intlTicket,
          'sc.name': this.name,
          'sc.idno': this.idno,
          'sc.ticketNo': this.ticketNo,
          'sc.pnrNo': this.pnrNo,
          'sc.orderNo': this.orderNo
        }
        searchChangeOrders(params, (jsonResult) => {
          this.changeOrders = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      searchPassengers: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.name': this.name
        }

        searchPassengers(params, (jsonResult) => {
          this.passengerList = jsonResult.dataList
        })
      },
      reset: function () {
        this.beginDate = ''
        this.endDate = ''
        this.name = ''
        this.phone = ''
        this.idno = ''
        this.ticketNo = ''
        this.status = -1
        this.customerId = -1
        this.intlTicket = -1
        this.sc.pageNo = 1
        this.linkman = ''
        this.linkPhone = ''
        this.pnrNo = ''
        this.orderNo = ''
      }
    }
  }
</script>