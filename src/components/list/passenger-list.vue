<template>
  <table class="table table-striped table-hover table-sm small" id="passengerList">
        <thead>
            <tr>
                <th>英文名</th>
                <th>中文名</th>
                <th>VIP</th>
                <th>性别</th>
                <th>生日</th>
                <th>国籍</th>
                <th>证件</th>
                
                
                <th>喜好</th>
                <th>备注</th>
                <th>公司</th>
                <th>创建时间</th>
                <th>修改时间</th>
                <th></th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList">
                <td>{{info.nameEn}}</td>
                <td>{{info.nameCn}}</td>
                <td>
                  <span class="text-danger" v-if="info.vipLevel > 0">VIP-{{info.vipLevel}}</span>                  
                </td>
                <td>{{getGenderDesc(info.gender)}}</td>
                <td>{{info.birthday}}</td>
                <td>{{info.nationality}}</td>
                <td>
                  <template v-for="(idInfo, index) in info.idInfos">
                    <template v-if="index > 0"><br /></template>
                    <span>{{showIdTypeDesc(idInfo.idType)}}: {{idInfo.idNo}}</span>
                  </template>
                </td>
                
                
                <td>{{info.hobby}}</td>
                <td>{{info.remark}}</td>
                <td>
                  <template v-if="info.customer !== null">
                    {{info.customer.vipName}}
                  </template>                  
                </td>
                <td>{{info.createTime}}</td>
                <td>{{info.lastUpdate}}</td>
                <td>
                  <router-link :to="`/passenger?id=` + info.id">修改</router-link>
                </td>
                <td>
                  <router-link :to="`/passenger/` + info.id">详情</router-link>
                </td>
            </tr>

        </tbody>
  </table>
</template>

<script>
  import { showIdTypeDesc } from '../../common/common.js'
  export default {
    props: {
      dataList: {
        type: Array
      }
    },
    methods: {
      getGenderDesc: function (val) {
        if (val === 1) {
          return '男'
        } else if (val === 2) {
          return '女'
        } else {
          return ''
        }
      },
      showIdTypeDesc: function (idType) {
        return showIdTypeDesc(idType)
      },
    }
  }
</script>