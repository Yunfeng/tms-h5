import { checkLoginStatus, searchPrivileges } from '../api/user.js'
import { authWorkWeixinUser } from '../api/workweixin.js'
import { getWxsOpenid } from '../api/wx.js'
import { searchCustomers } from '../api/customer.js'

export const actions = {
  init(context, cb) {
    // 仅初始化一次
    if (context.state.initialized) return
    context.state.initialized = true

    checkLoginStatus((jsonResult) => {
      // console.log(jsonResult)
      if (jsonResult.status === 'OK') {
        // 初始化，读取cookie中的数据
        context.commit('readCookies')
        cb(false)

        const u = {
          'username': jsonResult.username,
          'logined': true,
          'fullname': jsonResult.fullname,
          'token': jsonResult.token,
          'enterpriseId': jsonResult.enterpriseId,
          'userId': jsonResult.userId,
          'sid': jsonResult.sid,
          'redmineUrl': jsonResult.redmineUrl
        }
        context.dispatch('setLoginInfo', u)

        context.dispatch('searchPrivileges')
      } else {
        context.commit('logout')
        // context.dispatch('showAlertMsg', {errMsg: '您需要重新登录!'})
        cb(true)
      }
    })
  },
  setLoginInfo(context, payload) {
    context.commit('setUsername', payload)
    context.dispatch('searchPrivileges')
  },
  showAlertMsg(context, payload) {
    if (payload.errMsgType === undefined) {
      context.state.errMsgType = 'warning'
    } else {
      context.state.errMsgType = payload.errMsgType
    }

    context.state.errMsg = payload.errMsg
    context.state.errAlert = true

    var timeout = payload.timeout
    if (timeout === undefined || timeout === null) {
      if (payload.errMsgType === 'danger') {
        timeout = 5000
      } else {
        timeout = 2500
      }
    }

    setTimeout(() => { context.state.errAlert = false }, timeout)
  },
  showLoading(context, payload) {
    context.state.loading = true
    if (payload === undefined || payload.loadingText === undefined) {
      context.state.loadingText = '数据加载中...'
    } else {
      context.state.loadingText = payload.loadingText
    }
  },
  hideLoading(context) {
    context.state.loading = false
  },
  searchPrivileges(context) {
    searchPrivileges((privileges) => {
      // console.log(privileges)
      for (let info of privileges) {
        context.commit('addPrivilege', info)
      }
    })
  },
  getWxsOpenId(context, payload) {
    //获取微信服务号用户的openid
    return new Promise((resolve, reject) => {
      const params = {
        'code': payload.code,
        'state': payload.state
      }

      getWxsOpenid(params, v => {
        context.dispatch('setWxsOpenId', v)
        resolve()
      })
    })
  },
  setWxsOpenId(context, payload) {
    context.state.wxInfo.openid = payload.openid
    $.cookie('userid', payload.userid, { expires: 30, path: '/' })
  },
  getWorkWxUserId(context, payload) {
    return new Promise((resolve, reject) => {
      const params = {
        'code': payload.code,
        'state': payload.state
      }
      authWorkWeixinUser(params, v => {
        context.dispatch('setWorkWxUserid', v)
        resolve()
      })
    })
  },
  setWorkWxUserid(context, payload) {
    context.state.wxInfo.userid = payload.userid
    $.cookie('userid', payload.userid, { expires: 30, path: '/' })
  },
  addFlight(context, payload) {
    context.state.order.flights.push(payload);
    if (context.state.order.psgs.length === 0) {
      context.dispatch('addPsg')
    }
  },
  addPsg(context, p) {
    if (p === undefined || p === null) {
      p = {
        'index': 0,
        'selected': true,
        'name': '',
        'idNo': '',
        'idType': 1,
        'psgType': 0,
        'mobile': '',
        'ffpNo': ''
      };
    }


    if (p.name.trim().length > 0) {
      //检查下是否有空位可以更新
      let index = 0
      for (const info of context.state.order.psgs) {
        if (info.name.trim().length === 0) {
          p.index = index
          context.commit('updatePsg', p)
          return
        }

        index = index + 1
      }
    }

    context.state.order.psgs.push(p);
  },
  deletePsg(context, index) {
    context.state.order.psgs.splice(index, 1);
    if (context.state.order.psgs.length === 0) {
      context.dispatch('addPsg');
    }
  },
  searchCustomer(context) {
    const params = {
      'sc.pageNo': 1,
      'sc.pageSize': 10000
      // 'sc.status': this.status,
      // 'sc.enterpriseType': this.enterpriseType
    }

    searchCustomers(params, (jsonResult) => {
      this.customers = jsonResult.dataList
      context.commit('setCustomers', jsonResult.dataList)
    })
  }
}
