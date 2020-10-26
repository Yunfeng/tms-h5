<template>
  <div id="workbench" class="row">
    <div class="col-xl-5 col-lg-6 offset-lg-3">
      <div class="row">
        <div class="col-lg-6">
          <div class="card widget-flat" @click.stop="jumpToAttractions()">
            <div class="card-body">
              <div class="float-right">
                <i class="mdi mdi-account-multiple widget-icon"></i>
              </div>
              <h5
                class="text-muted font-weight-normal mt-0"
                title="Number of Customers"
              >
                景点
              </h5>
              <h3 class="mt-3 mb-3">1</h3>
              <i class="uil uil-angle-right-b float-right"></i>
              <p class="mb-0 text-muted"></p>
            </div>
            <!-- end card-body-->
          </div>
          <!-- end card-->
        </div>
        <!-- end col-->

        <div class="col-lg-6">
          <div class="card widget-flat" @click.stop="jumpToTicketOrders()">
            <div class="card-body">
              <div class="float-right">
                <i
                  class="mdi mdi-cart-plus widget-icon bg-success-lighten text-success"
                ></i>
              </div>
              <h5
                class="text-muted font-weight-normal mt-0"
                title="Number of Orders"
              >
                门票订单
              </h5>
              <h3 class="mt-3 mb-3"></h3>

              <i class="uil uil-angle-right-b float-right"></i>
              <p class="mb-0 text-muted"></p>
            </div>
            <!-- end card-body-->
          </div>
          <!-- end card-->
        </div>
        <!-- end col-->
      </div>
      <!-- end row -->
    </div>
  </div>
</template>

<script>
export default {
  name: "MyWorkBench",
  data() {
    return {
      sc: {
        pageNo: 1,
        pageSize: 5,
      },

      beginDate: "",
      endDate: "",
      name: "",
      phone: "",
      idno: "",
      ticketNo: "",
      status: -1,
      customerId: -1,
      intlTicket: -1,
      linkman: "",
      linkPhone: "",
      pnrNo: "",
      orderNo: "",
    };
  },
  mounted: function () {
    if (window.matchMedia("(max-width: 576px)").matches) {
      this.$router.replace("/h5/home");
    }
  },
  methods: {
    jumpToAttractions: function () {
      this.$router.push("/attractions");
    },
    jumpToTicketOrders: function () {
      this.$router.push("/attractions/ticket/orders");
    },

    searchFlightOrders: function () {
      const params = {
        "sc.pageNo": this.sc.pageNo,
        "sc.pageSize": this.sc.pageSize,
        "sc.beginDate": this.beginDate,
        "sc.endDate": this.endDate,
        "sc.name": this.name,
        "sc.phone": this.phone,
        "sc.linkman": this.linkman,
        "sc.linkPhone": this.linkPhone,
        "sc.idno": this.idno,
        "sc.status": this.status,
        "sc.customerId": this.customerId,
        "sc.ticketNo": this.ticketNo,
        "sc.intlTicket": this.intlTicket,
        "sc.pnrNo": this.pnrNo,
        "sc.orderNo": this.orderNo,
      };
      searchFlightOrders(params, (jsonResult) => {
        this.dataList = jsonResult.dataList;
        this.sc = jsonResult.page;
      });
    },
    reset: function () {
      this.beginDate = "";
      this.endDate = "";
      this.name = "";
      this.phone = "";
      this.idno = "";
      this.ticketNo = "";
      this.status = -1;
      this.customerId = -1;
      this.intlTicket = -1;
      this.sc.pageNo = 1;
      this.linkman = "";
      this.linkPhone = "";
      this.pnrNo = "";
      this.orderNo = "";
    },
  },
};
</script>