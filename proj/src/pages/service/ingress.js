//部署一个工作负载的表单
import React from 'react'
//import {Modal,message,Badge,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, }from 'antd'
import './service.less' 
import {Modal,message,Spin,Alert,Badge,InputNumber,Tag,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, 
  
} from 'antd';
import CreateIng from './form/create_ing'  
import EditIng from './form/edit_ing' 
import utils from './../../utils/utils'
import cookie from 'react-cookies'
export default class Ingress extends React.Component {
       
    state = {  //初始化state
        selectedRowKeys:[],
        selectedRows:null,
        currentcluster:'',
        currentnamespace:'',
        searchname:'',
        searchdata:[],
        search:false,
        dataSource:[{
            name:'myins1',
            status:'Active',
            namespace:'default',
            rules:[{
                host:'example.com',
                backend:[{
                     path:'/bar',
                     servicename:'mynginx',
                     serviceport:80
                },{
                    path:'/foo',
                    servicename:'mynginx2',
                    serviceport:8080
               }]
            },{
                host:'xio.ip',
                backend:[{
                     path:'/foo',
                     servicename:'mynginx3',
                     serviceport:443
                }]
            }],
            target: [{
                domin:'example2.com/nginx',
                des:'nginx2'
            } 
            ],
            createtime:"2019-4-11",  
            key:'1',
            backend:{
                servicename:'mynginx',
                serviceport:443
            },
           
        },
        {
            name:'nginxins',
            status:'Initializing',
            namespace:'default',
            target: [{
                domin:'example2.com/nginx',
                des:'nginx2'
            }, {
                domin:'example3.com/nginx',
                des:'nginx3'
            },
            ],
            createtime:"2019-4-11",  
            key:'2'
        },
        {
            name:'webins',
            status:'Initializing',
            namespace:'default',
            target: [{
                domin:'example2.com/nginx',
                des:'nginx2'
            }, {
                domin:'example3.com/nginx',
                des:'nginx3'
            },
            ],
            createtime:"2019-4-11",  
            key:'3'
        },
         

        ],
        editvisible:false,
        btnloading:false,
        

    }
    componentDidMount(){//请求数据
        
       this.setState({
        currentcluster:this.props.currentcluster,
        currentnamespace:this.props.currentnamespace,

      })
      this.request(this.props.currentcluster,this.props.currentnamespace);
      console.log('ingress  currentcluster:',this.props.currentcluster)
    }
    componentWillReceiveProps(nextProps){
         
        //接收参数后更新数据
        this.setState({
            currentcluster:nextProps.currentcluster,
            currentnamespace:nextProps.currentnamespace,

        }) 
        this.request(nextProps.currentcluster,nextProps.currentnamespace);
        console.log('ingress get props currentcluster:',nextProps.currentcluster)
        console.log('ingress get props currentnamespaces:',nextProps.currentnamespace)

    }
    request = (clustername,namespace) => {
        fetch(utils.urlprefix+'/api/cluster/'+clustername+'/ingresses',{
        method:'GET',
        headers: { 
            "Authorization":"Basic "+cookie.load("at") 
            },
        }).then((response) => {
            console.log('response:',response.ok)
            
            return response.json();
        }).then((data) => {
            console.log('data:',data)
            var datas=[]
            if(namespace!='All'&&namespace!=''&&namespace!=undefined){
                datas=data.filter(item=>item.namespace==namespace)
            }else{
                datas=data
            }
            this.setState({ //表格选中状态清空
                selectedRowKeys:[],
                selectedRows:null,
                dataSource:datas,
                btnloading:false,
            })
             
            return data;
        }).catch((e)=>{
            this.setState({  
                btnloading:false,
            })
            console.log(e);
        })
    }

    // 删除操作
    handleDelete = (key,text,record )=>{
        console.log("删除！")  
        console.log("key",key)
        console.log("text",text)
        console.log("record",record)
        //let id = record.id;
        Modal.confirm({
            title:'确认删除',
            content:'您确认要删除此条数据吗？'+record.name ,
            onOk:()=>{ 
                var datas={
                    items:[]
                }  
                var ditem={
                        name:record.name, 
                        namespace:record.namespace,
                 }
                datas.items=datas.items.concat(ditem)
               
               // console.log(JSON.stringify(datas))
                //下面URL的 集群 名称 以后需要替换掉
                fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/ingresses?data='+JSON.stringify(datas),{
                    method:'DELETE',
                    mode: 'cors', 
                    headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        },
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
                        this.request(this.props.currentcluster,this.props.currentnamespace);
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [ ],  
                            selectedRows: null
                        })
                        message.success('删除成功');
                        //发送删除请求
                        this.request(this.props.currentcluster,this.props.currentnamespace);
                        console.log(e);
                    }) 
                
            }
        })
    }
    // 编辑操作
    handleUpdate = (visible)=>{
        console.log("编辑！")   
        if(visible)   
        this.setState({
            editvisible:true
        }) 
        else
        this.setState({
            editvisible:false
        }) 
    }
    onClick = ( key,text,record ) => { //点击下拉菜单选则
        //message.info(`Click on item ${key}`); 
        this.setState({ 
            operationdata:record, // 传入要操作数据
        })
        console.log('operationdata',record)
        if(key==='1'){ //如果是升级
            this.handleUpdate(true)
        }
        if(key==='2'){ //如果是删除
            this.handleDelete(key, text, record)
        } 
        
    }; 
    //批量删除操作
    handleMutiDelete = ()=>{
        console.log("MutiDelete")
        console.log("选中的行的keys ",this.state.selectedRowKeys)
        console.log("选中的行的数据",this.state.selectedRows) 
        //let id = record.id;
        if(this.state.selectedRowKeys.length===0){
            Modal.info({
                title:'确认删除',
                content:'请选择一行',
            })
        } else
        Modal.confirm({
            title:'确认删除',
            content:'您确认要删除这些数据吗？'+this.state.selectedRows.map(item=>item.name) ,
            onOk:()=>{

                var datas={
                    items:[]
                }  
                this.state.selectedRows.map(item=>{
                    var ditem={
                        name:item.name, 
                        namespace:item.namespace,
                    }
                    datas.items=datas.items.concat(ditem)
                })
               // console.log(JSON.stringify(datas))
                //下面URL的 集群 名称 以后需要替换掉
                fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/ingresses?data='+JSON.stringify(datas),{
                    method:'DELETE',
                    mode: 'cors', 
                    headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        },
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
                        this.request(this.props.currentcluster,this.props.currentnamespace);
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [ ],  
                            selectedRows: null
                        })
                        message.success('删除成功');
                        //发送删除请求
                        this.request(this.props.currentcluster,this.props.currentnamespace);
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
    statechange=()=>{ //创建服务之后回调
        this.request(this.state.currentcluster,this.props.currentnamespace)
    } 
    handleRefresh =() =>{
        console.log('refresh !')
        this.setState({ 
            btnloading:true
        })
        //this.request()
        setTimeout(()=> {//模拟数据加载结束则取消加载框 
            this.request(this.props.currentcluster,this.props.currentnamespace);
          }
        ,1000) 
    }
    render(){
        const columns=[
            { 
                title:'名称',
                key:'name',
                dataIndex: 'name',
                width:"20%"
            }, 
            { 
                title:'状态',
                key:'status',
                dataIndex: 'status',
                render(status){
                    let config = {
                        'Active': <Tag  color="#87d068" style={{cursor:'auto' }} >Active</Tag>,
                        'Initializing': <Tag  color="#faad14" style={{cursor:'auto' }} >Initializing</Tag> ,  
                    }
                    return config[status];
                }
            },
            { 
                title:'命名空间',
                key:'namespace',
                dataIndex: 'namespace',
            },
            { 
                title:'目标',
                key:'target',
                dataIndex: 'target',
                render(target){
                    var tars=[]
                    if(target)
                    target.map( (item,index)=>{
                        var tar=<div key={index}><a href={'http://'+item.domin} target='_blank'>{item.domin}</a><Icon type="right" />{ item.des}</div>
                        tars=tars.concat(tar)
                    })
                    return(
                        <div>{tars}</div>
                    )
                }
            },  
            { 
                title:'创建时间',
                key:'createtime',
                dataIndex: 'createtime',
            },
            {
                title:'操作',
                key:'operation', 
                render:(text,record)=>{
                    
                    return( 
                     <Dropdown overlay={
                        <Menu onClick={({key})=>this.onClick(key,text,record)}>
                        <Menu.Item key="1">编辑</Menu.Item> 
                        <Menu.Item key="2">删除</Menu.Item>
                      </Menu> 
                     } trigger={['click']}>
                         <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                    </Dropdown> 
                   )
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
        

        return(
            <div style={{ padding:10 ,minHeight:'calc(60vh)'}}>
                <Row className='Button-wrap'> 
                <Col span='20'> 
                    <Button onClick={this.handleMutiDelete}>删除<Icon type='delete'></Icon></Button>
                    <Input style={{display:'inline-block',width:300}} onChange={this.searchChange}></Input>
                    <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                    <Button onClick={this.handleRefresh} loading={this.state.btnloading}>刷新 </Button>
                   
                </Col>
                <Col span='4' className='Button-right'> 
                    <CreateIng statechange={this.statechange} namespaces={this.props.namespaces} currentcluster={this.props.currentcluster} ></CreateIng>
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
                    dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                    rowKey={record => record.name+record.namespace}
                    rowSelection={rowSelection }
                    columns={columns }  
                    rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                />}
                </Spin>
                <EditIng statechange={this.statechange} currentcluster={this.props.currentcluster} dataSource={this.state.operationdata} namespaces={this.props.namespaces} editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}/>
               
            </div>
        )
    }
} 