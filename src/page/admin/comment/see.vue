<template>
  <div class="form-box">
    <div class="formBoxS">
    <el-row style="border-bottom: 1px solid #E4E7ED;padding-bottom: 15px;">
      <el-col :span="4">
        <div style="margin-left: 22px;">
          <el-avatar :size="70" :src="data.headimg">
              <img :src="data.headimg"/>
          </el-avatar>
        </div>
      </el-col>
      <el-col :span="20" >
        <div class="grid-content bg-purple-light" style="height: 35px;line-height:35px;"><strong>评价人姓名：</strong>{{data.user_name}}</div>
        <div class="grid-content bg-purple-light" style="height: 30px;line-height: 30px;"><strong>评价人电话：</strong>{{data.user_tel}}</div>
      </el-col>
    </el-row>
   <el-row>
     <el-col :span="12" >
       <div class="grid-content bg-purple-light" style="height: 35px;line-height:35px;"><strong>评价对象：</strong>{{data.obj_user_name}}</div>
     </el-col>
     <el-col :span="12" >
       <div class="grid-content bg-purple-light" style="height: 35px;line-height:35px;"><strong>联系电话：</strong>{{data.obj_user_tel}}</div>
     </el-col>
   </el-row>
    <el-row style="border-bottom: 1px solid #E4E7ED;">
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="height: 35px;line-height:35px;"><strong>订单号：</strong>{{data.order}}</div>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="height: 60px;line-height:60px;"><strong>评价星级：</strong>{{data.star}}星</div>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="line-height:25px;"><strong>评价内容</strong></div>
        <div class="grid-content bg-purple-light" style="line-height:30px;padding: 10px 0px;word-wrap: break-word;word-break: break-all;">
         {{data.text}}
        </div>
      </el-col>

      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="height: 60px;line-height:60px;"><strong>评价时间：</strong>{{data.datetime}}</div>
      </el-col>
    </el-row>
    </div>
  </div>
</template>

<script>

  export default {
    name:"seeComment",
    data(){
      return{
        http:this.$http,
        data:{}
      }
    },
    methods:{
      resetload(d){
        this.data=d;
      }
    }

  }
</script>

<style scoped>
  .item{
    background: green;
    margin-bottom: 20px;
    height: 180px;
  }
  .form-box{
    padding-top: 15px;
    padding-right: 15px;
    padding-bottom: 15px;
  }
  .formBoxS{
    height: 90vh;
    overflow: scroll;
  }
  .selectInfo{
    padding-top: 22px;
  }
</style>
