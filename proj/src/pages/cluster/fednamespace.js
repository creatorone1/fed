import React from 'react';
 import {Modal,message,Badge,InputNumber,Spin,Alert,Tag,Table, Select,Tabs,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import EditCluster from './form/clusteredit'
import CreateFedNamespace from './form/createfednamespace' 
import utils from './../../utils/utils'
const Option = Select.Option;
const TabPane = Tabs.TabPane;
export default class FedNamespaceList extends React.Component {
      
    state = {
       
        selectedRowKeys:[],
        selectedRows:null, 
        searchname:'',
        searchdata:[],
        dataSource:[{
            name:'default', 
            status:'Active', 
            createtime:'2019-08-05T07:27:57Z',
          
        },{
            name:'system',  
            status:'Active', 
            createtime:'2019-08-05T07:27:57Z', 

        }
        ]
        ,
        crvisible:false,
          
        btnloading:false,
    }
    componentDidMount(){//请求数据
       
       //console.log('namespace type:',this.props.type) //如果不是集群的
       console.log('namspaces currentcluster:',this.props.currentcluster) 
       if(this.props.type!==undefined){
           console.log('change')
           
           this.setState({  
                  dataSource:this.props.data //
               })  
       }else{  //如果是联邦的则访问联邦命名空间数据
          this.request(this.props.currentcluster)
       }
     }

    componentWillReceiveProps(nextProps){
       // console.log('componentWillReceiveProps')
        console.log('nextProps currentcluster:',nextProps.currentcluster) 
        /*if(nextProps.type!==undefined){
            console.log('change')
            this.setState({  
                //这儿 必须是深拷贝，不然会影响传入的值,并且只能初始化这个参数一次，以后的form的set操作不能影响该值
                dataSource:JSON.parse(nextProps.data) //
                }) 
            console.log(nextProps.data)
        }*/
        //this.request(nextProps.currentcluster);
    } 

    // 动态获取mock数据
    request = (clustername) => { //初始化数据请求
        fetch(utils.urlprefix+'/api/cluster/'+clustername+'/namespaces',{
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
                btnloading:false,
            }) 
            return data;
        }).catch( (e)=> {  
            this.setState({  
                btnloading:false,
            }) 
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
                    title:'删除命名空间',
                    content:'请选择一行',
                })
            }  else
            Modal.confirm({
                title:'删除命名空间',
                content:'您确认要删除这些命名空间吗？'+this.state.selectedRows.map(item=>item.name),
                onOk:()=>{

                    var datas={
                        items:[]
                    }  
                    this.state.selectedRows.map(item=>{
                        var ditem={
                            name:item.name,   
                        }
                        datas.items=datas.items.concat(ditem)
                    })
                   // console.log(JSON.stringify(datas))
                    //下面URL的 集群 名称 以后需要替换掉
                    fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/namespaces?data='+JSON.stringify(datas),{
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
                            this.request(this.props.currentcluster);
                            return data;
                        }).catch( (e)=> {  
                            this.setState({  //取消选中行
                                selectedRowKeys: [ ],  
                                selectedRows: null
                            })
                            message.success('删除成功');
                            //发送删除请求
                            this.request(this.props.currentcluster);
                            console.log(e);
                        }) 
                    }
            }) 
    }  

    onClick = ( key,text,record ) => { //点击下拉菜单选则
        //message.info(`Click on item ${key}`);
        this.setState({ 
            operationdata:record, // 传入要操作数据
        })
 
        if(key==='2'){ //如果是删除
            this.handleDelete(key, text, record)
        }
    }
    
    
        // 删除操作
    handleDelete = (key, text, record)=>{
            console.log("删除！")  
            console.log("key",key)
            console.log("text",text)
            console.log("record",record)
            //let id = record.id;
            Modal.confirm({
                title:'删除命名空间',
                content:'您确认要删除此命名空间吗？'+record.name ,
                onOk:()=>{ 
                    var datas={
                        items:[]
                    }  
                    var ditem={
                            name:record.name,   
                     }
                    datas.items=datas.items.concat(ditem)
                   
                   // console.log(JSON.stringify(datas))
                    //下面URL的 集群 名称 以后需要替换掉
                    fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/namespaces?data='+JSON.stringify(datas),{
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
                            this.request(this.props.currentcluster);
                            return data;
                        }).catch( (e)=> {  
                            this.setState({  //取消选中行
                                selectedRowKeys: [ ],  
                                selectedRows: null
                            })
                            message.success('删除成功');
                            //发送删除请求
                            this.request(this.props.currentcluster);
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
                console.log('refresh!')
                this.request(this.props.currentcluster)
    } 

    handleRefresh =() =>{
        console.log('refresh !')
        this.setState({ 
            btnloading:true
        })
        //this.request()
        setTimeout(()=> {//模拟数据加载结束则取消加载框 
            this.request(this.props.currentcluster)
        }
        ,1000) 
    } 
    render(){ 
        const columns=[
            {
                title:'命名空间',
                key:'name',
                dataIndex: 'name',
                width: '60%',
                align:'left',
            },
            {   
                title:'状态',
                key:'status',
                dataIndex:'status',
                render(status){ //第一个是running中的pod 第二个是pod总数
                    let config = {
                        'Active': <Tag  color="#87d068" style={{cursor:'auto' }} >Active</Tag>,
                        //'NotReady': <Tag  color="#ff7875" style={{cursor:'auto' }} >NotReady</Tag> ,  

                    }
                    return config[status];
                },
               
                align:'left',
            }, 
            {   
                title:'创建时间',
                key:'createtime',
                dataIndex:'createtime', 
                align:'left',
            },
             
            {   
                title:'操作',
                key:'operation' ,
                render:(text,record)=>{ 
                    return (<Dropdown overlay={  
                        <Menu onClick={({key})=>this.onClick(key,text,record)}>  
                        <Menu.Item key="2">删除</Menu.Item> 
                      </Menu> 
                     } trigger={['click']}>
                         <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                    </Dropdown>)
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
            <div style={this.props.type?{}:{padding:10 ,minHeight:'calc(60vh)' }}> 
               
             
                <div >
                    <Row className='Button-wrap'> 
                    <Col span='20'> 
                        <Button onClick={this.handleMutiDelete}>删除<Icon type='delete'></Icon></Button>
                        <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                        <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                        <Button onClick={this.handleRefresh} loading={this.state.btnloading}>刷新 </Button>
                
                    </Col>
                        <Col span='4' className='Button-right'> 
                        <CreateFedNamespace statechange={this.statechange} currentcluster={this.props.currentcluster}/>
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
                    />}
                    </Spin>
                      
                </div>
              
            </div>
                 )} 
            </HashRouter>
            
        )
    }
}