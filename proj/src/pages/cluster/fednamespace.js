import React from 'react';
 import {Modal,message,Badge,InputNumber,Spin,Alert,Tag,Table, Select,Tabs,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import EditCluster from './form/clusteredit'
import CreateFedNamespace from './form/createfednamespace' 
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
        ,crvisible:false,
    }
    componentDidMount(){//请求数据
       
       console.log('namespace type:',this.props.type) //如果不是集群的
       if(this.props.type!==undefined){
           console.log('change')
           
           this.setState({  
                  dataSource:this.props.data //
               })  
       }else{  //如果是联邦的则访问联邦命名空间数据
         // this.request()
       }
     }

    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps')
        /*if(nextProps.type!==undefined){
            console.log('change')
            this.setState({  
                //这儿 必须是深拷贝，不然会影响传入的值,并且只能初始化这个参数一次，以后的form的set操作不能影响该值
                dataSource:JSON.parse(nextProps.data) //
                }) 
            console.log(nextProps.data)
        }*/
       
    } 

    // 动态获取mock数据
    request = () => {
        var token='token-b2q8g:ql4lb8mnw26fdwjgfwmhjsh2j6ssm2nmgm584bz6fqgrnp6klqhz2k'
        fetch('https://10.103.240.133/v3',{
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
        }).catch(function (e) {
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
                        
                    </Col>
                        <Col span='4' className='Button-right'> 
                        <CreateFedNamespace />
                    </Col>
                    </Row>
                    <Table  
                        style={{marginTop:16}}
                        dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                        rowSelection={rowSelection }
                        columns={columns }  
                        rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                    />
                      
                </div>
              
            </div>
                 )} 
            </HashRouter>
            
        )
    }
}