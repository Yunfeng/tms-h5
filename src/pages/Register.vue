<template>
  <div class="account-pages mt-5 mb-5">
      <div class="container" v-if="step === 0">
          <div class="row justify-content-center">
              <div class="col-lg-5">
                  <div class="card">
                      <!-- Logo-->
                      <div class="card-header pt-4 pb-4 text-center bg-primary">
                          <a href="index.html">
                              <span><img src="/public/images/logo.png" alt="" height="18"></span>
                          </a>
                      </div>

                      <div class="card-body p-4">
                          
                          <div class="text-center w-75 m-auto">
                              <h4 class="text-dark-50 text-center mt-0 font-weight-bold">免费注册</h4>
                              <p class="text-muted mb-4">还没有账户? 创建你的账户，只需花不到一分钟的时间</p>
                          </div>

                          <form id="frmRegister">

                              <div class="row mb-2">
                                  <label for="fullname">全名</label>
                                  <input class="form-control" name="user.empname" type="text" placeholder="输入你的姓名" required>
                              </div>

                              <div class="row mb-2">
                                  <label for="emailaddress">电子邮件地址</label>
                                  <input class="form-control" type="email" name="user.email" required placeholder="输入你的电子邮件地址">
                              </div>

                              <div class="row mb-2">
                                  <label for="emailaddress">手机</label>
                                  <input class="form-control" type="text" name="user.mobileNo" required placeholder="输入你的手机号码">
                              </div>

                              <div class="row mb-2">
                                  <label for="emailaddress">用户名</label>
                                  <input class="form-control" type="text" name="user.username" required placeholder="输入登录系统时的用户名">
                              </div>

                              <div class="row mb-2">
                                  <label for="emailaddress">验证码</label>
                                  <div class="row mb-2">
                                    <div class="col-4 pr-0">
                                      <input type="text" id="captchaValue" name="captchaValue" class="form-control" placeholder="验证码" />
                                    </div>
                                    <div class="col-8">
                                        <img id="kaptchaImage" height="100%" width="150" title="点击图片更换验证码">
                                        <small><a href="javascript:void(0)" @click="refreshKaptcha()">刷新</a></small>
                                    </div>
                                  </div>
                              </div>


                              <div class="form-group mb-0 text-center">
                                <button type="button" class="btn btn-primary btn-block" @click.stop="register()">注 册</button>
                              </div>

                          </form>
                      </div> <!-- end card-body -->
                  </div>
                  <!-- end card -->

                  <div class="row mt-3">
                      <div class="col-12 text-center">
                          <p class="text-muted">已经有账户了? <router-link to="/login" class="text-dark ml-1"><b>登录</b></router-link></p>
                      </div> <!-- end col-->
                  </div>
                  <!-- end row -->

              </div> <!-- end col -->
          </div>
          <!-- end row -->
      </div>
      <!-- end container -->


      <div class="col-10 me-auto alert alert-success text-center" v-if="step === 1">
            <h1>注册成功！</h1>
            <span class="text-danger small">用户名和密码将发到您的注册手机上, 请查收!</span>
            <br />
            <br />
            <br />
            <h4><router-link to="/login">去登录</router-link></h4>
      </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { APP_FLIGHT_PATH } from '../common/common.js'
// import {  } from '../api/user.js'

export default {
  data () {
    return {
      step: 0
    }
  },
  mounted: function () {
    $('#kaptchaImage').click(() => { this.refreshKaptcha() })
    this.refreshKaptcha()

  },
  methods: {
    showErrMsg: function (msg) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg })
    },
    refreshKaptcha: function () {
      $('#kaptchaImage').attr('src',
        '/Flight/captcha.do?' + Math.floor(Math.random() * 100)).fadeIn()
    },
    register: function () {
      const self = this
      $.ajax({
        type: 'post',
        url: APP_FLIGHT_PATH + '/register.do',
        data: $('#frmRegister').serialize(),
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.showErrMsg('注册成功')
            self.step = 1
          } else {
            self.showErrMsg(jsonResult.errmsg)
          }
        }
      })
    }
  }
}
</script>
