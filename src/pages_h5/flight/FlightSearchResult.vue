<template>
  <div id="flight-search-result" class="row mb-2">

      <div class="col-12 bg-info text-center text-white">
          <span @click="back()" class="float-left fa-2">
            <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
          </span>
          <span class="fa-2">{{dcityName}}-{{acityName}}</span> <small>{{ddate.substring(5)}}</small>

          <span @click="showFilter()" class="float-right fa-2">                       
            <i class="fa fa-filter" aria-hidden="true"></i>
            <template v-if="totalCount > 0">
              <small>筛选</small>
            </template>
          </span>   
      </div>         

      <div class="col-12 text-center bg-primary border-1" style="opacity:0.8">
        <span class="float-left" v-if="isToday">
          <a href="javascript:void(0)" @click.stop="changeDdate(-1)" class="text-white">前一天</a>
        </span>
        
        <span class="text-danger small" v-if="isReplacing">更新中...</span>
        
        <span class="float-right">
          <a href="javascript:void(0)" @click.stop="changeDdate(1)" class="text-white fa-2">后一天</a>
        </span>
      </div>
      <table class="table table-striped table-hover table-sm">
        <thead>
            <th class="text-center small">航班</th>
            <th class="text-center small">出发</th>
            <th class="text-center small">到达</th>
            <th class="text-center small">时间</th>
            <th class="text-center small">价格</th>
        </thead>
        <tbody>
          <template v-for="flight in execSort(searchFlightResults)" >
            <tr @click="showFlightDetail(flight)" name="flightItem">
                <td class="text-center">
                  {{flight.flightNo}}
                  <br />
                  <small>{{flight.carrierName}}</small>
                </td>
                <td class="text-center hidden-sm-down">
                  {{flight.dcityName}} {{flight.dportName}} 
                  <span class="small text-primary">{{flight.dterm}}</span>
                </td>
                <td class="text-center hidden-sm-down">
                  {{flight.acityName}}{{flight.aportName}} 
                  <span class="small text-primary">{{flight.aterm}}</span>
                </td>
                <td class="text-center">
                  <span class="text-info fa-2">{{flight.dtime}}</span> 
                  <small>{{flight.atime}}</small>
                </td>
                <td class="text-center">
                    <div v-if="flight.subClassList.length > 0">
                        <template v-if="flight.lowestPrice != null">
                            <i class="fa fa-rmb"></i>
                            <span class="text-danger">
                              <big><strong>{{flight.lowestPrice.price}}</strong></big>
                            </span>
                              <i class="fa fa-long-arrow-up text-success" aria-hidden="true"></i>

                        </template>    
                    </div>
                    <div v-else>
                        <span class="text-danger">已售完</span>
                    </div>
                </td>
            </tr>
            <tr v-show="detailFlightId == flight.id">
              <td colspan="5">
                <table class="table table-striped">
                  <tbody>
                    <tr v-for="info in sortSubclass(flight.subClassList)">
                      <td class="text-right px-1"><small>{{showCabinClass(info.cabinClass, info.offset)}} {{info.subClass}}</small></td>
                      <td class="text-center">
                        <span :id="'tgq-' + flight.id + '-' + info.subClass" tgq-cached="0" @click="showTGQ(flight.carrierCode, info.subClass)"><small>退改</small></span>
                      </td>
                      <td class="text-right">
                        <template v-if="info.price > 0">
                          <i class="fa fa-rmb text-warning"></i> <span class="text-danger fa-2">{{info.price}}</span>
                        </template>
                        <template v-else>
                          <span class="text-danger"><small></small></span>
                        </template>
                      </td>
                      <td class="text-right">
                        <span v-if="info.seatCount < 10" class="text-danger"><small>{{info.seatCount}}张</small></span>

                        <a @click.stop="bookFlight(flight, info, null);" :title="info.price + '元，余位' + info.seatStatus" class="btn btn-outline-info btn-sm">预定</a>   
                        <a @click.stop="bookFlight(flight, info, info.policyCode);" class="btn btn-outline-success btn-sm" v-if="info.policyCode !== null">优惠预定</a>            
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="card col-12 border-0" v-if="flight.freshness < 60">
                  <div class="card-body text-right">
                    <small>更新时间: <span class="text-success">{{showFreshness(flight.freshness)}}</span></small>
                  </div>
                </div>
              </td>
            </tr>
            
          </template>
        </tbody>
      </table>
      <div class="card col-12 text-right mt-1 border-0" v-if="totalCount > 0">
        <span class="text-info"><small>共</small> {{showCount}}/{{totalCount}} <small>航班</small></span>
      </div>

    <div id="loadingToast" v-show="searching">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">航班查询中 {{dataLength}}</p>
      </div>
    </div>

    <div class="modal fade" id="tgqModal">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>  

    <my-modal-filter ref="modalFilter" :carrierInfos="carrierInfos"></my-modal-filter>
  </div>
</template>

<script>
import { getCabinClassDesc, addDate } from '../../common/common.js'
import { rav, searchTgq } from '../../api/flight.js'
import MyButton from '../../components/my-button.vue'
import MyInput from '../../components/my-input.vue'
import $ from 'jquery'
import MyModalFilter from '../../components/my-flight-filter.vue'

export default {
  components: {
    'my-button': MyButton,
    'my-input': MyInput,
    MyModalFilter
  },
  data () {
    return {
      searching: false,

      flt: null,

      startPosition: -1,
      searchFlightResults: [],
      carriers: [],
      carrierInfos: [],
      filter: {
        showCodeShare: false,
        filterByCarrier: '',
        filterByTime: '0',
        sortBy: 0
      },

      avCount: 0,
      totalCount: 0,
      showCount: 0,

      dataLength: 0, // 每次来的数据长度
      isReplacing: false, // 航班数据是否开始替换了,

      tgqCarrier: '',
      tgqSubclass: '',

      detailFlightId: -1 // 显示哪一个航班的详情信息 
    }
  },
  computed: {
    dcity () { return this.$store.state.searchParams.dcity },
    acity () { return this.$store.state.searchParams.acity },
    ddate () { return this.$store.state.searchParams.ddate },
    dcityName () { return this.$store.state.searchParams.dcityName },
    acityName () { return this.$store.state.searchParams.acityName },
    onlyCarrier () { return this.$store.state.searchParams.onlyCarrier },
    sortBy () { return this.$store.state.searchParams.sortBy },
    isToday () {
      // 判断 ddate 日期是否小于等于今天
      var aa = new Date(this.ddate) - new Date()
      return aa > 0
    }
  },
  mounted: function () {
    this.$store.commit('hideBottomTabBar')

    this.avCount = 0
    this.filter.sortBy = this.sortBy
    this.filter.filterByCarrier = this.onlyCarrier

    this.readyToSearch()
  },
  beforeDestroy: function () {
    this.$store.commit('showBottomTabBar')
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    readyToSearch: function () {
      this.startPosition = -1
      this.isReplacing = false
      this.avCount = 0
      this.dataLength = 0
      this.searchFlightResults.splice(0)
      this.search()
    },
    search: function () {
      var self = this

      if (self.dcity.length === 0 || self.acity.length === 0) {
        this.showErrMsg('请先选择出发、到达城市', 'danger')
        return
      }

      self.searching = true
      if (self.isReplacing) {
        self.searching = false // 开始替换旧的航班信息了，则关闭加载框，允许用户操作，后台更新数据
        // console.log('flight is replacing...')
      }

      
    },
    
    continueSearchFlight: function () {
      if (this.startPosition === -1) {
        this.startPosition = 0
      }

      this.avCount = this.avCount + 1
      // if ((this.avCount > 10 && this.totalCount === 0) || this.avCount > 20) {
      //   this.searching = false
      //   this.showErrMsg('时间有点长了，过会再试试吧')
      //   return
      // }

      this.search()
    },
    showFlightDetail: function (fltInfo) {
      // 显示某一航班详情
      if (this.detailFlightId === fltInfo.id)
        this.detailFlightId = -1
      else
        this.detailFlightId = fltInfo.id
    },
    closeDetail: function () {
      this.detailShowing = false
      this.listShowing = true
    },
    execSort: function (searchResults) {
      return searchResults
      var data = this.filter
      var returnFlights = searchResults.filter(function (flight) {
        if (data.showCodeShare) {
          return true
        } else {
          if (flight.codeShared === '0') {
            return true
          } else {
            return false
          }
        }
      })

      returnFlights = returnFlights.filter(function (flight) {
        if (data.filterByCarrier === '' || data.filterByCarrier === flight.carrierCode) {
          return true
        } else {
          return false
        }
      })

      returnFlights = returnFlights.filter(function (flight) {
        switch (data.filterByTime) {
          case '0': return true
          case '1': return flight.depTime >= '0000' && flight.depTime <= '0600'
          case '2': return flight.depTime >= '0600' && flight.depTime <= '1200'
          case '3': return flight.depTime >= '1200' && flight.depTime <= '1800'
          case '4': return flight.depTime >= '1800' && flight.depTime <= '2359'
        }
      })

      this.totalCount = searchResults.length
      this.showCount = returnFlights.length

      if (data.sortBy === 0) {
        // 按照起飞时间的升序
        returnFlights.sort(function (a, b) {
          if (a.depTime > b.depTime) {
            return 1
          }
          if (a.depTime < b.depTime) {
            return -1
          }
          return 0
        })
      } else if (data.sortBy === 1) {
        // 按照起飞时间的降序
        returnFlights.sort(function (a, b) {
          if (a.depTime > b.depTime) {
            return -1
          }
          if (a.depTime < b.depTime) {
            return 1
          }
          return 0
        })
      } else if (data.sortBy === 2) {
        // 最低价格的升序
        returnFlights.sort(function (a, b) {
          var price0 = 1000000
          var price1 = 1000000
          if (a.lowestPrice != null) price0 = a.lowestPrice.price
          if (b.lowestPrice != null) price1 = b.lowestPrice.price

          return price0 - price1
        })
      } else if (data.sortBy === 3) {
        // 最低价格的降序
        returnFlights.sort(function (a, b) {
          var price0 = 0
          var price1 = 0
          if (a.lowestPrice != null) price0 = a.lowestPrice.price
          if (b.lowestPrice != null) price1 = b.lowestPrice.price

          return price1 - price0
        })
      }

      return returnFlights
    },
    sortSubclass: function (classList) {
      if (classList === null) return null

      var returnedList = classList.slice(0) // 此处若不新建数组，Vue.js总是发警告说 infinite loop

      returnedList.sort(function (a, b) {
        var price0 = 1000000
        var price1 = 1000000
        if (a.price !== 0) price0 = a.price
        if (b.price !== 0) price1 = b.price

        return price0 - price1
      })

      return returnedList
    },
    showCabinClass: function (cabinClass, offset) {
      return getCabinClassDesc(cabinClass, offset)
    },
    showFreshness: function (freshness) {
      if (freshness <= 5) {
        return '刚刚'
      } else {
        return freshness + ' 分钟前'
      }
    },
    bookFlight: function (flt0, subclass0, policyCode) {
      console.log(flt0)
      var fltInfo = {
        'flightNo': flt0.flightNo,
        'carrierName': flt0.carrierName,
        'ddate': flt0.ddate,
        'dport': flt0.dport,
        'aport': flt0.aport,
        'dtime': flt0.dtime,
        'showDtime': flt0.dtime,
        'atime': flt0.atime,
        'showAtime': flt0.atime,
        'dportName': flt0.dportName,
        'dterm': flt0.dterm,
        'aportName': flt0.aportName,
        'aterm': flt0.aterm,
        'subclass': subclass0.subClass,
        'price': subclass0.price,
        'returnPoint': subclass0.returnPoint,
        'airportTax': flt0.airportTax,
        'fuelSurcharge': flt0.fuelSurcharge,
        'tax': flt0.airportTax + flt0.fuelSurcharge,
        'policyCode': policyCode,
        'changeRule': subclass0.changeRule,
        'refundRule': subclass0.refundRule
      }
      console.log(fltInfo)

      this.$store.dispatch('addFlight', fltInfo)
      this.$router.replace('/flt/booking')
    },
    showFilter: function () {
      this.$refs.modalFilter.modal().then(v => {
        this.filter.showCodeShare = v.showCodeShare
        this.filter.filterByCarrier = v.filterByCarrier
        this.filter.filterByTime = v.filterByTime
        this.filter.sortBy = parseInt(v.sortBy)
      }).catch(ex => {})
    },
    showTGQ: function (carrier, subclass) {
      this.tgqCarrier = carrier
      this.tgqSubclass = subclass
      var params = { 'carrier': carrier,
        'subclass': subclass
      }

      searchTgq(params, this.tgqDone)
    },
    tgqDone: function (jsonResult) {
      var self = this
      var tgqDetail = ''
      if (jsonResult.dataList.length > 0) {
        var info = jsonResult.dataList[0]
        if (info.endorsementRule != null) {
          tgqDetail = '签转：' + info.endorsementRule + '.<br />'
        }

        tgqDetail += '更改：起飞前'
        if (info.rerouteRuleBefore === 0) {
          tgqDetail += '免手续费, '
        } else {
          tgqDetail += info.rerouteRuleBefore + '%手续费, '
        }
        tgqDetail += '起飞后'
        if (info.rerouteRuleAfter === 0) {
          tgqDetail += '免手续费. '
        } else {
          tgqDetail += info.rerouteRuleAfter + '%手续费.'
        }
        tgqDetail += '<br />'

        tgqDetail += '退票：起飞前'
        if (info.refundRuleBefore === 0) {
          tgqDetail += '免手续费, '
        } else {
          tgqDetail += info.refundRuleBefore + '%手续费, '
        }
        tgqDetail += '起飞后'
        if (info.refundRuleAfter === 0) {
          tgqDetail += '免手续费. '
        } else {
          tgqDetail += info.refundRuleAfter + '%手续费.'
        }
        tgqDetail += '<br />'
      } else {
        tgqDetail = '具体退改签信息请咨询客服'
      }

      self.dispalyTgqInfo(self.tgqCarrier, self.tgqSubclass, tgqDetail)
    },
    dispalyTgqInfo: function (carrier, subclass, tgqDetail) {
      var modal = $('#tgqModal')
      var title = carrier + ' ' + subclass + ' 退改签信息'
      modal.find('.modal-title').text(title)
      modal.find('.modal-body').html(tgqDetail)
      modal.modal('show')
    },
    changeDdate: function (x) {
      var newDate = addDate(this.ddate, x)

      this.$store.commit('setDdate', newDate)
      this.readyToSearch()
    }
  }
}
</script>

<style>
  .time {
    font-size: 150%
  }
  .lowest-price {
    font-size: 160%;
    font-weight: bold;
  }
  .airport {
    font-size: 110%
  }
</style>
