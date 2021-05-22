<template>  
  <div id="accordion" role="tablist" v-if="logined">

    <div class="card">
        <div class="card-header" role="tab" id="navTmcHeading" >
            <h6 class="mb-0">             
                <a role="button" data-bs-toggle="collapse" href="#navTmcBody" aria-expanded="true" aria-controls="navTmcBody">
                差旅管理系统 >
                </a>
            </h6>
        </div>
        <div id="navTmcBody" class="collapse" role="tabpanel" aria-labelledby="navTmcHeading" data-parent="#accordion">
            <div class="card-body">
                <ul class="list-unstyled">     
                    <li>
                        <router-link to="/flt/orders">机票订单</router-link>
                    </li>
                    <li>
                        <router-link to="/bills">账单</router-link>
                        <ul>
                            <li>
                                <router-link to="/flt/tickets">机票</router-link>
                            </li>
                            <li>
                                &nbsp;&nbsp;
                                <router-link to="/flt/refunds" class="ml-auto text-right">退票</router-link>
                            </li>
                            <li>
                                <router-link to="/train/tickets">火车票</router-link>
                            </li>
                            <li>
                                <router-link to="/hotel/orders">酒店</router-link>
                            </li>
                        </ul>
                    </li>


                    <li>
                        
                    </li>
                    <li>
                        <router-link to="/ent/receipts">收款单</router-link>
                    </li>
                    <li></li>
                    <li>
                        <router-link to="/ent/balances">财务信息</router-link>
                    </li>

                    <li>&nbsp;</li>
                    <li>
                        <router-link to="/customers">客户信息</router-link>
                    </li>
                    <li>
                        <router-link to="/departments">&nbsp;&nbsp;&nbsp;&nbsp;部门信息</router-link>
                    </li>
                    <li>
                        <router-link to="/passengers">&nbsp;&nbsp;&nbsp;&nbsp;乘机人信息</router-link>
                    </li>
                    <li> 
                        <router-link to="/suppliers">供应商</router-link>
                    </li> 
                    <li> 
                        <router-link to="/payments">支付方式</router-link>
                    </li> 
                    <li> 
                        <router-link to="/flt/commissions/fixed">定额代理费</router-link>
                    </li> 
                    <li> 
                        <router-link to="/products">服务产品</router-link>
                    </li> 
                </ul>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header" role="tab" id="nav1Heading" >
            <h6 class="mb-0">             
                <a role="button" data-bs-toggle="collapse" href="#nav1Body" aria-expanded="true" aria-controls="nav1Body">
                同行采购 >
                </a>
            </h6>
        </div>
        <div id="nav1Body" class="collapse" role="tabpanel" aria-labelledby="nav1Heading" data-parent="#accordion">
            <div class="card-body">
                <ul class="list-unstyled">     
                    <li>
                        买家
                        <ul>
                            <li>
                                <router-link to="/ka/new/order"><strong>导入订单</strong></router-link>
                            </li>
                            <li>
                                <router-link to="/ka/policies">浏览政策</router-link>
                            </li>                                
                            <li>
                                <router-link to="/ka/buyer/orders">订单</router-link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        卖家
                        <ul>
                            <li>
                                <router-link to="/ka/new/policy" class="text-danger" title="需要授权芝麻分，且芝麻分在600以上">发布新政策</router-link>  
                            </li>  
                            <li>
                                <router-link to="/ka/policies">浏览政策</router-link>
                            </li>
                            <li>
                            <router-link to="/my/worktime">工作时间</router-link>
                            </li>  
                            <li>
                                <router-link to="/ka/seller/orders">订单</router-link>
                            </li>
                        </ul>                    
                    </li>
                    <li>&nbsp;</li>
                    <li><router-link to="/zmxy">芝麻信用分</router-link></li>
                </ul>
            </div>
        </div>
    </div>


    <div class="card">
        <div class="card-header" role="tab" id="nav4Heading">
            <h6 class="mb-0">   
                
                <a role="button" data-bs-toggle="collapse" href="#nav4Body" aria-expanded="true" aria-controls="nav4Body">
                    系统管理 >
                </a>
            </h6>
        </div>
        <div id="nav4Body" class="collapse" role="tabpanel" aria-labelledby="nav4Heading" data-parent="#accordion">
            <div class="card-body">
                <dl class="member_submenu">
                    <dt>财务信息</dt>
                    <dd>
                        <router-link to="/recharge">账户余额</router-link>
                    </dd>
                    <dd>
                        <router-link to="/trans/histories">交易记录</router-link>
                    </dd>
                </dl>
                <dl class="member_submenu">
                    <dt>账号管理</dt>
                    <dd>
                        <router-link to="/users">员工管理</router-link>
                    </dd>
                    <dd>
                        <router-link to="/my/password">密码修改</router-link>
                    </dd>
                </dl>
                <dl class="member_submenu">
                    <dt>日志</dt>
                    <dd>
                        <router-link to="/my/histories">操作日志</router-link>
                    </dd>
                </dl>
            </div>
        </div>
    </div>

    <div class="card" id="divAdminMenu" style="display:none">
        <div class="card-header" role="tab" id="navAdminHeading">
            <h5 class="mb-0">            
                <a role="button" data-bs-toggle="collapse" href="#navAdminBody" aria-expanded="true" aria-controls="navAdminBody">
                    管理区 >
                </a>
            </h5>
        </div>
        <div id="navAdminBody" class="collapse" role="tabpanel" aria-labelledby="navAdminHeading" data-parent="#accordion">
            <div class="card-body">
                <ul>
                    <li><a href="flight-tmc-policy-order-platform.shtml" title="">同行政策订单</a></li>
                    <li><a href="flight-tmc-refund-order-platform.shtml" title="">退票单</a></li>
                    <li><a href="flight-tmc-change-order-platform.shtml" title="">改签单</a></li>
                    <li></li>
                    <li><a href="platform-admin-ent-crm.shtml" title="">企业关系</a></li>
                    <li></li>
                    <li><a href="platform-admin-ent-balance.shtml" title="">企业现金</a></li>
                    <li></li>
                    <li><a href="platform-admin-zmxy.shtml" title="">芝麻信用评分</a></li>
                    <li><a href="platform-admin-credit-apply.shtml" title="">信用额度申请</a></li>
                    <li class="hidden">
                        <a href="flight-charter-info.shtml">包机切位</a>
                        <ul>
                            <li><a href="flight-charter-info.shtml">航班列表</a></li>
                            <li>
                                <a href="flight-charter-info-my.shtml">管理</a>
                                <ul>
                                    <li><a href="flight-charter-info-my.shtml">我的航班</a></li>
                                    <li><a href="flight-charter-order-seller.shtml">我的订单</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li></li>
                    <li><a href="platform-pnr-log.shtml" title="">pnr log</a></li>
                    <li></li>
                    <li><a href="platform-end-rer-ref-rule.shtml" title="">退改签收费规定</a></li>
                    <li></li>
                    <li><a href="platform-airline" title="">航空公司</a></li>
                </ul>       
            </div>
        </div>
    </div>

  </div>

  
</template>


<script>
export default {
  computed: {
    logined () { return this.$store.state.logined }
  }
}
</script>
