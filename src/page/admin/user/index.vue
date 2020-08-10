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
            <el-form-item label="用户身份:">
              <el-select v-model="extra.cwstate" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="无" value="0"></el-option>
                <el-option label="工人" value="1"></el-option>
                <el-option label="包工" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="注册时间:">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.datetime" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="search_btn(true)">查询</el-button>
              <el-button type="primary" size="small" @click="search_btn(false)">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-button type="warning" size="small" round @click="eventOperation({type:'rWorker',data:{}})">撤销工人<i class="el-icon-error el-icon--right"></i></el-button>
      <el-button type="danger" size="small" round @click="eventOperation({type:'rContractor',data:{}})">撤销包工<i class="el-icon-error el-icon--right"></i></el-button>
      <div class="user main">
      <TbaleList :offSelect="true" @selectionChange="selectionChanges" minHeight="530" :tableData="tableData" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>
      <!-- 详情组件 -->
       <el-drawer size='50%' :wrapperClosable='true' :show-close="false" :visible="visibleType==='userDetails' " direction="rtl" custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" content="详情"></el-page-header></div>
         <div class="drawerContent">
           <UserDetails ref="userdetails" :data="userdata" />
         </div>
       </el-drawer>
       <!-- 设置 -->
       <el-drawer size='50%' :wrapperClosable='true' :show-close="false" :visible="visibleType==='contractor'" direction="rtl" custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" :content="visibleTitle"></el-page-header></div>
         <div class="drawerContent">
             <Userset ref="contractor" @evnetPost="submit"></Userset>
         </div>
       </el-drawer>
        <el-drawer size='50%' :wrapperClosable='true' :show-close="false" :visible="visibleType==='worker'" direction="rtl" custom-class="drawer-box" >
           <div slot="title" class="drawer-title"><el-page-header @back="handleClose" :content="visibleTitle"></el-page-header></div>
           <div class="drawerContent">
               <Userset ref="worker" @evnetPost="submit"></Userset>
           </div>
         </el-drawer>
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
          selectAlldata:"",
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
          extra:{
            nickname:"",
            cwstate:"",
            tel:"",
            cardid:"",
            name:"",
            datetime:""
          }
      }
    },
    mounted(){
      this.loadTable();
    },
    methods:{
      selectionChanges(data){
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
            cwstate:"",
            tel:"",
            cardid:"",
            name:"",
            datetime:""
          }
        }
        this.loadTable(true);
      },
      eventOperation({type,data}){
        //console.log(type)
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
        if(type==='userDetails'){
           this.userdata=data.row;
           setTimeout(()=>{
              this.$refs.userdetails.resetload(data.row);
           },100)
        }
        if(type=="worker"){
          //工人
          this.visibleTitle="设为工人";
          data.row.typework="gr",
          setTimeout(()=>{
             this.$refs.worker.resetload(data);
          },10)
        }
        if(type=="contractor"){
          //包工
          this.visibleTitle="设为包工";
          data.row.typework="bg",
          setTimeout(()=>{
             this.$refs.contractor.resetload(data);
          },10)

        }
        //撤销工人
        if(type=='rWorker'){
           if(this.selectAlldata.length>0){
              let isid="";
              let isto=this.selectAlldata.every((item)=>{
                isid=isid=='' ? item.id : isid+","+item.id;
                return item.cwstate=='1';
              })
              if(!isto){
                this.$message.error('勾选中包含了不是工人的用户！');
                return false;
              }

              this.$confirm('确认将所选用户撤销工人身份？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

                this.postData({
                   isid:isid,
                },this.$api.rWorker);

              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消操作'
                });
              });



           }else{
             this.$message.error('请勾选要撤销的工人！');
           }
        }
        //撤销包工
        if(type=='rContractor'){
           if(this.selectAlldata.length>0){
              let isid="";
              let isto=this.selectAlldata.every((item)=>{
                isid=isid=='' ? item.id : isid+","+item.id;
                return item.cwstate=='2';
              })
              if(!isto){
                this.$message.error('勾选中包含了不是包工头的用户！');
                return false;
              }


              this.$confirm('确认将所选用户撤销包工身份？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

                this.postData({
                  isid:isid,
                },this.$api.rContractor);

              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消操作'
                });
              });


           }else{
             this.$message.error('请勾选要撤销的包工头用户！');
           }
        }

      },
      //提交数据
      submit({data,type}){
        if(type=='gr'){
           this.postData(data,this.$api.worker);
        }
        if(type=='bg'){
           this.postData(data,this.$api.contractor);
        }

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
          {prop:"wstatet",name:"是否为工人",minWidth:170,isShowType:"default"},
          {prop:"cstatet",name:"是否为包工",minWidth:170,isShowType:"default"},
          {prop:"datetime",name:"注册时间",minWidth:170,isShowType:"default"},
          {prop:'state',name:"操作",minWidth:300,align:'center',fixed:"right",isShowType:"btn",btnArr:[
             {size:"mini",type:"primary",plain:true,name:"设为工人",field:'worker',state:"1",fieldName:"gztype"},
             {size:"mini",type:"danger",plain:true,name:"设为包工",field:'contractor',state:"1",fieldName:"gztype"},
             {size:"mini",type:"info",plain:true,name:"详情",field:'userDetails'},
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
        url:this.$api.userList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
              this.pageMeter.total=res.data.count;
              this.tableData=res.data.data;
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
