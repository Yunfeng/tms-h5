<template>
  <div id="passenger-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/passengers'>企业员工列表</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">详情</li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>

    <template v-if="psgInfo !== null">
      
     
      <div class="card">
        <div class="card-header">
          基础信息
        </div>
        <table class="table table-striped table-sm small">
          <tr>
            <td class="text-right text-info col-4">中文名</td>
            <td>{{psgInfo.nameCn}}</td>
          </tr>
          <tr>
            <td class="text-right text-info">英文名</td>
            <td>{{psgInfo.nameEn}}</td>
          </tr>
          <tr>
            <td class="text-right text-info">性别</td>
            <td>{{getGenderDesc(psgInfo.gender)}}</td>
          </tr>        
          
          <tr>
            <td class="text-right text-info">手机</td>
            <td>{{psgInfo.mobile}}
            </td>
          </tr>
          <tr>
            <td class="text-right text-info">电话</td>
            <td>{{psgInfo.phone}}</td>
          </tr>
          <tr>
            <td class="text-right text-info">电子邮件</td>
            <td>{{psgInfo.email}}</td>
          </tr>
          <tr>
            <td class="text-right text-info">生日</td>
            <td>{{psgInfo.birthday}}</td>
          </tr>
                                    
        </table>
      </div>

      <div class="card">
        <div class="card-header">
          证件信息
        </div>
        <div class="card-body" v-for="(info, index) in psgInfo.idInfos">    
              <div class="form-group row">
                <label class="control-label col-4 text-right">
                    证件类型    
                </label>
                <div class="col-6">
                  <select class="form-control input-group-addon" v-model.number="info.idType" disabled>
                    <option value="1">身份证</option>
                    <option value="2">护照</option>
                    <option value="4">港澳通行证</option>
                    <option value="8">台胞证</option>  
                  </select>
                </div>
              </div>                    
              <div class="form-group row">
                <label class="control-label col-4 text-right">
                    证件号    
                </label>
                <div class="col-6">
                  {{info.idNo}}
                </div>
              </div>                    
                               
              <div class="form-group row" v-if="info.idType !== 1">
                <label class="control-label col-4 text-right">
                    签发国家/地区    
                </label>
                <div class="col-6">
                  {{info.idIssueNation}}
                </div>
              </div>  
              <div class="form-group row" v-if="info.idType !== 1">
                <label class="control-label col-4 text-right">
                    有效期    
                </label>
                <div class="col-6">
                  {{info.idValidDate}}
                </div>
              </div>                     
          </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          其它信息
        </div>
        <table class="table table-striped table-sm small">
          <tr>
            <td class="text-right text-info col-4">常旅客卡号</td>
            <td>{{psgInfo.ffpNo}}</td>
          </tr>
          <tr>
            <td class="text-right text-info">飞机等级</td>
            <td>{{psgInfo.flightLevel}}</td>
          </tr>
          <tr>
            <td class="text-right text-info">火车等级</td>
            <td>{{psgInfo.trainLevel}}</td>
          </tr>
          <tr>
            <td class="text-right text-info">喜好</td>
            <td>{{psgInfo.hobby}}</td>
          </tr>                
          <tr>
            <td class="text-right text-info">备注</td>
            <td>{{psgInfo.remark}}</td>
          </tr>                                        
        </table>
      </div>

    </template>
  </div>
</template>

<script>
  import { searchPassengerById } from '../api/user.js'

  export default {
    data () {
      return {
        id: 0,

        psgInfo: null
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin }
    },
    mounted: function () {
      this.id = parseInt(this.$route.params.id)
      console.log(this.id)
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
        searchPassengerById(this.id, v => {
          this.psgInfo = v
        })
      },
      getGenderDesc: function (val) {
        if (val === 1) {
          return '男'
        } else if (val === 2) {
          return '女'
        } else {
          return ''
        }
      }
    }
  }
</script>