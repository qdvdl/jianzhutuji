<template>
  <div>
     <div class="user">
       <el-row  :gutter="0">
         <el-col :span="1">
           <div class="user-info user-header">
             <!-- <img :src="data.headimg" alt=""> -->
             <el-image :src="data.headimg" :lazy='true' :preview-src-list="[data.headimg]" alt="data.headimg">
                   <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
                   <div slot="placeholder">
                     <img :src="data.headimg" style="width: 100%;height: 100%;" alt="">
                   </div>
             </el-image>
           </div>
         </el-col>
         <el-col :span="12"><div class="user-info setinfo"><strong>用户昵称：</strong>{{data.nickname}}</div></el-col>
         <el-col :span="11"><div class="user-info setinfo"><strong>绑定手机号：</strong>{{data.tel}}</div></el-col>
       </el-row>
       <el-row  :gutter="0">
         <el-col :span="1"> <div class="user-info"></div> </el-col>
         <el-col :span="12"><div class="user-info setinfo" ><strong>是否是工人：</strong>{{data.wstatet}}</div></el-col>
       </el-row>
     </div>
     <el-divider></el-divider>
      <div class="formBoxS">
        <CreateForm ref="myForm" labelWidth="125px" :rules="rules" @eventSubmit="onSubmit" refNanme="sbmit" bntText="提交" :formData="formData" :formListItem="formListItem()">
          <div slot="selectinfo" class="selectInfo">
              <!-- <el-select v-model="type_s">
                <el-option  v-for="item in typeWorks" :key="item.value" :label="item.text":value="item.value">
                </el-option>
              </el-select> -->
             <div class="tag-list-box" v-for="item in typeWorks" :key="item.value">
                 <el-button size="small" @click="activeTag(selectid,item)">{{item.text}}<i class="el-icon-circle-plus-outline" style="margin-left: 8px;"></i></el-button>
             </div>
             <div style="padding-top: 10px;" v-if="selectTag.length>0">
                已经选择：<el-tag  @close="delTypeWorks(item.id)" class="tag-list-box" v-for="item in selectTag" :key="item.id" closable effect="dark">{{item.text}}</el-tag>
             </div>
          </div>
        </CreateForm>

      </div>
  </div>
</template>

<script>
  import CreateForm from "@/components/form";
  export default {
      components:{CreateForm},
      name:"editWorkes",
      data(){
        return{
            selectTag:[],
            type_s:"",
            selectid:"0",
            typeWork:[],
            typeWorks:[],//工种子元素
            data:{},
            rules:this.verification(), //字段验证函数
            formData:this.setFormData() //定义字段配置
        }
      },
      created(){
        this.getTypeWork(0);
      },
      methods:{
        //删除选择工种
        delTypeWorks(id){
          this.selectTag=this.selectTag.filter((item)=>{
            return id!=item.id;
          })
        },
        //选择标签
        activeTag(pid,data){
          let isPush=this.selectTag.some((item)=>{
            return item.id==data.value;
          })
          if(!isPush){
             if(this.selectTag.length<2){
               this.selectTag.push({id:data.value,parent_id:pid,text:data.text});
            }
          }
        },
        resetload(d){
          this.showFormData(d);
        },
        //提交数据
        onSubmit(data){
          if(this.selectTag.length>0){
              let t_id="",t_pid="";
              this.selectTag.map((item)=>{
                t_id=t_id==""?item.id : t_id+","+item.id;
                t_pid=t_pid==""?item.parent_id : t_pid+","+item.parent_id;
              })
             // console.log(t_id,t_pid)
            //console.log(this.selectTag)
              let postdata=data.data;
              postdata.id=this.data.id;
              postdata.type_s=this.type_s;

              postdata.t_id=t_id;
              postdata.t_pid=t_pid;
              this.$emit('evnetPost',{
                  data:postdata
              })
          }else{
            this.$message.error('请选择工种！');
          }
        },
        //处理显示已有数据
        showFormData(row){
          this.data=row;
          let {name,cardid,birthday, type_p, type_s, card_img_z,card_img_f}=row;
          let formdata=null;
          formdata={
            name:name, //姓名
            cardid:cardid,//身份证号
            birthday:birthday, //出生年月日
            type_p:type_p, //工种父级
            type_s:type_s, //工种子级
            card_img_z:card_img_z,//正面
            card_img_f:card_img_f//反面
          }
          if(card_img_z){
             formdata.cardUrlz=[card_img_z];
          }
          if(card_img_f){
             formdata.cardUrlf=[card_img_f];
          }

          if(type_p){
             this.selectid=type_p;
             this.type_s=type_s;
             this.getTypeWork(type_p,type_s);
          }
          this.selectTag=row.selectTag;
          this.formData=formdata;
        },
         //配置表单字段
        setFormData(){
          return {
            name:"", //姓名
            cardid:"",//身份证号
            birthday:"", //出生年月日
            type_p:"", //工种父级
            type_s:"", //工种子级
            card_img_z:"",//正面
            card_img_f:"",//反面
            cardUrlz:[],
            cardUrlf:[]
          }
        },
        // 验证表单
        verification(){
          //自定义验证
          var vimg = (rule, value, callback) => {
           // console.log(value)
            if (value!==""&&value.split(",").length<1) {
              callback(new Error('请上传身份证!'));
            } else {
              callback();
            }
          };
          var v=[
            {field:"name",type:{required:"请输入工人姓名，10字以内！",chinese:'必须是中文字符！'}},
            {field:"cardid",type:{required:"请输入18位身份证件号！",cardid:'身份证格式错误！'},textCount:[18,19]},
            {field:"birthday",type:{required:"请选择出生日期！"}},
            {field:"type_p",type:{required:"请选择工种！"}},
            {field:"card_img_z",validator:vimg,type:{required:"请上传身份证正面！"}},
            {field:"card_img_f",validator:vimg,type:{required:"请上传身份证反面！"}},
          ];
          v=this.$verification(v);
          return v;
        },
        //配置表单项
        formListItem(){
         let typeWork=this.typeWork;
         //console.log(typeWork)
         let gongzhong={prop:"type_p",placeholder:"请选择工种",label:'工种：',type:'select',select:typeWork,isSlot:true,state:this.selectid,change:(val)=>{
            this.selectid=val;
            //console.log(val)
            this.getTypeWork(val);
          }}
            let form=[
              {prop:"name", maxlength:10,placeholder:"请输入工人姓名，10字以内",label:'姓名：',type:'text'},
              {prop:"cardid", maxlength:18,placeholder:"请输入工人身份证号，18字以内",label:'身份证号：',type:'text'},
              {prop:"birthday", maxlength:10,placeholder:"请选择日期",label:'出生年月：',type:'date'},
              gongzhong,
              {prop:"card_img_z", label:'身份证正面：',type:'imgUpload',placeholder:'图片建议尺寸：600*380;',
                 croppParamePoster:{
                   croppersW:"1000px",//裁剪显示区域大小（像素）
                   croppersH:"500px",//裁剪显示区域大小（像素）
                   autoCropWidth:"600", //裁剪框的宽度（无）
                   autoCropHeight:"380", //裁剪框的高度（无）
                   top:"30vh",           //裁剪后弹窗顶部距离
                   topCrop:"20vh"       //裁剪前弹窗顶部距离
                 },
                 isCrop:true,
                 uploadParame:{
                    data:{path:"card"},//上传图片时携带图片参数
                    limit:1,//图片上传最大数量
                    action:this.$api.upload, //上传图片地址
                 },
                 name:'cardUrlz' //formData对应key值名，formData[key]必须是数组
              },
              {prop:"card_img_f", label:'身份证反面：',type:'imgUpload',placeholder:'图片建议尺寸：600*380;',
                 croppParamePoster:{
                   croppersW:"1000px",//裁剪显示区域大小（像素）
                   croppersH:"500px",//裁剪显示区域大小（像素）
                   autoCropWidth:"600", //裁剪框的宽度（无）
                   autoCropHeight:"380", //裁剪框的高度（无）
                   top:"30vh",           //裁剪后弹窗顶部距离
                   topCrop:"20vh"       //裁剪前弹窗顶部距离
                 },
                 isCrop:true,
                 uploadParame:{
                    data:{path:"card"},//上传图片时携带图片参数
                    limit:1,//图片上传最大数量
                    action:this.$api.upload, //上传图片地址
                 },
                 name:'cardUrlf' //formData对应key值名，formData[key]必须是数组
              }
            ];

            return form;
        },
        getTypeWork(prentid,types){
          //console.log(prentid,types)
          const loading = this.$loading({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
           type:"get",
           data:{parent_id:prentid},
           url:this.$api.worker,
           success:(res)=>{
              loading.close();

              if(res.code==200){

                if(prentid=='0'){
                   this.typeWork=res.data;
                }else{
                  if(types){
                    this.type_s=types;
                  }else{
                    if(res.data.length>0){
                      this.type_s=res.data[0].value;
                    }else{
                      this.type_s="";
                    }
                  }
                  this.typeWorks=res.data;
                }
              }else{
                 this.$message.error(res.msg);
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
  .tag-list-box{
    display: inline-block;
    margin-right: 15px;
  }
  .selectInfo{
    padding-top: 20px;
  }
  .user-header{
    width: 50px;
    height: 50px;
    background: #EEEEEE;
    border-radius: 50%;
    box-shadow: 0 0 10px #AAAAAA;
    margin-left: 15px;
    position: relative;
    top: 15px;
  }
  .user-header .el-image{

    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .user-info{
    min-height: 50px;
    line-height: 50px;
    /* text-align: center; */
  }
  .setinfo{
    margin-left: 50px;
  }
  .user{
    padding:10px 0;
    font-size: 14px;
  }
  .title-txt{
    font-size: 15px;
  }
  .formBoxS{
    height: 65vh;
    overflow: scroll;
  }
</style>
