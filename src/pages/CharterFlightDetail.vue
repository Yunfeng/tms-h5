<template>
  <div id="billDetail">
    <template v-if="detail !== null">
      <div class="card">
          <div class="card-header bg-info text-white">
            包机信息
            <span class="float-right" @click.stop="back()">返回</span>
          </div>
      
          <table class="table table-striped table-hover table-sm small">
              <thead>
                  <tr>
                      <th>名称</th>
                      <th>出发</th>
                      <th>到达</th>
                      <th>总座位数</th>
                      <th>余位</th>
                      <th>底价</th>
                      <th>销售价</th>
                      <th>备注</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>   
                      <td>{{(detail.name)}}</td>                             
                      <td>
                          {{detail.dport}}
                      </td>
                      <td>{{detail.aport}}</td>
                      <td>
                        {{detail.totalSeats}}
                      </td>
                      <td>{{detail.leftSeats}}</td>
                      <td>{{detail.bottomPrice}}</td>
                      <td>{{detail.salePrice}}</td>
                      <td>{{detail.remark}}</td>
                  </tr>
              </tbody>
          </table>
      </div>
	    <div class="card">
	      <div class="card-header">行程信息</div>	  
	      <table class="table table-response table-striped table-hover table-sm">
	        <thead>
	            <tr>
	                <th>航班号</th>
	                <th>日期</th>
	                <th>舱位</th>
	                <th>出发</th>
	                <th>到达</th>
	                <th>起飞时间</th>
	                <th>到达时间</th>
	            </tr>
	        </thead>
	        <tbody>
	          <template  v-for="(info, index) in detail.details">
	            <tr>   
	                <td>{{info.flight.flightNo}}</td>                             
	                <td>
	                    {{info.flight.departureDate}}
	                </td>
	                <td>{{info.flight.subclass}}</td>
	                <td>{{info.flight.departureAirport}}</td>
	                <td>{{info.flight.arrivalAirport}}</td>
	                <td>{{info.flight.departureTime}}</td>
	                <td>{{info.flight.arrivalTime}}</td>
	            </tr>
	          </template>
	        </tbody>
	      </table>
	    </div>
      <div class="card">
        <div class="card-body">
          <button class="btn btn-danger" v-if="detail.totalSeats === detail.leftSeats" @click.stop="deleteDetail()">删除</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import { searchCharterFlightDetail, deleteCharterFlightDetail } from '../api/charter-flight.js'

  export default {
    data () {
      return {
        detail: null,
        id: 0
      }
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
      search: function () {
        searchCharterFlightDetail(this.id,
          (jsonResult) => {
            this.detail = jsonResult
          }
        )
      },
      deleteDetail: function () {
        if (window.confirm('确定要删除此包机信息？') === false) {
          this.showErrMsg('不删除了')
          return
        }

        deleteCharterFlightDetail(this.id, (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('删除成功')
            this.back()
          } else {
            this.showErrMsg('删除失败: ' + jsonResult.errmsg)
          }
        })
      }
    }
  }
</script>