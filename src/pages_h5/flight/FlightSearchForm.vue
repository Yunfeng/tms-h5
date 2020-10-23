<template>
  <div id="flight-search" class="card mt-5 row">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb py-1">
        <li class="breadcrumb-item active ml-1" aria-current="page">
          机票预订
        </li>
        <li class="breadcrumb-item ml-auto mr-1">
          <router-link to="/h5/flt/orders">机票订单</router-link>
        </li>
      </ol>
    </nav>
    <template v-if="showSearchForm">
      <div class="card-body py-0 my-1">
        <form>
          <div class="form-group">
            <label>出发</label>
            <my-select-airport
              :cityCode.sync="dcity"
              :cityName.sync="dcityName"
              :id="dcity"
            ></my-select-airport>
          </div>
          <div class="form-group">
            <label>到达</label>
            <my-select-airport
              :cityCode.sync="acity"
              :cityName.sync="acityName"
              :id="acity"
            ></my-select-airport>
          </div>

          <div class="form-group">
            <label>日期</label>
            <my-date-picker
              id="ddate"
              v-model="ddate"
              placeholder="出发日期"
            ></my-date-picker>
          </div>
          <div class="form-group text-center">
            <button
              type="button"
              @click.stop="search()"
              class="btn btn-primary btn-lg"
            >
              搜索
            </button>
          </div>
        </form>
      </div>
    </template>
    <template v-else>
      <div class="card-body text-center py-1 my-0">
        <span class="float-left" @click.stop="returnSearchForm()">
          <i class="mdi mdi-arrow-left"></i>
        </span>
        {{ dcityName }} ~ {{ acityName }}
        <br />
        {{ ddate }}
      </div>
      <div class="col-12 text-center bg-primary border-1" style="opacity: 0.8">
        <span class="float-left" v-if="isToday">
          <a
            href="javascript:void(0)"
            @click.stop="changeDdate(-1)"
            class="text-white"
            >前一天</a
          >
        </span>

        <span class="text-danger small" v-if="isReplacing">更新中...</span>

        <span class="float-right">
          <a
            href="javascript:void(0)"
            @click.stop="changeDdate(1)"
            class="text-white fa-2"
            >后一天</a
          >
        </span>
      </div>
      <table class="table table-striped table-hover table-sm">
        <thead class="thead-light">
          <th class="text-center">时间</th>
          <th class="text-center">航班</th>
          <th class="text-center">出发</th>
          <th class="text-center">到达</th>
          <th class="text-center d-none d-md-table-cell">时长</th>
          <th class="text-center d-none d-md-table-cell">机型</th>
          <th class="text-center d-none d-md-table-cell">经停</th>
          <th class="text-center">价格</th>
          <th></th>
        </thead>
        <tbody>
          <template v-for="flight in searchFlightResults">
            <tr
              @click="showFlightDetail(flight)"
              name="flightItem"
              :key="flight.flightNo"
              class="table-primary"
            >
              <td class="text-center">
                <span class="text-primary fa-2">{{ flight.dtime }}</span>
                <span class="text-muted">{{ flight.atime }}</span>
              </td>
              <td>
                {{ flight.flightNo }}
                <span v-if="flight.codeShare === 1" class="small text-muted">{{
                  flight.opFlightNo
                }}</span>
              </td>
              <td class="text-center">
                {{ flight.dportName }}
                <span class="text-muted">{{ flight.dterm }}</span>
              </td>
              <td class="text-center">
                {{ flight.aportName }}
                <span class="text-muted">{{ flight.aterm }}</span>
              </td>

              <td class="text-center d-none d-md-table-cell">
                <span class="text-info fa-2">{{ flight.duration }}</span>
              </td>
              <td class="text-center d-none d-md-table-cell">
                <span class="text-info fa-2">{{ flight.aircraft }}</span>
              </td>
              <td class="text-center d-none d-md-table-cell">
                <span class="text-info fa-2" v-if="flight.stopover < 1"
                  >无</span
                >
              </td>
              <td class="text-center">
                <div v-if="flight.subClassList.length > 0">
                  <template v-if="flight.lowestPrice != null">
                    <i class="fa fa-rmb"></i>
                    <span class="text-danger">
                      <big>
                        <strong>{{ flight.lowestPrice.price }}</strong>
                      </big>
                    </span>
                    <span class="text-muted"
                      >{{ flight.lowestPrice.cabinClass
                      }}{{ flight.lowestPrice.discountRate }}</span
                    >
                    <i
                      class="fa fa-long-arrow-up text-success"
                      aria-hidden="true"
                    ></i>
                  </template>
                </div>
                <div v-else>
                  <span class="text-danger">已售完</span>
                </div>
              </td>
              <td class="text-left fa-2">
                <template v-if="detailFlightId !== flight.flightNo">
                  <i class="mdi mdi-arrow-right"></i>
                </template>
                <template v-else>
                  <i class="mdi mdi-arrow-down"></i>
                </template>
              </td>
            </tr>
            <tr v-show="detailFlightId == flight.flightNo">
              <td colspan="8">
                <table class="table table-striped">
                  <tbody>
                    <tr v-for="info in sortSubclass(flight.subClassList)">
                      <td class="text-right px-1">
                        {{ info.subClass }}
                        <small
                          >({{ info.cabinClass }}{{ info.discountRate }})</small
                        >
                      </td>
                      <td class="text-center">
                        <span @click="showTGQ(info.tgqInfo)">退改</span>
                      </td>
                      <td>
                        <span @click="showLuggageInfo(info.luggageInfos)"
                          >行李</span
                        >
                      </td>
                      <td class="text-right">
                        <template v-if="info.price > 0">
                          <i class="fa fa-rmb text-warning"></i>
                          <span class="text-danger fa-2">{{ info.price }}</span>
                        </template>
                        <template v-else>
                          <span class="text-danger">
                            <small></small>
                          </span>
                        </template>
                      </td>
                      <td class="text-right">
                        <span v-if="info.seatCount < 10" class="text-danger">
                          <small>{{ info.seatCount }}张</small>
                        </span>

                        <a
                          @click.stop="bookFlight(flight, info, null)"
                          :title="info.price + '元，余位' + info.seatStatus"
                          class="btn btn-outline-info btn-sm"
                          >预定</a
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="card col-12 text-right mt-1 border-0" v-if="totalCount > 0">
        <span class="text-info">
          <small>共</small>
          {{ showCount }}/{{ totalCount }}
          <small>航班</small>
        </span>
      </div>
    </template>

    <div class="modal" tabindex="-1" id="tgqModal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body px-0">
            <p>Modal body text goes here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MyDatePicker from "../../components/my-datepicker.vue";
import { getCabinClassDesc, addDate, tomorrow } from "../../common/common.js";
import { rav, searchTgq } from "../../api/flight.js";
import $ from "jquery";
import MySelectAirport from "../../components/my-select2-airport.vue";

export default {
  components: {
    MyDatePicker,
    MySelectAirport,
  },
  data() {
    return {
      showSearchForm: true,
      searching: false,

      flt: null,

      startPosition: -1,
      searchFlightResults: [],
      carriers: [],
      carrierInfos: [],
      filter: {
        showCodeShare: false,
        filterByCarrier: "",
        filterByTime: "0",
        sortBy: 0,
      },

      avCount: 0,
      totalCount: 0,
      showCount: 0,

      dataLength: 0, // 每次来的数据长度
      isReplacing: false, // 航班数据是否开始替换了,

      tgqCarrier: "",
      tgqSubclass: "",

      detailFlightId: "", // 显示哪一个航班的详情信息,

      // testFlights: avResult.flights
      dcity: null,
      dcityName: null,
      acity: null,
      acityName: null,
      ddate: null,
    };
  },
  computed: mapState({
    // dcity: (state) => state.searchParams.dcity,
    // acity: (state) => state.searchParams.acity,
    // ddate: (state) => state.searchParams.ddate,
    isToday() {
      // 判断 ddate 日期是否小于等于今天
      const aa = new Date(this.ddate) - new Date();
      return aa > 0;
    },
  }),
  mounted: function () {
    this.init();
  },
  methods: {
    showLoading: function (loadingText) {
      this.$store.commit("showLoading", {
        loading: true,
        loadingText: loadingText,
      });
    },
    hideLoading: function () {
      this.$store.commit("showLoading", { loading: false });
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch("showAlertMsg", {
        errMsg: msg,
        errMsgType: msgType,
      });
    },
    init: function () {
      if (this.dcity == null) {
        const dcity = $.cookie("rav.dcity");
        if (dcity !== undefined) {
          this.dcity = dcity;
        }
        const acity = $.cookie("rav.acity");
        if (acity !== undefined) {
          this.acity = acity;
        }

        const ddate = $.cookie("rav.ddate");
        if (ddate !== undefined) {
          this.ddate = ddate;
        }
      }
      // console.log(this.dcity)
      if (this.dcity == null) {
        const newDate = addDate(this.ddate, 1);
        this.dcity = "SHA";
        this.acity = "KHN";
        this.ddate = tomorrow();
      }
    },
    search: function () {
      this.searchFlightResults.splice(0);
      if (
        this.dcity === undefined ||
        this.acity === undefined ||
        this.ddate === undefined
      ) {
        this.showErrMsg("请确定下需要查什么");
        return;
      }

      if (this.dcity.length !== 3 || this.acity.length !== 3) {
        this.showErrMsg("请选择出发/到达城市");
        return;
      }

      if (this.dcity === this.acity) {
        this.showErrMsg("出发和到达城市不能相同");
        return;
      }

      if (this.ddate.length <= 8) {
        this.showErrMsg("请选定乘机日期");
        return;
      }

      this.showSearchForm = false;
      //开发测试代码
      // this.searchFlightResults = this.testFlights
      // return
      this.dcity = this.dcity.toUpperCase();
      this.acity = this.acity.toUpperCase();
      this.$store.commit("setDcity", {
        cityCode: this.dcity,
        cityName: this.dcityName,
      });
      this.$store.commit("setAcity", {
        cityCode: this.acity,
        cityName: this.acityName,
      });
      this.$store.commit("setDdate", this.ddate);

      this.showLoading();

      $.cookie("rav.dcity", this.dcity, { path: "/" });
      $.cookie("rav.acity", this.acity, { path: "/" });
      $.cookie("rav.ddate", this.ddate, { path: "/" });

      // 查询航班
      const params = {
        startPosition: -1,
        dcity: this.dcity,
        acity: this.acity,
        ddate: this.ddate,
      };

      rav(params, this.ravDone, this.ravFail, this.ravAlways);
    },
    ravDone: function (jsonResult) {
      var self = this;
      if (jsonResult !== null) {
        if (jsonResult.status === -1) {
          self.showErrMsg("系统错误，请与管理员联系。");
          self.searching = false;
          return;
        }

        if (jsonResult.dataList != null && jsonResult.dataList.length > 0) {
          var len1 = jsonResult.dataList.length;
          self.dataLength = len1;
          for (var i = 0; i < len1; i++) {
            var flt = jsonResult.dataList[i];

            // 检查是否已经存在同样的航班号，如果存在，则比较彼此的ID，ID大的留着
            var len0 = self.searchFlightResults.length;
            for (var j = 0; j < len0; j++) {
              var flt0 = self.searchFlightResults[j];
              if (flt0.flightNo === flt.flightNo) {
                // console.log(flt0.flightNo + ': ' + flt0.id + ', ' + flt.id)
                self.searchFlightResults.splice(j, 1);
                self.isReplacing = true; // 开始替换航班数据了
                break;
              }
            }

            self.searchFlightResults.push(flt);

            if (self.startPosition < flt.id) {
              self.startPosition = flt.id;
            }

            if (
              self.carriers.length === 0 ||
              self.carriers.indexOf(flt.carrierCode) === -1
            ) {
              self.carriers.push(flt.carrierCode);
              self.carrierInfos.push({
                code: flt.carrierCode,
                name: flt.carrierName,
              });
            }
          }
        }

        if (jsonResult.status === 1) {
          // search done
          self.carriers.sort();
          self.carrierInfos.sort();
          self.searching = false;
          self.isReplacing = false;
        } else if (jsonResult.status === 101) {
          self.searching = false;
          self.showErrMsg("无直飞航班", "danger");
        } else {
          setTimeout(self.continueSearchFlight, 1500);
        }
      }
    },
    ravFail: function (status, statusText) {
      this.searching = false;
      this.showErrMsg(status + " " + statusText, "danger");
    },
    ravAlways: function () {
      this.hideLoading();
    },
    execSort: function (searchResults) {
      return searchResults;
      var data = this.filter;
      var returnFlights = searchResults.filter(function (flight) {
        if (data.showCodeShare) {
          return true;
        } else {
          if (flight.codeShared === "0") {
            return true;
          } else {
            return false;
          }
        }
      });

      returnFlights = returnFlights.filter(function (flight) {
        if (
          data.filterByCarrier === "" ||
          data.filterByCarrier === flight.carrierCode
        ) {
          return true;
        } else {
          return false;
        }
      });

      returnFlights = returnFlights.filter(function (flight) {
        switch (data.filterByTime) {
          case "0":
            return true;
          case "1":
            return flight.depTime >= "0000" && flight.depTime <= "0600";
          case "2":
            return flight.depTime >= "0600" && flight.depTime <= "1200";
          case "3":
            return flight.depTime >= "1200" && flight.depTime <= "1800";
          case "4":
            return flight.depTime >= "1800" && flight.depTime <= "2359";
        }
      });

      this.totalCount = searchResults.length;
      this.showCount = returnFlights.length;

      if (data.sortBy === 0) {
        // 按照起飞时间的升序
        returnFlights.sort(function (a, b) {
          if (a.depTime > b.depTime) {
            return 1;
          }
          if (a.depTime < b.depTime) {
            return -1;
          }
          return 0;
        });
      } else if (data.sortBy === 1) {
        // 按照起飞时间的降序
        returnFlights.sort(function (a, b) {
          if (a.depTime > b.depTime) {
            return -1;
          }
          if (a.depTime < b.depTime) {
            return 1;
          }
          return 0;
        });
      } else if (data.sortBy === 2) {
        // 最低价格的升序
        returnFlights.sort(function (a, b) {
          var price0 = 1000000;
          var price1 = 1000000;
          if (a.lowestPrice != null) price0 = a.lowestPrice.price;
          if (b.lowestPrice != null) price1 = b.lowestPrice.price;

          return price0 - price1;
        });
      } else if (data.sortBy === 3) {
        // 最低价格的降序
        returnFlights.sort(function (a, b) {
          var price0 = 0;
          var price1 = 0;
          if (a.lowestPrice != null) price0 = a.lowestPrice.price;
          if (b.lowestPrice != null) price1 = b.lowestPrice.price;

          return price1 - price0;
        });
      }

      return returnFlights;
    },
    sortSubclass: function (classList) {
      if (classList === null) return null;

      var returnedList = classList.slice(0); // 此处若不新建数组，Vue.js总是发警告说 infinite loop

      returnedList.sort(function (a, b) {
        var price0 = 1000000;
        var price1 = 1000000;
        if (a.price !== 0) price0 = a.price;
        if (b.price !== 0) price1 = b.price;

        return price0 - price1;
      });

      return returnedList;
    },
    showCabinClass: function (cabinClass, offset) {
      return getCabinClassDesc(cabinClass, offset);
    },
    showFreshness: function (freshness) {
      if (freshness <= 5) {
        return "刚刚";
      } else {
        return freshness + " 分钟前";
      }
    },
    bookFlight: function (flt0, subclass0, policyCode) {
      console.log(flt0);
      var fltInfo = {
        flightNo: flt0.flightNo,
        carrierName: flt0.carrierName,
        ddate: flt0.ddate,
        dport: flt0.dport,
        dcityName: flt0.dcityName,
        dportName: flt0.dportName,
        aport: flt0.aport,
        acityName: flt0.acityName,
        aportName: flt0.aportName,
        dtime: flt0.dtime,
        showDtime: flt0.dtime,
        atime: flt0.atime,
        showAtime: flt0.atime,
        dterm: flt0.dterm,
        aterm: flt0.aterm,
        subclass: subclass0.subClass,
        price: subclass0.price,
        returnPoint: subclass0.returnPoint,
        airportTax: flt0.airportTax,
        fuelSurcharge: flt0.fuelSurcharge,
        tax: flt0.airportTax + flt0.fuelSurcharge,
        policyCode: policyCode,
        changeRule: subclass0.changeRule,
        refundRule: subclass0.refundRule,
        aircraft: flt0.aircraft,
      };
      console.log(fltInfo);

      this.$store.dispatch("addFlight", fltInfo);
      this.$router.replace("/h5/flt/booking");
    },
    showFilter: function () {
      this.$refs.modalFilter
        .modal()
        .then((v) => {
          this.filter.showCodeShare = v.showCodeShare;
          this.filter.filterByCarrier = v.filterByCarrier;
          this.filter.filterByTime = v.filterByTime;
          this.filter.sortBy = parseInt(v.sortBy);
        })
        .catch((ex) => {});
    },
    showTGQ: function (tgqInfo) {
      console.log(tgqInfo);
      var self = this;
      var tgqDetail = `<table class='table table-sm table-response small px-0'>
        <thead>
          <tr>
            <th class="px-0"></th>
            <th class="px-0 pr-1">${tgqInfo.tamountList[0].title.substring(
              5
            )}</th>
            <th class="px-0 pr-1">${tgqInfo.tamountList[1].title.substring(
              5
            )}</th>
            <th class="px-0 pr-1">${tgqInfo.tamountList[2].title.substring(
              5
            )}</th>
            <th class="px-0">${tgqInfo.tamountList[3].title.substring(5)}</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-info text-white">
            <th class="px-0">退票</th>
            <th class="px-0">${tgqInfo.tamountList[0].amount}</th>
            <th class="px-0">${tgqInfo.tamountList[1].amount}</th>
            <th class="px-0">${tgqInfo.tamountList[2].amount}</th>
            <th class="px-0">${tgqInfo.tamountList[3].amount}</th>
          </tr>
          <tr>
            <th class="px-0">改签</th>
            <th class="px-0">${tgqInfo.gamountList[0].amount}</th>
            <th class="px-0">${tgqInfo.gamountList[1].amount}</th>
            <th class="px-0">${tgqInfo.gamountList[2].amount}</th>
            <th class="px-0">${tgqInfo.gamountList[3].amount}</th>
          </tr>
        </body>
      `;

      self.dispalyTgqInfo("退改信息", tgqDetail);
    },
    showLuggageInfo: function (luggageInfos) {
      console.log(luggageInfos);
      let htmlInfo = `
        <table class="table table-response table-sm small">
                          <tr>
                            <td></td>
                            <td>标题</td>
                            <td>免费限制</td>
                            <td>体积限制</td>
                            <td>重量限制</td>
                          </tr>
                          `;
      // console.log(htmlInfo);
      for (let info of luggageInfos) {
        let strLuggageType = "托运";
        if (info.luggageType === 1) {
          strLuggageType = "非托运";
        }
        htmlInfo += `
                    <tr>
                            <td>
                              ${strLuggageType}
                            </td>
                            <td>${info.title}</td>
                            <td>${info.freeLimit}</td>
                            <td>${info.volumeLimit}</td>
                            <td>${info.weightLimit}</td>
                          </tr>
                  `;
      }
      // console.log(htmlInfo);

      htmlInfo += `
      </table>
      `;
      console.log(htmlInfo);
      this.dispalyTgqInfo("行李信息", htmlInfo);
    },
    dispalyTgqInfo: function (title, tgqDetail) {
      var modal = $("#tgqModal");
      modal.find(".modal-title").text(title);
      modal.find(".modal-body").html(tgqDetail);
      modal.modal("show");
    },
    changeDdate: function (x) {
      let newDate = addDate(this.ddate, x);
      this.ddate = newDate;

      this.$store.commit("setDdate", newDate);
      this.search();
    },
    showCabinClass: function (cabinClass, offset) {
      return getCabinClassDesc(cabinClass, offset);
    },
    showFlightDetail: function (fltInfo) {
      // 显示某一航班详情
      if (this.detailFlightId === fltInfo.flightNo) this.detailFlightId = "";
      else this.detailFlightId = fltInfo.flightNo;
    },
    closeDetail: function () {
      this.detailShowing = false;
      this.listShowing = true;
    },
    returnSearchForm: function () {
      this.showSearchForm = true;
    },
  },
};
</script>
