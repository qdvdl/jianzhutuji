import Vue from 'vue'
import Router from 'vue-router'
//首页
import Home from '@/page/index';
//登录
import Login from '@/page/login';
//基础路由(必须)
import Admin from '@/page/admin/operation/admin';//管理员
import Role from '@/page/admin/operation/role';//角色
import SetAdmin from '@/page/admin/operation/setAdmin';//设置
import Auth from '@/page/admin/operation/auth';//权限栏目
import Log from '@/page/admin/operation/log';//操作日志
//项目开发
/* 基础设置 */
import SetBasics from '@/page/admin/basics/setBasics';//设置
import SetImgtext from '@/page/admin/basics/imgtext';//文章协议管理
import SetMarketing from '@/page/admin/basics/marketing';//营销管理
 /* 用户管理 */
import User from '@/page/admin/user';
 /* 工人管理 */
import Workers from '@/page/admin/workers';
 /* 包工头管理 */
import Contractor from '@/page/admin/contractor';
 /* 工种管理 */
import Species from '@/page/admin/species';
/* 订单管理 */
import Order from '@/page/admin/order';
/* 评价管理 */
import Comment from '@/page/admin/comment';
/* 投诉管理 */
import Complaints from '@/page/admin/complaints';
/* 意见反馈 */
import Feedback from '@/page/admin/feedback';

/* 轮播图 */
import Banner from '@/page/admin/banner';//轮播图设置

Vue.use(Router);

export default new Router({
  mode: "history",
  base:"/admin",
  routes: [
    //基础路由(必须)
    {path: '/',name: 'home',component: Home,meta: {title: "首页",type: "login", keepAlive:false}}, //keepAlive：开启缓存俩判断
    {path: '/admin',name: 'admin',component: Admin,meta: {title: "系统管理-管理员",type: "login", keepAlive:false}},
    {path: '/role',name: 'role',component: Role,meta: {title: "系统管理-角色管理",type: "login", keepAlive:false}},
    {path: '/setAdmin',name: 'setAdmin',component: SetAdmin,meta: {title: "系统管理-系统设置",type: "login", keepAlive:false}},
    {path: '/auth',name: 'auth',component: Auth,meta: {title: "系统管理-栏目管理",type: "login", keepAlive:false}},
    {path: '/log',name: 'log',component: Log,meta: {title: "系统管理-操作日志",type: "login", keepAlive:false}},
    //登录
    {path: '/login',name: 'login',component: Login,meta: {title: "登录页面",type:"", keepAlive:false}},
    //项目路由(开发)
    /* 基础设置 */
    {path: '/setBasics',name:'setBasics',component: SetBasics,meta: {title: "基础设置-设置",type:"login", keepAlive:false}},
    {path: '/imgtext',name:'imgtext',component: SetImgtext,meta: {title: "基础设置-文章协议",type:"login", keepAlive:false}},
    {path: '/marketing',name:'marketing',component: SetMarketing,meta: {title: "基础设置-营销管理",type:"login", keepAlive:false}},
    /* 用户管理 */
    {path: '/userList',name:'userList',component: User,meta: {title: "用户管理-用户列表",type:"login", keepAlive:false}},
    // 工人管理
    {path: '/workersList',name:'workersList',component: Workers,meta: {title: "工人管理-工人列表",type:"login", keepAlive:false}},
     /* 包工头管理 */
    {path: '/contractorList',name:'contractorList',component: Contractor,meta: {title: "包工头管理-包工头列表",type:"login", keepAlive:false}},
    /* 工种管理 */
    {path: '/speciesList',name:'speciesList',component: Species,meta: {title: "工种管理-工种列表",type:"login", keepAlive:false}},
    /* 订单管理 */
    {path: '/orderList',name:'orderList',component: Order,meta: {title: "订单管理-订单列表",type:"login", keepAlive:false}},
    /* 评价管理 */
    {path: '/commentList',name:'commentList',component: Comment,meta: {title: "客户管理-客户列表",type:"login", keepAlive:false}},
    /* 投诉管理 */
    {path: '/complaintsList',name:'complaintsList',component: Complaints,meta: {title: "投诉管理-投诉列表",type:"login", keepAlive:false}},
    /* 意见反馈 */
    {path: '/feedbackList',name:'feedbackList',component: Feedback,meta: {title: "意见反馈管理-反馈列表",type:"login", keepAlive:false}},


    /* 轮播图 */
    {path: '/banner',name:'banner',component: Banner,meta: {title: "基础设置-轮播图",type:"login", keepAlive:false}},

  ]
})
