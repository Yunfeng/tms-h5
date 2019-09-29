<template>
  <div id="customers">
    <nav aria-label="breadcrumb" role="navigation">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><router-link to='/customers'>客户</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">
          <template v-if="customer.id === 0">
            新建
          </template>
          <template v-else>
            修改
          </template>                      
        </li>
        <span class="ml-auto" @click.stop="back()">返回</span>
      </ol>
    </nav>

    <div class="card">
        <div class="modal-body">
          <form class="form-horizontal">
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    公司名称*
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.vipName" />
                </div>
            </div>
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    公司全称
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.fullName" />
                </div>
            </div>
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    客户编号   
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.customerCode" />
                </div>
            </div>
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    客户类型   
                </label>
                <div class="col-6">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="0" v-model.number="customer.enterpriseType">
                    <label class="form-check-label">散客</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="1" v-model.number="customer.enterpriseType">
                    <label class="form-check-label">企业</label>
                  </div>
                </div>
            </div>  
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    排序拼音   
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.pinyin" />
                  <span class="text-muted small">最多10个字符，用于显示时的排序</span>
                </div>
            </div>
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    服务项目   
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.serviceItem" />
                </div>
            </div>
            
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    销售员   
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.salesStaff" />
                  <small class="form-text text-muted">客户开发人</small>
                </div>
            </div>                    
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    客户维护人  
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.customerMaintainer" />
                </div>
            </div>
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    协议开始日期   
                </label>
                <div class="col-6">
                  <my-date-picker id="beginDate" v-model="customer.agreementBeginDate"></my-date-picker>
                </div>
            </div>
            
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    协议结束日期   
                </label>
                <div class="col-6">
                  <my-date-picker id="endDate" v-model="customer.agreementEndDate"></my-date-picker>
                </div>
            </div>
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    合同负责人    
                </label>
                <div class="col-md-6">
                    <input type="text" class="form-control" v-model="customer.contractLinkman"  />
                </div>
            </div>                    
            <div class="form-group row">
              <label class="control-label col-4 text-right">
                  联系电话    
              </label>
              <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.contractLinkPhone" />
                  <small class="form-text text-muted">合同负责人的联系电话</small>
              </div>
            </div>                    
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    账单联系人  
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.linkman" />
                </div>
            </div>
            
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    联系电话   
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.phone" />
                </div>
            </div>                    
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    电子邮箱   
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.email" />
                </div>
            </div>                    
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    邮寄地址   
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.address" />
                </div>
            </div>   
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    结算方式   
                </label>
                <div class="col-6">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="1" v-model.number="customer.settlementType">
                    <label class="form-check-label">次日</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="2" v-model.number="customer.settlementType">
                    <label class="form-check-label">周结</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="3" v-model.number="customer.settlementType">
                    <label class="form-check-label">月结</label>
                  </div>
                </div>
            </div>                                     
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    结算方式   
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.settlementMode" />
                  <small class="form-text text-muted">（送票POS，月结）</small>
                </div>
            </div>                                     
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    结算周期   
                </label>
                <div class="col-6">
                  <input type="text" class="form-control" v-model="customer.settlementPeriod" />
                </div>
            </div>
            <div class="form-group row">
              <label class="control-label col-4 text-right">
                  出票审核    
              </label>
              <div class="col-6">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" value="0" v-model.number="customer.approvalTicket">
                  <label class="form-check-label">否</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" value="1" v-model.number="customer.approvalTicket">
                  <label class="form-check-label">是</label>
                </div>

                <small class="form-text text-muted">开票之前是否需要事先审批</small>
              </div>
            </div>   
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    审核方式   
                </label>
                <div class="col-8">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="1" v-model.number="customer.approvalType">
                    <label class="form-check-label">电话</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="2" v-model.number="customer.approvalType">
                    <label class="form-check-label">短信</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="3" v-model.number="customer.approvalType">
                    <label class="form-check-label">邮件</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="4" v-model.number="customer.approvalType">
                    <label class="form-check-label">微信</label>
                  </div>

                </div>
            </div>   
            <div class="form-group row">
              <label class="control-label col-4 text-right">
                  审核方式备注    
              </label>
              <div class="col-6">
                <input type="text" class="form-control" v-model="customer.approvalMode" />
                  <small class="form-text text-muted">出票审核方式</small>
              </div>
            </div>    
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    行程单   
                </label>
                <div class="col-8">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="0" v-model.number="customer.itineraryType">
                    <label class="form-check-label">不</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="1" v-model.number="customer.itineraryType">
                    <label class="form-check-label">行程单</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="2" v-model.number="customer.itineraryType">
                    <label class="form-check-label">发票</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="3" v-model.number="customer.itineraryType">
                    <label class="form-check-label">信息单</label>
                  </div>
                </div>
            </div>      
            <div class="form-group row">
                <label class="control-label col-4 text-right">
                    短网址   
                </label>
                <div class="col-8">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="0" v-model.number="customer.shortUrl">
                    <label class="form-check-label text-danger">停用</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="1" v-model.number="customer.shortUrl">
                    <label class="form-check-label text-success">启用</label>
                  </div>
                </div>
            </div>                
            <div class="form-group row" v-if="id > 0">
                <label class="control-label col-4 text-right">
                    状态   
                </label>
                <div class="col-8">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="0" v-model.number="customer.status">
                    <label class="form-check-label text-danger">停用</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="1" v-model.number="customer.status">
                    <label class="form-check-label text-success">启用</label>
                  </div>
                </div>
            </div>                  
            <div class="form-group row">
              <label class="control-label col-4 text-right">
                  备注    
              </label>
              <div class="col-6">
                <input type="text" class="form-control" v-model="customer.remark" />
              </div>
            </div>                    

          </form>
        </div>
        <div class="card-footer text-center">
            <button type="button" class="btn btn-primary" @click.stop="createUser()">保存</button>
        </div>
    </div>
  </div>
</template>

<script>
  import { createCustomer, searchCustomerDetail } from '../api/customer.js'
  import MyDatePicker from '../components/my-datepicker.vue'

  export default {
    components: {
      MyDatePicker
    },
    data () {
      return {
        id: 0,
        customer: {
          id: 0,
          customerCode: '',
          vipName: '',
          fullName: '',
          enterpriseType: 1,
          pinyin: '',
          serviceItem: '',
          agreementBeginDate: '',
          agreementEndDate: '',
          approvalType: 0,
          approvalMode: '',
          approvalTicket: 0,
          contractLinkPhone: '',
          contractLinkman: '',
          customerMaintainer: '',
          email: '',
          fax: '',
          linkman: '',
          address: '',
          mobile: '',
          phone: '',
          postCode: '',
          remark: '',
          salesStaff: '',
          settlementType: 0,
          settlementMode: '',
          settlementPeriod: '',
          itineraryType: 0,
          shortUrl: 0,
          status: 1
        }
      }
    },
    mounted: function () {
      let oldId = this.$route.query.id

      if (oldId !== undefined) {
        this.id = oldId
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
      showLoading: function (msg) {
        this.$store.dispatch('showLoading', { 'loadingText': msg })
      },
      hideLoading: function () {
        this.$store.dispatch('hideLoading')
      },
      search: function () {
        searchCustomerDetail(this.id,
          (jsonResult) => {
            this.customer = jsonResult
          }
        )
      },
      createUser: function () {
        if (this.customer.vipName === '') {
          this.showErrMsg('请填写企业名称')
          return
        }

        var jsonParams = JSON.stringify(this.customer)

        this.showLoading('处理中...')
        createCustomer(jsonParams,
          (v) => {
            // console.log(v)
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
              // window.alert(jsonResult.errmsg)
            } else {
              this.showErrMsg('保存成功')
              this.$router.push("/customer/" + v.returnCode)
            }
          },
          () => { this.hideLoading() },
          er => { this.showErrMsg('错误：' + er.status, 'danger') }
        )
      }
    }
  }
</script>