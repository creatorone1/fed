import React from 'react';
 import {Modal,message,Badge,InputNumber,Spin,Alert,Tag,Table, Select,Tabs,Divider,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import EditNode from './form/nodeedit'
import Header from './../../components/Header'
import utils from '../../utils/utils';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
export default class Node extends React.Component {
      
    state = {
       
        selectedRowKeys:[],
        selectedRows:null, 
        cluster:[ 
            'Cluster1',
            'Cluster2'
        ],
        searchname:'',
        searchdata:[],
         dataSource:[/*{
            name:'node1',
            status:'Ready',
            pods:['20','35'],
            role:'Master',
            version:'v1.10.0',
            cpu:['2.2','24'],
            memory:['2.7','32'],
            cluster:'cluster1',
            labels:[{
                name:'beta.kubernetes.io/arch',
                value:'amd64'
            },{
                name:'beta.kubernetes.io/os',
                value:'linux'
            },{
                name:'kubernetes.io/hostname',
                value:'node1'
            }],
            key:1

        },{
            name:'node2',
            status:'NotReady',
            pods:['15','26'],
            role:'Worker',
            version:'v1.10.0',
            cpu:['0.8','24'],
            memory:['0.5','32'],
            cluster:'cluster1',
            labels:[{
                name:'beta.kubernetes.io/arch',
                value:'amd64'
            },{
                name:'beta.kubernetes.io/os',
                value:'linux'
            },{
                name:'kubernetes.io/hostname',
                value:'node2'
            }],
            key:2

        }
         ,{
            name:'node3',
            status:'unschedulable',
            pods:['14','32'],
            role:'Worker',
            version:'v1.10.0',
            cpu:['1.8','24'],
            memory:['2.5','32'],
            cluster:'cluster1',
            labels:[{
                name:'beta.kubernetes.io/arch',
                value:'amd64'
            },{
                name:'beta.kubernetes.io/os',
                value:'linux'
            },{
                name:'kubernetes.io/hostname',
                value:'node3'
            }],
            key:3

        },
        {
            name:'node4',
            status:'Ready',
            pods:['15','26'],
            role:'Master',
            version:'v1.10.0',
            cpu:['3.8','24'],
            memory:['1.6','32'],
            cluster:'cluster2',
            labels:[{
                name:'beta.kubernetes.io/arch',
                value:'amd64'
            },{
                name:'beta.kubernetes.io/os',
                value:'linux'
            },{
                name:'kubernetes.io/hostname',
                value:'node4'
            }],
            key:4

        }
         ,{
            name:'node5',
            status:'Ready',
            pods:['2','24'],
            role:'Worker',
            version:'v1.10.0',
            cpu:['0.4','24'],
            memory:['0.8','32'],
            cluster:'cluster2',
            labels:[{
                name:'beta.kubernetes.io/arch',
                value:'amd64'
            },{
                name:'beta.kubernetes.io/os',
                value:'linux'
            },{
                name:'kubernetes.io/hostname',
                value:'node5'
            }],
            key:5

        }*/
        
         
        ], 
        alldatas:[] //所有集群下的node数据
        ,
        pauseop:false,
        currentcluster:'fed',
        btnloading:false, 
    }
    componentDidMount(){//请求数据
        //按集群读取节点数据
        this.request()
     }
    // 动态获取mock数据
    request = () => { //初始化数据请求
        fetch(utils.urlprefix+'/api/clusters',{
                method:'GET'
            }).then((response) => {
                    console.log('response:',response.ok)
                    return response.json();
            }).then((data) => {
                    console.log('data:',data)
                    this.setState({
                        cluster:data.filter(item=>item.status!="NotReady")
                    })

                fetch(utils.urlprefix+'/api/cluster/fed/namespaces',{
                        method:'GET'
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            console.log('data:',data)
                            var nms=[]
                            data.map(nm=>{
                                nms=nms.concat(nm.name)
                            })    
                            this.setState({
                                namespaces:nms,
                                fednamespaces:nms
                            })
                            
                            return data;
                        }).catch((e)=>{
                            console.log(e);
                        }) 

                    //请求节点数据
                    var nodes=[]
                    var clustercount=0  
                    var clength=  data.length
                    data.map(cluster=>{
                            fetch(utils.urlprefix+'/api/cluster/'+cluster.name+'/nodes',{
                        method:'GET',
                        mode: 'cors', 
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            console.log('data:',data)
                            clustercount++
                            nodes=nodes.concat(data)
                            if(clustercount==clength){
                                console.log('get all nodes') 
                                var nowdata=[]
                                if(this.state.currentcluster!='All'&& this.state.currentcluster!='fed'){
                                    nowdata=nodes.filter(item=>item.cluster==this.state.currentcluster)
                                    //console.log('get all nodes')
                                }else{
                                    nowdata=nodes
                                }
                                console.log('nowdata',nowdata)
                                this.setState({ //表格选中状态清空
                                    selectedRowKeys:[],
                                    selectedRows:null,
                                    dataSource: nowdata,
                                    alldatas:nodes,
                                    btnloading:false, 
                                })
                            }else{ 
                            } 
                            return data;
                        }).catch( (e)=> { 
                            console.log('getnode error:'+cluster.name+' '+e);
                            clustercount++ 
                            if(clustercount==clength){
                                var nowdata=[]
                                if(this.state.currentcluster!='All'&&this.state.currentcluster!='fed'){
                                    nowdata=nodes.filter(item=>item.cluster==this.state.currentcluster)
                                    console.log('Not All')
                                }else{
                                    console.log(' All')
                                    nowdata=nodes
                                }
                                console.log('nowdata2',nowdata)
                                this.setState({ //表格选中状态清空
                                    selectedRowKeys:[],
                                    selectedRows:null,
                                    dataSource: nowdata,
                                    alldatas:nodes, 
                                    btnloading:false, 
                                })
                            }else{ 
                            }
                            
                            })
                        })
                    return data;
                }).catch(function (e) {
                    this.setState({  
                        btnloading:false, 
                    })
                    console.log(e);
                })

         
    }  
    requestnode = (clustername) => { //初始化数据请求
     
        fetch(utils.urlprefix+'/api/cluster/'+clustername+'/nodes',{
                        method:'GET',
                        mode: 'cors', 
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            console.log('data:',data)

                            this.setState({ //表格选中状态清空
                                selectedRowKeys:[],
                                selectedRows:null,
                                dataSource:data,
                            })
                            
                            return data;
                        }).catch( (e)=> {  
                            console.log(e);
                        })
                  

         
    }
    handleClustertChange=(value)=> {
        var data=[]
        if(value!='All'){
            data=this.state.alldatas.filter(item=>item.cluster==value)

        }else{
            data=this.state.alldatas 
        }
        
        this.setState({
            currentcluster:value ,
            dataSource:data
        })

        //进行筛选Clustert数据操作
        console.log(`cluster selected ${value}`);
    }
        //点击暂停
     handleMutiPause = ()=>{
            console.log("Pause")
            console.log("selectedRowKeys",this.state.selectedRowKeys)
            console.log("selectedRows",this.state.selectedRows) 
            //let id = record.id;
            
            if(this.state.selectedRowKeys.length===0){
                Modal.info({
                    title:'暂停节点',
                    content:'请选择一行',
                })
            } else  if(this.state.selectedRows.filter(item=>item.role=='Master').length>0){
                Modal.error({ //如果包含master节点提醒用户不可对master节点进行操作
                    title:'操作异常',
                    content:'Master节点不可进行该操作',
                })
            } else
            Modal.confirm({
                title:'暂停节点',
                content:'您确认要暂停这些节点吗？'+this.state.selectedRows.map(item=>item.name) ,
                onOk:()=>{
                    var datas={
                        items:[]
                    }  
                    this.state.selectedRows.map(item=>{
                        var depitem={
                            name:item.name ,
                            clustername:item.cluster
                        }
                        datas.items=datas.items.concat(depitem)
                    })
                    console.log('datas',JSON.stringify(datas))
                    fetch(utils.urlprefix+'/api/cluster/'+this.state.selectedRows[0].cluster+'/pause/nodes?data='+JSON.stringify(datas),{
                        method:'GET',
                        mode: 'cors', 
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('暂停成功');
                             
                            //刷新数据
                            this.request();
                            return data;
                        }).catch( (e)=> {  
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('暂停失败');
                            //this.requestnode(this.state.selectedRows[0].cluster);
                            this.request();
                            console.log(e);
                        }) 
                     
                }
            })
     }
        //点击恢复
    handleMutiResume = ()=>{
            console.log("Resume")
            console.log("selectedRowKeys",this.state.selectedRowKeys)
            console.log("selectedRows",this.state.selectedRows) 
            //let id = record.id;
            if(this.state.selectedRowKeys.length===0){
                Modal.info({
                    title:'恢复节点',
                    content:'请选择一行',
                })
            }else if(this.state.selectedRows.filter(item=>item.role=='Master').length>0){
                Modal.error({ //如果包含master节点提醒用户不可对master节点进行操作
                    title:'操作异常',
                    content:'Master节点不可进行该操作',
                })
            } else
            Modal.confirm({
                title:'恢复节点',
                content:'您确认要恢复这些节点吗？'+this.state.selectedRows.map(item=>item.name) ,
                onOk:()=>{
                    var datas={
                        items:[]
                    }  
                    this.state.selectedRows.map(item=>{
                        var depitem={
                            name:item.name, 
                            clustername:item.cluster,
                        }
                        datas.items=datas.items.concat(depitem)
                    })
                    console.log('datas',JSON.stringify(datas))
                    fetch(utils.urlprefix+'/api/cluster/'+this.state.selectedRows[0].cluster+'/resume/nodes?data='+JSON.stringify(datas),{
                        method:'GET',
                        mode: 'cors', 
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('恢复成功');
                            //刷新数据
                            //this.requestnode(this.state.selectedRows[0].cluster);
                            this.request();
                            return data;
                        }).catch( (e)=> {  
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('恢复失败');
                            //this.requestnode(this.state.selectedRows[0].cluster);
                            this.request();
                            console.log(e);
                        }) 
                }
            })
        }  
        //点击驱逐
    handleMutiDrain = ()=>{
            console.log("Drain")
            console.log("selectedRowKeys",this.state.selectedRowKeys)
            console.log("selectedRows",this.state.selectedRows) 
            //let id = record.id;
            if(this.state.selectedRowKeys.length===0){
                Modal.info({
                    title:'驱逐节点',
                    content:'请选择一行',
                })
            }else if(this.state.selectedRows.filter(item=>item.role=='Master').length>0){
                Modal.error({ //如果包含master节点提醒用户不可对master节点进行操作
                    title:'操作异常',
                    content:'Master节点不可进行该操作',
                })
            } else
            Modal.confirm({
                title:'驱逐节点',
                content:'您确认要驱逐这些节点吗？'+this.state.selectedRows.map(item=>item.name),
                onOk:()=>{
                    var datas={
                        items:[]
                    }  
                    this.state.selectedRows.map(item=>{
                        var depitem={
                            name:item.name, 
                            clustername:item.cluster,
                        }
                        datas.items=datas.items.concat(depitem)
                    })
                    console.log('datas',datas)
                    
                    fetch(utils.urlprefix+'/api/cluster/'+this.state.selectedRows[0].cluster+'/drain/nodes?data='+JSON.stringify(datas),{
                        method:'GET',
                        mode: 'cors', 
                        }).then((response) => {
                            console.log('response:',response.ok)
                            return response.json();
                        }).then((data) => {
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('驱逐成功');
                            //刷新数据
                            //this.requestnode(this.state.selectedRows[0].cluster);
                            this.request();
                            return data;
                        }).catch( (e)=> {  
                            this.setState({  //取消选中行
                                selectedRowKeys: [],  
                                selectedRows: null
                            })
                            message.success('驱逐失败');
                            //this.requestnode(this.state.selectedRows[0].cluster);
                            this.request();
                            console.log(e);
                        }) 
                }
            })
        }         
    
     //下拉菜单item点击响应
     onClick = ( key,text,record ) => { //点击下拉菜单选则
        //message.info(`Click on item ${key}`);
        this.setState({ 
            operationdata:record, // 传入要操作数据
        })
        //console.log( "key",key);
        //console.log( "text",text);
        //console.log( "item",record);
        if(key==='1'){ //如果是暂停
            this.handlePause(key, text, record)  
        }
        if(key==='2'){ //如果是驱逐
            this.handleDrain(key, text, record)
        }
        if(key==='3'){ //如果是编辑
            this.handleUpdate(true) //显示编辑对话框
            
        }
        if(key==='4'){ //如果是删除
            this.handleDelete(key, text, record)
        }
        if(key==='5'){ //如果是恢复
            this.handleResume(key, text, record)
        }
        
    }; 

     // 暂停操作
     handlePause = (key, text, record)=>{
        console.log("暂停！")  
        console.log("key",key)
        console.log("text",text)
        console.log("record",record)
        //let id = record.id;
       
         Modal.confirm({
            title:'暂停节点',
            content:'您确认要暂停这节点吗？'+record.name,
            onOk:()=>{
                var datas={
                    items:[]
                }   
                var depitem={
                    name:record.name,
                    clustername:record.cluster
                }

                datas.items=datas.items.concat(depitem) 
                 console.log('datas',datas)
                fetch(utils.urlprefix+'/api/cluster/'+record.cluster+'/pause/nodes?data='+JSON.stringify(datas),{
                    method:'GET',
                    mode: 'cors', 
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('暂停成功');
                         
                        //刷新数据
                        //this.requestnode(this.state.currentcluster);
                        this.request();
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('暂停失败');
                        //this.requestnode(this.state.currentcluster);
                        this.request();
                        console.log(e);
                    }) 
                 
            }
        }) 

    }

     // 驱逐操作
     handleDrain = (key, text, record)=>{
        console.log("驱逐！")  
        console.log("key",key)
        console.log("text",text)
        console.log("record",record)
        //let id = record.id;
        Modal.confirm({
            title:'驱逐节点',
            content:'您确认要驱逐这节点吗？'+record.name,
            onOk:()=>{
                var datas={
                    items:[]
                }  
                
                 var depitem={
                     name:record.name,
                 }
                 datas.items=datas.items.concat(depitem)
                
                fetch(utils.urlprefix+'/api/cluster/'+record.cluster+'/drain/nodes?data='+JSON.stringify(datas),{
                    method:'GET',
                    mode: 'cors', 
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('驱逐成功');
                        //刷新数据
                        //this.requestnode(record.cluster);
                        this.request();
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('驱逐失败');
                        //this.requestnode(record.cluster);
                        this.request();
                        console.log(e);
                    }) 
            }
        })
    }
      // 编辑操作
      handleUpdate = (visible)=>{
        //console.log("编辑！") 
        if(visible)   
        this.setState({
            editvisible:true
        }) 
        else
        this.setState({
            editvisible:false
        }) 

    }
     // 恢复操作
     handleResume = (key, text, record)=>{
        console.log("恢复！")  
        console.log("key",key)
        console.log("text",text)
        console.log("record",record)
        //let id = record.id;
        Modal.confirm({
            title:'恢复节点',
            content:'您确认要恢复此节点吗？'+record.name ,
            onOk:()=>{
                var datas={
                    items:[]
                }  
                
                 var depitem={
                     name:record.name,
                     clustername:record.cluster
                } 
                datas.items=datas.items.concat(depitem) 
                
                 console.log('datas',datas)
                fetch(utils.urlprefix+'/api/cluster/'+record.cluster+'/resume/nodes?data='+JSON.stringify(datas),{
                    method:'GET',
                    mode: 'cors', 
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('恢复成功');
                        //刷新数据
                        //this.requestnode(record.cluster);
                        this.request();
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [],  
                            selectedRows: null
                        })
                        message.success('恢复失败');
                        //this.requestnode(record.cluster);
                        this.request();
                        console.log(e);
                    }) 
            }
        })
    }
    
    // 删除操作
    handleDelete = (key, text, record)=>{
        console.log("删除！")  
        console.log("key",key)
        console.log("text",text)
        console.log("record",record)
        //let id = record.id;
        Modal.confirm({
            title:'删除节点',
            content:'您确认要删除此节点吗？'+record.name ,
            onOk:()=>{ 
                var datas={
                    items:[]
                }  
                var ditem={
                        name:record.name,  
                        clustername:record.cluster
                    } 
                datas.items=datas.items.concat(ditem) 
                    
                console.log('datas',JSON.stringify(datas))

               // console.log(JSON.stringify(datas))
                //下面URL的 集群 名称 以后需要替换掉 ok
                fetch(utils.urlprefix+'/api/cluster/'+record.cluster+'/nodes?data='+JSON.stringify(datas),{
                    method:'DELETE',
                    mode: 'cors', 
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        this.setState({  //取消选中行
                            selectedRowKeys: [ ],  
                            selectedRows: null
                        })
                        message.success('删除成功');
                        //发送删除请求
                        this.request();
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [ ],  
                            selectedRows: null
                        })
                        message.success('删除成功');
                        //发送删除请求
                        this.request();
                        console.log(e);
                    }) 
                
            }
        })
    }
        //搜索输入框响应变化
    searchChange = (e)=>{
            //console.log('e.target.value',e.target.value)
            let content=e.target.value
            this.setState({
                searchname:content
            })
            if(content===''){
                this.setState({
                    search:false
                })    
            }
            if(content!==''){
                //console.log('this.state.searchname:',this.state.searchname)
                //console.log(this.state.dataSource.map(item=>item.name.indexOf(this.state.searchname)))
                this.setState({
                    searchdata:this.state.dataSource.filter(item=>item.name.indexOf(content)!==-1),
                    search:true
                })
                 
            }
        }
        //点击搜索按钮
    handleSearch = ()=>{
            //console.log('this.state.searchname:',this.state.searchname)
            if(this.state.searchname!==''){
                //console.log('this.state.searchname:',this.state.searchname)
                //console.log(this.state.dataSource.map(item=>item.name.indexOf(this.state.searchname)))
                this.setState({
                    searchdata:this.state.dataSource.filter(item=>item.name.indexOf(this.state.searchname)!==-1),
                    search:true
                })
                 
            }else{
                this.setState({ 
                    search:false
                })
                
            }
        }

    handleRedirect=(nodedetail)=>{
        console.log('跳转！')
        sessionStorage.setItem('nodename',nodedetail.name)
        sessionStorage.setItem('nodecluster',nodedetail.cluster)
         utils.nodedetail=nodedetail
    }

    statechange=()=>{ //创建服务之后回调
        console.log('refresh!')
        this.request()
    } 
    handleRefresh =() =>{
        console.log('refresh !')
        this.setState({ 
            btnloading:true
        })
        //this.request()
        setTimeout(()=> {//模拟数据加载结束则取消加载框 
            this.request()
        }
        ,1000) 
    } 
    render(){ 
        const columns=[
            {
                title:'节点名称',
                key:'name',
                dataIndex: 'name',
                render: (text,record) =>
                {
                    //<a href={"#/node/"+record.name}>{text}</a>      
                    return (  <Link to={"/node/detailpage/"+record.name}  onClick={()=>this.handleRedirect(record)}>{text}</Link>)
                }  
            },
            {
                title:'状态',
                key:'status',
                dataIndex: 'status',
                render(status){ //第一个是running中的pod 第二个是pod总数
                    let config = {
                        'Ready': <Tag  color="#87d068" style={{cursor:'auto' }} >Ready</Tag>,
                        'NotReady': <Tag  color="#ff7875" style={{cursor:'auto' }} >NotReady</Tag> ,  
                        'unschedulable': <Tag  color="#fa8c16" style={{cursor:'auto' }} >Unschedulable</Tag> ,  
                    
                    }
                    return config[status];
                }
               
            }, 
            {
                title:'所在集群',
                key:'cluster',
                dataIndex: 'cluster',
            },
            {
                title:'角色',
                key:'role',
                dataIndex: 'role',
            },
            {
                title:'版本',
                key:'version',
                dataIndex: 'version',
            },
            {
                title:'pods',
                key:'pods',
                dataIndex: 'pods',
                render(pods){ //第一个是running中的pod 第二个是pod总数
                    return(pods[0]+'/'+pods[1])
                }
            },
            {   
                title:'cpu',
                key:'cpu',
                dataIndex:'cpu',
                render(cpu){ //第一个是running中的pod 第二个是pod总数
                    return(cpu[0]+'/'+cpu[1]+' Cores')
                }
                
            },
            {   
                title:'memory',
                key:'memory',
                dataIndex:'memory',
                render(memory){ //第一个是running中的pod 第二个是pod总数
                    return(memory[0]+'/'+memory[1]+' GB')
                }
            },
            {
                title:'操作',
                key:'operation', 
                render:(text,record)=>{
                    var opration
                    var pause= <Menu.Item key="1">暂停</Menu.Item>
                    var drain=<Menu.Item key="2">驱逐</Menu.Item>
                    var resume=<Menu.Item key="5">恢复</Menu.Item>
                    if(record.role=='Master'){
                        opration = ( <Dropdown overlay={  
                            <Menu onClick={({key})=>this.onClick(key,text,record)}> 
                            <Menu.Item key="3">编辑</Menu.Item>
                          </Menu> 
                         } trigger={['click']}>
                             <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                        </Dropdown> )
                    } else{
                        opration = ( <Dropdown overlay={  
                            <Menu onClick={({key})=>this.onClick(key,text,record)}>
                            {record.status=='unschedulable'?<Menu.Item key="5">恢复</Menu.Item>:''
                            }
                            {record.status=='Ready'?pause:''
                            }
                            {record.status=='Ready'?drain:''
                            }
                            <Menu.Item key="3">编辑</Menu.Item>
                            <Menu.Item key="4">删除</Menu.Item> 
                          </Menu> 
                         } trigger={['click']}>
                             <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                        </Dropdown> )
                    }
                    return opration
                }
            },

        ] 
        
        const selectedRowKeys=this.state.selectedRowKeys;
        const rowSelection={ 
            type: 'checkbox',
            selectedRowKeys,
            onChange:(selectedRowKeys,selectedRows)=>{
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            }
        } 
        const clusterdata=this.state.cluster.map( (item)=>( 
            <Option value={item.name} key={item.name}>{item.name}</Option>
         
            )
        )
        return (
            
            <div> 
                { this.state.loading?(  <Spin tip="Loading...">
                    <Alert
                    message="Loading"
                    description="数据加载中"
                    type="info"
                    />
                </Spin>
                ): 
            (  
            <div style={{ minHeight:'calc(60vh)'}}> 
                <div className="Dropdown-wrap"> 
                    <span style={{marginRight:10,fontSize:15}}>集群：</span>
                    <Select defaultValue='All' style={{ width: 120 }} onSelect={this.handleClustertChange}  >
                         <Option value='All'  key='All'>全局</Option>
                          
                         {clusterdata}
                    </Select> 
                   
                </div>
               
               
               <div className="Dropdown-wrap" style={{marginTop:10}}> 
                    <span style={{marginRight:10,fontSize:15}}>节点列表 </span>  
                </div> 
                <div style={{backgroundColor:'white',marginTop:-10,padding:10 }}>
                    <Divider style={{marginTop:-5}}></Divider>
                    <Row className='Button-wrap' style={{ marginTop:-10}}> 
                    <Col span='16'> 
                        <Button onClick={this.handleMutiPause}>暂停<Icon type='pause'></Icon></Button>
                        <Button onClick={this.handleMutiResume}>恢复<Icon type="caret-right" /></Button>
                        <Button onClick={this.handleMutiDrain}>驱逐<Icon type="export" /></Button>
                         
                         
                        
                    </Col>
                        <Col span='8' className='Button-right'> 
                        <Button onClick={this.handleRefresh} loading={this.state.btnloading}>刷新 </Button>
                
                        <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                        <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                    </Col>
                    </Row>
                    
                    <Spin tip="Loading..." spinning={this.state.btnloading}>
                    {this.state.btnloading?(      
                            <Alert
                                message="Loading"
                                description="数据加载中"
                                type="info"
                            />
                    ):
                    <Table  
                        style={{marginTop:16}}
                        dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                        rowKey={record => record.name}
                        rowSelection={rowSelection }
                        columns={columns }  
                        rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                        /> }
                    </Spin>
                     
                </div>  
                <EditNode statechange={this.statechange} currentcluster={this.state.currentcluster} dataSource={this.state.operationdata}  editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}></EditNode>
            </div>
                 )} 

            </div>
            
        )
    }
}