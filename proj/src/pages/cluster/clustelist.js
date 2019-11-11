import React from 'react';
 import {Modal,message,Badge,InputNumber,Spin,Alert,Tag,Table, Select,Tabs,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import EditCluster from './form/clusteredit'
import CreateCluster from './form/createcluster'
import utils from './../../utils/utils'

const Option = Select.Option;
const TabPane = Tabs.TabPane;
export default class ClusterList extends React.Component {
      
    state = {
       
        selectedRowKeys:[],
        selectedRows:null, 
        searchname:'',
        searchdata:[],
        dataSource:[{
            name:'cluster1',
            nodes:'2',
            status:'Ready',
            role:'Controller',
            deployments:['22','30'],
            createtime:'2019-08-05T07:27:57Z',
            labels:[{
                name:'serverAddress',
                value:'https://192.168.0.16:6443'
            },{
                name:'clientCIDR',
                value:'0.0.0.0/0'
            } ],
            version:'v1.10.9'
        },{
            name:'cluster2',
            nodes:'3',
            status:'Ready',
            role:'SubCluster',
            deployments:['16','18'],
            createtime:'2019-08-05T07:27:57Z',
            labels:[{
                name:'serverAddress',
                value:'https://192.168.0.16:6443'
            },{
                name:'clientCIDR',
                value:'0.0.0.0/0'
            } ],
            version:'v1.10.0'
        }
        ]
       
    }
    componentDidMount(){//请求数据
        this.request()

     }
    // 动态获取mock数据
    request = () => { //初始化数据请求
        fetch('http://localhost:9090/api/clusters',{
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
                dataSource:data
            })
             
            return data;
        }).catch( (e)=> {  
            console.log(e);
        })
    } 




    //点击删除
    handleMutiDelete = ()=>{
            console.log("MultiDelete")
            console.log("selectedRowKeys",this.state.selectedRowKeys)
            console.log("selectedRows",this.state.selectedRows) 
            //let id = record.id;
            if(this.state.selectedRowKeys.length===0){
                Modal.info({
                    title:'删除集群',
                    content:'请选择一行',
                })
            }else if(this.state.selectedRows.filter(item=>item.role=='Controller').length>0){
                Modal.error({ //如果包含master节点提醒用户不可对master节点进行操作
                    title:'操作异常',
                    content:'中心控制集群不可进行该操作',
                })
            } else
            Modal.confirm({
                title:'删除集群',
                content:'您确认要删除这些集群吗？'+this.state.selectedRows.map(item=>item.name),
                onOk:()=>{
                    this.setState({  //取消选中行
                        selectedRowKeys: [ ],  
                        selectedRows: null
                    })
                    message.success('删除成功');
                    //发送恢复请求
                    this.request();
                }
            }) 
    }  

    onClick = ( key,text,record ) => { //点击下拉菜单选则
        //message.info(`Click on item ${key}`);
        this.setState({ 
            operationdata:record, // 传入要操作数据
        })
          if(key==='1'){ //如果是编辑
            this.handleUpdate(true) //显示编辑对话框
            
        }
        if(key==='2'){ //如果是删除
            this.handleDelete(key, text, record)
        }
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
        // 删除操作
        handleDelete = (key, text, record)=>{
            console.log("删除！")  
            console.log("key",key)
            console.log("text",text)
            console.log("record",record)
            //let id = record.id;
            Modal.confirm({
                title:'删除集群',
                content:'您确认要删除此集群吗？'+record.name ,
                onOk:()=>{ 
                    message.success('删除成功');
                    //发送删除请求
                    this.request();
                    //有了后台后删除
                    this.setState({
                        dataSource:this.state.dataSource.filter(item => item.name!==record.name)
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
    
        handleRedirect=(clusterdetail)=>{
            console.log('跳转！')
            sessionStorage.setItem('clustername',clusterdetail.name)
            utils.clusterdetail=clusterdetail
            //console.log('utils.clusterdetail',utils.clusterdetail)
           // Header.nodedetail=nodedetail
        }
        statechange=()=>{ //创建服务之后回调
            console.log('refresh!')
            this.request(this.props.currentcluster)
        } 
    render(){ 
        const columns=[
            {
                title:'集群名称',
                key:'name',
                dataIndex: 'name',
                width: '30%',
                align:'left',
                render: (text,record) =>
                {
                    //<a href={"#/node/"+record.name}>{text}</a>      
                    return (  <Link to={"/cluster/detailpage/"+record.name}  onClick={()=>this.handleRedirect(record)}>{text}</Link>)
                }
            },
            {   
                title:'状态',
                key:'status',
                dataIndex:'status',
                render(status){ //第一个是running中的pod 第二个是pod总数
                    let config = {
                        'Ready': <Tag  color="#87d068" style={{cursor:'auto' }} >Ready</Tag>,
                        'NotReady': <Tag  color="#ff7875" style={{cursor:'auto' }} >NotReady</Tag> ,  

                    }
                    return config[status];
                },
               
                align:'left',
            },  {   
                title:'版本',
                key:'version',
                dataIndex:'version',  
            },
            
            {   
                title:'角色',
                key:'role',
                dataIndex:'role', 
            },
            {   
                title:'主机数',
                key:'nodes',
                dataIndex:'nodes',
                 
            },
            {   
                title:'服务',
                key:'deployments',
                dataIndex:'deployments', 
                render(deployments){ //第一个是running中的deployment 第二个是deployment总数
                    if(deployments)
                    return(deployments[0]+'/'+deployments[1])
                }
            }
            , {   
                title:'创建时间',
                key:'createtime',
                dataIndex:'createtime',  
            },
            {   
                title:'操作',
                key:'operation' ,
                render:(text,record)=>{
                    var opration 
                    if(record.role=='Controller'){
                        opration = ( <Dropdown overlay={  
                            <Menu onClick={({key})=>this.onClick(key,text,record)}> 
                            <Menu.Item key="1">编辑</Menu.Item>
                          </Menu> 
                         } trigger={['click']}>
                             <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                        </Dropdown> )
                    } else{
                        opration = ( <Dropdown overlay={  
                            <Menu onClick={({key})=>this.onClick(key,text,record)}> 
                            <Menu.Item key="1">编辑</Menu.Item>
                            <Menu.Item key="2">删除</Menu.Item> 
                          </Menu> 
                         } trigger={['click']}>
                             <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                        </Dropdown> )
                    }
                    return opration
                }
            }
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
        return (
            
            <HashRouter> 
                { this.state.loading?(  <Spin tip="Loading...">
                    <Alert
                    message="Loading"
                    description="数据加载中"
                    type="info"
                    />
                </Spin>
                ): 
            (  
            <div style={{padding:10 ,minHeight:'calc(60vh)' }}> 
                <div >
                    <Row className='Button-wrap'> 
                    <Col span='20'> 
                        <Button onClick={this.handleMutiDelete}>删除<Icon type='delete'></Icon></Button>
                        <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                        <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                        
                    </Col>
                        <Col span='4' className='Button-right'> 
                        <CreateCluster   />
                    </Col>
                    </Row>
                    <Table  
                        style={{marginTop:16}}
                        dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                        rowSelection={rowSelection }
                        columns={columns }  
                        rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                    />
                     <EditCluster dataSource={this.state.operationdata}  editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}></EditCluster>
            
                </div>  
            </div>
                 )} 
            </HashRouter>
            
        )
    }
}