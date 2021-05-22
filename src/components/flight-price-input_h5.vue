<template>
  <dl class="row mb-2" :id="id">
    <dt class="col-4 text-right">{{ psgTypeName }}价格</dt>
    <dd class="col-8"></dd>
    <dt class="col-4 text-right">票面价</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="price0" />
      <span class="text-muted small">不参与计算</span>
    </dd>
    <dt class="col-4 text-right">销售价</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="parValue0" />
      <span class="text-muted small">航司的实际卖价</span>
    </dd>
    <dt class="col-4 text-right">税</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="tax0" />
      <span class="text-muted small">总的税金</span>
    </dd>

    <dt class="col-4 text-right">服务费</dt>
    <dd class="col-8">
      <input
        type="text"
        class="form-control"
        v-model.lazy.number="serviceCharge0"
      />
      <span class="text-muted small">服务费/人</span>
    </dd>
    <dt class="col-4 text-right">客户应付/{{ psgTypeName }}</dt>
    <dd class="col-8">
      <input type="text" class="form-control" v-model.lazy.number="amount0" />
      <span class="text-muted small">实际应付金额</span>
    </dd>
    <dt class="col-4 text-right">人数</dt>
    <dd class="col-8">
      {{ ticketCount }}
    </dd>
    <dt class="col-4 text-right">小计</dt>
    <dd class="col-8">
      {{ totalAmount }}
    </dd>
  </dl>
</template>

<script>
export default {
  props: {
    id: "",
    psgTypeName: "",
    price: 0,
    parValue: 0,
    tax: 0,
    serviceCharge: 0,
    amount: 0,
    totalAmount: 0,
    ticketCount: 0,
    saveMode: 0,
  },
  data: function () {
    return {
      parValue0: this.parValue,
      price0: this.price,
      tax0: this.tax,
      serviceCharge0: this.serviceCharge,
      discount0: this.discount,
      amount0: this.amount,
      saveMode0: this.saveMode,
    };
  },
  watch: {
    price0: function (newValue) {
      this.$emit("update:price", newValue);
    },
    parValue0: function (newValue) {
      this.$emit("update:parValue", newValue);
      this.calc();
    },
    tax0: function (newValue) {
      this.$emit("update:tax", newValue);
      this.calc();
    },
    serviceCharge0: function (newValue) {
      this.$emit("update:serviceCharge", newValue);
      this.calc();
    },
    saveMode0: function (newValue) {
      this.$emit("update:saveMode", newValue);
      this.calc();
    },
    ticketCount: function (newValue) {
      this.calc();
    },
  },
  mounted: function () {
    this.calc();
  },
  methods: {
    calc: function () {
      this.amount0 = this.parValue0 + this.tax0 + this.serviceCharge0;
      this.totalAmount0 = this.amount0 * this.ticketCount;

      this.emitAll();
    },
    emitAll: function () {
      this.$emit("update:serviceCharge", this.serviceCharge0);
      this.$emit("update:amount", this.amount0);
      this.$emit("update:totalAmount", this.totalAmount0);
    },
    mathRound: function (val) {
      return Math.round(val * 100) / 100;
    },
  },
};
</script>