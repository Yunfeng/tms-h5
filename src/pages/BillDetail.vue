<template>
  <div id="billDetail">
    <nav aria-label="breadcrumb" role="navigation" v-if="printMode !== '1'">
      <ol class="breadcrumb pb-0">
        <li class="breadcrumb-item"><router-link to='/bills'>账单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ms-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    <template v-if="detail !== null">
      <div class="card">
        <table class="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th class="text-center">账单号</th>
              <th class="text-center">日期</th>
              <th class="text-center">国际</th>              
              <th class="text-center">客户</th>
              <th class="text-center">成本中心</th>
              <th class="text-center">项目</th>
              <th class="text-center">出票日期</th>
              <th class="text-center">订票员</th>
              
              
             
              <th class="text-center">收款方式</th>                           
              <th class="text-center">金额</th>
              
            </tr>
          </thead>
          <tbody>
            <tr>   
              <td class="text-center">{{(detail.billNum)}}</td>                             
              <td class="text-center">
                {{detail.opDate}}
                <template v-if="detail.audited !== '1'">
                  <a href="javascript:void(0)" @click.stop="editOpDate()" class="small">修改</a>
                </template>
              </td>
              <td class="text-center">
                <span v-if="detail.intlTicket === 0">国内</span>
                <span class="text-danger" v-else-if="detail.intlTicket === 1">国际</span>
              </td>              
              <td class="text-center">
                
                <template v-if="detail.customer !== null">{{detail.customer.vipName}}</template>
                
              </td>
              <td class="text-center">
                {{detail.costCenter}}
                
              </td>
              <td class="text-center">
                {{detail.projectName}}
                
              </td>
              <td class="text-center">
                {{detail.etdzDate}}
                <template v-if="detail.audited !== '1'">
                  <a href="javascript:void(0)" @click.stop="editEtdzDate()" class="small">修改</a>
                </template>
              </td>
              <td class="text-center">
                {{detail.op1}}
                <template v-if="detail.audited !== '1'">
                  <a href="javascript:void(0)" @click.stop="editOp1()" class="small">修改</a>
                </template>
              </td>
                            
              <td class="text-center">                  
                <span class="text-danger" v-if="detail.bePaid === '0'"> {{detail.payTypeNoteDesc}}</span>
                <span class="text-success" v-else>{{detail.payTypeNoteDesc}}</span>
            

                {{detail.payRemark}}
              </td>
              <td class="text-center">
                  {{detail.billSum}}
              </td>
            </tr>
          </tbody>
        </table>
        <table class="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th class="text-center">审核日期</th>
              <th class="text-center">收款状态</th>
              <th class="text-center">
                  订单号
              </th>
              
              <th class="text-center">录入时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">
                  <span v-if="detail.audited === '1' && detail.auditDate !== null">{{detail.auditDate}}</span>
                  <span v-else-if="detail.audited === '1'">已审核</span>
                  <span class="text-danger" v-else>未审核</span>
              </td>
              <td class="text-center">
                <template v-if="detail.bePaid === '0'">
                  <span class="text-danger">未收</span>
                </template>
                <template v-else-if="detail.bePaid === '1'">
                  <span class="text-success strong">已收</span>
                </template>
              </td>

             
              <td class="text-center">                
                
                  {{detail.orderNo}}
              </td>   
              
              <td class="text-center">{{detail.createTime}}</td>
            </tr>
          </tbody>
        </table>
        <div class="card-body">
          <strong>备注：</strong>
                {{detail.remark}}
        </div>
      </div>
      <template v-if="isFlightBill">
        <div class="card">
          <div class="card-header">机票明细</div>
      
          <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>票号</th>
                    <th>乘客</th>
                    <th>出票日期</th>
                    <th>票价</th>
                    <th>税</th>
                    <th>保险 </th>
                    <th>服务费</th>
                    <th>优惠</th>
                    <th class="text-center bg-info text-white" colspan="7">行程</th>
                    <th>总计</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
              <template  v-for="info in detail.tickets">
                <tr :key="info.id">   
                    <td>{{info.balanceCode}}-{{(info.ticketNo)}}</td>
                    <td>
                        {{info.passengerName}}
                    </td>
                    <td>{{info.etdzDate}}</td>
                    <td>{{info.price}}</td>
                    <td>{{info.tax}}</td>
                    <td>{{info.insurance}}</td>
                    <td>{{info.serviceCharge}}</td>
                    <td>{{info.discount}}</td>
                    <td>
                        <template v-for="flt in info.details">
                          <span :key="flt.id">{{flt.flight}}<br/></span>
                        </template>
                    </td>
                    <td>
                        <template v-for="flt in info.details">
                          <span :key="flt.id">{{flt.subclass}}<br/></span>
                        </template>
                    </td>
                    <td>
                        <template v-for="flt in info.details">
                          <span :key="flt.id">{{flt.dport}}{{flt.dportName}} {{flt.dterm}}<br/></span>
                        </template>
                    </td>
                    <td>
                        <template v-for="flt in info.details">
                          <span :key="flt.id">{{flt.aport}}{{flt.aportName}} {{flt.aterm}}<br/></span>
                        </template>
                    </td>
                    <td>
                        <template v-for="flt in info.details">
                          <span :key="flt.id">{{flt.ddate}}<br/></span>
                        </template>
                    </td>
                    <td>
                        <template v-for="flt in info.details">
                          <span :key="flt.id">{{flt.dtime}}<br/></span>
                        </template>
                    </td>
                    <td>
                        <template v-for="flt in info.details">
                          <span :key="flt.id">{{flt.atime}}<br/></span>
                        </template>
                    </td>
                    <td>{{info.accountRecv}}</td>
                    <td>
                    </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else-if="isTrainBill">
          <div class="card">
              <div class="card-header">火车票明细</div>
          </div>
          <table class="table table-response table-striped table-hover table-sm">
              <thead>
                  <tr>
                      <th>乘客</th>
                      <th>人数</th>
                      <th>班次</th>
                      <th>日期</th>
                      <th>出发</th>
                      <th>到达</th>
                      <th>等级</th>
                      <th>价格</th>
                      <th>服务费</th>
                      <th>备注</th>
                  </tr>
              </thead>
              <tbody>
                  <template  v-for="info in detail.trainTickets">
                    <tr :key="info.id">   
                      <td>
                          {{info.passengerName}}
                      </td>
                      <td>{{info.psgCount}}</td>
                      <td>{{info.trainNo}}</td>
                      <td>{{info.ddate}}</td>
                      <td>{{info.dcity}}</td>
                      <td>{{info.acity}}</td>
                      <td>{{info.seatClass}}</td>
                      <td>{{info.price}}</td>
                      <td>{{info.serviceCharge}}</td>
                      <td>{{info.remark}}</td>
                    </tr>
                  </template>

              </tbody>
          </table>
      </template>
      <template v-else-if="isHotelBill">
          <div class="card">
              <div class="card-header">酒店预订明细</div>
          </div>
          <table class="table table-striped table-hover talbe-sm small">
              <thead>
                  <tr>
                      <th>乘客</th>
                      <th>酒店</th>
                      <th>入住日期</th>
                      <th>离店日期</th>
                      <th>房型</th>
                      <th>房间数</th>
                      <th>销售价</th>
                      <th>服务费</th>
                      <th>间夜</th>
                      <th>总金额</th>
                  </tr>
              </thead>
              <tbody>
                  <template  v-for="info in detail.hotelBookings">
                    <tr :key="info.id">   
                        <td>
                            {{info.passengerName}}
                        </td>
                        <td>{{info.hotelName}}</td>
                        <td>{{info.ddate}}</td>
                        <td>{{info.leaveDate}}</td>
                        <td>{{info.roomType}}</td>
                        <td>{{info.roomCount}}</td>
                        <td>{{info.price}}</td>
                        <td>{{info.serviceCharge}}</td>
                        <td>{{info.count}}</td>
                        <td>{{info.totalAmount}}</td>
                      </tr>
                  </template>

              </tbody>
          </table>
      </template>
      <template v-else-if="isRefundBill">
        <div class="card">
          <div class="card-header">退票明细</div>
      
          <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>票号</th>
                    <th>乘客</th>
                    <th class="text-center bg-info text-white" colspan="7">行程</th>
                    <th>原付金额</th>
                    <th>航司退票费</th>
                    <th>服务费</th>
                    <th>实退客户</th>
                </tr>
            </thead>
            <tbody>
              <template  v-for="info in detail.refundTickets">
                <tr :key="info.id">   
                    <td>{{info.balanceCode}}-{{(info.ticketNo)}}</td>                             
                    <td>
                        {{info.psgName}}
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          {{flt.flightNo}}
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          {{flt.subclass}}
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          <small class="text-success">{{flt.departureAirport}}{{flt.departureAirportName}} {{flt.departureTerminal}}</small>
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          <small class="text-success">{{flt.arrivalAirport}}{{flt.arrivalAirportName}} {{flt.arrivalTerminal}}</small>
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          {{flt.departureDate}}
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          {{flt.departureTime}}
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          {{flt.arrivalTime}}
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>                    
                    <td>{{info.ticketAmount}}</td>
                    <td>{{info.airRefundCharge}}</td>
                    <td>{{info.serviceCharge}}</td>
                    <td>{{info.passengerRefundAmount}}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else-if="isVasBill">
        <div class="card">
          <div class="card-header">服务单明细</div>
      
          <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>产品名称</th>
                    <th>单价</th>
                    <th>数量</th>
                    <th>实收 </th>
                </tr>
            </thead>
            <tbody>
              <template  v-for="info in detail.vasOrders">
                <tr :key="info.id">   
                    <td>{{info.productName}}<small class="text-info">{{info.productCode}}</small></td>
                    <td>{{info.price}}</td>                               
                    <td>
                        {{info.count}}
                    </td>
                    <td>{{info.total}}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else-if="isChangeBill">
        <div class="card">
          <div class="card-header">改签明细</div>
      
          <table class="table table-striped table-hover table-sm small">
            <thead>
                <tr>
                    <th>票号</th>
                    <th>乘客</th>
                    <th class="text-center bg-info text-white" colspan="7">行程</th>
                    <th>销售价</th>
                    <th>税</th>
                    <th>航司收费</th>
                    <th>服务费</th>
                </tr>
            </thead>
            <tbody>
              <template  v-for="info in detail.changeOrders">
                <tr :key="info.id">   
                    <td>{{info.balanceCode}}-{{(info.ticketNo)}}</td>                             
                    <td>
                        {{info.psgName}}
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          <span v-if="flt.flightType === 0">前：</span> 
                          <span v-else>后：</span> 
                          {{flt.flightNo}}
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          {{flt.subclass}}
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          <small class="text-success">{{flt.departureAirport}}{{flt.departureAirportName}} {{flt.departureTerminal}}</small>
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          <small class="text-success">{{flt.arrivalAirport}}{{flt.arrivalAirportName}} {{flt.arrivalTerminal}}</small>
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          {{flt.departureDate}}
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          {{flt.departureTime}}
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>
                    <td>
                        <template v-for="(flt, index) in info.flights">
                          {{flt.arrivalTime}}
                          <template v-if="index < info.flights.length - 1 "><br/></template>
                        </template>
                    </td>   
                    <td>{{info.parvalue}}</td>
                    <td>{{info.tax}}</td>
                    <td>{{info.airChangeCharge}}</td>
                    <td>{{info.serviceCharge}}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </template>

      
    </template>

  </div>
</template>

<script>
  import { BILL_FLIGHT, BILL_HOTEL, BILL_TRAIN, BILL_REFUND, BILL_VAS, BILL_CHANGE } from '../common/const.js'  
  import { searchBillDetail } from '../api/bill.js'
  import $ from 'jquery'

  export default {
    name: "BillDetail",
    data () {
      return {
        detail: null,
        id: 0,
        billNum: '',

        customers: [],
        customerId: 0,

        ticketId: 0,
        price: 0,
        parvalue: 0,
        tax: 0,
        insurance: 0,
        serviceCharge: 0,
        commRate: 0,
        commission: 0,
        discountRate: 0,
        discount: 0,
        amount: 0,
        totalAmount: 0,
        profit: 0,

 
        printMode: '0'
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin },
      isRoot () { return this.$store.state.isRoot },
      isFlightBill () {
        return this.detail.billType === BILL_FLIGHT
      },
      isRefundBill () {
        return this.detail.billType === BILL_REFUND
      },
      isChangeBill () {
        return this.detail.billType === BILL_CHANGE
      },
      isHotelBill () {
        return this.detail.billType === BILL_HOTEL
      },
      isTrainBill () {
        return this.detail.billType === BILL_TRAIN
      },
      isVasBill () {
        return this.detail.billType === BILL_VAS
      }
    },    
    mounted: function () {
      const printMode = this.$route.query.print
      // console.log(printMode)
      if (printMode === '1') {
        this.$store.commit('setPrintMode', 1)
        this.printMode = printMode
      }

      this.id = parseInt(this.$route.params.id)
      if (this.id === 0) {
        this.billNum = this.$route.query.billNum
      }
      this.searchBillDetail()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      refresh: function () {
        this.searchBillDetail(this.id)
      },
      searchBillDetail: function () {
        searchBillDetail(this.id,
          (jsonResult) => {
            this.detail = jsonResult
            if (this.id === 0) {
              this.id = this.detail.id
            }
          }
        )
      },      
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status === 'OK') {
          this.showErrMsg('操作成功')
          this.searchBillDetail()
        } else {
          this.showErrMsg('操作失败: ' + jsonResult.errmsg)
        }
      }
    }
  }
  // 800
</script>