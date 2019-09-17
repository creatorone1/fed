 // 用户管理
import React from 'react'
import {Modal,message,Radio,Card,Divider,Badge,InputNumber,Spin,Alert,Tag,Table, Select,Tabs,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import CreateUser from'./form/createuser'
import EditUser from'./form/edituser'
import RadioGroup from 'antd/lib/radio/group';
import './user.less'
export default class User extends React.Component {
    state = {
        selectedRowKeys:[],
        selectedRows:null, 
        searchname:'',
        searchdata:[],
        checked:'',
        dataSource:[{
             username:'user1',
             status:'Active',
             role:'Administrator',
             createtime:'2019-08-085T07:27:57Z',
             authtime:'2019-08-095T07:27:57Z',
             /*auths:[ //管理员拥有所有权限
                'federation',
                'clustercheck:cluster1',
                'clustercheck:cluster2',
                'application'
             ]*/
             
        },{
            username:'user2',
            status:'inActive',
            role:'CommonUser',
            createtime:'2019-08-085T07:27:57Z',
            authtime:'2019-08-095T07:27:57Z',
            auths:[ 
                'clustercheck:cluster3',
                'clustercheck:cluster2',
                'service',
                'store' 
            ]
        }
        ],

        //根据登录用户的身份来显示可以管理的内容 先从cookie中获取
        loginUser:{  
            username:'use',
            role:'Administrator'
        }
       
    }
    componentDidMount(){//请求数据
        this.request();
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据

    }
    request = () => {
        fetch('url',{
        method:'GET'
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
    //批量删除操作
    handleMutiDelete = ()=>{
        console.log("MutiDelete")
        console.log("选中的行的keys ",this.state.selectedRowKeys)
        console.log("选中的行的数据",this.state.selectedRows) 
        //let id = record.id;
        if(this.state.selectedRowKeys.length===0){
            Modal.info({
                title:'删除用户',
                content:'请选择一行',
            })
        } else
        Modal.confirm({
            title:'删除用户',
            content:'您确认要删除这些用户吗？'+this.state.selectedRows.map(item=>item.username) ,
            onOk:()=>{
                this.setState({  //取消选中行
                    selectedRowKeys: [ ],  
                    selectedRows: null
                })
                message.success('删除成功');
                //发送删除请求
                this.request();
            }
        })
    }
    //点击暂停
    handleMutiPause = ()=>{
            console.log("Pause")
            console.log("selectedRowKeys",this.state.selectedRowKeys)
            console.log("selectedRows",this.state.selectedRows) 
            //let id = record.id;
            
            if(this.state.selectedRowKeys.length===0){
                Modal.info({
                    title:'停用用户',
                    content:'请选择一行',
                })
            }  else
            Modal.confirm({
                title:'停用用户',
                content:'您确认要将这些用户停用吗？'+this.state.selectedRows.map(item=>item.username) ,
                onOk:()=>{
                    this.setState({  //取消选中行
                        selectedRowKeys: [ ],  
                        selectedRows: null
                    })
                    message.success('停用成功');
                    //发送暂停请求
                    this.request();
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
                    title:'用户恢复',
                    content:'请选择一行',
                })
            } else
            Modal.confirm({
                title:'用户恢复',
                content:'您确认要恢复这些用户吗？'+this.state.selectedRows.map(item=>item.username) ,
                onOk:()=>{
                    this.setState({  //取消选中行
                        selectedRowKeys: [ ],  
                        selectedRows: null
                    })
                    message.success('恢复成功');
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
        //console.log( "key",key);
        //console.log( "text",text);
        //console.log( "item",record);
        if(key==='1'){ //如果是编辑 
            this.handleUpdate(true) //显示编辑对话框
            
        }
        if(key==='2'){ //如果是暂停
            this.handlePause(key, text, record)  
        }
        if(key==='3'){ // 如果是恢复
            this.handleResume(key, text, record)
            
        }
        if(key==='4'){ //如果是删除
            this.handleDelete(key, text, record)
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
            title:'停用用户',
            content:'您确认要停用这用户吗？'+record.username,
            onOk:()=>{
                
                message.success('停用成功');
                //发送暂停请求
                this.request();
                 
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
            title:'恢复用户',
            content:'您确认要恢复此用户吗？'+record.username ,
            onOk:()=>{ 
                message.success('恢复成功');
                //发送恢复请求
                this.request();
                
                 
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
            title:'删除用户',
            content:'您确认要删除此用户吗？'+record.username ,
            onOk:()=>{ 
                message.success('删除成功');
                //发送删除请求
                this.request();
                //有了后台后删除
                this.setState({
                    dataSource:this.state.dataSource.filter(item => item.username!==record.username)
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
           /* var data={
                name:2,
                age:"18asd"
            }
            console.log("datajson:"+JSON.stringify(data))
            fetch('http://localhost:9090/api/cluster/cluster/deployments?json='+JSON.stringify(data)
            ,{
                method:'GET',
                mode: 'cors',
                headers:{ // 请求头（可以是Headers对象，也可是JSON对象）
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }, 
                }).then((response) => {
                    console.log('response:',response.ok)
                    return response.json();
                }).then((data) => {
                    console.log('data:',data)
                    return data;
                }).catch(function (e) {
                    console.log(e);
                })*/
             if(this.state.searchname!==''){
                //console.log('this.state.searchname:',this.state.searchname)
                //console.log(this.state.dataSource.map(item=>item.name.indexOf(this.state.searchname)))
                this.setState({
                    searchdata:this.state.dataSource.filter(item=>item.username.indexOf(this.state.searchname)!==-1),
                    search:true
                })
                 
            }else{
                this.setState({ 
                    search:false
                })
                
            }
        }

    handleConfig = (e)=>{
        console.log('select config',e.target.value)
        this.setState({
            checked:e.target.value
        })
    }   

    render(){
        const columns=[
            {
                title:'用户名',
                key:'username',
                dataIndex: 'username',  
                 
            },
            {   
                title:'状态',
                key:'status',
                dataIndex:'status',
                render(status){ //第一个是running中的pod 第二个是pod总数
                    let config = {
                        'Active': <Tag  color="#87d068" style={{cursor:'auto' }} >Active</Tag>,
                        'inActive': <Tag  color="#ff7875" style={{cursor:'auto' }} >inActive</Tag> ,  

                    }
                    return config[status];
                },
                
            },  
            
            {   
                title:'角色',
                key:'role',
                dataIndex:'role', 
                render(role){
                    let userrole={
                        'Administrator':'管理员',
                        'CommonUser':'普通用户',
                    }
                    return userrole[role]
                }
            }, 
            {   
                title:'创建时间',
                key:'createtime',
                dataIndex:'createtime',  
            }, 
            {   
                title:'授权时间',
                key:'authtime',
                dataIndex:'authtime',  
            },
            {   
                title:'操作',
                key:'operation' ,
                render:(text,record)=>{
                    var opration  
                    var pause= <Menu.Item key="2">暂停</Menu.Item> 
                    var resume=<Menu.Item key="3">恢复</Menu.Item>
                    if(this.state.loginUser.role=='普通用户'){
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
                            {record.status=='Active'?pause:resume
                            }  
                            <Menu.Item key="4">删除</Menu.Item> 
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


        return(
            <HashRouter  > 
            { this.state.loading?(  <Spin tip="Loading...">
                <Alert
                message="Loading"
                description="数据加载中"
                type="info"
                />
            </Spin>
            ): 
        (  
        <div style={{backgroundColor:'white', minHeight:'calc(60vh)'}} > 
           <div className="Dropdown-wrap" > 
                    <span style={{marginRight:10,fontSize:15}}>用户列表 </span>  
                </div> 
         
            <div style={{ padding:10 ,marginTop:-10  }}>
                 <Divider style={{marginTop:-5}}></Divider>

                <Row className='Button-wrap' style={{ marginTop:-10}}> 
                <Col span='20'> 
                    <Button onClick={this.handleMutiPause}>暂停<Icon type='pause'></Icon></Button>
                    <Button onClick={this.handleMutiResume}>恢复<Icon type="caret-right" /></Button>
                     {this.state.loginUser.role=='管理员'? 
                     <Button onClick={this.handleMutiDelete}>删除<Icon type="delete" /></Button>:''
                    }    
                    <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                    <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                    
                </Col>
                    <Col span='4' className='Button-right'> 
                    <CreateUser/>
                </Col>
                </Row>
                <Table  
                    style={{marginTop:16}}
                    dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                    rowSelection={rowSelection }
                    columns={columns }  
                    rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                />
                <EditUser dataSource={this.state.operationdata} editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}></EditUser>
                 {
                     /**
                <Radio.Group className='config-wrap' onChange={this.handleConfig}>
                        <Radio value='1x'>
                        <Card  className={this.state.checked!=='1x'?'config-card-wrap':''}
                          style={{
                              background:this.state.checked=='1x'?'#5e7ce0':'#f2f5fc', 
                            }}
                         > 
                         <div style={{ width:'60px',background:'#FFFFFF', textAlign:'center',margin:'0 auto' }}>
                         1x
                         </div> 
                         <div>
                         config1x asdasfasfasf
                         </div> 
                        </Card>
                        </Radio>

                        <Radio value='2x'>
                        <Card  className={this.state.checked!=='2x'?'config-card-wrap':''} 
                        style={{  background:this.state.checked=='2x'?'#5e7ce0':'#f2f5fc'}}>
                            <div style={{ }}>
                            2x
                            </div> 
                            <div>
                             config2x
                            </div>
                            </Card>
                        </Radio>
                </Radio.Group>
                     */
                 }
     
                 
                 
            </div>  
        </div>
             )} 
        </HashRouter>
                )
        }
    }