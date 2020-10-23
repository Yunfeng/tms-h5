<template>
  <select class="form-control" v-model.trim="cityCode0" :id="id">
    <template v-for="info in cityList">
      <option :value="info.code" :title="info.code + info.py + info.pys">
        {{ info.name }}
      </option>
    </template>
  </select>
</template>


<script>
import $ from "jquery";
// import { getAllCity } from '../api/hotel.js'
import domCities from "../data/domCities.js";

export default {
  props: {
    id: "",
    cityCode: "",
    cityName: "",
  },
  data() {
    return {
      cityList: [],
      cityCode0: "",
    };
  },
  mounted: function () {
    this.getAllCity();
    this.cityCode0 = this.cityCode;

    const vm = this;
    $(this.$el)
      // init select2
      .select2({
        data: this.cityList,
        placeholder: "请选择城市或机场",
        matcher: this.matchCustomSelect2,
      })
      .val(this.cityCode0)
      .trigger("change")
      // emit event on change.
      .on("change", function () {
        vm.cityCode0 = this.value;
      });
  },
  watch: {
    cityCode: function (value) {
      // update value
      $(this.$el).val(value).trigger("change");
    },
    cityCode0: function (newVal) {
      // console.log('watch supplierId0: ' + newVal)
      this.$emit("update:cityCode", newVal);
      for (let i = 0; i < this.cityList.length; i++) {
        const info = this.cityList[i];
        if (info.code === newVal) {
          this.$emit("update:cityName", info.name);
          break;
        }
      }
    },
  },
  destroyed: function () {
    $(this.$el).off().select2("destroy");
  },
  methods: {
    getAllCity: function () {
      // getAllCity(v => {
      //   this.cityList = v
      //   console.log(this.cityList)
      // })
      this.cityList.splice(0);
      this.$nextTick(function () {
        let index = 0;
        // console.log(domCities.citys)
        for (let i = 0; i < domCities.hotCities.length; i++) {
          const info = domCities.hotCities[i];
          this.cityList.push({
            id: index,
            code: info[0],
            name: info[1],
            py: info[2],
            pys: info[3],
          });
          index++;
          // console.log(index)
        }

        for (let i = 0; i < domCities.citys.length; i++) {
          const info = domCities.citys[i];
          this.cityList.push({
            id: index,
            code: info[0],
            name: info[1],
            py: info[2],
            pys: info[3],
          });
          index++;
          // console.log(index)
        }

        this.cityCode0 = this.cityCode;
      });
    },
    matchCustomSelect2: function (params, data) {
      // If there are no search terms, return all of the data

      // console.log(data)

      if ($.trim(params.term) === "") {
        return data;
      }

      // console.log(params.term)

      // Do not display the item if there is no 'text' property
      if (typeof data.text === "undefined") {
        return null;
      }

      // `params.term` should be the term that is used for searching
      // `data.text` is the text that is displayed for the data object
      if (
        data.text.indexOf(params.term.toUpperCase()) > -1 ||
        data.title.indexOf(params.term.toUpperCase()) > -1
      ) {
        // console.log(data)
        return data;
        // var modifiedData = $.extend({}, data, true);
        // modifiedData.text += ' (matched)';

        // You can return modified objects from here
        // This includes matching the `children` how you want in nested data sets
        // return modifiedData;
      }

      // Return `null` if the term should not be displayed
      return null;
    },
  },
};
</script>
