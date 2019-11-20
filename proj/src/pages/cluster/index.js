import React from 'react';
 import {Modal,message,Badge,InputNumber,Spin,Alert,Tag,Table, Select,Tabs,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import ClusterList from './clustelist'
import FedNamespaceList from'./fednamespace'
import utils from'./../../utils/utils'
const Option = Select.Option;
const TabPane = Tabs.TabPane;
export default class Cluster extends React.Component {
      
    state = {
       
        selectedRowKeys:[],
        selectedRows:null, 
        searchname:'',
        searchdata:[],
        dataSource:[{
            name:'cluster1',
            nodes:'2',
            status:'Active',
            role:'Controller',
            deployments:['22','30']
        },{
            name:'cluster2',
            nodes:'3',
            status:'Active',
            role:'SubCluster',
            deployments:['16','18']

        }
        ]
       
    }
    componentDidMount(){//请求数据
       // this.request()

     }
    // 动态获取mock数据
    request = () => {
        var token='token-b2q8g:ql4lb8mnw26fdwjgfwmhjsh2j6ssm2nmgm584bz6fqgrnp6klqhz2k'
        fetch(utils.urlprefix+'/v3',{
        method:'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
        }).then((data) => {
            console.log('data:',data)
            return data;
        }).catch((e)=>{
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
                title:'删除节点',
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
             
           // Header.nodedetail=nodedetail
        }
       
    render(){ 
   
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
            <div style={{  minHeight:'calc(60vh)'}}> 
                <Tabs defaultActiveKey="1" type="card"  onChange={this.handleCallback} style={{minheight:'calc(60vh)'}}> 
                    <TabPane tab="集群列表" key="1"  style={{backgroundColor:'white',marginTop:-16 }} >
                        <ClusterList /> 
                        </TabPane>
                    <TabPane tab="联邦命名空间" key="2"  style={{backgroundColor:'white',marginTop:-16 }}>
                        <FedNamespaceList  currentcluster={'fed'} />
                        </TabPane>
                     
                </Tabs> 
            </div>
                 )} 
            </HashRouter>
            
        )
    }
}