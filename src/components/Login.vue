<template>
  <div id="login" class="row">

      <div class="card col-12 no-gutters">
        <div class="card-header text-center text-success">
            登录
        </div>
        <div class="card-block no-gutters pb-0">
          <div class="form-group">
              <input class="form-control" type="text" placeholder="用户名" v-model="username">
          </div>
          <div class="form-group">
              <input class="form-control" type="password" placeholder="密码" v-model="password">
          </div>
        </div>
        <div class="card-block text-center bg-faded text-white">
          <button class="btn btn-success btn-block" @click.stop="login()">登录</button> 
        </div>
        <div class="card-block">
          <span><small><a href="#/password">找回密码</a></small></span>
          <span class="float-right"><small><a href="#/register">这里注册</a></small></span>
        </div>
      </div>

  </div>
</template>

<script>

export default {
  data () {
    return {
      username: '',
      password: '',
      vcode: '',
      errMsg: '',
      errAlert: false,
      justLogout: false
    }
  }
}
</script>
