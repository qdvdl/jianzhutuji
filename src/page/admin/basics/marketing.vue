<template>
  <div class="info">
      <el-form ref="share" :rules="postRules" :model="share" label-width="90px">
        <div class="botder-title"><strong>针对包工头</strong></div>
        <div class="info-box">
          <el-form-item label-width="130px" label="是否开启分享发布" prop="mCOff">
             <el-switch v-model="switchOff" @change="mswitchChange"></el-switch><span class="input-zhu el-icon-warning-outline">默认关闭;</span>
          </el-form-item>
          <div v-if="share.mCOff==='1'">
            <el-form-item label-width="75px" label="包工头前" prop="mCfirstCS">
                <el-input v-model="share.mCfirstCS"  maxlength="6" style="width: 140px;">
                    <template slot="append">次</template>
                </el-input>
                分享可免费发布  <span class="input-zhu el-icon-warning-outline">大于0的整数;</span>
            </el-form-item>
             <el-form-item label-width="75px" label="包工头第" prop="mCfirstCSmin">
                   <el-input v-model="share.mCfirstCSmin" maxlength="6" style="width: 90px;"></el-input>
                   <span>-</span>
                   <el-input v-model="share.mCfirstCSmax" maxlength="6" style="width: 140px;">
                       <template slot="append">次</template>
                   </el-input>
                   分享可半价发布 <span class="input-zhu el-icon-warning-outline">大于0的整数;</span>
             </el-form-item>
          </div>
        </div>
        <div class="botder-title"><strong>针对工人</strong></div>
        <div class="info-box">
          <el-form-item label-width="160px" label="是否开启分享才可接单" prop="mWOff">
             <el-switch v-model="switchOff1"   @change="wswitchChange"></el-switch><span class="input-zhu el-icon-warning-outline">默认关闭;</span>
          </el-form-item>
          <div v-if="share.mWOff==='1'">
            <el-form-item label-width="134px" label="工人需要转发分享" prop="mWfXCS">
                <el-input v-model="share.mWfXCS" @blur="defaults($event,'mWfXCS','0')" maxlength="6" style="width: 140px;">
                    <template slot="append">次</template>
                </el-input>
                可开启接单功能
                <!-- <span class="input-zhu el-icon-warning-outline">大于0的整数;</span> -->
            </el-form-item>
            <el-form-item label-width="190px" label="工人每月未到岗次数次超过" prop="mWDJCS">
                <el-input v-model="share.mWDJCS" maxlength="6" style="width: 140px;">
                    <template slot="append">次</template>
                </el-input>
                次自动冻结此工人账号，不可接单<span class="input-zhu el-icon-warning-outline">大于0的整数;</span>
            </el-form-item>
          </div>
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
          switchOff:false,
          switchOff1:false,
          //提交信息
          share: {
           mCOff:'',
           mCfirstCS:'',
           mCfirstCSmin:'',
           mCfirstCSmax:'',
           mWOff:'',
           mWfXCS:'',
           mWDJCS:''
          },
          postRules:this.verification(), //验证表单
          //数据表格
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
      },
      mswitchChange(off){
        this.switchOff=off;
        this.share.mCOff=off ? '1' : '0';
      },
      wswitchChange(off){
        this.switchOff1=off;
        this.share.mWOff=off ? '1' : '0';
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
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let data=this.share;
              if(data.mCOff==='1'){
                if(parseInt(data.mCfirstCSmax)<=parseInt(data.mCfirstCSmin)){
                  this.$message.error('包工头分享半价发布设置，前面值不能大于后面值！');
                  return false;
                }
              }
              this.postData(data);
            } else {
              return false;
            }
          });
        },
        //验证消息
        verification(){
          var v=[
              {field:"mCfirstCS",type:{integer:"大于0的整数！"},textCount:[1,20]},
              {field:"mCfirstCSmin",type:{integer:"大于0的整数！"},textCount:[1,20]},
              {field:"mCfirstCSmax",type:{integer:"大于0的整数！"},textCount:[1,20]},
              {field:"mWfXCS",type:{number:"请输入整数！"},textCount:[1,20]},
              {field:"mWDJCS",type:{integer:"大于0的整数！"},textCount:[1,20]}
          ];
          v=this.$verification(v);
          return v;
        },
        // 设置默认数据
        setData(d){
          this.share={
            mCOff:d.mCOff,
            mCfirstCS:d.mCfirstCS,
            mCfirstCSmin:d.mCfirstCSmin,
            mCfirstCSmax:d.mCfirstCSmax,
            mWOff:d.mWOff,
            mWfXCS:d.mWfXCS,
            mWDJCS:d.mWDJCS
          }


          this.switchOff=d.mCOff=='1' ? true : false;
          this.switchOff1=d.mWOff=='1' ? true : false;
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
          	url:this.$api.marketing,
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
          	url:this.$api.marketing,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                 this.setData(res.data);
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
