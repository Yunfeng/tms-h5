<template>
	<tr>
    <td>
      <input type="text" class="form-control text-center px-0" v-model.trim="flight.dport" :class="{'form-control-sm': isMini}" :size="portInputSize" placeholder="SHA" />
    </td>
    <td>
      <input type="text" class="form-control text-center px-0" v-model.trim="flight.aport" :class="{'form-control-sm': isMini}" :size="portInputSize" placeholder="PEK" />
    </td>
    <td style="min-width: 100px;">
      <my-date-picker :id="`fltDate` + index" v-model="flight.ddate" placeholder="日期" :sizing="sizing"></my-date-picker>
    </td>
	  <td>
      <input type="text" class="form-control text-center px-0" v-model.trim="flight.flightNo" :class="{'form-control-sm': isMini}" :size="dateInputSize" placeholder="CA999" />
    </td>
	  <td>
      <input type="text" class="form-control text-center px-0" v-model.trim="flight.subclass" :class="{'form-control-sm': isMini}" :size="timeInputSize" placeholder="F" />
    </td>
	  <td>
      <input type="text" class="form-control text-center px-0" v-model.trim="flight.dtime" :class="{'form-control-sm': isMini}"  :size="termInputSize" placeholder="0905" />
    </td>
	  <td>
      <input type="text" class="form-control text-center px-0" v-model.trim="flight.atime" :class="{'form-control-sm': isMini}"  :size="termInputSize" placeholder="1535" />
      <span class="small text-info" v-if="flight.arrivalDate !== flight.departureDate">
        {{flight.arrivalDate}}  
      </span>
    </td>
    <td>
      <input type="text" class="form-control text-center px-0" v-model.trim="flight.dterm" :class="{'form-control-sm': isMini}"  :size="termInputSize" placeholder="T2" />
    </td>
    <td>
        <input type="text" class="form-control text-center px-0" v-model.trim="flight.aterm" :class="{'form-control-sm': isMini}" :size="termInputSize" placeholder="T3" />
    </td>
    <td>
	    <a href="javascript:void(0)" @click.stop="remove(index)"  class="btn btn-sm btn-danger">删除</a>
	  </td>    
	</tr>          
</template>

<script>
  import MyDatePicker from '../components/my-datepicker.vue'

  export default {
    components: {
      MyDatePicker
    },
    props: {
      index: Number,
      flight: Object,
      mini: {
        type: Boolean,
        default: false
      },
      readOnly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isMini() { return this.mini === true },
      timeInputSize() {return this.mini ? 4 : 0},
      termInputSize() {return this.mini ? 4 : 0},
      portInputSize() {return this.mini ? 4 : 0},
      dateInputSize() {return this.mini ? 10 : 0},
      sizing() { return this.mini ? 'sm' : '' }
    },
    methods: {
      remove: function (index) {
        this.$emit('remove', index)
      }
    }
  }
</script>