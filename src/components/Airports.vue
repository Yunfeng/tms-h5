<template>
  <div id="airports">
    <table class="table table-striped table-hover table-sm small">
        <thead>
            <tr>
                <th>三字代码</th>
                <th>城市代码</th>
                <th>城市名</th>
                <th>机场中文名</th>
                <th>机场英文名</th>
                <th>国家代码</th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in airports">
                <td>{{info.threeCode}}</td>
                <td>{{info.cityCode}}</td>
                <td>{{info.cityName}}</td>
                <td>{{info.nameCN}}</td>
                <td>{{info.nameEN}}</td>
            </tr>

        </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    asyncData ({ store, route }) {
      // return the Promise from the action
      console.log('asyncData')
      // return store.commit('getAirports')
    },
    computed: {
      // display the item from store state.
      airports () {
        console.log('computed: airports')
        return this.$store.state.airports
      }
    },
    beforeCreate: function () {
      console.log('beforeCreate')
    },
    created: function () {
      console.log('created')
      console.log(this.airports.length)
    },
    mounted: function () {
      this.$store.dispatch('getAirports')
    }
  }
</script>