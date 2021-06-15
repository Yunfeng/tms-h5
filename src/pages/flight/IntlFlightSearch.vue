<template>
	<div id="searching" class="row mb-2">
    <div class="col-12 bg-info text-center text-white mb-1">
      <span class="fa-2">国际/港澳台航班预定</span>
    </div> 

    <div class="card col-12">
      <div class="card-body">
        <form>
          <div class=" col-12">
          	<div>
	          	<div class="form-check form-check-inline">
	              <input class="form-check-input" type="radio" value="1" v-model.number="routeType">
	              <label class="form-check-label">单程</label>
	            </div>
	            <div class="form-check form-check-inline">
	              <input class="form-check-input" type="radio" value="2" v-model.number="routeType">
	              <label class="form-check-label">往返</label>
	            </div>
	          </div>
            <div class="col-2">
              <input class="form-control" type="text" v-model="dcity" id="dcity" placeholder="出发机场">
            </div>

            <!-- <label class="ml-1">到达</label> -->
            <div class="col-2">
              <input class="form-control" type="text" v-model="acity" id="acity" placeholder="到达机场">
            </div>

            <div class=" col-2 px-0">
              <input class="form-control" type="text" placeholder="出发日期" v-model="ddate" id="ddate">
            </div>

            <div class=" col-2 px-0">
              <input class="form-control" type="text" placeholder="返程日期" v-model="adate" id="adate">
            </div>
            <div class=" col-2 px-0">
              <select v-model="sortBy" class="form-control" >
                      <option value="0">起飞时间升序</option>
                      <option value="1">起飞时间降序</option>
                      <option value="2">最低价格升序</option>
                      <option value="3">最低价格降序</option>
              </select>
            </div>
            <div class=" col">
            	<button type="button" @click.stop="search()" class="btn btn-primary">搜索</button>
        	</div>
          </div>     
        </form>
      </div>

    </div>
    <div class="card col-12">
    	<table class="table table-sm table-stripe">
    		<thead>
    			<tr>
    				<td>solution id</td>
    				<td>最低票价</td>
    				<td>最低税费</td>
    				<td>最低总价</td>
    			</tr>
    		</thead>
    		<tbody>
    			<tr v-for="(info, index) in solutions">
    				<td>{{info.id}}</td>
    				<td>{{info.bestPriceAcrossAgenciesBaseFare.amount}}</td>
    				<td>{{info.bestPriceAcrossAgenciesTax.amount}}</td>
    				<td>{{info.bestPriceAcrossAgenciesTotal.amount}}</td>
    				<td>
    					<table>
    						<tr v-for="segmentInfo in info.segments">
    							<td>{{segmentInfo.origin}}</td>
    							<td>{{segmentInfo.destination}}</td>
    							<td>
    								<table>
    									<tr v-for="fltInfo in segmentInfo.flights">
    										<td>{{fltInfo.flightNo}}</td>
    										<td>{{fltInfo.dport}}</td>
    										<td>{{fltInfo.dterm}}</td>
    										<td>{{fltInfo.aport}}</td>
    										<td>{{fltInfo.aterm}}</td>
    										<td>{{fltInfo.ddate}}</td>
    										<td>{{fltInfo.dtime}}</td>
    										<td>{{fltInfo.adate}}</td>
    										<td>{{fltInfo.atime}}</td>
    										<td>{{fltInfo.stopover}}</td>
    										<td>{{fltInfo.aircraft}}</td>
    										<td>{{fltInfo.flyTime}}</td>
    										<td>{{fltInfo.io}}</td>
    										<td>{{fltInfo.cabin}}</td>
    										<td>{{fltInfo.rbd}}</td>
    										<td>{{fltInfo.seatCount}}</td>
    										<td>{{fltInfo.refundable}}</td>
    										<td>{{fltInfo.changeable}}</td>
    										<td>{{fltInfo.upgradable}}</td>
    									</tr>
    								</table>
    							</td>
    						</tr>
    					</table>
    				</td>
    			</tr>
    		</tbody>
    	</table>
    </div>
  </div>
</template>

<script>
import { addDate } from '../../common/common.js'
import { searchOne } from '../../api/flight.js'
import $ from 'jquery'

export default {
  components: {
  },
  data () {
    return {
      searching: false,
      targetName: '',
      showDialog: false,
      showPicker: false,

      onlyCarrier: '',
      sortBy: 0,

      dcity: 'SHA',
      acity: 'sel',
      routeType: 2,
      ddate: '2020-04-21',
      adate: '2020-04-30',

      flights: [],
      solutions: []
    }
  },
  computed: {
    // dcity () { return this.$store.state.searchParams.dcity },
    // acity () { return this.$store.state.searchParams.acity },
    // ddate () { return this.$store.state.searchParams.ddate },
    // dcityName () { return this.$store.state.searchParams.dcityName },
    // acityName () { return this.$store.state.searchParams.acityName }
    // onlyCarrier () { return this.$store.state.searchParams.onlyCarrier },
    // sortBy () { return this.$store.state.searchParams.sortBy }
  },
  watch: {
    onlyCarrier (curVal, oldVal) {
      this.$store.commit('setOnlyCarrier', curVal)
    },
    sortBy (curVal, oldVal) {
      this.$store.commit('setSortBy', parseInt(curVal))
    }
  },
  created: function () {

  },
  mounted: function () {
    var self = this
    var today = new Date()

    $('#ddate').datepicker({
      dateFormat: 'yy-mm-dd',
      autoSize: true,
      showButtonPanel: false,
      showOtherMonths: false,
      selectOtherMonths: false,
      numberOfMonths: 1,
      minDate: today,
      showOptions: { direction: 'up' },
      onSelect: function (dateText, inst) {
        self.$store.commit('setDdate', dateText)
      },
      beforeShow: function (input) {
        $(input).css({ position: 'relative', zIndex: '1000' })
      }
    })
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    search: function () {
      if (this.dcity === undefined || this.acity === undefined || this.ddate === undefined) {
        this.showErrMsg('请确定下需要查什么')
        return
      }

      if (this.dcity.length !== 3 ||  this.acity.length !== 3 ) {
        this.showErrMsg('请选择出发/到达城市')
        return
      }

      if (this.dcity === this.acity) {
        this.showErrMsg('出发和到达城市不能相同')
        return
      }

      if (this.ddate.length <= 8) {
        this.showErrMsg('请选定乘机日期')
        return
      }

     const params = { 
     	'routeType': this.routeType,
       'dcity': this.dcity,
       'acity': this.acity,
        'ddate': this.ddate,
        'adate': this.adate
      }

      searchOne(params, this.ravDone, this.ravFail, this.ravAlways)
    },
    ravDone: function (jsonResult) {
    	// console.log(jsonResult)
      var self = this
      if (jsonResult !== null) {
      	// this.flights = jsonResult.flights
      	this.solutions = jsonResult.solutions

        if (jsonResult.status === -1) {
          self.showErrMsg('系统错误，请与管理员联系。')
          self.searching = false
          return
        }

        if (jsonResult.dataList != null && jsonResult.dataList.length > 0) {
          var len1 = jsonResult.dataList.length
          self.dataLength = len1
          for (var i = 0; i < len1; i++) {
            var flt = jsonResult.dataList[i]

            // 检查是否已经存在同样的航班号，如果存在，则比较彼此的ID，ID大的留着
            var len0 = self.searchFlightResults.length
            for (var j = 0; j < len0; j++) {
              var flt0 = self.searchFlightResults[j]
              if (flt0.flightNo === flt.flightNo) {
                // console.log(flt0.flightNo + ': ' + flt0.id + ', ' + flt.id)
                self.searchFlightResults.splice(j, 1)
                self.isReplacing = true // 开始替换航班数据了
                break
              }
            }

            self.searchFlightResults.push(flt)

            if (self.startPosition < flt.id) {
              self.startPosition = flt.id
            }

            if (self.carriers.length === 0 || self.carriers.indexOf(flt.carrierCode) === -1) {
              self.carriers.push(flt.carrierCode)
              self.carrierInfos.push({ 'code': flt.carrierCode, 'name': flt.carrierName })
            }
          }
        }

        if (jsonResult.status === 1) {
          // search done
          self.carriers.sort()
          self.carrierInfos.sort()
          self.searching = false
          self.isReplacing = false
        } else if (jsonResult.status === 101) {
          self.searching = false
          self.showErrMsg('无直飞航班', 'danger')
        } else {
          setTimeout(self.continueSearchFlight, 1500)
        }
      }
    },
    ravFail: function (status, statusText) {
      this.searching = false
      this.showErrMsg(status + ' ' + statusText, 'danger')
    },
    ravAlways: function () {

    },
    cityPickerClosed: function (val) {
      this.showPicker = val
    },
    dcityFocusedEvent: function () {
      this.targetName = 'Dcity'
      this.showPicker = true
    },
    acityFocusedEvent: function () {
      this.targetName = 'Acity'
      this.showPicker = true
    },
    switchCity: function () {
      this.$store.commit('switchCity')
    }
  }
}
</script>
