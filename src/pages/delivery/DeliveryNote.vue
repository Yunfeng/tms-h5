<template>
  <div id="delivery-note-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/delivery/notes'>配送单</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ms-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>
    
    <template v-if="detail !== null">
      <div class="card mb-0">
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
                  <th>预订人</th>
                  <th>处理人</th>                
                  <th>状态</th>
              </tr>                        
          </thead>
          <tbody>
              <tr>
                  <td>{{detail.orderNo}}</td>
                  <td>
                      {{detail.deliveredContent}}  
                  </td>
                  <td>{{detail.deliveryDate}}</td>
                  <td>{{detail.receiver}}</td>
                  <td>{{detail.mobile}}</td>
                  <td>{{detail.address}}</td>
                  <td>{{detail.remark}}</td>
                  <td>{{detail.createTime}}</td>
                  <td>{{detail.operator}}</td>
                  <td>{{detail.processor}}</td>
                  <td>{{getStatusDesc(detail.status)}}</td>
              </tr>
          </tbody>
        </table>
    	</div>

      <div class="card" v-if="detail.status === 0 || detail.status === 1">
        <div class="card-body small"> 
          <div class="d-flex flex-row  justify-content-around" v-if="detail.status === 0">
            <button type="button" class="btn btn-sm btn-info ms-auto me-auto" @click.stop="updateDeliveryDate()">派送日期</button>
              <button class="btn btn-primary btn-sm ms-auto me-auto" @click.stop="processOrder()">处理配送</button>
              <button class="btn btn-danger btn-sm ms-auto me-auto" @click.stop="cancelOrder()">取消</button>
            </div>
            <div class="d-flex flex-row  justify-content-around" v-else-if="detail.status === 1">
              <button class="btn btn-primary btn-sm ms-auto me-auto" @click.stop="finishOrder()">配送完毕</button>
              <button class="btn btn-danger btn-sm ms-auto me-auto" @click.stop="cancelOrder()">取消</button>
            </div>
        </div>
      </div>

      <ul class="nav nav-tabs nav-bordered mb-3" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="order-tab" data-bs-toggle="tab" href="#orderDetailTab" role="tab" aria-controls="home" aria-selected="true">内容</a>
        </li>      
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="orderDetailTab" role="tabpanel" aria-labelledby="order-tab" v-if="orderInfo !== null">
          <div class="card">
            <div class="card-body bg-info text-white py-0">乘机人信息</div>      
            <table class="table table-striped table-hover table-sm mb-0">
                <thead>
                    <tr>
                        <th class="text-right">姓名</th>
                        <th>票号</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(info, index) in orderInfo.passengers" :key="index">   
                        <td class="text-right">
                            {{info.name}}
                        </td>                             
                        <td>
                          {{info.ticketNo}}
                        </td>
                    </tr>                               
                </tbody>
            </table>
            <div class="card-body bg-info text-white py-0">航班信息</div>    
            <table class="table table-striped table-hover table-sm mb-0">
                <thead>
                    <tr>
                        <th>出发</th>
                        <th>到达</th>
                        <th>出发日期</th>
                        <th>航班号</th>
                        <th>出发时间</th>
                        <th>到达时间</th>
                        <th>舱位</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(info, index) in orderInfo.flights" :key="index">   
                        <td>
                          <span class="text-success">{{info.flight.departureAirport}}</span>
                            {{info.flight.departureAirportName}} 
                            {{info.flight.departureTerminal}} 
                            
                        </td>                             
                        <td>
                          <span class="text-success">{{info.flight.arrivalAirport}}</span>
                            {{info.flight.arrivalAirportName}}
                            {{info.flight.arrivalTerminal}}
                            
                        </td>
                        <td>{{info.flight.departureDate}}</td>
                        <td>{{info.flight.flightNo}}</td>
                        <td>{{info.flight.departureTime}}</td>
                        <td>{{info.flight.arrivalTime}}</td>
                        <td>{{info.flight.subclass}}</td>
                    </tr>                               
                </tbody>
            </table>
          </div>
        </div>      
      </div>    
        
      <div class="card">
          <div class="card-header small">
              <a href="javascript:void(0)" class="float-right" @click.stop="viewHistory()">查看历史记录</a>
          </div>
          <table class="table table-sm table-striped small">
              <tr>
                  <td>操作员</td>
                  <td>内容</td>
                  <td>时间</td>
              </tr>
              <tr v-for="info in histories" :key="info.id">
                  <td>{{info.operator}}</td>
                  <td>{{info.content}}</td>
                  <td>{{info.createTime}}</td>
              </tr>
          </table>
      </div>
    </template>

    <my-modal-prompt ref="modalPrompt" :nullable="modalNullable">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
    <my-modal-change-date ref="updateDateModal">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-change-date>
  </div>
  
</template>

<script>
  import { searchDeliveryNote, showDeliveryNoteStatus, processDeliveryNote, updateDeliveryDate, searchHistory, cancelDeliveryNote, finishDeliveryNote } from '../../api/delivery.js'

  import MyModalPrompt from '../../components/my-modal-prompt.vue'
  import MyModalChangeDate from '../../components/my-modal-change-date.vue'

  export default {
    components: {
      MyModalPrompt,
      MyModalChangeDate
    },
    data () {
      return {
        detail: null,
        orderInfo: null,
        id: 0,
        orderNo: '',

        modalTitle: '',
        modalNullable: false,

        histories: []
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin }
    },
    mounted: function () {
      this.id = parseInt(this.$route.params.id)
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
      	searchDeliveryNote(this.id, val => {
      		this.detail = val
      		this.orderInfo = this.detail.flightOrder
      	})
      },
      getStatusDesc: function (status) {
        return showDeliveryNoteStatus(status)
      },
      cancelOrder: function () {
        this.modalTitle = '请输入取消的理由：'
        this.$refs.modalPrompt.modal().then(remark => {
          // 点击确定按钮的回调处理
          if (remark === '') {
            this.showErrMsg('请填写取消订单的理由')
            return
          }
          cancelDeliveryNote(this.id, { remark }, v => this.commonShowMessage(v))

        }).catch((r) => {})
      },
      processOrder: function () {
        processDeliveryNote(this.id, v => this.commonShowMessage(v))
      },
      finishOrder: function () {
        this.modalTitle = '请输入完成备注：'
        this.$refs.modalPrompt.modal().then(remark => {
          if (remark === '') {
            return
          }
          finishDeliveryNote(this.id, { remark }, v => this.commonShowMessage(v))
        }).catch((r) => {})
      },
      updateDeliveryDate: function () {
        // 此处允许修改出票日期
        this.modalTitle = '请输入派送日期（格式：2019-08-28）：'
        this.$refs.updateDateModal.modal().then((newDate) => {
          updateDeliveryDate(this.id, { 'deliveryDate': newDate }, v => {
            this.commonShowMessage(v)
          })
        }).catch((ex) => {})
      },
      viewHistory: function () {
        searchHistory(this.id, (jsonResult) => { this.histories = jsonResult })
      },
      commonShowMessage: function (jsonResult) {
        if (jsonResult.status !== 'OK') {
          this.showErrMsg('操作失败：' + jsonResult.errmsg, 'danger')
        } else {
          if (jsonResult.desc !== '') {
            this.showErrMsg(jsonResult.desc)
          } else {
            this.showErrMsg('操作成功')
          }
          this.search()
        }
      }
    }
  }
</script>