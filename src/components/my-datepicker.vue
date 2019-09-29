<template>
  <input class="form-control" :id="id" :name="name" type="text" :placeholder="placeholder" :value="value" @input="updateValue($event.target.value)" :class="className" style="min-width: 80px; max-width: 110px">
</template>

<script>
import $ from 'jquery'

export default {
  props: {
    placeholder: '',
    value: '',
    id: '',
    name: '',
    sizing: ''
  },
  computed: {
    className: function () {
      return {
        'form-control-sm': this.sizing === 'sm'
      }
    }
  },
  mounted: function () {
    const self = this
    // console.log('my-datepicker.vue mounted')

    $(this.$el).datepicker({
      dateFormat: 'yy-mm-dd',
      autoSize: true,
      showButtonPanel: false,
      showOtherMonths: false,
      selectOtherMonths: false,
      numberOfMonths: 1,
      showOptions: { direction: 'up' },
      onSelect: function (dateText, inst) {
        self.updateValue(dateText)
      },
      beforeShow: function (input) {
        $(input).css({ position: 'relative', zIndex: '1100' })
      },
      onClose: function () {
        $(this).css({ position: 'relative', zIndex: '0' })
      }
    })
  },
  updated: function () {
    // console.log('my-datepicker.vue updated')
  },
  activated: function () {
    // console.log('my-datepicker.vue activated')
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  }
}
</script>
