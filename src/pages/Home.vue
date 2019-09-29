<template>
  <div id="home">
    <div>
      <h3>欢迎光临！
        <small>
          <input class="btn btn-success" type="button" value="签到" title="每日签到，获赠积分: 第一天签到赠送10积分，第二天签到赠送20积分，连续签到每天增加10积分; 未连续签到，则重新计分。" id="userCheckin" @click.stop="checkIn()">
        </small>
      </h3>
    </div>
    <div class="card mt-2">
        <div class="card-header bg-faded">
            下载区
        </div>
        <div class="card-body">
            <ul class="list-unstyled">
                <li>1. 携程比价使用说明 <a href="http://www.90sky.com/download/携程比价使用说明1.0.pdf" target="_blank">下载</a></li>
                <li>2. eterm配置放大软件（免费） 进QQ群下载</li>
                <li>3. FD运价下载用说明 <a href="http://www.90sky.com/download/FD运价下载使用说明.pdf" target="_blank">下载</a></li>

            </ul>
        </div>
    </div>
    <div class="card mt-2">
        <div class="card-header">
            产品价格表
        </div>
        <div class="card-body">
            <ul class="list-unstyled">
                <li>
                    脱机打印
                    <ul>
                        <li>免费 或 1000积分/月</li>
                    </ul>
                </li>

            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import { checkIn, searchTmcPolicies } from '../api/user.js'

export default {
  data () {
    return {
      policies: [],
      carrier: 'MU'
    }
  },
  mounted: function () {
    this.searchTmcPolicies()
  },
  methods: {
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    checkIn: function () {
      checkIn(
        (jsonResult) => {
          if (jsonResult.status === '100') {
            this.showErrMsg('签到成功, 得到 ' + jsonResult.desc + ' 个积分。', 'success')
            return
          }

          this.showErrMsg(jsonResult.desc)
        }
      )
    },
    searchTmcPolicies: function () {
      const params = {
        'sc.pageNo': 1,
        'sc.pageSize': 5,
        'sc.carrier': this.carrier,
        'sc.intlPolicy': -1,
        'sc.policyType': -1
      }

      searchTmcPolicies(params,
        (jsonResult) => {
          this.policies = jsonResult.dataList
        }
      )
    },
    getPortDesc: function (port) {
      if (port === '*') {
        return '全国'
      } else if (port.length > 7) {
        return port.substring(0, 7) + '...'
      }
    },
    getPriceDesc: function (minPrice, maxPrice) {
      var priceDesc = ''
      if (minPrice > 0) priceDesc += '>= ' + minPrice
      if (maxPrice > 0) priceDesc += '<= ' + maxPrice
      return priceDesc
    },
    getRemarkDesc: function (remark) {
      if (remark.length > 15) {
        return remark.substring(0, 15) + '...'
      } else {
        return remark
      }
    }
  }
}
</script>
