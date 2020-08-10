<template>
  <div class="form-box">
    <CreateForm ref="myForm" labelWidth="100px" :rules="rules" @eventSubmit="onSubmit" refNanme="sbmit" bntText="提交" :formData="formData" :formListItem="formListItem()"/>
  </div>
</template>

<script>
  import CreateForm from "@/components/form";
  export default {
    components:{CreateForm},
    name:"Species",
    data(){
      return{
          formData:this.setFormData(),
          rules:this.verification(),
          type:'',
          toptype:'',
          parent_id:'',
      }
    },
    methods:{
        showFormData(type,data){
           if(type=="editSpecies"){
             let {id,name,price,sort,parent_id}=data.row;
             let d={
               name:name,
               price:price,
               sort:sort,
               id:id,
               parent_id:parent_id
             }
             if(parent_id=='0'){
                this.toptype='top';
             }else{
                this.toptype='child';
                this.parent_id=parent_id;
             }
             this.formData=d;
           }else{
             if(!data.row){
               this.toptype='top';
             }else{
               this.toptype='child';
               this.parent_id=data.row.id;
             }
             this.formData=this.setFormData();
           }
        },
        onSubmit({data}){
          //数据验证通过
          let postdata=data;
          if(this.toptype=='top'){
            postdata.parent_id='0';
          }else{
             postdata.parent_id=this.parent_id;
          }
          this.$emit('evnetPost',postdata);
        },
        setFormData(){
          //配置数据
          return {
            name:"",
            price:0,
            sort:0
          }
        },
        verification(){
          //验证数据
          var v=[
             {field:"name",type:{required:"请输入工种名称！"},textCount:[2,10]},
             {field:"price",type:{amount:"输入格式错误！"}},
             {field:"sort",type:{required:"请输入排序值！",number:'必须是数字'}}
          ];
          v=this.$verification(v);
          return v;
        },
        formListItem(){
          //配置表单
          let form=[
            {prop:"name", maxlength:10,placeholder:"请输入工种名称",label:'工种名称：',type:'text'},
            {prop:"sort", maxlength:10,placeholder:"请输入排序值",label:'排序值：',type:'text'}
          ];

          if(this.toptype!=='top'){
            form.splice(1,0,{prop:"price", maxlength:10,placeholder:"请输入工种名称",label:'价格：',type:'text'});
          }

          return form;
        }
    }
  }
</script>

<style scoped>
  .item{
    background: green;
    margin-bottom: 20px;
    height: 180px;
  }
  .form-box{
    padding-top: 15px;
    padding-right: 15px;
    padding-bottom: 15px;
  }
</style>
