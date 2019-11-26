/**
 * 定义了目录地址
*/
const menuList = [
    {
        title:'首页',
        key:'/home'
    },
    {
        title:'应用管理',
        key:'/application',
          
    },
    {
        title:'镜像管理',
        key:'/image',
          
    },
    {
        title:'服务管理',
        key:'/service',
          
    },
    {
        title:'存储管理',
        key:'/store',
          
    },
    {
        title:'节点管理',
        key:'/node',
        /*children:[
            {
                title:'镜像管理',
                key:'/node/images',
            },
            {
                title:'节点详情',
                key:'/node/info',
            } 
        ]*/
          
    },
    {
        title:'集群管理',
        key:'/cluster', 
    },
    {
        title:'监控管理',
        key:'/monitor', 
    },
    {
        title:'用户管理',
        key:'/user'
    },
    
    
];
export default menuList;