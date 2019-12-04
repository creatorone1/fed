/**存储类管理* */

import React from 'react'
import './store.less'
import {Modal,message,Badge,InputNumber,Spin,Alert,Tag,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import CreateSc from './form/create_sc'
import EditSc from './form/edit_sc'
import utils from './../../utils/utils'
export default class StorageClass extends React.Component {
    state = {
        selectedRowKeys:[],
        selectedRows:null,
        currentcluster:'',
        currentnamespace:'',
        searchname:'',
        searchdata:[],
        dataSource:[{
                name:'stc1', 
                status:'Active', 
                provisioner:'example.com/nfs', 
                createtime:'2019-5-10',
                reclaimPolicy:'Delete',
                key:'1',

            },{
                name:'stc2',
                status:'Active', 
                provisioner:'example.com/nfs', 
                createtime:'2019-5-11',
                reclaimPolicy:'Retain',
                key:'2',
            },{
                name:'stc3',
                status:'Active',   
                provisioner:'example.com/nfs',  
                createtime:'2019-5-11', 
                reclaimPolicy:'Retain',
                key:'3',
            }
        ],
        btnloading:false, 
    }
    componentDidMount(){//请求数据
        //this.request();
        this.request(this.props.currentcluster);
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据
        this.request(nextProps.currentcluster);
    }
    request = (clustername) => {
        fetch(utils.urlprefix+'/api/cluster/'+clustername+'/scs',{
        method:'GET'
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
                 }
                datas.items=datas.items.concat(ditem)
               
               // console.log(JSON.stringify(datas))
                //下面URL的 集群 名称 以后需要替换掉
                fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/scs?data='+JSON.stringify(datas),{
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
                    }
                    datas.items=datas.items.concat(ditem)
                })
               // console.log(JSON.stringify(datas))
                //下面URL的 集群 名称 以后需要替换掉
                fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/scs?data='+JSON.stringify(datas),{
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
         console.log('this.state.searchname:',this.state.searchname)
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
    onClick = ( key,text,record ) => { //点击下拉菜单选则
        //message.info(`Click on item ${key}`); 
        this.setState({ 
            operationdata:record, // 传入要操作数据
        })
        if(key==='1'){ //如果是编辑
            this.handleUpdate(true)
        }
        if(key==='2'){ //如果是删除
            this.handleDelete(key, text, record)
        } 
    }; 
    handleUpdate = (visible)=>{//编辑存储类
        //console.log("升级！") 
        if(visible)   
        this.setState({
            editvisible:true
        }) 
        else
        this.setState({
            editvisible:false
        }) 
        //var fd =new FormData()
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
    handleUpload =(e)=>{
        console.log(e.target.files)
    }
    render(){
        /**考虑加上集群列，表示数据属于哪个集群 */
        
        const columns=[
            {
                title:'名称',
                key:'name',
                dataIndex: 'name',
            },
            {
                title:'状态',
                key:'status',
                dataIndex: 'status',
                render(abc) {
                    let config = {
                          'Active': <Tag color="#87d068" style={{cursor:'auto' }} >Active</Tag> ,  
                    }
                    return config[abc];
                }
            }, 
            {
                title:'提供者',
                key:'provisioner',
                dataIndex: 'provisioner',
            }, 
            {
                title:'回收规则',
                key:'reclaimPolicy',
                dataIndex: 'reclaimPolicy',
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
                        {
                           // <Menu.Item key="1">编辑</Menu.Item> 
                        }
                         
                        <Menu.Item key="2">删除</Menu.Item> 
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
                    {
                        //<input type="file" onChange={this.handleUpload}/>    
                    } 
                        <Button onClick={this.handleMutiDelete}>删除<Icon type='delete'></Icon></Button>
                        <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                        <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                        <Button onClick={this.handleRefresh} loading={this.state.btnloading}>刷新 </Button>
                
                    </Col>
                        <Col span='4' className='Button-right'> 
                        <CreateSc  statechange={this.statechange} currentcluster={this.props.currentcluster}   namespaces={this.props.namespaces} > </CreateSc>
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
                        rowKey={record => record.name}
                        rowSelection={rowSelection }
                        columns={columns }  
                        rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                    />}
                    </Spin>
                      <EditSc statechange={this.statechange} currentcluster={this.props.currentcluster} dataSource={this.state.operationdata} namespaces={this.props.namespaces} editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}></EditSc>
                </div>
                )
        }
    }