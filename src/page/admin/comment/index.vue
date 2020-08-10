<template>
  <div>
      <div class="search-box">


        <el-form :inline="true" :model="extra" class="demo-form-inline">
           <el-form-item label="评价人姓名:">
             <el-input v-model="extra.user_name" placeholder="评价人姓名"></el-input>
           </el-form-item>
           <el-form-item label="评价人电话:">
             <el-input v-model="extra.user_tel" placeholder="评价人电话"></el-input>
           </el-form-item>
           <el-form-item label="评价对象:">
             <el-input v-model="extra.obj_name" placeholder="评价对象"></el-input>
           </el-form-item>
           <el-form-item label="评价对象电话:">
             <el-input v-model="extra.obj_tel" placeholder="评价对象电话"></el-input>
           </el-form-item>
           <el-form-item label="评价时间:">
             <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.datetime" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
           </el-form-item>

           <el-form-item label="显示状态:">
             <el-select v-model="extra.show_type" placeholder="请选择">
               <el-option label="全部" value=""></el-option>
               <el-option label="显示" value="1"></el-option>
               <el-option label="隐藏" value="2"></el-option>
             </el-select>
           </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" @click="search_btn(true)">查询</el-button>
              <el-button type="primary" size="small" @click="search_btn(false)">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-button type="primary" @click="eventOperation({type:'showComment',data:{}})" size="small" round>显示<i class="el-icon-check el-icon--right"></i></el-button>
      <el-button type="danger" size="small" @click="eventOperation({type:'hideComment',data:{type:'0'}})" round>隐藏<i class="el-icon-warning el-icon--right"></i></el-button>
      <div class="user main">
      <TbaleList :offSelect="true" @selectionChange="selectionChanges" minHeight="530" :tableData="tableData" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>
      <!-- 详情组件 -->
       <el-drawer size='50%' :wrapperClosable='true' :show-close="false" :visible="visibleType==='seeComment' " direction="rtl" custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" content="详情"></el-page-header></div>
         <div class="drawerContent">
           <Details ref="seeComment"/>
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
            user_name:"",
            user_tel:"",
            obj_name:"",
            obj_tel:"",
            datetime:"",
            show_type:""
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
            user_name:"",
            user_tel:"",
            obj_name:"",
            obj_tel:"",
            datetime:"",
            show_type:""
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

        if(type==='seeComment'){
           setTimeout(()=>{
              this.$refs.seeComment.resetload(data.row);
           },30)
        }
        //显示评价
        if(type=="showComment"){
            if(this.selectAlldata.length>0){
               let isid="";
               let isto=this.selectAlldata.every((item)=>{
                 isid=isid=='' ? item.id : isid+","+item.id;
                 return item.show_type=='2';
               })
               if(!isto){
                 this.$message.error('勾选中包含已经显示评价！');
                 return false;
               }
              this.confirmOperation('是否确认显示所选评价？',{isid:isid,show_type:'1'},this.$api.showComment);
            }else{
              this.$message.error('请勾选要显示的评价！');
            }
        }
        //隐藏评价
        if(type=="hideComment"){
          if(this.selectAlldata.length>0){
             let isid="";
             let isto=this.selectAlldata.every((item)=>{
               isid=isid=='' ? item.id : isid+","+item.id;
               return item.show_type=='1';
             })
             if(!isto){
               this.$message.error('勾选中包含已经隐藏评价！');
               return false;
             }
              this.confirmOperation('是否确认隐藏所选评价？',{isid:isid,show_type:'2'},this.$api.hideComment);
          }else{
            this.$message.error('请勾选要显示的评价！');
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
          {prop:"headimg",name:"头像",minWidth:170,isShowType:"img",isbase:true},
          {prop:"user_name",name:"评价人",minWidth:170,isShowType:"default"},
          {prop:"user_tel",name:"评价人电话",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"obj_user_name",name:"评价对象",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"obj_user_tel",name:"评价对象电话",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"text",name:"评价内容",minWidth:200,isShowType:"default"},
          {prop:"show_type_text",name:"状态",minWidth:170,isShowType:"default"},
          {prop:"datetime",name:"评价时间",minWidth:200,isShowType:"default"},
          {prop:'state',name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
             {size:"mini",type:"info",plain:true,name:"详情",field:'seeComment'},
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
        url:this.$api.commentList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
              this.pageMeter.total=res.data.count;
              this.tableData=res.data.data;
              // this.typeWorklist=res.data.typeWork;
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
