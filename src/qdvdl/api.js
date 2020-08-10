export default{
    // 管理员基本必须接口(请勿删除)区域中
    login:"api/login",  //登录接口
    code:"main/getCode",  //验证码接口
    addAdmin:"api/addAdmin", //添加管理员
    editAdmin:"api/editAdmin", //编辑管理员
    delAdmin:"api/delAdmin", //删除管理员
    admin:"api/admin", //管理员列表
    role:"api/role"    ,//角色列表
    addRole:"api/addRole" ,//添加角色
    editRole:"api/editRole" ,//编辑角色
    delRole:"api/delRole" ,//删除角色
    getLog:"api/getLog",    //获取首页信息接口
    upload:"main/upload_file" ,//统一上传接口
    log:"api/log",     //后台操作日志接口
    dellog:"api/dellog" ,//删除操作日志
    setAdmin:"api/setAdmin", //网站基本信息
    // end(请勿删除)

    //开发接口(自定义开发接口)
     setIcometMs:"apiAll/setIcometMs", //消息服务器
     setBasics:"apiAll/setBasics",  //基本设置
     marketing:"apiAll/marketing",  //营销管理
     imgtext:"apiAll/imgtext",  //协议文章
    // 用户信息
    userList:"apiAll/userList",    //用户列表
    worker:"apiAll/worker",    //设置为工人
    rWorker:"apiAll/rWorker",    //撤销为工人
    contractor:"apiAll/contractor",    //设置为包工
    rContractor:"apiAll/rContractor",    //撤销为包工
    userDetails:"apiAll/userDetails", //用户详情
    //工种信息设置
    speciesList:"apiAll/speciesList",
    addSpecies:"apiAll/addSpecies",
    editSpecies:"apiAll/editSpecies",
    delSpecies:"apiAll/delSpecies",
    setSpecies:"apiAll/setSpecies",
    //工人列表
    workersList:"apiAll/workersList",
    auditWorkers:"apiAll/auditWorkers",//审核工人
    frozenThaw:"apiAll/frozenThaw",    //冻结解冻
    editWorkers:"apiAll/editWorkers",  //编辑
    // 包工列表
    contractorList:"apiAll/contractorList",
    auditContractor:"apiAll/auditContractor",//审核
    frozenThawC:"apiAll/frozenThawC",     //冻结解冻
    editContractor:"apiAll/editContractor",  //编辑
    //订单列表
    orderList:"apiAll/orderList",
    okOrder:"apiAll/okOrder",
    cancelOrder:"apiAll/cancelOrder",
    delOrder:"apiAll/delOrder",
    seeOrder:"apiAll/seeOrder",
    //评价列表
    commentList:"apiAll/commentList",
    showComment:"apiAll/showComment",   //显示评价
    hideComment:"apiAll/hideComment",   //隐藏评价
    seeComment:"apiAll/seeComment",   //评价详情
    // 投诉管理
    complaintsList:"apiAll/complaintsList",
    fComplaints:"apiAll/fComplaints",   //反馈投诉
    seeComplaints:"apiAll/seeComplaints",   //查看详情投诉
    //反馈意见
    feedbackList:"apiAll/feedbackList",












     // banner
    banner:"apiAll/banner",  //获取基本信息
    addBanner:"apiAll/addBanner",  //添加
    editBanner:"apiAll/editBanner",  //编辑
    delBanner:"apiAll/delBanner"  //删除

}
