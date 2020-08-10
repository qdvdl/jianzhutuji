<template>
  <div>
      <div class="search-box">
        <el-form :inline="true" :model="extra" class="demo-form-inline">
            <el-form-item label="投诉人姓名:">
              <el-input v-model="extra.user_name" placeholder="投诉人姓名"></el-input>
            </el-form-item>
            <el-form-item label="投诉人电话:">
              <el-input v-model="extra.user_tel" placeholder="投诉人电话"></el-input>
            </el-form-item>
            <el-form-item label="被投诉人:">
              <el-input v-model="extra.obj_name" placeholder="被投诉人"></el-input>
            </el-form-item>
            <el-form-item label="被投诉人电话:">
              <el-input v-model="extra.obj_tel" placeholder="被投诉人电话"></el-input>
            </el-form-item>
            <el-form-item label="投诉时间:">
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
           <Complaints :vehicle="vehicle" ref="complaints" @evnetPost="submit"></Complaints>
         </div>
       </el-drawer>
    </div>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import PageBott from '@/components/pageBott';//分页组件
  import Complaints from "./add";  //添加数据
  import ClientInfo from "./see";  //查看详情
  export default {
    components:{TbaleList,PageBott,Complaints,ClientInfo},
    data(){
      return{
        dealc_sum:0,
        dealv_sum:0,
        info:{},//详情
        isSeeShow:false,//详情展示
        admin_id:"",
        // 导出导出
        action:this.$api.importOrder,//导入文件接口
        templateUrl:this.$api.downTempOrder ,//下载文件模版地址
        exportUrl:this.$api.exportOrder   ,//导出数据地址
        isImport:this.$handleVerify('importOrder'),   //是否显示导入
        isExport:this.$handleVerify('exportOrder'),    //是否显示导出
        isDown:this.$handleVerify('downTempOrder'),      //是否显示下载
        // 其他字段
          title:"添加品牌",
          visible:false, //添加||编辑
          type:"",
          //分页配置
          pageMeter:{
            limit:10,
            page:1,
            total:0
          },
          vehicle:[],
          tableData:[],
          userdata:{},
          column:this.columns(),
          extra:{
            user_name:"",
            user_tel:"",
            obj_name:"",
            obj_tel:"",
            datetime:""
          },
          operation:{
            add:"addClient",      //添加客户
            edit:"editClient",   //编辑客户
            deal:"turClient", //成交客户
            see:"seeClient", //查看详情
            oteam:"oteamClient" //分配管理员
          },
          //成交信息
          titles:'成交信息',
          formVisible:false,
          formDeal:{
            id:"",
            client_name:"",
            deal_price:"",
            deal_time:""
          },
          //管理员
          admin:[]
      }
    },
    mounted(){
      this.loadTable();
    },
    methods:{
      successLoad(){
        // 导入成功
        this.loadTable(true);
      },
      //成交信息
      dealPrice(v){
        this.formDeal.deal_price=(v.match(/^\d*(\.?\d{0,2})/g)[0]) || null; //保留2位小数字
      },
       //刷新数据
      refreshData(){
        this.loadTable(true);
      },
      //关闭弹窗
      handleClose(t){
        if(t=='load'){
          this.loadTable(this.type=='add',this.type=='del');
        }
        this.formVisible=false;
        this.visible=false;
        this.isSeeShow=false;
      },
      //搜索数据
      select_chg(v){
        this.loadTable(true);
      },
      search_btn(off){
        if(!off){
          //清空搜索数据
          this.extra={
           user_name:"",
           user_tel:"",
           obj_name:"",
           obj_tel:"",
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
        if(type=='fComplaints'){
          this.title="投诉反馈";
          this.visible=true;
          setTimeout(()=>{
            this.$refs.complaints.showFormData(data,type);
          },30)
        }else if(type=='seeComplaints'){
            this.title="投诉反馈";
            this.visible=true;
            setTimeout(()=>{
              this.$refs.complaints.showFormData(data,type);
            },30)
        }
      },
      //保存数据
      submit(data){
        //回复内容
        // console.log(data)
        this.postData(data,this.$api.fComplaints);

      },
      //提交数据后台
      postData(data,url){
        const loading = this.$loading({
          lock: true,
          text: '操作中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$request({
         type:"post",
         data:data,
         url:url,
         success:(res)=>{
            loading.close();
            if(res.code==200){
               this.$message.success(res.msg);
               this.handleClose('load');
            }else{
               this.$message.error(res.msg);
            }
         },error:(err)=>{
           this.$message.error(err);
         }
        });
      },
      // 表格数据相关
      columns(){
        let c=[
          //配置列表显示数据
          {prop:"headimg",name:"头像",minWidth:170,isShowType:"img",isbase:true},
          {prop:"user_name",name:"投诉人（工人姓名）",minWidth:170,isShowType:"default"},
          {prop:"user_tel",name:"联系电话（工人）",minWidth:170,isShowType:"default"},
          {prop:"obj_user_name",name:"投诉对象（包工）",minWidth:170,isShowType:"default"},
          {prop:"obj_user_tel",name:"联系电话（包工）",minWidth:170,isShowType:"default"},
          {prop:"datetime",name:"投诉时间",minWidth:170,isShowType:"default"},
          {prop:"text",name:"投诉内容",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {prop:"f_text",name:"投诉反馈",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {prop:"datetime_f",name:"反馈时间",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {name:"操作",minWidth:220,align:'center',fixed:"right",isShowType:"btn",btnArr:[
            {size:"mini",type:"danger",plain:true,name:"投诉反馈",field:'fComplaints',state:"1",fieldName:"state"},
            {size:"mini",type:"info",plain:true,name:"详情",field:'seeComplaints',state:"2",fieldName:"state"},
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
        url:this.$api.complaintsList,
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
