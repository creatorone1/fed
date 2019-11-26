// 应用管理
import React from 'react'
import './application.less'
import {  Row,Col,Spin, Alert,Card,Tag, Input,Tabs,Table, Modal, Button, message, Badge ,Menu,Dropdown,Icon,Select} from 'antd';
import { height } from 'window-size';
import Util from './../../utils/utils'
import EditApp from './form/edit_app'
import utils from './../../utils/utils'
export default class AppRelease   extends React.Component {
    state = {
        selectedRowKeys:[],
        selectedRows:null,
        currentcluster:'',
        currentnamespace:'',
        searchname:'',
        searchdata:[],
        search:false,
        operationdata:undefined,
        rbvisible:false, //控制回滚弹窗是否显示
        rollbackdata:[],     //回滚数据 
        scvisible:false,
        editvisible:false,
        dataSource:[{
            name:{
                name:'wordpress-test',
                iconurl:'https://bitnami.com/assets/stacks/wordpress/img/wordpress-stack-220x234.png'
            }, 
            chartversion:'5.2.0',
            version:1, //表示的是历史版本号
            status:'Active',
            namespace:'default',
            cluster:'cluster1',
            createtime:'2019-5-24',
            appversion: "5.2.0",
            key:'1',
        },{
            name:{
                name:'mysql-test',
                iconurl:'https://www.mysql.com/common/logos/logo-mysql-170x115.png'
            },
            chartversion:'4.3.6',
            appversion: "4.3.6",
            status:'Pending',
            namespace:'default',
            version:2,
            cluster:'cluster2',
            createtime:'2019-5-23',
            key:'2',
        } ],
        btnloading:false
    }
    componentDidMount(){//请求数据
        this.request(this.props.currentcluster);
        this.setState({
            currentcluster:this.props.currentcluster, 
           })
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据
        this.setState({
            currentcluster:nextProps.currentcluster, 
        })
        this.request(nextProps.currentcluster);
        console.log('AppRelease get props currentcluster:',nextProps.currentcluster)
    }

    //请求数据
    request = (clustername) => {
        fetch(utils.urlprefix+'/api/cluster/'+clustername+'/apps',{
        method:'GET'
        }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
        }).then((data) => {
            console.log('data:',data)
            data.map(item=>{
                item.createtime=Util.formateDate(item.createtime)
            })
            this.setState({
                selectedRowKeys:[],
                selectedRows:null,
                dataSource:data,
                btnloading:false
            })
            return data;
        }).catch((e)=>{
            this.setState({
                dataSource:[],
                btnloading:false
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
            content:'您确认要删除这些数据吗？'+record.name.name ,
            onOk:()=>{

                var datas={
                    items:[]
                }   
                var ditem={
                    name:record.name.name , 
                }
                datas.items=datas.items.concat(ditem) 
                //下面URL的 集群 名称 以后需要替换掉
                fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/releases?data='+JSON.stringify(datas),{
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
                        message.success('网络错误');
                        //发送删除请求
                        this.request(this.props.currentcluster); 
                        console.log(e);
                    })
               
            }
        })
    }
    //批量删除操作
    handleMutiDelete = ()=>{
        console.log("MutiDelete")
        console.log("Pause")
        console.log("selectedRowKeys",this.state.selectedRowKeys)
        console.log("selectedRows",this.state.selectedRows) 
        //let id = record.id;
        if(this.state.selectedRowKeys.length===0){
            Modal.info({
                title:'确认删除',
                content:'请选择一行',
            })
        } else
        Modal.confirm({
            title:'确认删除',
            content:'您确认要删除这些数据吗？'+this.state.selectedRows.map(item=>item.name.name) ,
            onOk:()=>{

                var datas={
                    items:[]
                }  
                this.state.selectedRows.map(item=>{
                    var ditem={
                        name:item.name.name, 
                    }
                    datas.items=datas.items.concat(ditem)
                })
                //下面URL的 集群 名称 以后需要替换掉
                fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/releases?data='+JSON.stringify(datas),{
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
                searchdata:this.state.dataSource.filter(item=>item.name.name.indexOf(content)!==-1),
                search:true
            })
             
        }
    }
    //点击搜索按钮
    handleSearch = ()=>{
        console.log('this.state.searchname:',this.state.searchname)
    if(this.state.searchname!==''){
        //console.log('this.state.searchname:',this.state.searchname)
        //console.log(this.state.dataSource.map(item=>item.name.indexOf(this.state.searchname)))
        this.setState({
            searchdata:this.state.dataSource.filter(item=>item.name.name.indexOf(this.state.searchname)!==-1),
            search:true
        })
            
    }else{
        this.setState({ 
            search:false
        })
        
    }
    }

     // 回滚操作
    handleRollback = (key,text,record)=>{
        console.log("回滚！")  
       // let sysTime = Util.formateDate(new Date().getTime()); //获取格式化的时间
       Modal.confirm({
        title:'确认回滚',
        content:'您确认要回滚这个应用吗？'+record.name.name ,
        onOk:()=>{ 
              
            //下面URL的 集群 名称 以后需要替换掉
            fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/app/'+record.name.name+'/rollback',{
                method:'PUT',
                mode: 'cors', 
                }).then((response) => {
                    console.log('response:',response.ok)
                    return response.json();
                }).then((data) => {
                    this.setState({  //取消选中行
                        selectedRowKeys: [ ],  
                        selectedRows: null
                    })
                    message.success('回滚成功');
                    //发送删除请求
                    this.request(this.props.currentcluster); 
                    return data;
                }).catch( (e)=> {  
                    this.setState({  //取消选中行
                        selectedRowKeys: [ ],  
                        selectedRows: null
                    })
                    message.success('网络错误');
                    //发送删除请求
                    this.request(this.props.currentcluster); 
                    console.log(e);
                })
           
        }
    })
        /*fetch('url'+record.name,{  //查找该工作负载的副本集,修改 this.state.rollback 数据
                method:'GET'
            }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
             }).then((data) => {
            console.log('data:',data) 
            this.setState({    //传入获取的版本数据 
                //rollbackdata:data,  以后由后台传入数据 
                 rollbackdata:[
                    {
                        name:'appversion-d58g7',
                        version:1,
                        createtime:sysTime
                    },
                    {
                        name:'appversion-d58g8',
                        version:2,
                        createtime:sysTime
                    },
                    {
                        name:'appversion-d58g9',
                        version:3,
                        createtime:sysTime
                    },
                ], 
                
                rbvisible:true,   
            })  
        }).catch((e)=> {  //写箭头函数，不要写function(e) {} 
            console.log("Error:   以后记得删除catch里的setState");
            this.setState({     //传入获取的版本数据
                //rollbackdata:data,  以后由后台传入数据
                operationdata:record, // 传入要操作数据
               rollbackdata:[
                    {
                        name:'appversion-d58g7',
                        version:1,
                        createtime:sysTime
                    },
                    {
                        name:'appversion-d58g8',
                        version:2,
                        createtime:sysTime
                    },
                    {
                        name:'appversion-d58g9',
                        version:3,
                        createtime:sysTime
                    },
                ],
                
                rbvisible:true,   
            })
            
            message.success('网络请求错误！') 
            
            console.log("Error: ",e);
        }) */
    }
    handleSelectRb=(value)=>{ //选择回滚版本数据
        this.setState({
            version:value
        })

    }
     // 升级操作
     handleUpdate = (visible,ok)=>{
        //console.log("升级！") 
        if(visible)   
        this.setState({
            editvisible:true
        }) 
        else
        this.setState({
            editvisible:false
        }) 
        if(ok){
            this.request(this.props.currentcluster); 
        }

    } 
    onClick = ( key,text,record ) => { //点击下拉菜单选则
        //message.info(`Click on item ${key}`); 
        this.setState({ 
            operationdata:record, // 传入要操作数据
        })
        if(key==='1'){ //如果是升级
             this.handleUpdate(true)
        }
        if(key==='2'){ //如果是回滚
            this.handleRollback(key, text, record)
        } 
        if(key==='3'){ //如果是删除
            this.handleDelete(key, text, record)
        } 
    };
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
            this.request(this.props.currentcluster);
          }
        ,1000) 
    }
    render(){
        const columns=[
            {
                title:'名称',
                key:'name',
                dataIndex: 'name',
                render(item) {
                     
                    let name = (<div><img src={item.iconurl} alt='' style={{display:'line-block',width:'30px', height:'30px',marginRight:'16px'}}   /><span>{item.name}</span></div>)
                    return name;
                }
            },
            {
                title:'状态',
                key:'status',
                dataIndex: 'status',
                render(abc) {
                    let config = {
                        'Active': <Tag  color="#87d068" style={{cursor:'auto' }} >Active</Tag>,
                        'Pending': <Tag color="#faad14" style={{cursor:'auto' }} >Pending</Tag> ,   
                    }
                    return config[abc];
                }
            },
            {
                title:'命名空间',
                key:'namespace',
                dataIndex: 'namespace',
            },
            /*{
                title:'集群',
                key:'cluster',
                dataIndex: 'cluster',
            },*/
            {
                title:'版本',
                key:'version',
                dataIndex: 'version',
            },
            {
                title:'Chart版本',
                key:'chartversion',
                dataIndex: 'chartversion',
            },
            {
                title:'创建时间',
                key:'createtime',
                dataIndex: 'createtime',
                width:'20%',
            },
            {
                title:'操作',
                key:'operation',
                render:(text,record)=>{ 
                    return( 
                     <Dropdown overlay={
                        <Menu onClick={({key})=>this.onClick(key,text,record)}>
                        <Menu.Item key="1">升级</Menu.Item> 
                        <Menu.Item key="2">回滚</Menu.Item> 
                        <Menu.Item key="3">删除</Menu.Item> 
                      </Menu> 
                     } trigger={['click']}>
                         <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                    </Dropdown> 
                   )
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
                <div style={{ padding:10 ,minHeight:'calc(60vh)'}}>
                   <Row className='Button-wrap'> 
                    <Col span='20'> 
                        <Button onClick={this.handleMutiDelete}>删除<Icon type='delete'></Icon></Button>
                        <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                        <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                         <Button onClick={this.handleRefresh} loading={this.state.btnloading}>刷新 </Button>
                    
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
                        rowKey={record => record.name.name+record.namespace} 
                        rowSelection={rowSelection }
                        columns={columns }  
                        rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                    />}
                    </Spin>
                    <EditApp  statechange={this.statechange} currentcluster={this.props.currentcluster} clusters={this.props.clusters} dataSource={this.state.operationdata}   editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}/>
                 
                 <Modal
                    width='560px'
                    title={ this.state.operationdata===undefined ? '回滚':'回滚: '+this.state.operationdata.name.name}
                    visible={this.state.rbvisible} 
                    maskClosable={false} 
                    destroyOnClose  
                    onCancel={()=>{
                                this.setState({
                                    rbvisible:false
                                 }) 
                                }
                            }
                    onOk={()=>{
                          console.log('rollback version: '+this.state.version)
                         if(this.state.version!==undefined)
                        {   this.request('url'+this.state.operationdata.name.name+this.state.version); //发送回滚请求
                            message.success('回滚成功');
                            this.setState({
                                rbvisible:false,
                                version:undefined
                            })
                        }else{
                            this.setState({
                                rbvisible:false
                            })
                         }  
                        }}
                > 
                        <div>回滚到</div>
                        <Select style={{width:'80%',marginTop:16}} onSelect={this.handleSelectRb}>
                            {
                                this.state.rollbackdata.map(item=> 
                                    <Select.Option key={item.name} value={item.version} disabled={item.version===this.state.operationdata.version}>{item.name+'     version  '+item.version+' :    '+item.createtime}</Select.Option>
                                )
                            } 
                        </Select> 
                </Modal>

                </div>
                )
        }
    }