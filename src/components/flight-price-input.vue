<template>
  <div class="card" :id="id">
    <div class="card-header pb-0 text-center">
      {{psgTypeName}}价格
    </div>
    <table class="table table-sm mb-1" >
      <tbody>
        <tr>
          <td>
            票面价
            <input type="text" class="form-control" v-model.lazy.number="price0">
            <span class="text-muted small">不参与计算</span>
          </td>
          <td>
            销售价
            <input type="text" class="form-control" v-model.lazy.number="parValue0">
            <span class="text-muted small">航司的实际卖价</span>
          </td>
          <td>
            税
            <input type="text" class="form-control" v-model.lazy.number="tax0">
            <span class="text-muted small">总的税金</span>
          </td>
          <td>
            客户应付/{{psgTypeName}}
            <input type="text" class="form-control" v-model.lazy.number="amount0">
            <span class="text-muted small">实际应付金额</span>
          </td>
          <td>人数: {{ticketCount}}</td>
          <td>小计: {{totalAmount}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    props: {
      id: '',
      psgTypeName: '',
      price: 0,
      parValue: 0,
      tax: 0,
      insurance: 0,
      serviceCharge: 0,
      commRate: 0,
      commission: 0,
      discountRate: 0,
      discount: 0,
      etdzMemo: '',
      payMemo: '',
      amount: 0,
      totalAmount: 0,
      cost: {
        type: Number,
        default: 0
      },
      totalCost: 0,
      profit: 0,
      totalProfit: 0,

      ticketCount: 0,
      saveMode: 0
    },
    data: function () {
      return {
        parValue0: this.parValue,
        price0: this.price,
        tax0: this.tax,
        insurance0: this.insurance,
        serviceCharge0: this.serviceCharge,
        discount0: this.discount,
        commission0: this.commission,
        commRate0: this.commRate,
        discountRate0: this.discountRate,
        amount0: this.amount,
        saveMode0: this.saveMode,
        profit0: this.profit,
        totalProfit0: this.totalProfit,
        cost0: this.cost,
        totalCost0: this.totalCost
      }
    },
    watch: {
      price0: function (newValue) {
        this.$emit('update:price', newValue)
      },
      parValue0: function (newValue) {
        this.$emit('update:parValue', newValue)
        this.calc()
      },
      tax0: function (newValue) {
        this.$emit('update:tax', newValue)
        this.calc()
      },
      insurance0: function (newValue) {
        this.$emit('update:insurance', newValue)
        this.calc()
      },
      serviceCharge0: function (newValue) {
        this.$emit('update:serviceCharge', newValue)
        this.calc()
      },
      discount0: function (newValue) {
        this.$emit('update:discount', newValue)
        this.calc()
      },
      commission0: function (newValue) {
        this.$emit('update:commission', newValue)
        this.calc()
      },
      commRate0: function (newValue) {
        // this.$emit('update:commRate', newValue)
        this.calc()
      },
      discountRate0: function (newValue) {
        // this.$emit('update:discountRate', newValue)
        this.calc()
      },
      amount0: function (newValue) {
        // this.$emit('update:amount', newValue)
        this.caclDisCount()
      },
      cost0: function (newValue) {
        // this.$emit('update:cost', newValue)
        // console.log(this.cost0)
        this.caclDisCountBycost()
      },
      saveMode0: function (newValue) {
        this.$emit('update:saveMode', newValue)
        this.calc()
      },
      ticketCount: function (newValue) {
        this.calc()
      }
    },
    mounted: function () {
      this.calc()
    },
    methods: {
      calc: function () {
        if (this.commRate0 > 0) {
          this.commission0 = this.parValue0 * this.commRate0 / 100
        }
        if (this.discountRate0 > 0) {
          this.discount0 = this.parValue0 * this.discountRate0 / 100
        }

        this.cost0 = this.parValue0 + this.tax0 + this.insurance0 - this.commission0
        this.totalCost0 = this.cost0 * this.ticketCount

        this.amount0 = this.parValue0 + this.tax0 + this.insurance0 + this.serviceCharge0 - this.discount0
        this.totalAmount0 = this.amount0 * this.ticketCount
        this.caclProfit()

        this.emitAll()
      },
      caclDisCount: function () {
        this.cost0 = this.parValue0 + this.tax0 + this.insurance0 - this.commission0
        this.totalCost0 = this.cost0 * this.ticketCount

        this.discount0 = this.parValue0 + this.tax0 + this.insurance0 + this.serviceCharge0 - this.amount0

        this.totalAmount0 = this.amount0 * this.ticketCount
        this.caclProfit()

        this.emitAll()
      },
      caclDisCountBycost: function () {
        // this.commRate0 = 0
        this.commission0 = this.parValue0 + this.tax0 + this.insurance0 - this.cost0
        this.caclProfit()

        this.emitAll()
      },
      caclProfit: function () {
        this.profit0 = this.mathRound(this.commission0 + this.serviceCharge0 - this.discount0)
        this.totalProfit0 = this.mathRound(this.profit0 * this.ticketCount)
      },
      emitAll: function () {
        this.$emit('update:commRate', this.commRate0)
        this.$emit('update:commission', this.commission0)
        // this.$emit('update:discountRate', this.discountRate0)
        this.$emit('update:serviceCharge', this.serviceCharge0)
        this.$emit('update:discount', this.discount0)
        this.$emit('update:amount', this.amount0)
        this.$emit('update:totalAmount', this.totalAmount0)
        this.$emit('update:profit', this.profit0)
        this.$emit('update:totalProfit', this.totalProfit0)
        this.$emit('update:cost', this.cost0)
        this.$emit('update:totalCost', this.totalCost0)
      },
      mathRound: function (val) {
        return Math.round(val * 100) / 100
      }
    }
  }
</script>