<template>
  <div class="info">
      <el-form ref="share" :rules="postRules" :model="share" label-width="90px">
        <div class="botder-title"><strong>费用设置</strong></div>
        <div class="info-box">
          <el-form-item label-width="130px"  label="服务费收取比列" prop="servicePrice">
              <el-input v-model="share.servicePrice" @blur="defaults($event,'servicePrice','1')"  style="width: 140px;" maxlength="6">
                  <template slot="append">%</template>
              </el-input>
              <span class="input-zhu el-icon-warning-outline">大于0的正数，默认1。小数点保留后两位;</span>
          </el-form-item>
        </div>
        <div class="botder-title"><strong>时效设置</strong></div>
        <div class="info-box">
          <el-form-item label-width="286px" label="确认包工头支付相关劳务费，订单未确认" prop="timeLimit">
              <el-input v-model="share.timeLimit" @blur="defaults($event,'timeLimit','12')"  data-type="timeLimit"  maxlength="6" style="width: 140px;">
                  <template slot="append">小时</template>
              </el-input>
              系统默认确认<span class="input-zhu el-icon-warning-outline">大于0的整数，默认12;</span>
          </el-form-item>
          <el-form-item label-width="144px" label="工人接单后，订单" prop="cancelTime">
              <el-input v-model="share.cancelTime"  @blur="defaults($event,'cancelTime','12')" data-type="cancelTime" maxlength="6" style="width: 140px;">
                  <template slot="append">小时</template>
              </el-input>
              前可以取消；<span class="input-zhu el-icon-warning-outline">大于0的整数，默认12;</span>
          </el-form-item>
          <el-form-item label-width="243px" label="工人接单后，每月可主动取消订单" prop="cancelTimes">
              <el-input v-model="share.cancelTimes" @blur="defaults($event,'cancelTimes','1')" data-type="cancelTimes" maxlength="6" style="width: 140px;">
                  <template slot="append">次</template>
              </el-input>
               <span class="input-zhu el-icon-warning-outline">大于0的整数，默认1</span>
          </el-form-item>
        </div>
        <div class="botder-title"> <strong>微信分享设置</strong></div>
        <div class="info-box" style="width: 50%;">
            <el-form-item label="分享标题:" prop="shareName">
              <el-input maxlength="20" v-model="share.shareName"></el-input>
            </el-form-item>
            <el-form-item label="分享图片:" prop="shareImgurl">
              <Upload :croppParame="croppParame" :isCrop="true" item="imgurl" name="imgurl" :imgList="imgurl" :parame="uploadParame" @onSuccess="getImage"></Upload>
              <p class="imgMsg"><i class="el-icon-warning-outline"></i>建议尺寸300*300像素</p>
            </el-form-item>
        </div>
        <div class="botder-title"><strong>客服联系电话</strong></div>
        <div class="info-box">
            <el-form-item  label="客服电话" prop="phoneTel">
                <el-input v-model="share.phoneTel" maxlength="12"></el-input>
            </el-form-item>
        </div>
      </el-form>
      <div class="btn-box-s">
         <el-button @click="submitForm('share')"  type="primary" plain>保存</el-button>
      </div>
      <!-- 信息添加弹窗 -->
  </div>
</template>

<script>
  import Upload from '@/components/upload';
  export default {
    components:{Upload},
    data(){
      return{
        // 上传图片配置
          croppParame:{
            croppersW:"800px",//裁剪显示区域大小（像素）
            croppersH:"400px",//裁剪显示区域大小（像素）
            autoCropWidth:"300", //裁剪框的宽度（无）
            autoCropHeight:"300", //裁剪框的高度（无）
            top:"30vh",           //裁剪后弹窗顶部距离
            topCrop:"20vh"       //裁剪前弹窗顶部距离
          },
          uploadParame:{
            data:{path:"sheet"},//上传图片时携带图片参数
            limit:1,//图片上传最大数量
            action:this.$api.upload,//上传图片地址
          },
          imgurl:[],
          //提交信息
          share: {
            servicePrice:'',//收取比例
            timeLimit:'',//确实时间
            cancelTime:'',//取消订单时间
            cancelTimes:'',//取消次数
            shareName: '',
            shareImgurl:"",
            phoneTel:"" //客服电话
          },
          postRules:this.verification(), //验证表单
          //添加表格成交信息
          brand:[],
          //数据表格
          tableData:[],//表格数据
          visible:false,
          http:this.$http,
          otype:'',
          index:''
      }
    },
    mounted(){
      this.getData();
    },
    methods:{
      defaults(e,type,d){
        if(e.target.value==""){
          this.share[type]=d;
        }
        // console.log(type)

      },
      refreshData(){
        //刷新数据
        this.getData();
      },
        close(t){
          this.visible=false;
        },
        //添加提交
        submitForm(formName){
          this.share.shareImgurl=this.imgurl.join(",");
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let data=this.share;
              this.postData(this.share);
            } else {
              return false;
            }
          });
        },
        //验证消息
        verification(){
          var v=[
             {field:"servicePrice",type:{amounts:"大于0的正数，小数点保留后两位！"},textCount:[1,20]},
             {field:"timeLimit",type:{integer:"大于0的整数！"},textCount:[1,20]},
             {field:"cancelTime",type:{integer:"大于0的整数！"},textCount:[1,20]},
             {field:"cancelTimes",type:{integer:"大于0的整数！"},textCount:[1,20]},
             {field:"shareName",type:{required:"请输入分享标题！"},textCount:[2,20]},
             {field:"shareImgurl",type:{required:"请上传图片！"}},
             {field:"phoneTel",type:{phoneTel:'必须格式：xxx-xxxxxxx或者11位手机号'}},
          ];
          v=this.$verification(v);
          return v;
        },
        //添加后获取图片
        getImage({set,imgUrl,index}){
          if(set.type==="add"){
            //添加
            this[index].push(imgUrl);
          }else if(set.type==="edit"){
            //编辑
            this.$set(this[index],set.index,imgUrl);
          }else if(set.type==="del"){
            //删除
           this[index]=this[index].filter((item,i)=>{
              if(set.index!=i){
                return item;
              }
            });
          }
        },
        setData(d){
          this.share={
            servicePrice:d.servicePrice,//收取比例
            timeLimit:d.timeLimit,//确实时间
            cancelTime:d.cancelTime,//取消订单时间
            cancelTimes:d.cancelTimes,//取消次数
            shareName: d.shareName,
            shareImgurl:d.shareImgurl,
            phoneTel:d.phoneTel //客服电话
          },
          this.imgurl=[d.shareImgurl];
        },
        postData(data){
          const loading = this.$loading({
            lock: true,
            text: '提交中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"post",
          	url:this.$api.setBasics,
            data:data,
          	success:(res)=>{
             loading.close();
              if(res.code==200){
                this.$message.success(res.msg);
              }else{
                this.$message.error('数据加载失败');
              }
          	},error:(err)=>{
          		this.$message.error(err);
          	}
          });
        },
        getData(){
          const loading = this.$loading({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"get",
          	url:this.$api.setBasics,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                 this.setData(res.data);
                 //this.brand=res.data.brand;
              }else{
                this.$message.error('数据加载失败');
              }
          	},error:(err)=>{
          		this.$message.error(err);
          	}
          });
        }
    }
  }
</script>

<style scoped>
  .info-box{
    padding-top: 15px;
  }
  .info{
    padding-top: 15px;
  }
  .botder-title strong{
    margin-right:25px;
  }
  .btn-box-s{
    padding-left: 90px;
  }

  .drawerContent{
   height: 93vh;
   background: #FFFFFF;
   overflow: scroll;
   padding-top: 15px;
  }

</style>
