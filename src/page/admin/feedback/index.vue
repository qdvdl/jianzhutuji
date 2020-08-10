<template>
  <div>
      <div class="search-box">

        <el-form :inline="true" :model="extra" class="demo-form-inline">
            <el-form-item label="反馈人昵称:">
              <el-input v-model="extra.nickname" placeholder="反馈人昵称"></el-input>
            </el-form-item>
            <el-form-item label="反馈人姓名:">
              <el-input v-model="extra.name" placeholder="反馈人姓名"></el-input>
            </el-form-item>
            <el-form-item label="反馈人电话:">
              <el-input v-model="extra.tel" placeholder="反馈人电话"></el-input>
            </el-form-item>

            <el-form-item label="反馈人类型:">
              <el-select v-model="extra.cwstate" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="工人" value="1"></el-option>
                <el-option label="包工" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="反馈时间:">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.datetime" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="search_btn(true)">查询</el-button>
              <el-button type="primary" size="small" @click="search_btn(false)">重置</el-button>
            </el-form-item>
        </el-form>
      </div>

      <div class="user main">
      <TbaleList minHeight="500" :unfold="true" :tableData="tableData" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>
      <!-- 添加编辑 -->
       <el-drawer
         size='50%'
         :wrapperClosable='false'
         :show-close="false"
         :visible.sync="visible"
         direction="rtl"
         custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" :content="title"></el-page-header></div>
         <div class="drawerContent">
           <Feedback ref="seeFeedback"></Feedback>
         </div>
       </el-drawer>
    </div>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import PageBott from '@/components/pageBott';//分页组件
  import Feedback from "./add";  //添加数据
  export default {
    components:{TbaleList,PageBott,Feedback},
    data(){
      return{
          title:"",
          visible:false,
          type:"",
          //分页配置
          pageMeter:{
            limit:10,
            page:1,
            total:0
          },
          tableData:[],
          column:this.columns(),
          extra:{
             nickname:"",
             name:"",
             tel:"",
             cwstate:"",
             datetime:""
          }
      }
    },
    mounted(){
      this.loadTable();
    },
    methods:{
       //刷新数据
      refreshData(){
        this.loadTable(true);
      },
      //关闭弹窗
      handleClose(t){
        if(t=='load'){
          this.loadTable();
        }
        this.visible=false;
      },
      //搜索数据
      select_chg(v){
        this.loadTable(true);
      },
      search_btn(off){
        if(!off){
          //清空搜索数据
          this.extra={
            nickname:"",
            name:"",
            tel:"",
            cwstate:"",
            datetime:""
          }
        }
        this.loadTable(true);
      },
      //触发操作按钮
      eventOperation({data,type}){
        //验证是否有操作权限
        if(!this.$handleVerify(type)){
          this.$message({
            showClose: true,
            message:this.$authorityMsg,
            type: 'error'
          });
          return false;
        }
        //如果是添加
        this.type=type;
        if(type=='seeFeedback'){
          this.title="反馈详情";
          this.visible=true;
          setTimeout(()=>{
            this.$refs.seeFeedback.showFormData(data,type);
          },30)
        }
      },
      // 表格数据相关
      columns(){
        let c=[
          //配置列表显示数据
          {prop:"headimg",name:"头像",minWidth:170,isShowType:"img",isbase:true},
          {prop:"nickname",name:"昵称",minWidth:170,isShowType:"default"},
          {prop:"user_name",name:"姓名",minWidth:170,isShowType:"default"},
          {prop:"user_tel",name:"联系电话",minWidth:170,isShowType:"default"},
          {prop:"cwstate_text",name:"反馈人类型",minWidth:170,isShowType:"default"},
          {prop:"datetime",name:"反馈时间",minWidth:170,isShowType:"default"},
          {prop:"text",name:"反馈意见",minWidth:170,isShowType:"default",isUnfold:true},
          {name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
            {size:"mini",type:"primary",plain:true,name:"详情",field:'seeFeedback'}
            // {size:"mini",type:"info",plain:true,name:"详情",field:'see'}
            // {size:"mini",type:"danger",plain:true,name:"成交",field:'deal',state:"1",fieldName:"deal_state"},
            // {size:"mini",type:"danger",plain:true,name:"操作员分组",field:'oteam'}
          ]}
        ]
        return c;
      },

      currChange({limit,page}){
        this.pageMeter.limit=limit;
        this.pageMeter.page=page;
        //分页开始
        this.loadTable();
      },
      loadTable(isReset,isResetCount){
        //isReset是否重置从第一页开始
        //isResetCounts 重新计算分页
        if(isReset){
          this.pageMeter.page=1;
        }

        if(isResetCount){
          if(this.tableData.length<=1&&this.pageMeter.page>1){
            this.pageMeter.page=this.pageMeter.page-1;
          }
        }

        let data=Object.assign({},this.extra,{
          limit:this.pageMeter.limit,
          page:this.pageMeter.page
        });

        this.getData(data);
      },
      getData(data){
       const loading = this.$loading({
         lock: true,
         text: '加载中',
         spinner: 'el-icon-loading',
         background: 'rgba(0, 0, 0, 0.7)'
       });
       this.$request({
        type:"get",
        data:data,
        url:this.$api.feedbackList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
              this.pageMeter.total=res.data.count;
              this.tableData=res.data.data;
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
   @import url("../../../assets/css/main.css");
   .footerText{
     height:32px;
     line-height:32px;
     text-align: left;
     margin-bottom: 10px;
   }
   .footerText strong{
     padding-left: 15px;
     margin-right: 5px;
     font-weight: 500;
   }
   .footerText span{
     margin-right: 40px;
     font-size: 18px;
     font-weight: 500;
     color: red;
   }
</style>
