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
        <div class="grid-content bg-purple-light" style="height: 35px;line-height:35px;"><strong>投诉人姓名：</strong>{{formData.user_name}}</div>
        <div class="grid-content bg-purple-light" style="height: 30px;line-height: 30px;"><strong>联系电话：</strong>{{formData.user_tel}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" >
        <div class="grid-content bg-purple-light" style="height: 35px;line-height:35px;"><strong>投诉对象：</strong>{{formData.obj_user_name}}</div>
      </el-col>
      <el-col :span="12" >
        <div class="grid-content bg-purple-light" style="height: 35px;line-height:35px;"><strong>联系电话：</strong>{{formData.obj_user_tel}}</div>
      </el-col>
    </el-row>
    <el-row style="border-bottom: 1px solid #E4E7ED;">
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="line-height:25px;"><strong>投诉内容</strong></div>
        <div class="grid-content bg-purple-light" style="line-height:30px;padding: 10px 0px;word-wrap: break-word;word-break: break-all;">
          {{formData.text}}
        </div>
      </el-col>
      <el-col :span="24" v-if="formData.img">
          <el-image v-for="(img,idex) in formData.img" :key="idex" style="width: 150px; max-height: 150px;margin-right: 10px;" :src="img" :preview-src-list="formData.img"></el-image>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="height: 60px;line-height:60px;"><strong>投诉时间：</strong>{{formData.datetime}}</div>
      </el-col>
    </el-row>

    <el-row style="border-bottom: 1px solid #E4E7ED;padding-top: 10px;" v-if="formData.state=='1'">
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="line-height:25px;"><strong>投诉反馈内容</strong></div>
        <div class="grid-content bg-purple-light" style="line-height:30px;padding: 10px 0px;word-wrap: break-word;word-break: break-all;">
          {{formData.f_text}}
        </div>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="height: 60px;line-height:60px;"><strong>反馈时间：</strong>{{formData.datetime_f}}</div>
      </el-col>
    </el-row>
      <el-row style="border-bottom: 0px solid #E4E7ED;padding-top: 10px;"  v-if="formData.state=='2'">
          <el-col :span="24">
            <el-input type="textarea" placeholder="请输入反馈内容" v-model="reply" maxlength="200" show-word-limit> </el-input>
          </el-col>
          <el-col :span="24" style="padding: 40px 0">
               <el-button @click="onSubmit" size="mini" type="primary">反馈</el-button>
          </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>

  export default {
    name:"addVehicle",
    data(){
      return{
        http:this.$http,
        formDeal:{
          deal_price:"",
          deal_time:""
        },
        reply:"",
        formData:this.setFormData(),
        type:'',
        deal_state:''
      }
    },
    methods:{
        dealPrice(v){
          this.formDeal.deal_price=(v.match(/^\d*(\.?\d{0,2})/g)[0]) || null; //保留2位小数字
        },
        showFormData(data,type){
           if(type==="fComplaints"||type==="seeComplaints"){
            let {id,headimg,user_name,user_tel,obj_user_tel,obj_user_name,datetime,datetime_f,text,f_text,img,state}=data.row;
            img=img.map((item)=>{
              return this.$http+item;
            })

            let d={
               id:id,
               headimg:headimg,
               user_name:user_name,
               user_tel:user_tel,
               obj_user_name:obj_user_name,
               obj_user_tel:obj_user_tel,
               datetime:datetime,
               datetime_f:datetime_f,
               state:state,
               text:text,
               f_text:f_text,
               img:img
            }
            this.formData=d;


           }
        },
        onSubmit({data}){
          let d={
            id: this.formData.id,
            reply:this.reply
          };
          if(d.reply==""){
             this.$message.warning('反馈内容不能为空！');
          }
          this.$emit('evnetPost',d);
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
