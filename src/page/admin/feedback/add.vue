<template>
  <div class="form-box">
    <div class="formBoxS">
      <el-row style="border-bottom: 1px solid #E4E7ED;padding-bottom: 15px;">
        <el-col :span="4">
          <div style="margin-left: 22px;">
            <el-avatar :size="70" :src="formData.headimg">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
          </div>
        </el-col>
        <el-col :span="20" >
          <div class="grid-content bg-purple-light" style="height: 35px;line-height:35px;"><strong>反馈人姓名：</strong>{{formData.user_name}}</div>
          <div class="grid-content bg-purple-light" style="height: 30px;line-height: 30px;"><strong>联系电话：</strong>{{formData.user_tel}}</div>
        </el-col>
      </el-row>

    <el-row style="border-bottom: 1px solid #E4E7ED;">
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="line-height:25px;"><strong>反馈内容</strong></div>
        <div class="grid-content bg-purple-light" style="line-height:30px;padding: 10px 0px;word-wrap: break-word;word-break: break-all;">
          {{formData.text}}
        </div>
      </el-col>
      <el-col :span="24" v-if="formData.img">
          <el-image v-for="(img,idex) in formData.img" :key="idex" style="width: 150px; max-height: 150px;margin-right: 10px;" :src="img" :preview-src-list="formData.img"></el-image>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="height: 60px;line-height:60px;"><strong>反馈时间：</strong>{{formData.datetime}}</div>
      </el-col>
    </el-row>

    </div>
  </div>
</template>

<script>

  export default {
    name:"seeFeedback",
    data(){
      return{
        http:this.$http,
        formDeal:{
          deal_price:"",
          deal_time:""
        },
        formData:this.setFormData(),
        type:'',
        deal_state:''
      }
    },
    methods:{
        showFormData(data,type){

          let {headimg,nickname,user_name,user_tel,text,img,datetime}=data.row;
          img=img.map((item)=>{
            return this.$http+item;
          })

          let d={
             headimg:headimg,
             nickname:nickname,
             user_name:user_name,
             user_tel:user_tel,
             text:text,
             img:img,
             datetime:datetime
          }
          this.formData=d;
        },
        setFormData(){
          //配置数据
          return {
            nickname:"",
            star:"",
            text:"",
            img:"",
            datetime:"",
            reply:"",
            replytime:""
          }
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
