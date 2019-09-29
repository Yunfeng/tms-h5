<template>
  <div id="login" class="col-12 account-pages mt-5 mb-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5">
          
          <div class="card">

              <!-- Logo -->
              <div class="card-header pt-4 pb-4 text-center bg-primary">
                  <a href="index.html">
                      <span><img src="/public/images/logo.png" alt="" height="18"></span>
                  </a>
              </div>

              <div class="card-body p-4">
                  
                  <div class="text-center w-75 m-auto">
                      <h4 class="text-dark-50 text-center mt-0 font-weight-bold">登录</h4>
                      <p class="text-muted mb-4"></p>
                  </div>

                  <form action="#">

                      <div class="form-group">
                          <label for="emailaddress">用户名</label>
                          <input id="username" class="form-control" type="text" required="" placeholder="请在此处输入用户名" v-model.trim="username">
                      </div>

                      <div class="form-group">
                          <label for="password">密码</label>
                          <input id="password" class="form-control" type="password" placeholder="请在此处输入密码" v-model.trim="password">
                      </div>

                                                  

                      <div class="form-group mb-0 text-center">
                        <button id="btnLogin" type="button" class="btn btn-primary btn-block" :disabled="logining" @click.stop="login()">登录</button>
                      </div>

                  </form>
              </div> <!-- end card-body -->
          </div>
          <!-- end card -->

        </div> <!-- end col -->
      </div>
      <!-- end row -->
    </div>
    <!-- end container -->
  </div>
</template>

<script>
import $ from 'jquery'
import { login } from '../api/user.js'

export default {
  data () {
    return {
      username: '',
      password: '',
      vcode: '',
      errMsg: '',
      errAlert: false,
      justLogout: false,
      logining: false
    }
  },
  computed: {
    workMode () { return this.$store.state.workMode }
  },  
  updated: function () {
    if (this.logined === false && this.justLogout) {
      this.justLogout = false
      this.refreshKaptcha()

      var self = this
      $('#kaptchaImage').click(self.refreshKaptcha)
    }
  },
  mounted: function () {
    this.$store.commit('readCookies')
    $('#kaptchaImage').click(() => { this.refreshKaptcha() })
    this.refreshKaptcha()
  },
  methods: {
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    login: function () {
      this.logining = true
      const params = {
        'username': this.username,
        'password': this.password,
        'captchaValue': this.vcode
      }

      login(params, (jsonResult) => {
        if (jsonResult.status === 'OK') {
          if (jsonResult.expireDate !== undefined && jsonResult.expireDate !== null) {
            if (jsonResult.expireDays < 30 && jsonResult.expireDays >= 0) {
              this.showErrMsg('您的会员有效期到' + jsonResult.expireDate + '截止，请及时续费！', 'danger')
            } else if (jsonResult.expireDays < 0) {
              this.showErrMsg('您的会员已过期！')
            }
          }

          const u = {
            'username': jsonResult.username,
            'logined': true,
            'fullname': jsonResult.fullname,
            'token': jsonResult.token,
            'enterpriseId': jsonResult.enterpriseId,
            'userId': jsonResult.userId,
            'sid': jsonResult.sid
          }
          this.$store.dispatch('setLoginInfo', u)
          if (this.workMode === 'h5') {
            this.$router.push('/h5/flt/orders')
          } else {
            this.$router.push('/home')  
          }
        } else {
          this.showErrMsg(jsonResult.errMsg, 'danger')
          this.refreshKaptcha()
          this.vcode = ''
        }
      }, () => {
        this.logining = false
      })
    },
    refreshKaptcha: function () {
      $('#kaptchaImage').attr('src',
        '/Flight/captcha.do?' + Math.floor(Math.random() * 100)).fadeIn()
    }
  }
}
</script>
