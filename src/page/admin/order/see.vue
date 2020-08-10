<template>
  <div>
    <div class="order-info" style="padding-top: 20px;">
      <h3 class="info-title">订单基本信息</h3>
      <el-row class="item">
        <el-col :span="3"><strong>订单号：</strong> </el-col>
        <el-col :span="9">{{data.number}}</el-col>
        <el-col :span="3"> <strong>订单状态：</strong></el-col>
        <el-col :span="9">{{data.status_text}}</el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="3"><strong>包工姓名：</strong> </el-col>
        <el-col :span="9">{{data.uc_name}}</el-col>
        <el-col :span="3"> <strong>联系手机号：</strong></el-col>
        <el-col :span="9">{{data.uc_tel}}</el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="3"><strong>下单时间：</strong> </el-col>
        <el-col :span="9">{{data.datetime_xd}}</el-col>
        <el-col :span="3"><strong>工作时间：</strong></el-col>
        <el-col :span="9">{{data.workhours}}</el-col>
      </el-row>
      <div v-if="data.work_id">
      <h3 class="info-title">接单工人信息：</h3>
      <el-row class="item">
        <el-col :span="3"> <strong>工人姓名：</strong> </el-col>
        <el-col :span="9">{{data.uw_name}}</el-col>
        <el-col :span="3"> <strong>工人年龄：</strong></el-col>
        <el-col :span="9">{{data.age}}</el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="3"> <strong>联系手机号：</strong> </el-col>
        <el-col :span="9">{{data.uw_tel}}</el-col>
        <el-col :span="3"> <strong>工种：</strong></el-col>
        <el-col :span="9">{{data.type_p_text}}-{{data.type_s_text}}</el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="3"> <strong>接单时间：</strong> </el-col>
        <el-col :span="9">{{data.datetime_jd}}</el-col>
        <el-col :span="3"></el-col>
        <el-col :span="9"></el-col>
      </el-row>
      </div>
      <div v-if="data.match_state=='1'">
        <h3 class="info-title">匹配工人信息：</h3>
        <el-row class="item">
          <el-col :span="3"> <strong>工人姓名：</strong> </el-col>
          <el-col :span="9">{{data.match_user.mu_name}}</el-col>
          <el-col :span="3"> <strong>工人年龄：</strong></el-col>
          <el-col :span="9">{{data.match_user.mu_age}}</el-col>
        </el-row>
        <el-row class="item">
          <el-col :span="3"> <strong>联系手机号：</strong> </el-col>
          <el-col :span="9">{{data.match_user.mu_tel}}</el-col>
          <el-col :span="3"> <strong>工种：</strong></el-col>
          <el-col :span="9">{{data.match_user.mu_tws_name}}<span v-if="data.match_user.mu_twsss_name">,{{data.match_user.mu_twsss_name}}</span></el-col>
        </el-row>

      </div>
      <h3 class="info-title">订单信息：</h3>
      <el-row class="item">
        <el-col :span="3"> <strong>项目名称：</strong> </el-col>
        <el-col :span="21">{{data.name}}</el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="3"> <strong>工程地点：</strong> </el-col>
        <el-col :span="21">{{data.province}}{{data.city}}{{data.area}}{{data.address}}</el-col>
      </el-row>
     <el-row class="item">
       <el-col :span="3"> <strong>所需工种：</strong> </el-col>
       <el-col :span="9">{{data.o_type_p_text}}-{{data.o_type_s_text}}</el-col>
       <el-col :span="3"><strong>所需人数：</strong></el-col>
       <el-col :span="9">{{data.num}}</el-col>
     </el-row>
     <el-row class="item">
       <el-col :span="3"> <strong>工种单价：</strong> </el-col>
       <el-col :span="21">{{data.price}}元/天{{data.unit}}</el-col>
     </el-row>
      <h3 class="info-title">项目描述及要求</h3>
      <el-row class="item">
        <el-col :span="24">{{data.des}}</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name:"clientInfo",
    props:{
      data:Object|Array,//详情
    },
    methods:{

    }
  }
</script>

<style scoped>
  .info-title{
    height: 40px;
    line-height: 40px;
    color: #888;
    /* padding-top: 40px; */
    font-size:16px;

  }
  strong{
    font-size: 15px;
    display: inline-block;
    width: 100%;
    text-align: right;
    /* background: red; */
  }
  .item{
    min-height: 40px;
    line-height: 40px;
   /* padding-left:15px; */
    /* background: red; */
    border-bottom: 1px solid #AAAAAA;
    margin-bottom: 15px;
  }
  .order-info{
    height: 90vh;
    overflow: scroll;
  }
</style>
