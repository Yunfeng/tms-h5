<template>
  <div>
    <div class="form-group row mb-1">
        <label class="control-label col-3 text-right">
            企业*    
        </label>
        <div class="col-9">
            <my-select-customer :minId="0" :status="1" :customerId.sync="localCustomerId"></my-select-customer>
        </div>
    </div>
    <div class="form-group row  mb-1" v-if="costCenters.length > 0">
      <label class="col-3 control-label text-right">成本中心</label>
      <div class="col-9">
        <select class="form-control" v-model="localCostCenter">
          <option value="">请选择</option>
          <option :value="info.name" :key="info.id" v-for="info in costCenters">{{info.name}}</option>
        </select>
      </div>
    </div>
    <div class="form-group row  mb-1" v-if="projectNames.length > 0">
      <label class="col-3 control-label text-right">项目名称</label>
      <div class="col-9">
        <select class="form-control" v-model="localProjectName">
          <option value="">请选择</option>
          <option :value="info.name" :key="info.id" v-for="info in projectNames">{{info.name}}</option>
        </select>
      </div>
    </div>    
  </div> 
</template>

<script>
  import MySelectCustomer from './my-select2-customer.vue'

  import { searchNotesByCustomer } from '../api/customer.js'

  export default {
    props: {
      customerId: 0,
      costCenter: '',
      projectName: ''
    },    
    components: {
      MySelectCustomer
    },
    data () {
      return {
        costCenters: [],
        projectNames: [],

        localCostCenter: '',
        localProjectName: '',
        localCustomerId: 0
      }
    },
    watch: {
      customerId: function (newVal) {
        this.localCustomerId = newVal
        this.getCostCenters()
      },
      costCenter: function (newVal) {
        console.log(newVal)
        this.localCostCenter = newVal
      },
      projectName: function (newVal) {
        console.log(newVal)
        this.localProjectName = newVal
      },
      localCustomerId: function (newVal) {
        this.$emit('update:customerId', newVal)        
      },
      localCostCenter: function (newVal) {
        console.log(newVal)
        this.$emit('update:costCenter', newVal)
      },
      localProjectName: function (newVal) {
        console.log(newVal)
        this.$emit('update:projectName', newVal)
      }
    },
    methods: {
      getCostCenters: function () {
        this.localCostCenter = ''
        this.localProjectName = ''
        this.costCenters.splice(0)
        this.projectNames.splice(0)
        if (this.customerId < 1) return

        searchNotesByCustomer(this.customerId, (jsonResult) => {
          for (const info of jsonResult) {
            if (info.noteType === 100) {
              this.costCenters.push(info)
            } else if (info.noteType === 200) {
              this.projectNames.push(info)
            }
          }
        })
      },
    }
  }

</script>