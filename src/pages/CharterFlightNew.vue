<template>
	<div id="new-charter-flight" >
    <div class="card">
      <div class="card-header bg-info text-white">
        新建团队机票
        <span class="float-right" @click.stop="back()">返回</span>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="form-group row">
          <label class="col-2 control-label text-right">团名(不能重复)*</label>
          <div class="col-10">
              <input type="text" class="form-control" v-model.trim="name">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-2 control-label text-right">座位数*</label>
          <div class="col-10">
              <input type="text" class="form-control" v-model.number="totalSeats">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-2 control-label text-right">联系人*</label>
          <div class="col-10">
              <input type="text" class="form-control" v-model.trim="linkMan">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-2 control-label text-right">联系电话*</label>
          <div class="col-10">
              <input type="text" class="form-control" v-model.trim="contactMobile">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-2 control-label text-right">备注</label>
          <div class="col-10">
              <input type="text" class="form-control" v-model.trim="remark">
          </div>
        </div>
      </div>                
    </div>
    <div class="card">
      <div class="card-header text-center">航班内容</div>
      <table id="fltTable" class="table table-sm">
        <thead>
          <tr>
            <th>出发机场*</th>
            <th>到达机场*</th>
            <th>航班号*</th>
            <th>起飞日期*</th>
            <th>舱位</th>
            <th>起飞时间</th>
            <th>到达时间</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(info, index) in flights">
            <tr>
              <td>
                <input type="text" class="form-control" maxlength="3" placeholder="出发机场" v-model.trim="info.flight.departureAirport" size="10" /></td>
              <td>
                <input type="text" class="form-control" maxlength="3" placeholder="到达机场" v-model.trim="info.flight.arrivalAirport" size="10" /></td>
              <td>
                <input type="text" class="form-control" maxlength="10" placeholder="航班号" v-model.trim="info.flight.flightNo" /></td>
              <td>
                <!-- <input type="text" class="form-control" maxlength="10" placeholder="格式: 2009-08-30" v-model.trim="info.flight.departureDate" /> -->
                <my-date-picker :id="`ddate` + index" v-model.trim="info.flight.departureDate"></my-date-picker>
              </td>
              <td>
                <input type="text" class="form-control" maxlength="2" placeholder="舱位" v-model.trim="info.flight.subclass" /></td>
              <td>
                <input type="text" class="form-control" placeholder="起飞时间"  v-model.trim="info.flight.departureTime" size="10" /></td>
              <td>
                <input type="text" class="form-control" placeholder="到达时间"  v-model.trim="info.flight.arrivalTime" size="10" /></td>
              <td>
                <a href="javascript:void(0)" @click.stop="deleteFlt(index)"  class="btn btn-sm btn-danger">删除</a>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="card-footer">        
        <span class="ms-auto me-auto">
          <a href="javascript:void(0);" @click.stop="addFlt()" class="btn btn-sm btn-success">增加航段</a>
        </span>
      </div>
    </div>
    <div class="card">
      <div class="card-body text-center">
        <button type="button" class="btn btn-success ml-2" @click.stop.prevent="createCharterFlight()">保存</button>
      </div>
    </div>
      
  </div>
</template>

<script>
  import { createCharterFlight, searchCharterFlightDetail } from '../api/charter-flight.js'
  import MyDatePicker from '../components/my-datepicker.vue'

  export default {
    components: {
      MyDatePicker
    },
    data () {
      return {
        name: '',
        totalSeats: 0,
        bottomPrice: 0,
        salePrice: 0,
        remark: '',
        linkMan: '',
        contactMobile: '',

        flights: [],

        copyId: 0
      }
    },
    mounted: function () {
      this.addFlt()

      let id = parseInt(this.$route.query.copyId)
      if (!isNaN(id)) {
        this.copyId = id
        this.getOriginalOrderDetail(this.copyId)
      }
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
      createCharterFlight: function () {
        const params = {
          'details': this.flights,
          'name': this.name,
          'totalSeats': this.totalSeats,
          'remark': this.remark,
          'linkMan': this.linkMan,
          'contactMobile': this.contactMobile
        }

        const jsonParams = JSON.stringify(params)

        this.showLoading()

        createCharterFlight(jsonParams,
          (jsonResult) => {
            if (jsonResult.status !== 'OK') {
              this.showErrMsg(jsonResult.errmsg)
            } else {
              this.showErrMsg('保存成功')
              this.$router.push('/charter-flights')
            }
          },
          () => { this.hideLoading() }
        )
      },
      addFlt: function () {
        this.flights.push({
          'flight': {
            'flightNo': '',
            'departureDate': '',
            'subclass': '',
            'departureAirport': '',
            'departureTerminal': '',
            'arrivalAirport': '',
            'arrivalTerminal': '',
            'departureTime': '',
            'arrivalTime': ''
          }
        })
      },
      deleteFlt: function (idx) {
        this.flights.splice(idx, 1)
      },
      getOriginalOrderDetail: function (orderId) {
        searchCharterFlightDetail(orderId, v => {
          // console.log(v)
          this.name = v.name
          this.totalSeats = v.totalSeats
          this.remark = v.remark
          this.linkMan = v.linkMan
          this.contactMobile = v.contactMobile

          this.flights.splice(0)
          for (const flt0 of v.details) {
            const flt2 = flt0.flight
            // console.log(flt2)
            const flt = {
              'flight': {
                'flightNo': flt2.flightNo,
                'departureDate': flt2.departureDate,
                // 'subclass': flt2.subclass,
                'departureAirport': flt2.departureAirport,
                'arrivalAirport': flt2.arrivalAirport
              }
            }
            this.flights.push(flt);
          }
        })
      },      
      reset: function () {
        // body...
        this.flights.splice(0)
        this.addFlt()

        this.name = ''
        this.totalSeats = 0
        this.remark = '',
        this.linkMan = '',
        this.contactMobile = ''
      }
    }
  }

</script>