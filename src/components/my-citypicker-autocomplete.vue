<template>
    <select class="select2" data-toggle="select2" data-placeholder="请选择 ...">
    </select>
</template>

<script>
  import $ from 'jquery'
  import domCities from '../domCities.js'

  export default {
    props: {
      target: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        searchWord: '',
        cities: domCities.citys,
        hotCities: domCities.hotCities,
        select2Data: [],
        
        cityCode0: ''
      };
    },
    computed: {
      cityCode () {
        return this.$store.getters.getSearchCityCode(this.target)
      }
    },
    watch: {
      cityCode: function (newVal, oldVal) {
        // console.log('cityCode: ' + newVal + ", " + oldVal + ' - ' + this.cityCode0 + ', ' + this.target)

        if (this.cityCode0 !== newVal) {
          $(this.$el).val(newVal).trigger('change.select2')  
        }
      }
    },
    mounted() {
      const self = this

      this.init()

      this.select2Obj = $(this.$el)

      $(this.$el).select2({
        data: self.select2Data,
        matcher: self.matchCustom,
        minimumResultsForSearch: 10
      });  

      $(this.$el).on("select2:select", function (e) {
        // console.log(e)
        if (e.params !== undefined ) {
          const data = e.params.data;
          // console.log(data)
          self.cityCode0 = data.value
          const str = 'set' + self.target
          self.$store.commit(str, { 'cityCode': data.id, 'cityName': data.cityName })          
        }
      })

      // console.log('mounted')
      // $(this.$el).val('KMG').trigger('select2:select')
      $(this.$el).val(this.cityCode).trigger('change.select2')
      // console.log(this.select2Obj)
      // this.select2Obj.val('KWE');
      // this.select2Obj.trigger('change');
    },
    destroyed() {
      $(this.$el).select2('destroy');
    },
    methods: {
      init: function () {
        this.select2Data.splice(0)

        let idx = 0
        for(let info of this.hotCities) {
          idx++
          this.select2Data.push({
            'cityId': idx,
            'cityName': info[1],
            'id': info[0],
            'text': info[1] + ' - ' + info[0],
            'title': info[0] + info[1] + info[2] + info[3]
          })
        }

        idx = 100
        for(let info of this.cities) {
          idx++
          this.select2Data.push({
            'cityId': idx,
            'cityName': info[1],
            'id': info[0],
            'text': info[1] + ' - ' + info[0],
            'title': info[0] + info[1] + info[2] + info[3]
          })
        }
      },
      matchCustom: function (params, data) {
        // If there are no search terms, return all of the data
        if ($.trim(params.term) === '') {
          return data;
        }

        this.searchWord = $.trim(params.term).toUpperCase()

        // Do not display the item if there is no 'text' property
        if (typeof data.text === 'undefined') {
          return null;
        }

        if (data.cityId < 100) return null;

        // `params.term` should be the term that is used for searching
        // `data.text` is the text that is displayed for the data object
        // console.log(data.id)
        if (data.title.indexOf(this.searchWord) > -1) {
          var modifiedData = $.extend({}, data, true);

          // You can return modified objects from here
          // This includes matching the `children` how you want in nested data sets
          return modifiedData;
        }

        // Return `null` if the term should not be displayed
        return null;
      }
    }
  };
</script>