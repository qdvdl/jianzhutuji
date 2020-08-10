<template>

  <div>
    <div class="form-box">
      <el-table
        :data="city"
        style="width: 100%;margin-bottom: 20px;"
        row-key="value"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="text" label="地区"></el-table-column>
        <el-table-column prop="name" label="价格">
          <template slot-scope="scope" v-if="scope.row.text!='北京市'&&scope.row.text!='天津市'&&scope.row.text!='上海市'&&scope.row.text!='重庆市'">
            <el-input oninput="this.value=this.value.replace(/[^\d]/g,'');" maxlength="10" :data-id="scope.row.value" v-model="scope.row.price" placeholder="请输入价格"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="时间(小时)">
          <template slot-scope="scope" v-if="scope.row.text!='北京市'&&scope.row.text!='天津市'&&scope.row.text!='上海市'&&scope.row.text!='重庆市'">
            <el-input oninput="this.value=this.value.replace(/[^\d]/g,'');"  maxlength="10" v-model="scope.row.hours" placeholder="请输入小时"></el-input>
          </template>
        </el-table-column>
      </el-table>
     </div>
     <div class="btn-box">
        <el-button type="primary" size="small" @click="submit">保存设置</el-button>
     </div>
  </div>
</template>

<script>
  import City from "@/components/city.data-3";
  export default {
    name:"Set",
    data(){
      return{
          city:[],
          inputevetn:"",
          id:""
      }
    },
    methods:{
      showFormData(type,data){
        this.id=data.row.id;
        this.getData({id:data.row.id});
      },
      focusVprice(e){
        this.inputevetn=e;
      },
      Vprice(){
         //e.target.dataset.id
        // let value=(this.inputevetn.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;  //金额保留2位
        // console.log(value)
        //   this.value=this.value.replace(/[^\d.]/g,'');
      },
      submit(){
          this.$emit('evnetPost',{list:this.city,id:this.id})
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
         url:this.$api.setSpecies,
         success:(res)=>{
            loading.close();
            if(res.code==200){
              if(res.data.length>0){
                 this.city=res.data;
              }else{
                let arr=[];
                City.map((item)=>{
                  //console.log(item)
                  let arrs=[];
                    item.children.map((items,index)=>{
                      arrs.push({value: items.value, text: items.text,price:'',hours:''})
                    })
                   arr.push({value: item.value, text: item.text,children:arrs,price:'',hours:''});
                })
                this.city=arr;
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
  .form-box{
    height: 80vh;
    overflow: scroll;
  }
  .btn-box{
    padding-left: 10px;
    padding-top: 20px;
  }
</style>
