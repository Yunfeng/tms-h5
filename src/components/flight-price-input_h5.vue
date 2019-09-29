<template>
  <dl class="row"  :id="id">
    <dt class="col-4 text-right">{{psgTypeName}}价格</dt>
    <dd class="col-8"></dd>
    <dt class="col-4 text-right">票面价</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="price0">
      <span class="text-muted small">不参与计算</span>
    </dd>
    <dt class="col-4 text-right">销售价</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="parvalue0">
      <span class="text-muted small">航司的实际卖价</span>
    </dd>
    <dt class="col-4 text-right">税</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="tax0">
      <span class="text-muted small">总的税金</span>
    </dd>
    <dt class="col-4 text-right">保险费</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="insurance0">
      <span class="text-muted small">保险费(0利润)</span>
    </dd>
    <dt class="col-4 text-right">服务费</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="serviceCharge0">
            <span class="text-muted small">服务费/人</span>
    </dd>
    <dt class="col-4 text-right">代理费率</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="commRate0">
    </dd>
    <dt class="col-4 text-right">代理费</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="commission0">
            <span class="text-muted small">包含在销售价中的代理费</span>
    </dd>
    <dt class="col-4 text-right">客户让利</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="discount0">
            <span class="text-muted small">正数表示优惠，负数表示加价</span>
    </dd>
    <dt class="col-4 text-right">客户应付/{{psgTypeName}}</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="amount0">
            <span class="text-muted small">实际应付金额</span>
    </dd>
    <dt class="col-4 text-right">底价/{{psgTypeName}}</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="cost0">
            <span class="text-muted small">实际成本</span>
    </dd>
    <dt class="col-4 text-right">人数</dt>
    <dd class="col-8">
      {{ticketCount}}
    </dd>
    <dt class="col-4 text-right">利润</dt>
    <dd class="col-8">
      {{totalProfit}}
    </dd>
    <dt class="col-4 text-right">小计</dt>
    <dd class="col-8">
      {{totalAmount}}
    </dd>
  </dl>
</template>

<script>
  export default {
    props: {
      id: '',
      psgTypeName: '',
      price: 0,
      parvalue: 0,
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
        parvalue0: this.parvalue,
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
      parvalue0: function (newValue) {
        this.$emit('update:parvalue', newValue)
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
          this.commission0 = this.parvalue0 * this.commRate0 / 100
        }
        if (this.discountRate0 > 0) {
          this.discount0 = this.parvalue0 * this.discountRate0 / 100
        }

        this.cost0 = this.parvalue0 + this.tax0 + this.insurance0 - this.commission0
        this.totalCost0 = this.cost0 * this.ticketCount

        this.amount0 = this.parvalue0 + this.tax0 + this.insurance0 + this.serviceCharge0 - this.discount0
        this.totalAmount0 = this.amount0 * this.ticketCount
        this.caclProfit()

        this.emitAll()
      },
      caclDisCount: function () {
        this.cost0 = this.parvalue0 + this.tax0 + this.insurance0 - this.commission0
        this.totalCost0 = this.cost0 * this.ticketCount

        this.discount0 = this.parvalue0 + this.tax0 + this.insurance0 + this.serviceCharge0 - this.amount0

        this.totalAmount0 = this.amount0 * this.ticketCount
        this.caclProfit()

        this.emitAll()
      },
      caclDisCountBycost: function () {
        // this.commRate0 = 0
        this.commission0 = this.parvalue0 + this.tax0 + this.insurance0 - this.cost0
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