<template>
  <div>
      <div class="search-box">

        <el-form :inline="true" :model="extra" class="demo-form-inline">
           <el-form-item label="昵称:">
             <el-input v-model="extra.nickname" placeholder="用户昵称"></el-input>
           </el-form-item>
           <el-form-item label="姓名:">
             <el-input v-model="extra.name" placeholder="用户姓名"></el-input>
           </el-form-item>
           <el-form-item label="联系电话:">
             <el-input v-model="extra.tel" placeholder="联系电话"></el-input>
           </el-form-item>
           <el-form-item label="身份证号:">
             <el-input v-model="extra.cardid" placeholder="身份证号"></el-input>
           </el-form-item>
           <el-form-item label="注册地区:">
             <el-input v-model="extra.city" placeholder="注册地区"></el-input>
           </el-form-item>
        <!--   <el-form-item label="出生日期:">
              <el-date-picker value-format="yyyy-MM-dd" :editable='false' v-model="extra.birthday" type="daterange" :unlink-panels="true" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
           </el-form-item> -->
           <el-form-item label="审核状态:">
             <el-select v-model="extra.audit" placeholder="请选择">
               <el-option label="全部" value=""></el-option>
               <el-option label="待审核" value="3"></el-option>
               <el-option label="未通过" value="2"></el-option>
               <el-option label="已通过" value="1"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="用户状态:">
             <el-select v-model="extra.state" placeholder="请选择">
               <el-option label="全部" value=""></el-option>
               <el-option label="已冻结" value="0"></el-option>
               <el-option label="正常" value="1"></el-option>
             </el-select>
           </el-form-item>

          <!-- <el-form-item label="工种:">
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
           </el-form-item> -->

            <el-form-item label="注册时间:">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.datetime" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="search_btn(true)">查询</el-button>
              <el-button type="primary" size="small" @click="search_btn(false)">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-button type="primary" @click="eventOperation({type:'auditWorkers',data:{}})" size="small" round>批量审核<i class="el-icon-check el-icon--right"></i></el-button>
      <el-button type="danger" size="small" @click="eventOperation({type:'frozenThaw',data:{type:'0'}})" round>批量冻结<i class="el-icon-warning el-icon--right"></i></el-button>
      <el-button type="success" size="small" @click="eventOperation({type:'frozenThaw',data:{type:'1'}})" round>批量解冻<i class="el-icon-success el-icon--right"></i></el-button>
      <div class="user main">
      <TbaleList :offSelect="true" @selectionChange="selectionChanges" minHeight="530" :tableData="tableData" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>
      <!-- 详情组件 -->
       <el-drawer size='50%' :wrapperClosable='true' :show-close="false" :visible="visibleType==='seeWorkers' " direction="rtl" custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" content="详情"></el-page-header></div>
         <div class="drawerContent">
           <UserDetails ref="userdetails" :data="userdata" />
         </div>
       </el-drawer>
       <!-- 设置 -->
       <el-drawer size='50%' :wrapperClosable='true' :show-close="false" :visible="visibleType==='editWorkers'" direction="rtl" custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" :content="visibleTitle"></el-page-header></div>
         <div class="drawerContent">
             <Userset ref="editWorkers" @evnetPost="submit"></Userset>
         </div>
       </el-drawer>
       <!-- 审核用户 -->
      <el-dialog width="400px" :close-on-click-modal='false' title="审核用户" :visible.sync="dialogFormVisible">
        <el-select v-model="audit" placeholder="请选择审核状态">
          <el-option label="通过" value="1"></el-option>
          <el-option label="拒绝" value="2"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="auditFfunc">确 定</el-button>
        </div>
      </el-dialog>


    </div>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import PageBott from '@/components/pageBott';//分页组件
  import UserDetails from "./details";  //详情数据
  import Userset from "./set";  //设置操作
  export default {
    components:{TbaleList,PageBott,UserDetails,Userset},
    data(){
      return{
          audit:"",
          auditid:"",
          dialogFormVisible:false,
          visibleType:"",
          visibleTitle:"",
          //分页配置
          pageMeter:{
            limit:10,
            page:1,
            total:0
          },
          tableData:[],
          userdata:{},
          column:this.columns(),
          typeWorklist:[],
          typesWorklist:[],
          selectAlldata:[],//批量操作选中
          extra:{
           nickname:"",
           tel:"",
           name:"",
           datetime:"",
           cardid:"",
           city:"",
           birthday:"",
           audit:"",
           state:"",
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
            nickname:"",
            tel:"",
            name:"",
            datetime:"",
            cardid:"",
            city:"",
            birthday:"",
            audit:"",
            state:"",
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
        if(type==='seeWorkers'){
           this.userdata=data.row;
           setTimeout(()=>{
              this.$refs.userdetails.resetload(data.row);
           },30)
        }
        if(type=="editWorkers"){
          //包工头
          this.visibleTitle="编辑包工头";
          setTimeout(()=>{
             this.$refs.editWorkers.resetload(data.row);
          },30)
        }
        //批量审核
        if(type=="auditWorkers"){
            if(this.selectAlldata.length>0){
               let isid="";
               let isto=this.selectAlldata.every((item)=>{
                 isid=isid=='' ? item.id : isid+","+item.id;
                 return item.audit!=='1';
               })
               if(!isto){
                 this.$message.error('勾选中有已经审核的用户！');
                 return false;
               }

               this.audit="";
               this.dialogFormVisible=true;
               this.auditid=isid;

            }else{
              this.$message.error('请勾选要审核的用户！');
            }

        }
        //批量冻结/解冻
        if(type=="frozenThaw"){

          if(data.type=='0'){
            if(this.selectAlldata.length>0){
               let isid="";
               let isto=this.selectAlldata.every((item)=>{
                 isid=isid=='' ? item.id : isid+","+item.id;
                 return item.state=='1';
               })
               if(!isto){
                 this.$message.error('勾选中有已经冻结的用户！');
                 return false;
               }
               this.confirmOperation('确认冻结该用户？',{isid:isid,state:'0'});
            }else{
              this.$message.error('请勾选要冻结的用户！');
            }
          }

          if(data.type=='1'){
            if(this.selectAlldata.length>0){
               let isid="";
               let isto=this.selectAlldata.every((item)=>{
                 isid=isid=='' ? item.id : isid+","+item.id;
                 return item.state=='0';
               })
               if(!isto){
                  this.$message.error('勾选中有未冻结的用户！');
                 return false;
               }
               this.confirmOperation('确认启用该用户？',{isid:isid,state:'1'});
            }else{
              this.$message.error('请勾选要解冻的用户！');
            }
          }

        }
      },
      //审核确认
      auditFfunc(){
         if(this.audit===''){
           this.$message.error('请选择审核状态！');
           return false;
         }

         this.postData({
           audit:this.audit,
           isid:this.auditid,
         },this.$api.auditContractor);

      },
      confirmOperation(msg,data){
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.postData(data,this.$api.frozenThawC);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      //提交
      submit({data}){
        this.postData(data,this.$api.editContractor);
      },
      //设置成功
      postData(data,url){
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
                this.loadTable();
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
          {prop:"headimg",name:"头像",minWidth:170,isShowType:"img",isbase:true},
          {prop:"nickname",name:"昵称",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"name",name:"姓名",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"age",name:"年龄",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"tel",name:"联系电话",minWidth:170,isShowType:"default"},
          {prop:"cardid",name:"身份证号",minWidth:190,isShowType:"default"},
          {prop:"num",name:"下单数量",minWidth:170,isShowType:"default"},
          {prop:"audittext",name:"审核状态",minWidth:170,isShowType:"default"},
          {prop:"statetext",name:"包工状态",minWidth:170,isShowType:"default"},
          {prop:"province_city",name:"注册地区",minWidth:170,isShowType:"default"},
          {prop:"datetime",name:"注册时间",minWidth:170,isShowType:"default"},
          {prop:'state',name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
             {size:"mini",type:"primary",plain:true,name:"编辑",field:'editWorkers'},
             {size:"mini",type:"info",plain:true,name:"详情",field:'seeWorkers'},
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
      loadTable(isReset){
        //isReset是否重置从第一页开始
        if(isReset){
          this.pageMeter.page=1;
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
        url:this.$api.contractorList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
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
