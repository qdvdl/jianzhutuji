<template>
  <div>
      <div class="search-box">

        <el-form :inline="true" :model="extra" class="demo-form-inline">
           <el-form-item label="包工姓名:">
             <el-input v-model="extra.uc_name" placeholder="包工姓名"></el-input>
           </el-form-item>
           <el-form-item label="包工电话:">
             <el-input v-model="extra.uc_tel" placeholder="包工电话"></el-input>
           </el-form-item>
           <el-form-item label="工人姓名:">
             <el-input v-model="extra.uw_name" placeholder="工人姓名"></el-input>
           </el-form-item>
           <el-form-item label="工人电话:">
             <el-input v-model="extra.uw_tel" placeholder="工人电话"></el-input>
           </el-form-item>
           <el-form-item label="下单地区:">
             <el-input v-model="extra.city" placeholder="下单地区"></el-input>
           </el-form-item>
           <el-form-item label="下单时间:">
             <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.datetime_xd" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
           </el-form-item>
           <el-form-item label="接单时间:">
             <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.datetime_jd" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
           </el-form-item>
           <el-form-item label="完成时间:">
             <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.datetime_wc" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
           </el-form-item>

           <el-form-item label="订单状态:">
             <el-select v-model="extra.status" placeholder="请选择">
               <el-option label="全部" value=""></el-option>
               <el-option label="待接单" value="4"></el-option>
               <el-option label="已匹配" value="10"></el-option>
               <el-option label="待联系" value="5"></el-option>
               <el-option label="待开工" value="6"></el-option>
               <el-option label="服务中" value="7"></el-option>
               <el-option label="服务中(未到岗)" value="7-2"></el-option>
               <el-option label="待确认" value="3"></el-option>
               <el-option label="已完成" value="1"></el-option>
               <el-option label="包工已取消" value="2-2"></el-option>
               <el-option label="平台已取消" value="2-3"></el-option>
             </el-select>
           </el-form-item>

           <el-form-item label="工种:">
             <el-select v-model="extra.type_p" placeholder="请选择" @change="searchSelectType">
               <el-option label="全部" value=""></el-option>
               <el-option :label="item.name" :value="item.id" :key="item.id" v-for='item in typeWorklist'></el-option>
             </el-select>
           </el-form-item>

           <el-form-item v-if="extra.type_p">
             <el-select v-model="extra.type_s" placeholder="请选择">
               <el-option label="全部" value=""></el-option>
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for='item in typesWorklist'></el-option>
             </el-select>
           </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" @click="search_btn(true)">查询</el-button>
              <el-button type="primary" size="small" @click="search_btn(false)">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <p style="padding: 0px 0 15px 0px;">服务费金额统计：{{server_price_content}}</p>
      <el-button type="primary" @click="eventOperation({type:'okOrder',data:{}})" size="small" round>确认订单<i class="el-icon-check el-icon--right"></i></el-button>
      <el-button type="danger" size="small" @click="eventOperation({type:'cancelOrder',data:{type:'0'}})" round>取消订单<i class="el-icon-warning el-icon--right"></i></el-button>
      <el-button type="success" size="small" @click="eventOperation({type:'delOrder',data:{type:'1'}})" round>删除订单<i class="el-icon-success el-icon--right"></i></el-button>
      <div class="user main">
      <TbaleList :offSelect="true" @selectionChange="selectionChanges" minHeight="530" :tableData="tableData" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>
      <!-- 详情组件 -->
       <el-drawer size='50%' :wrapperClosable='true' :show-close="false" :visible="visibleType==='seeOrder' " direction="rtl" custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" content="详情"></el-page-header></div>
         <div class="drawerContent">
           <Details ref="seeOrder" :data="seeOrderdata" />
         </div>
       </el-drawer>

    </div>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import PageBott from '@/components/pageBott';//分页组件
  import Details from "./see";  //详情数据
  export default {
    components:{TbaleList,PageBott,Details},
    data(){
      return{
          server_price_content:"0",
          audit:"",
          auditid:"",
          dialogFormVisible:false,
          visibleType:"",
          visibleTitle:"",
          //分页配置
          selectAlldata:[],//批量操作选中参与计算
          pageMeter:{
            limit:10,
            page:1,
            total:0
          },
          tableData:[],
          seeOrderdata:{},
          column:this.columns(),
          typeWorklist:[],
          typesWorklist:[],
          extra:{
           status:"",
           datetime_wc:"",
           datetime_xd:"",
           datetime_jd:"",
           city:"",
           uw_name:"",
           uw_tel:"",
           uc_name:"",
           uc_tel:"",
           type_p:"",
           type_s:""
          }
      }
    },
    mounted(){
      this.loadTable();
    },
    methods:{
      //搜索选择
      searchSelectType(value){
        this.extra.type_s="";
        let typesWorklist=[];
        this.typeWorklist.map((item)=>{
            if(item.id==value){
              typesWorklist=item.children;
            }
        })
        this.typesWorklist=typesWorklist;
      },
      selectionChanges(data){
       // console.log(val)
        this.selectAlldata=data;
      },
      refreshData(){
        //刷新数据
        this.loadTable(true);
      },
      handleClose(){
        this.visibleType='';
      },
      search_btn(off){
        if(!off){
          this.extra={
            status:"",
            datetime_wc:"",
            datetime_xd:"",
            datetime_jd:"",
            city:"",
            uw_name:"",
            uw_tel:"",
            uc_name:"",
            uc_tel:"",
            type_p:"",
            type_s:""
          }
        }
        this.loadTable(true);
      },
      eventOperation({type,data}){
        //验证是否有操作权限
        if(!this.$handleVerify(type)){
          this.$message({
            showClose: true,
            message:this.$authorityMsg,
            type: 'error'
          });
          return false;
        }
        this.visibleType=type;

        if(type==='seeOrder'){
           this.seeOrderdata=data.row;
           setTimeout(()=>{
              this.$refs.seeOrder.resetload(data.row);
           },30)
        }
        //确认订单
        if(type=="okOrder"){
            if(this.selectAlldata.length>0){
               let isid="";
               let isto=this.selectAlldata.every((item)=>{
                 isid=isid=='' ? item.id : isid+","+item.id;
                 return item.status=='3';
               })
               if(!isto){
                 this.$message.error('请勾选要待确认订单！');
                 return false;
               }
              // console.log(isid)
               // this.audit="";
               // this.dialogFormVisible=true;
               // this.auditid=isid;
              this.confirmOperation('是否确认所选订单都已支付劳务费用？',{isid:isid,status:'1'},this.$api.okOrder);
            }else{
              this.$message.error('请勾选要确认的订单！');
            }

        }
        //取消订单
        if(type=="cancelOrder"){

          if(this.selectAlldata.length>0){
             let isid="";
             let isto=this.selectAlldata.every((item)=>{
               isid=isid=='' ? item.id : isid+","+item.id;
               return item.status=='4'||item.status=='7'&&item.state_wdg=='2';
             })

             if(!isto){
               this.$message.error('请对待接单、服务中（未到岗）的订单批量操作取消！');
               return false;
             }
             this.confirmOperation('是否取消所选订单？',{isid:isid,status:'2'},this.$api.cancelOrder);
          }else{
            this.$message.error('请勾选要取消的订单！');
          }
        }
         //删除订单
        if(type=="delOrder"){
          if(this.selectAlldata.length>0){
             let isid="";
             let isto=this.selectAlldata.every((item)=>{
               isid=isid=='' ? item.id : isid+","+item.id;
               return item.status=='2';
             })
             if(!isto){
                this.$message.error('勾选中有不是取消状态的订单！');
               return false;
             }
             this.confirmOperation('是否确认删除所选订单？',{isid:isid},this.$api.delOrder);
          }else{
            this.$message.error('请勾选要删除的订单！');
          }
        }
      },
      confirmOperation(msg,data,url){
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postData(data,url);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      //提交
      submit({data}){
        this.postData(data,this.$api.editWorkers);
      },
      //设置成功
      postData(data,url){
        // this.loadTable(false,this.visibleType=='delOrder');
        // return false;
          const loading = this.$loading({
            lock: true,
            text: '提交中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
            type:"post",
            url:url,
            data:data,
            success:(res)=>{
              this.dialogFormVisible=false;
              loading.close();
              if(res.code==200){
                this.$message.success(res.msg);
                this.loadTable(false,this.visibleType=='delOrder');
                this.visibleType="";
              }else{
                this.$message.error(res.msg);
              }
            },error:(err)=>{
              this.$message.error(err);
            }
          });

      },
      columns(){
        let c=[
          //配置列表显示数据
          {prop:"number",name:"订单号",minWidth:170,isShowType:"default"},
          {prop:"uw_name",name:"工人姓名",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"uw_tel",name:"工人电话",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"datetime_jd",name:"接单时间",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"uc_name",name:"包工姓名",minWidth:170,isShowType:"default"},
          {prop:"uc_tel",name:"包工电话",minWidth:190,isShowType:"default"},
          {prop:"datetime_xd",name:"下单时间",minWidth:200,isShowType:"default"},
          {prop:"province_city",name:"下单地区",minWidth:170,isShowType:"default"},
          {prop:"service_price",name:"服务金额",minWidth:170,isShowType:"default"},
          {prop:"status_text",name:"订单状态",minWidth:170,isShowType:"default"},
          {prop:'state',name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
             {size:"mini",type:"info",plain:true,name:"详情",field:'seeOrder'},
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
        //isResetCount重新计算分页
        if(isReset){
          this.pageMeter.page=1;
        }

        if(isResetCount){
          if((this.tableData.length-this.selectAlldata.length)<=0&&this.pageMeter.page>1){
            this.pageMeter.page=this.pageMeter.page-1;
          }
        }

        let data=Object.assign({},this.extra,{
          limit:this.pageMeter.limit,
          page:this.pageMeter.page
        });
       // console.log(this.selectAlldata.length);
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
        url:this.$api.orderList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
             this.server_price_content=!res.data.server_price_content?'0.00':res.data.server_price_content;
              this.pageMeter.total=res.data.count;
              this.tableData=res.data.data;
              this.typeWorklist=res.data.typeWork;
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
   @import url("../../../assets/css/main.css");
</style>
