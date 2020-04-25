<template>
  <div id="passenger-detail">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/passengers'>企业员工列表</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">
          <template v-if="id === 0">
            增加  
          </template>
          <template v-else>
            修改
          </template>
        </li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>

    <div class="card bg-white">
      <div class="card-body">
        <div class="card">
          <div class="card-header">
            基本信息
          </div>
          <div class="card-body">
              <input type="hidden" v-model.number="id" />
              
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    部门    
                </label>
                <div class="col-9">
                  <select class="form-control" v-model.number="departmentId">
                    <option value="0">请选择部门</option>
                    <template v-for="info in departments">
                      <option :value="info.id">{{info.name}}</option>
                    </template>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                  <label class="control-label col-3 text-right">
                      中文名    
                  </label>
                  <div class="col-md-6">
                      <input type="text" class="form-control" v-model="nameCn"  />
                  </div>
              </div>
              <div class="form-group row">
                  <label class="control-label col-3 text-right">
                      英文名    
                  </label>
                  <div class="col-md-6">
                      <input type="text" class="form-control" v-model="nameEn"  />
                      <small class="form-text text-muted">一般指护照上的英文名</small>
                  </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    性别    
                </label>
                <div class="col-9">
                  <select class="form-control" v-model.number="gender">
                    <option value="1">男</option>
                    <option value="2">女</option>                          
                  </select>
                </div>
              </div>                                        
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    手机    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="mobile" />
                    <small class="form-text text-muted">手机号</small>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    电话    
                </label>
                <div class="col-9">
                    <input type="text" class="form-control" v-model="phone" />
                    <small class="form-text text-muted">联系电话</small>
                </div>
              </div>                    
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    电子邮件    
                </label>
                <div class="col-9">
                  <input type="text" class="form-control" v-model="email" />
                  <small class="form-text text-muted"></small>
                </div>
              </div>   
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    生日    
                </label>
                <div class="col-9">
                    <my-date-picker id="birthday" v-model="birthday"></my-date-picker>
                    <small class="form-text text-muted">格式：yyyy-MM-dd 示例：2017-12-01</small>
                </div>
              </div>                    
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    国家/地区    
                </label>
                <div class="col-9">
                  <input type="text" class="form-control" v-model="nationality" />
                    <small class="form-text text-muted"></small>
                </div>
              </div>                    
                              

          </div>
        </div>
        <div class="card">
          <div class="card-header">
            证件信息
            <a href="javascript:void(0);" @click.stop="addIdInfo()" class="float-right">增加证件</a>
          </div>
          <div class="card-body" v-for="(info, index) in idInfos">    
          <!-- this.idInfos.push({ 'idType': 1, 'idNo': '', 'idIssueNation': '', 'idValidDate': '' })         -->
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    证件类型    
                </label>
                <div class="col-6">
                  <select class="form-control input-group-addon" v-model.number="info.idType">
                    <option value="1">身份证</option>
                    <option value="2">护照</option>
                    <option value="4">港澳通行证</option>
                    <option value="8">台胞证</option>  
                  </select>
                </div>
                <div class="col-3">
                  <a href="javascript:void(0)" @click.stop="deleteIdInfo(index)"  class="btn btn-sm btn-danger float-right">删除</a>
                </div>
              </div>                    
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    证件号    
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="info.idNo" />
                </div>
              </div>                    
                               
              <div class="form-group row" v-if="info.idType !== 1">
                <label class="control-label col-3 text-right">
                    签发国家/地区    
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="info.idIssueNation" />
                </div>
              </div>  
              <div class="form-group row" v-if="info.idType !== 1">
                <label class="control-label col-3 text-right">
                    有效期    
                </label>
                <div class="col-6">
                  <my-date-picker :id="`idValidDate` + index" v-model="info.idValidDate"></my-date-picker>
                </div>
              </div>                     
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            其它信息
          </div>
          <div class="card-body">
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    VIP级别    
                </label>
                <div class="col-9">
                  <select class="form-control input-group-addon" v-model.number="vipLevel">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>

                  </select>  
                </div>
              </div>                    
                              
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    常旅客卡号    
                </label>
                <div class="col-9">
                  <input type="text" class="form-control" v-model="ffpNo" />
                    <small class="form-text text-muted">航司代码+卡号，多个航司用逗号分隔</small>
                </div>
              </div>                    
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    飞机等级    
                </label>
                <div class="col-9">
                  <input type="text" class="form-control" v-model="flightLevel" />
                    <small class="form-text text-muted"></small>
                </div>
              </div>  
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    火车等级    
                </label>
                <div class="col-9">
                  <input type="text" class="form-control" v-model="trainLevel" />
                    <small class="form-text text-muted"></small>
                </div>
              </div>  
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    喜好    
                </label>
                <div class="col-9">
                  <input type="text" class="form-control" v-model="hobby" />
                    <small class="form-text text-muted"></small>
                </div>
              </div>  
              <div class="form-group row">
                <label class="control-label col-3 text-right">
                    备注    
                </label>
                <div class="col-9">
                  <input type="text" class="form-control" v-model="remark" />
                    <small class="form-text text-muted"></small>
                </div>
              </div>                    

          </div>
        </div>
      </div>
      <div class="card-footer text-center">
        <button type="button" class="btn btn-warning btn-sm" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-primary btn-lg ml-5" v-on:click="savePsg()">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { searchPassengerById, createPsg } from '../api/user.js'
  import { searchDepartmentsByCustomerId, searchCustomers } from '../api/customer.js'
  import $ from 'jquery'
  import MyPagination from '../components/my-pagination.vue'
  import MyDatePicker from '../components/my-datepicker.vue'

  export default {
    components: {
      MyPagination,
      MyDatePicker,
      MySelectCustomer
    },
    data () {
      return {
        id: 0,
        customerId: 0,
        departmentId: 0,
        nameCn: '',
        nameEn: '',
        mobile: '',
        phone: '',
        email: '',
        birthday: '',
        idNo: '',
        passportNo: '',
        passportExpiry: null,
        nationality: '',
        gender: -1,
        flightLevel: '',
        trainLevel: '',
        hobby: '',
        ffpNo: '',
        remark: '',
        vipLevel: 0,

        idInfos: [],
        ffpNos: [],

        dataList: [],
        customers: [],
        departments: [],

        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 20,
          pageTotal: 0
        },
        searchName: '',

        psgInfo: null
      }
    },
    computed: {
      isAdmin () { return this.$store.getters.isAdmin }
    },
    watch: {
      customerId: function (newVal) {
        this.searchDepartmentsByCustomerId()
      }
    },
    mounted: function () {
      this.resetPsg()

      // console.log(this.$route)
      this.id = parseInt(this.$route.params.id)
      // console.log(this.id)
      if (isNaN(this.id)) {
        this.id = parseInt(this.$route.query.id)
        if (isNaN(this.id)) {
          this.id = 0
        }
      }
      if (this.id > 0) {
        this.search()  
      }      
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
          this.editPsg()
        })
      },
      addIdInfo: function () {
        this.idInfos.push({
          'id': 0,
          'idType': 1,
          'idNo': '',
          'idIssueNation': '',
          'idValidDate': ''
        })
      },
      deleteIdInfo: function (idx) {
        this.idInfos.splice(idx, 1)
      },
      resetPsg: function () {
        this.id = 0
        this.customerId = 0
        this.departmentId = 0
        this.nameCn = ''
        this.nameEn = ''
        this.mobile = ''
        this.phone = ''
        this.email = ''
        this.birthday = ''
        this.idNo = ''
        this.passportNo = ''
        this.passportExpiry = ''
        this.enationality = ''
        this.gender = ''
        this.flightLevel = ''
        this.trainLevel = ''
        this.hobby = ''
        this.ffpNo = ''
        this.remark = ''
        this.vipLevel = 0

        this.idInfos.splice(0)
        this.ffpNos.splice(0)
      },
      savePsg: function () {
        const params = {
          'id': this.id,
          'customer': {
            'id': this.customerId
          },
          'department': {
            'id': this.departmentId
          },
          'nameCn': this.nameCn,
          'nameEn': this.nameEn,
          'mobile': this.mobile,
          'phone': this.phone,
          'email': this.email,
          'birthday': this.birthday,
          'idNo': this.idNo,
          'passportNo': this.passportNo,
          'passportExpiry': this.passportExpiry,
          'nationality': this.nationality,
          'gender': this.gender,
          'flightLevel': this.flightLevel,
          'trainLevel': this.trainLevel,
          'hobby': this.hobby,
          'ffpNo': this.ffpNo,
          'remark': this.remark,
          'vipLevel': this.vipLevel,
          'idInfos': this.idInfos,
          'ffpNos': this.ffpNos
        }

        const jsonParam = JSON.stringify(params)

        createPsg(jsonParam, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
          } else {
            this.showErrMsg('保存成功')
            this.back()
          }
        })
      },
      editPsg: function () {
        const info = this.psgInfo

        this.id = info.id
        this.customerId = 0
        if (info.customer !== null) this.customerId = info.customer.id
        this.departmentId = 0
        if (info.department !== null) this.departmentId = info.department.id

        this.nameCn = info.nameCn
        this.nameEn = info.nameEn
        this.mobile = info.mobile
        this.phone = info.phone
        this.email = info.email
        this.birthday = info.birthday
        this.idNo = info.idNo
        this.passportNo = info.passportNo
        this.passportExpiry = info.passportExpiry
        this.enationalitymail = info.nationality
        this.gender = info.gender
        this.flightLevel = info.flightLevel
        this.trainLevel = info.trainLevel
        this.hobby = info.hobby
        this.nationality = info.nationality
        this.ffpNo = info.ffpNo
        this.vipLevel = info.vipLevel

        this.remark = info.remark

        this.idInfos = info.idInfos
        this.ffpNos = info.ffpNos
        

        this.searchCustomers()
      },
      searchCustomers: function () {
        if (this.customers.length === 0) {
          searchCustomers(null, (jsonResult) => {
            this.customers = jsonResult.dataList
          })
        }
      },
      searchDepartmentsByCustomerId: function () {
        searchDepartmentsByCustomerId(this.customerId, (jsonResult) => {
          this.departments = jsonResult.dataList
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