<template>
  <div id="billDetail">
    <nav aria-label="breadcrumb" role="navigation" v-if="printMode !== '1'">
      <ol class="breadcrumb pb-0">
        <li class="breadcrumb-item"><router-link to='/bills'>账单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
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
              <th class="text-center">客户/成本中心/项目</th>
              <th class="text-center">出票日期</th>
              <th class="text-center">订票员</th>
              <th class="text-center">出票员</th>
              <th class="text-center">审核人</th>
              <th class="text-center">供应商</th>
              <th class="text-center">付款方式</th> 
              <th class="text-center">收款方式</th>                           
              <th class="text-center">金额</th>
              <th class="text-center">成本</th>
              <th class="text-center">利润</th>
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
                <template v-if="detail.customerType === 0">散客</template>
                <template v-else-if="detail.customer !== null">{{detail.customer.vipName}}</template>
                /{{detail.costCenter}}/{{detail.projectName}}
                <template v-if="detail.audited !== '1'">
                  <a href="javascript:void(0)" @click.stop="changeCustomer()" class="small">修改</a>
                </template>
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
              <td class="text-center">{{detail.op2}}</td>
              <td class="text-center">{{detail.op3}}</td>
              <td class="text-center">
                <template v-if="detail.supplier !== null">
                  {{detail.supplier.name}}
                </template>
                <template v-if="detail.audited !== '1'">
                  <a href="javascript:void(0)" @click.stop="editSupplier()" class="small pl-2">修改</a>
                </template>
              </td>                             
              <td class="text-center">
                <template v-if="detail.paymentMethod !== null">
                  {{detail.paymentMethod.name}}
                </template>
                <template v-if="detail.audited !== '1'">
                  <a href="javascript:void(0)" @click.stop="editPayment()" class="small pl-2">修改</a>
                </template>

              </td>                
              <td class="text-center">                  
                <span class="text-danger" v-if="detail.bePaid === '0'"> {{detail.payTypeNoteDesc}}</span>
                <span class="text-success" v-else>{{detail.payTypeNoteDesc}}</span>
                <template v-if="detail.audited !== '1'">
                  <a href="javascript:void(0)" @click.stop="editPayType()" class="small">修改</a>
                </template>

                {{detail.payRemark}}
              </td>
              <td class="text-center">
                  {{detail.billSum}}
              </td>
              <td class="text-center">{{detail.cost}}</td>
              <td class="text-center">{{detail.profit}}</td>

              
            </tr>
          </tbody>
        </table>
        <table class="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th class="text-center">审核日期</th>
              <th class="text-center">收款状态</th>
              <th class="text-center">支出状态</th>
              <th class="text-center">结算日期/单</th>
              <th class="text-center">销账日期/备注</th>
              <th class="text-center">收款单</th>
              <th class="text-center">
                  订单号
              </th>
              <th class="text-center">原始单号</th>
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
                  <button class="btn btn-sm btn-danger ml-2" @click.stop="undoWriteOff()" v-if="isAdmin">撤销</button>  
                </template>
              </td>
              <td class="text-center">
                <span class="text-danger" v-if="detail.paymentStatus ===0">未付</span>
                <span class="text-success strong" v-else>
                  已付
                  <button class="btn btn-sm btn-danger ml-2" @click.stop="undoFinishPayment()" v-if="isAdmin">撤销</button>
                </span>
              </td>

              <td class="text-center">
                {{detail.settleDate}}
                <span class="text-info small">{{detail.settlementNo}}</span>
                <template v-if="detail.settlementNo !== null && detail.bePaid === '0' && detail.paymentStatus === 0">
                  <button type="button" class="btn btn-sm btn-danger" @click.stop="delSettlementNo()">删除</button>
                </template>
              </td>
              <td class="text-center">
                {{detail.writeOffDate}}
                <span class="text-info small">{{detail.writeOffMemo}}</span>
              </td>
              <td class="text-center">
                {{detail.receiptNo}}
              </td>
               
              <td class="text-center">                
                <template v-if="isFlightBill">
                  <router-link :to="`/flt/order/0?orderNo=` + detail.orderNo" class="small text-info">{{detail.orderNo}}</router-link> 
                </template>
                <template v-else-if="detail.billType === '5'">
                  <router-link :to="`/flt/refund/order/0?orderNo=` + detail.orderNo" class="small text-info">{{detail.orderNo}}</router-link> 
                </template>
                <template v-else>
                  {{detail.orderNo}}
                </template>
              </td>   
              <td class="text-center">{{detail.flightOrderNo}}</td>
              <td class="text-center">{{detail.createTime}}</td>
            </tr>
          </tbody>
        </table>
        <div class="card-body">
          <strong>备注：</strong>
                {{detail.remark}}
                <a href="javascript:void(0)" @click.stop="editRemark()" class="small pl-2">修改</a>
        </div>
        <div class="card-body text-center py-2">
          <template v-if="detail.audited !== '1'">
            <button  type="button" class="btn btn-success" @click.stop="auditBillDone()">审核通过</button>
            <button type="button" class="btn btn-danger btn-sm float-right" @click.stop="deleteBill()">删除</button>
          </template>
          <template v-else-if="detail.bePaid !== '1'">
            <button  type="button" class="btn btn-success float-left" @click.stop="writeOffBill()" v-if="isRoot">销账(已收款)</button>
            
            <button type="button" class="btn btn-danger btn-sm float-right" @click.stop="cancelBillAudited()">取消审核</button>
          </template>

          <template v-if="detail.paymentStatus === 0">
            <button  type="button" class="btn btn-primary float-left ml-5" @click.stop="finishPayment()" v-if="isRoot">已付款</button>  
          </template>
          
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
                    <th>代理费</th>
                    <th>服务费</th>
                    <th>优惠</th>
                    <th class="text-center bg-info text-white" colspan="7">行程</th>
                    <th>总计</th>
                    <th>成本</th>
                    <th>利润</th>
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
                    <td>{{info.commission}}</td>
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
                    <td>{{info.cost}}</td>
                    <td>{{info.profit}}</td>
                    <td>
                      <!-- 暂时禁用此处的修改，3个月后再删除此功能。2018-10-27 -->
                      <!-- <template v-if="detail.audited !== '1'">
                        <a href="javascript:void(0)" @click.stop="editTicketPrice(info)">修改</a>
                      </template> -->
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
                      <th>底价</th>
                      <th>服务费</th>
                      <th>间夜</th>
                      <th>总金额</th>
                      <th>总成本</th>
                      <th>利润</th>
                      <th>备注</th>
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
                        <td>{{info.bottomPrice}}</td>
                        <td>{{info.serviceCharge}}</td>
                        <td>{{info.count}}</td>
                        <td>{{info.totalAmount}}</td>
                        <td>{{info.totalCost}}</td>
                        <td>{{info.profit}}</td>
                        <td>{{info.remark}}</td>
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
                    <th>航司实退 </th>
                    <th>利润</th>
                    <th></th>
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
                    <td>{{info.airlineRefundAmount}}</td>
                    <td>{{info.profit}}</td>
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
                    <th>成本</th>
                    <th>利润</th>
                    <th>备注</th>
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
                    <td>{{info.cost}}</td>
                    <td>{{info.profit}}</td>
                    <td>{{info.remark}}</td>
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
                    <th>利润</th>
                    <th></th>
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
                    <td>{{info.serviceCharge}}</td>
                    <td></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </template>

      <div class="card">
          <div class="card-header">
              <button type="button" class="btn btn-info btn-sm float-right" @click.stop="searchHistories()">查看操作记录</button>
          </div>
          <table class="table table-sm table-striped small">
            <tr>
              <th>时间</th><th>内容</th><th>操作人</th>
            </tr>
            <tr v-for="info in histories" :key="info.id">
              <td>{{info.createTime}}</td>
              <td>{{info.content}}</td>
              <td>{{info.operator}}</td>
            </tr>
          </table>
      </div>
    </template>

    <div class="modal" id="modalEditPrice" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">更改价格</h4>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
                </div>
                <div class="modal-body">
                    <table class="table table-sm">
                      <tr>
                        <td>票面价</td>
                        <td>销售价</td>
                        <td>税</td>
                        <td>保险费</td>
                        <td>服务费</td>
                      </tr>
                      <tr>
                        <td><input type="text" class="form-control" v-model.number="price"></td>
                        <td><input type="text" class="form-control" v-model.number="parvalue"></td>
                        <td><input type="text" class="form-control" v-model.number="tax"></td>
                        <td><input type="text" class="form-control" v-model.number="insurance"></td>
                        <td><input type="text" class="form-control" v-model.number="serviceCharge"></td>
                      </tr>
                      <tr>
                        <td>代理费率</td>
                        <td>代理费金额</td>
                        <td>客户让利</td>
                        <td>应收</td>
                      </tr>
                      <tr>
                        <td><input type="text" class="form-control" v-model.number="commRate"></td>
                        <td><input type="text" class="form-control" v-model.number="commission"></td>
                        <td><input type="text" class="form-control" v-model.number="discount"></td>
                        <td><input type="text" class="form-control" v-model.number="amount"></td>
                      </tr>                      
                     </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default"  data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click.stop="changeTicketPrice()">保存</button>
                </div>
            </div>
        </div>                    
    </div>

    <my-modal-prompt ref="modalPrompt" :nullable="modalNullable">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
    <my-modal-update-customer ref="updateCustomerModal"></my-modal-update-customer>
    <my-modal-supplier-update ref="updateSupplierModal"></my-modal-supplier-update>
    <my-modal-pay-method-update ref="updatePayMethodModal"></my-modal-pay-method-update>
    <my-modal-op1-update ref="updateOp1Modal"></my-modal-op1-update>
    <my-modal-change-date ref="updateDateModal">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-change-date>
    <my-modal-pay-type ref="modalPayType"></my-modal-pay-type>
  </div>
</template>

<script>
  import { BILL_FLIGHT, BILL_HOTEL, BILL_TRAIN, BILL_REFUND, BILL_VAS, BILL_CHANGE } from '../common/const.js'  
  import { auditBill, cancelBillAudited, searchBillDetail, changeBillCustomer, updateBillFlightTicketPrice, deleteBill, searchBillInfoHistory, updateBillInfoSupplier, updateBillInfoPaymentMethod, updateBillInfoEtdzDate, updateBillInfoOp1, updateBillInfoRemark, updateBillInfoPayType, updateBillInfoOpDate, delSettlementNo, undoWriteOffBill, writeOffSingleBill, finishBillPayment, undoFinishBillPayment } from '../api/bill.js'
  import $ from 'jquery'
  import MyModalPrompt from '../components/my-modal-prompt.vue'
  import MyModalSupplierUpdate from '../components/my-modal-supplier-update.vue'
  import MyModalPayMethodUpdate from '../components/my-modal-pay-method-update.vue'
  import MyModalOp1Update from '../components/my-modal-op1-update.vue'
  import MyModalUpdateCustomer from '../components/my-modal-customer-update.vue'
  import MyModalChangeDate from '../components/my-modal-change-date.vue'
  import MyModalPayType from '../components/my-modal-pay-type.vue'

  export default {
    name: "BillDetail",
    components: {
      MyModalPrompt,
      MyModalSupplierUpdate,
      MyModalPayMethodUpdate,
      MyModalOp1Update,
      MyModalUpdateCustomer,
      MyModalChangeDate,
      MyModalPayType
    },
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

        modalTitle: '',
        modalNullable: false,

        histories: [],

        printMode: '0'
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin },
      isRoot () { return this.$store.state.isRoot },
      supplierId: function () {
        if (this.detail === null || this.detail.supplier === null) {
          return 0
        } else {
          return this.detail.supplier.id
        }
      },
      payMethodId: function () {
        if (this.detail === null || this.detail.paymentMethod === null) {
          return 0
        } else {
          return this.detail.paymentMethod.id
        }
      },
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
    watch: {
      parvalue: function () {
        this.calc()
      },
      tax: function () {
        this.calc()
      },
      insurance: function () {
        this.calc()
      },
      serviceCharge: function () {
        this.calc()
      },
      discount: function () {
        this.calc()
      },
      commission: function () {
        this.calc()
      },
      commRate: function () {
        this.calc()
      },
      discountRate: function () {
        this.calc()
      },
      amount: function () {
        this.caclDisCount()
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
        this.searchBillDetail()
      },
      searchBillDetail: function () {
        const params = {
          'id': this.id,
          'billNum': this.billNum
        }

        searchBillDetail(params,
          (jsonResult) => {
            this.detail = jsonResult
            if (this.id === 0) {
              this.id = this.detail.id
            }
          }
        )
      },
      auditBillDone: function () {
        auditBill(this.id, v => this.commonShowMessage(v))
      },
      cancelBillAudited: function () {
        this.modalTitle = '请输入取消审核的原因'
        this.$refs.modalPrompt.modal().then((remark) => {
          cancelBillAudited(this.id, { remark }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      changeCustomer: function () {
        this.$refs.updateCustomerModal.modal(0).then((info) => {
          changeBillCustomer(this.id, {
            'customerId': info.customerId,
            'costCenter': info.costCenter,
            'projectName': info.projectName }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editTicketPrice: function (obj) {
        console.log(obj)
        this.ticketId = obj.id
        this.price = obj.price
        this.parvalue = obj.parvalue
        this.tax = obj.tax
        this.insurance = obj.insurance
        this.serviceCharge = obj.serviceCharge
        this.commRate = obj.commissionRate
        this.commission = obj.commission
        this.discountRate = obj.discountRate
        this.discount = obj.discount
        this.profit = obj.profit

        this.calc()

        $('#modalEditPrice').modal()
      },
      calc: function () {
        if (this.commRate > 0) {
          this.commission = this.parvalue * this.commRate / 100
        }
        if (this.discountRate > 0) {
          this.discount = this.parvalue * this.discountRate / 100
        }

        this.amount = this.parvalue + this.tax + this.insurance + this.serviceCharge - this.discount
        this.totalAmount = this.amount
        this.profit = (this.commission + this.serviceCharge - this.discount)
      },
      caclDisCount: function () {
        this.discount = this.parvalue + this.tax + this.insurance + this.serviceCharge - this.amount

        this.totalAmount = this.amount
        this.profit = this.commission + this.serviceCharge - this.discount
        this.totalProfit = this.profit
      },
      changeTicketPrice: function () {
        const params = {
          'id': this.ticketId,
          'price': this.price,
          'parvalue': this.parvalue,
          'tax': this.tax,
          'insurance': this.insurance,
          'serviceCharge': this.serviceCharge,
          'commRate': this.commRate,
          'commission': this.commission,
          'discountRate': this.discountRate,
          'discount': this.discount,
          'amount': this.amount,
          'totalAmount': this.totalAmount,
          'profit': this.profit
        }

        const str = JSON.stringify(params)

        updateBillFlightTicketPrice(this.id, str,
          (jsonResult) => {
            if (jsonResult.status !== 'OK') {
              this.showErrMsg('失败：' + jsonResult.errmsg)
            } else {
              this.showErrMsg('保存成功')
              // this.priceEditing = 0
              $('#modalEditPrice').modal('hide')
              this.refresh()
            }
          }
        )
      },
      deleteBill: function () {
        this.modalTitle = '确定要删除此账单？'
        this.$refs.modalPrompt.modal('YesOrNo').then((remark) => {
          this.doDeleteBill()
        }).catch((ex) => {})
      },
      doDeleteBill: function () {
        deleteBill(this.id, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('删除成功')
            this.back()
          } else {
            this.showErrMsg('删除失败: ' + jsonResult.errmsg)
          }
        })
      },
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status === 'OK') {
          this.showErrMsg('操作成功')
          this.searchBillDetail()
        } else {
          this.showErrMsg('操作失败: ' + jsonResult.errmsg)
        }
      },
      searchHistories: function () {
        searchBillInfoHistory(this.id, v => { this.histories = v })
      },
      editSupplier: function () {
        this.$refs.updateSupplierModal.modal(this.supplierId).then((info) => {
          updateBillInfoSupplier(this.id, { 'supplierId': info.supplierId }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editPayment: function () {
        this.$refs.updatePayMethodModal.modal(this.payMethodId).then((info) => {
          updateBillInfoPaymentMethod(this.id, { 'paymentMethodId': info.payMethodId }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editEtdzDate: function () {
        this.modalTitle = '请输入新的出票日期（格式示例：2017-01-08)：'
        this.$refs.updateDateModal.modal().then((remark) => {
          updateBillInfoEtdzDate(this.id, { 'etdzDate': remark }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editOp1: function () {
        this.$refs.updateOp1Modal.modal(this.detail.op1).then((info) => {
          updateBillInfoOp1(this.id, { 'op1': info.op1 }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editRemark: function () {
        this.modalTitle = '请输入新的账单备注：'
        this.$refs.modalPrompt.modal().then((remark) => {
          updateBillInfoRemark(this.id, { 'remark': remark }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editPayType: function () {
        this.$refs.modalPayType.modal(this.detail.payTypeNote).then((payType) => {
          updateBillInfoPayType(this.id, { 'payType': payType }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      editOpDate: function () {
        this.modalTitle = '请输入新的账单日期（格式示例：2017-01-08)：'
        this.$refs.updateDateModal.modal().then((remark) => {
          updateBillInfoOpDate(this.id, { 'opDate': remark }, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      delSettlementNo: function () {
        this.modalTitle = '确定从结算单中移除吗？'
        this.$refs.modalPrompt.modal('YesOrNo').then(() => {
          delSettlementNo(this.id, v => this.commonShowMessage(v))
        }).catch((ex) => {})
      },
      writeOffBill: function () {
        writeOffSingleBill(this.id, v => {
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.showErrMsg('操作成功')
              this.refresh()
            }
          })
      },
      undoWriteOff: function () {
        this.modalTitle = '确定撤销销账吗？请输入 OK'

        this.$refs.modalPrompt.modal('').then((remark) => {
          const params = {
            'billId': this.id,
            'remark': remark
          }
          console.log(params)

          undoWriteOffBill(params, v => {
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.showErrMsg('操作成功')
              this.refresh()
            }
          })
          
        }).catch((ex) => {})        
      },
      finishPayment: function () {
        //完成支付
        finishBillPayment(this.id, v => {
          if (v.status !== 'OK') {
            this.showErrMsg(v.errmsg, 'danger')
          } else {
            this.showErrMsg('操作成功')
            this.refresh()
          }
        })
      },
      undoFinishPayment: function () {
        undoFinishBillPayment(this.id, v => {
          if (v.status !== 'OK') {
            this.showErrMsg(v.errmsg, 'danger')
          } else {
            this.showErrMsg('操作成功')
            this.refresh()
          }
        })
      }
    }
  }
  // 800
</script>