<template>
  <div id="app" class="wrapper">
    <div class="content-page">
      <div class="content">

        <!-- Topbar Start -->
        <div class="navbar-custom topnav-navbar" v-if="logined">
            <div class="container-fluid">

              <!-- LOGO -->
              <a href="/" class="topnav-logo">
                  <span class="topnav-logo-lg">
                      <img src="/public/images/logo-dark.png" alt="TMS" height="16">
                      <!-- <img alt="TMS" height="16"> -->
                  </span>
                  <span class="topnav-logo-sm">
                      <img src="/public/images/logo_sm.png" alt="TMS" height="16">
                      <!-- <img alt="TMS" height="16"> -->
                  </span>
              </a>

              <ul class="list-unstyled topbar-right-menu float-right mb-0"  v-if="logined">
                  <li class="dropdown notification-list">
                      <a class="nav-link dropdown-toggle nav-user arrow-none mr-0" data-toggle="dropdown" href="#" role="button" aria-haspopup="false"
                          aria-expanded="false">
                          <span class="account-user-avatar"> 
                              <img src="/public/images/users/avatar-100.jpg" alt="user-image" class="rounded-circle">
                          </span>
                          <span>
                            <span class="account-user-name">{{username}}</span>
                          </span>
                      </a>
                      <div class="dropdown-menu dropdown-menu-right dropdown-menu-animated profile-dropdown ">
                          <!-- item-->
                          <div class=" dropdown-header noti-title">
                              <h6 class="text-overflow m-0">欢迎 !</h6>
                          </div>

                          <!-- item-->
                          <router-link to="/my/worktime" class="dropdown-item notify-item">
                            <i class="mdi mdi-account-settings-variant"></i>
                              <span>设置</span>
                          </router-link>

                          <!-- item-->
                          <router-link to="/my/histories" class="dropdown-item notify-item">
                            <i class="mdi mdi-lifebuoy"></i>
                              <span>操作记录</span>
                          </router-link>

                          <!-- item-->
                          <router-link to="/my/password" class="dropdown-item notify-item">
                            <i class="mdi mdi-lock-outline"></i>
                              <span>修改密码</span>
                          </router-link>

                          <!-- item-->
                          <router-link to="/logout" class="dropdown-item notify-item">
                            <i class="mdi mdi-logout"></i>
                              <span>退出</span>
                          </router-link>

                      </div>
                  </li>

              </ul>

            </div>
        </div>
        <!-- end Topbar -->

        <div class="topnav"  v-if="logined">
            <div class="container-fluid">
                <my-top-bar></my-top-bar>              
            </div>
        </div>


        <my-loading></my-loading>
        <top-tips></top-tips>
        <!-- <my-top-bar v-if="workMode !== 'h5' "></my-top-bar> -->


        <div class="px-2">
          <transition name="fade">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
          </transition>
          <transition  name="fade" mode="out-in" :duration="{ enter: 50, leave: 300 }">
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </transition>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import TopTips from './components/my-top-tips.vue'	
  import MyLoading from './components/my-loading.vue'
  import MyTopBar from './components/my-top-bar.vue'

  export default {
    components: {
      TopTips,
      MyLoading,
      MyTopBar
    },
    computed: {
      workMode ()  { return this.$store.state.workMode },
      logined () { return this.$store.state.logined },
      username () { return this.$store.state.username }
    },
    mounted: function () {
      // console.log('mounted: ' + this.logined)
      if (!this.logined) {
        this.$store.dispatch('init', () => {})
      }
    }
  }
</script>