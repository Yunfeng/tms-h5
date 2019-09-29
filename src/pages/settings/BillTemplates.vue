<template>
  <div id="pat-codes">
    <div class="card">
      <div class="card-header">
        模板
      </div>
      <div class="card-body bg-info text-white py-0">
        已有
      </div>        
            <table class="table">
              <tr>
                <td>模板编号</td>
                <td>模板名称</td>
                <td>创建时间</td>
                <td></td>
              </tr>
              <tr v-for="info in templates">
                <td>{{info.templateNo}}</td>
                <td>{{info.name}}</td>
                <td>{{info.createTime}}</td>
                <td>
                  <button type="button" class="btn btn-sm btn-danger" @click.stop="deleteTemplate(info.id)">删除</button>
                </td>
              </tr>
            </table>
      <div class="card-body bg-info text-white py-0">
        新建
      </div>        
      <div class="card-body">
          <div class="tab-pane fade show active" id="new" role="tabpanel" aria-labelledby="profile-tab">
            <div class="card">
              <div class="card-body">
                      <div class="d-flex border-1">
                        通用：
                        <template v-for="info in dataFields">
                          <span class="text-info ml-2" v-if="info.dataType === 0" @click.stop="addDataField(info)">{{info.name}}</span>
                        </template>
                      </div>
                      <div class="d-flex">
                        机票：
                        <template v-for="info in dataFields">
                          <span class="text-info ml-2" v-if="info.dataType === 1" @click.stop="addDataField(info)">{{info.name}}</span>
                        </template>
                      </div>
                      <div class="d-flex">
                        酒店：
                        <template v-for="info in dataFields">
                          <span class="text-info ml-2" v-if="info.dataType === 2" @click.stop="addDataField(info)">{{info.name}}</span>
                        </template>
                      </div>
                      <div class="d-flex">
                        火车票:
                        <template v-for="info in dataFields">
                          <span class="text-info ml-2" v-if="info.dataType === 3" @click.stop="addDataField(info)">{{info.name}}</span>
                        </template>
                      </div>
                      <div class="d-flex">
                        服务：
                        <template v-for="info in dataFields">
                          <span class="text-info ml-2" v-if="info.dataType === 4" @click.stop="addDataField(info)">{{info.name}}</span>
                        </template>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="form-row">
                        <label>模板名称：</label>
                        <input type="text" class="form-control" v-model.trim="templateName">
                      </div>
                    </div>
                    <table class="table table-sm table-bordered">
                      <tr>
                        <td><input type="radio" value="1" v-model.number="currentDataType">机票</td>
                        <template v-for="(info, index) in flightFields">
                          <td>{{index+1}}-{{info.name}}</td>
                        </template>
                      </tr>
                      <tr>
                        <td><input type="radio" value="2" v-model.number="currentDataType">酒店</td>
                        <template v-for="(info, index) in hotelFields">
                          <td>{{index+1}}-{{info.name}}</td>
                        </template>
                      </tr>
                      <tr>
                        <td><input type="radio" value="3" v-model.number="currentDataType">火车</td>
                        <template v-for="(info, index) in trainFields">
                          <td>{{index+1}}-{{info.name}}</td>
                        </template>
                      </tr>
                      <tr>
                        <td><input type="radio" value="4" v-model.number="currentDataType">服务</td>
                        <template v-for="(info, index) in vasFields">
                          <td>{{index+1}}-{{info.name}}</td>
                        </template>
                      </tr>
                    </table>
                    <div class="card-footer">
                      <button type="button" class="btn btn-primary" @click.stop="createTemplate()">保存</button>
                    </div>              
            </div>
          </div>
      </div>      
    </div>
         
  </div>  
</template>

<script>
  import { searchDataFields, createDataTemplate, searchDataTemplates, deleteDataTemplates } from '../../api/admin.js'

  export default {
    data () {
      return {
        dataFields: [],

        flightFields: [],
        hotelFields: [],
        trainFields: [],
        vasFields: [],
        templateName: '',

        currentDataType: 1,


        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        },
        templates: []
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
      showErrMsg: function (msg, msgType) {
        this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
      },
      showLoading: function (loadingText) {
        this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
      },
      hideLoading: function () {
        this.$store.commit('showLoading', { 'loading': false })
      },      
      search: function () {
        searchDataFields(v => {
          this.dataFields = v
        })

        this.searchTemplates()

      },
      searchTemplates: function () {
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize
        }

        searchDataTemplates(params, v => {
          this.templates = v.dataList
          // this.sc = v.page
        })
      },
      addDataField: function (info) {
        let dataType = info.dataType
        if (info.dataType === 0) {
          //如果是通用类型，则类型设置为当前行的数据类型
          dataType = this.currentDataType
        } else if (info.dataType !== 0) {
          this.currentDataType = dataType
        } 

        const newField = {
          'dataType': dataType, 
          'id': info.id, 
          'name': info.name
        }
        
        if (this.currentDataType === 1) {
          this.flightFields.push(newField)
        } else if (this.currentDataType === 2) {
          this.hotelFields.push(newField)
        } else if (this.currentDataType === 3) {
          this.trainFields.push(newField)
        } else if (this.currentDataType === 4) {
          this.vasFields.push(newField)
        }
        
      },
      createTemplate: function () {
        const params = {
          'flightFields': this.flightFields,
          'hotelFields': this.hotelFields,
          'trainFields': this.trainFields,
          'vasFields': this.vasFields,
          'name': this.templateName
        }

        const jsonParams = JSON.stringify(params)

        createDataTemplate(jsonParams, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
          } else {
            this.showErrMsg('操作成功')
            this.searchTemplates()
          }
        })
      },
      deleteTemplate: function (id) {
        deleteDataTemplates(id, v => {
          if (v.status !== 'OK') {
            this.showErrMsg(v.errmsg)
          } else {
            this.showErrMsg('操作成功')
            this.searchTemplates()
          }          
        })
      }
    }
  }
</script>