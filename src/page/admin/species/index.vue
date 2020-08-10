<template>
  <div>
      <div class="search-box">
        <el-button type="primary" size="small" round  @click="eventOperation('addSpecies',{type:'top'})">添加顶级<i class="el-icon-plus el-icon--right"></i></el-button>
      </div>
      <div class="user main">
           <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            :header-cell-style="headerClassName"
            :tree-props="{children: 'children'}">
            <el-table-column prop="name" label="工种">
            </el-table-column>
            <el-table-column  prop="price" label="工种单价（元/天）">
              <template slot-scope="scope">
                {{scope.row.price=='0.00'? '--' :scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column
              prop="sort"
              label="排序" >

            </el-table-column>
            <el-table-column
              prop="datetime"
              label="添加时间">
            </el-table-column>
            <el-table-column label="操作" width="280" >
                <template slot-scope="scope">
                  <el-button size="mini" v-if="scope.row.parent_id==='0'" type="primary" plain @click="eventOperation('addSpecies',scope)">添加</el-button>
                  <el-button type="warning" size="mini" v-if="scope.row.parent_id!=='0'" @click="eventOperation('setSpecies',scope)">地区价格设置</el-button>
                  <el-button size="mini" @click="eventOperation('editSpecies',scope)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="eventOperation('delSpecies',scope)">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
      </div>
    <!-- 添加 -->
    <el-drawer size='50%' :wrapperClosable='true' :show-close="false" :visible="visible=='addSpecies'||visible=='editSpecies'" direction="rtl" custom-class="drawer-box" >
      <div slot="title" class="drawer-title"><el-page-header @back="handleClose" :content="title"></el-page-header></div>
      <div class="drawerContent">
        <!-- <UserDetails ref="userdetails" :data="userdata" /> -->
        <AddSpecies ref="species" @evnetPost="submit"></AddSpecies>
      </div>
    </el-drawer>

    <!-- 设置地区价格 -->
    <el-drawer
      size='50%' :wrapperClosable='true' :show-close="false" :visible="visible=='setSpecies'" direction="rtl" custom-class="drawer-box" >
      <div slot="title" class="drawer-title"><el-page-header @back="handleClose" :content="title"></el-page-header></div>
      <div class="drawerContent">
        <!-- <UserDetails ref="userdetails" :data="userdata" /> -->
        <SetArea @evnetPost="submit" ref="speciesSetArea"></SetArea>
      </div>
    </el-drawer>


  </div>
</template>

<script>

  import AddSpecies from "./add";  //添加数据
  import SetArea from "./set";  //设置地区价格
  export default {
    components:{AddSpecies,SetArea},
    data(){
      return{
         title:"添加品牌",
          visible:"",
          type:"",
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
            name:""
          }
      }
    },
    mounted(){
      this.loadTable();
    },
    methods:{
      headerClassName({row, rowIndex}){
        //设置表头样式
        return {"backgroundColor":"#eef1f6","color":"#000000"};
      },
       //刷新数据
      refreshData(){
        this.loadTable(true);
      },
      //关闭弹窗
      handleClose(t){
        if(t=='load'){
          this.loadTable();
        }
       // this.$refs.species.showFormDatas();
        this.visible=false;
      },
      //触发操作按钮
      eventOperation(type,data){
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
        this.visible=type;
        if(type=='addSpecies'){
          this.title="添加工种";
          setTimeout(()=>{
            this.$refs.species.showFormData(type,data);
          },100)
        }else if(type=='editSpecies'){
          this.title="编辑工种";
          setTimeout(()=>{
            this.$refs.species.showFormData(type,data);
          },100)
        }else if(type=='delSpecies'){
          let {id,name}=data.row;
          this.$confirm('此操作将永久删除, 是否确定删除此工种?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            this.postData({
              id:id,
              name:name,
            },this.$api.delSpecies);

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

        }else if(type=='setSpecies'){
          this.title="工种地区价格配置";
          setTimeout(()=>{
            this.$refs.speciesSetArea.showFormData(type,data);
          },30)
         // console.log('set')
        }
      },
      //保存数据
      submit(data){
        //添加数据
        if(this.type==='addSpecies'){
          this.postData(data,this.$api.addSpecies);
        }
         //编辑数据
        if(this.type==='editSpecies'){
          this.postData(data,this.$api.editSpecies);
        }
        //设置地区价格
        if(this.type==='setSpecies'){
          this.postData({id:data.id,listdata:JSON.stringify(data.list)},this.$api.setSpecies);
        }
      },
      //提交数据后台
      postData(data,url){
        const loading = this.$loading({
          lock: true,
          text: '添加中...',
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
          {prop:"imgurl",name:"品牌图片",minWidth:170,isShowType:"img",isbase:false},
          {prop:"name",name:"品牌名称",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"datetime",name:"添加时间",minWidth:170,isShowType:"default"},
          {name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
            {size:"mini",type:"primary",plain:true,name:"编辑",field:'edit'},
            {size:"mini",type:"danger",plain:true,name:"删除",field:'del'}
          ]}
        ]
        return c;
      },
      loadTable(){
        this.getData();
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
        url:this.$api.speciesList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
              this.tableData=res.data;
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
</style>
