/**PVC管理* */

import React from 'react'
import './store.less'
import {Modal,message,Badge,InputNumber,Tag,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import CreatePVC from './form/create_pvc'
export default class PVC extends React.Component {
    state = {
        selectedRowKeys:[],
        selectedRows:null,
        currentcluster:'',
        currentnamespace:'',
        searchname:'',
        searchdata:[],
        dataSource:[{
            name:'pvc1',
            namespace:'default',
            status:'Bound',
            size:'10GB',
            volume:'myvo1',
            storageclass:'nfs',
            createtime:'2019-5-10',
            key:'1',
        },{
            name:'pvc2',
            status:'Bound',
            namespace:'default',
            size:'20GB',
            volume:'myvo2',
            storageclass:'nfs',
            createtime:'2019-5-11',
            key:'2',
        },{
            name:'pvc3',
            status:'Pending', //找不到合适的PV进行绑定的时候
            namespace:'default',
            size:'30GB',
            volume:'',
            storageclass:'',
            createtime:'2019-5-11',
            key:'3',
        },
       ] 

         
    }
    componentDidMount(){//请求数据
        //this.request();
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
                message.success('删除成功');
                //发送删除请求
                this.request();
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
        if(key==='1'){ //如果是删除
            this.handleDelete(key, text, record)
        } 
    }; 
    render(){
        
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
                        'Bound': <Tag  color="#87d068" style={{cursor:'auto' }} >Bound</Tag>,
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
            {
                title:'大小',
                key:'size',
                dataIndex: 'size',
            },
            {
                title:'持久卷',
                key:'volume',
                dataIndex: 'volume',
                render(abc,record) {
                    //console.log(abc+record.name)
                    if(abc!=='')
                    return  abc ;
                    else return '-';
                }
            },
            {
                title:'存储类',
                key:'storageclass',
                dataIndex: 'storageclass',
                render(abc,record) {
                    //console.log(abc+record.name)
                    if(abc!=='')
                    return  abc ;
                    else return '-';
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
                        <Menu.Item key="1">删除</Menu.Item> 
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
                     
                    </Col>
                     <Col span='4' className='Button-right'> 
                        <CreatePVC namespaces={this.props.namespaces} ></CreatePVC>
                    </Col>
                </Row>
                <Table  
                    dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                    rowSelection={rowSelection }
                    columns={columns }  
                    rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                />
                
                </div>
                )
        }
    }

    