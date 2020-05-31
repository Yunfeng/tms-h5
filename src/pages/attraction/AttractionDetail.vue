<template>
  <div id="attraction-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb my-0">
        <li class="breadcrumb-item"><router-link to='/attractions'>景点</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">价格详情</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>

    <template v-if="detailInfo !== null">
      <div class="media mb-3">
        <img class="d-flex mr-3 rounded-circle" src="" alt="图片" height="64">
        <div class="media-body">
            <h5 class="mt-0">{{detailInfo.name}}</h5>
            <dl class="row">
              <dt class="col-sm-3">地址</dt>
              <dd class="col-sm-9">{{detailInfo.address}}</dd>

              <dt class="col-sm-3">开放时间</dt>
              <dd class="col-sm-9">
                {{detailInfo.openTime}}
              </dd>
              <dt class="col-sm-3">状态</dt>
              <dd class="col-sm-9">
                <span class="text-success" v-if="detailInfo.status === 1">正常</span>
                <span class="text-danger" v-else>停用</span>
              </dd>
            </dl>
        </div>
      </div>
      <template v-if="booking === false">
        <div class="card">
          <div class="card-body my-0 py-0">
            可用价格
          </div>
          <table class="table table-sm">
            <thead>
              <tr>
                <th>日期</th>
                <th>价格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="info in prices" :key="`price` + info.id">
                <td>{{info.effectDate}}</td>
                <td>{{info.price}}</td>
                <td>
                  <button class="btn btn-danger btn-sm" @click.stop="buyTicket(info.id)">下单</button>
                </td>
              </tr>
              <tr>
                  <my-pagination :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
              </tr>

            </tbody>
          </table>  
        </div>
      </template>
      <template v-else>
        <div class="card">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>日期</th>
                <th>价格</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{priceInfo.effectDate}}</td>
                <td>{{priceInfo.price}}</td>
                <td>{{priceInfo.remark}}</td>
              </tr>
            </tbody>
          </table> 
          <div class="card-body">
            <div class="form-group row">
                <label class="control-label col-md-4 text-right">
                    价格    
                </label>
                <div class="col-md-6">
                    <input type="text" class="form-control" v-model.number="price"  readonly="">
                </div>
            </div>
            <div class="form-group row">
                <label class="control-label col-md-4 text-right">
                    数量    
                </label>
                <div class="col-md-6">
                    <input type="text" class="form-control" v-model.number="count" readonly="">
                </div>
            </div>
            <div class="form-group row">
                <label class="control-label col-md-4 text-right">
                    备注    
                </label>
                <div class="col-md-6">
                    <input type="text" class="form-control" v-model.trim="remark"  readonly="">
                </div>
            </div>
          </div> 
          <div class="card-body py-0 bg-info text-white">客人信息</div>                  
          <table class="table table-sm">
            <thead>
            <tr>
                <th>姓名</th>
                <th>证件号</th>
                <th>证件类型</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
              <template v-for="(info, index) in passengers">
                <tr :key="`passenger` + index">
                  <td>
                    <input type="text" class="form-control" placeholder="客人姓名" v-model.trim="info.name"/>
                  </td>
                  <td>
                      <input type="text" class="form-control" placeholder="证件号" v-model.trim="info.idNo" />
                  </td>
                  <td>
                      <input type="text" class="form-control" placeholder="联系电话" v-model.trim="info.mobile" />
                  </td>
                  <td>
                    <a href="javascript:void(0)" @click.stop="deletePsg(index)"  class="btn btn-sm btn-danger float-right">删除</a>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <div class="card-footer">        
            <span>
              <a href="javascript:void(0);" @click.stop="addPsg()" class="btn btn-sm btn-success">增加客人</a>
            </span>
          </div>
          <div class="card-body">                  
            <div class="form-group row">
              <span class="ml-auto mr-auto">订单总额：<b>{{total}}</b></span>
            </div>
          </div>
          <div class="card-footer text-center">        
            <button type="button" class="btn btn-primary" @click.stop.prevent="saveOrder()">保存</button>  
              
          </div>
        </div>
      </template>    
    </template>
  </div>
</template>

<script>
  import { getAttraction, searchAttractionPrices, createAttractionOrder, payTicketOrder } from '../../api/attraction.js'
  import $ from 'jquery'
  import MyPagination from '../../components/my-pagination.vue'
  import MyDatePicker from '../../components/my-datepicker.vue'
  
  export default {
    components: {
      MyPagination,
      MyDatePicker
    },
    data () {
      return {
        id: 0,

        detailInfo: null,
        priceInfo: null,
        prices: [],

        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 7,
          pageTotal: 0
        },
        
        price: 0,
        total: 0,
        remark: '', 
        passengers: [],

        booking: false
      }
    },
    watch: {
      count: function () {
        this.calc()
      }
    },
    computed: {
      count: function () {
        return this.passengers.length
      }
    },
    mounted: function () {
      this.id = parseInt(this.$route.params.id)
      // console.log(this.id)
      this.search()
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      },
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      search: function () {
        getAttraction(this.id, v => {
          this.detailInfo = v

          this.searchPrices()
        })
      },
      searchPrices: function () {
        const params = {
          'pageNo': this.sc.pageNo,
          'pageSize': this.sc.pageSize
        }

        searchAttractionPrices(this.id, params, v => {
          this.prices = v.dataList
          this.sc = v.page
          console.log(this.page)
        })
      },
      buyTicket: function (priceId) {
        console.log(priceId)
         for(const info of this.prices) {
          console.log(info)
          if (info.id === priceId) {
            this.priceInfo = info
            this.price = info.price
            break
          }
         } 
        console.log(this.priceInfo) 
        this.booking = true
        this.addPsg()
      },
      addPsg: function () {
        this.passengers.push({
          'name': '', 
          'idNo': '', 
          'mobile': '' 
        })
      },
      deletePsg: function (index) {
        this.passengers.splice(index, 1)
      },
      calc: function () {
        this.total = this.count * this.price
      },
      saveOrder: function (next) {
         
        const params = {
          'attractionId': this.id,
          'travelDate': this.priceInfo.effectDate,
          'price': this.price,
          'count': this.count,
          'total': this.total,
          'passengers': this.passengers,
          'remark': this.remark
        }

        var jsonParams = JSON.stringify(params)

        createAttractionOrder(jsonParams,
          (jsonResult) => {
            if (jsonResult.status !== 'OK') {
              this.showErrMsg(jsonResult.errmsg)
            } else {
              this.showErrMsg('保存成功')
              // if (next === 0) {                
                  this.$router.replace('/attractions/ticket/orders')
              // } else if (next === 1) {
                // this.reset()
              // }
            }
          }
        )
      },
      prevPage: function () {
        this.sc.pageNo = this.sc.pageNo - 1
        if (this.sc.pageNo < 1) this.sc.pageNo = 1
        this.searchPrices()
      },
      nextPage: function () {
        this.sc.pageNo = this.sc.pageNo + 1
        this.searchPrices()
      },
      directPage: function (pageNo) {
        this.sc.pageNo = pageNo
        this.searchPrices()
      },
    }
  }
</script>