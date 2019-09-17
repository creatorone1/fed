//部署一个工作负载的表单
import React from 'react'
//import {Modal,message,Badge,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, }from 'antd'
import './service.less' 
import {Modal,message,Badge,InputNumber,Tag,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, 
  
} from 'antd';
import CreateIng from './form/create_ing'  
import EditIng from './form/edit_ing' 
   
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
            status:'running',
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
            target: ['example.com/nginx' ,'nginx'],
            createtime:"2019-4-11",  
            key:'1',
            backend:{
                servicename:'mynginx',
                serviceport:443
            },
           
        },
        {
            name:'nginxins',
            status:'initializing',
            namespace:'default',
            target: ['example2.com/nginx' ,'nginx2'],
            createtime:"2019-4-11",  
            key:'2'
        },
        {
            name:'webins',
            status:'initializing',
            namespace:'default',
            target: ['example3.com/nginx' ,'nginx3'],
            createtime:"2019-4-11",  
            key:'3'
        },
         

        ],
        editvisible:false
        

    }
    componentDidMount(){//请求数据
      // this.request();
       this.setState({
        currentcluster:this.props.currentcluster,
        currentnamespace:this.props.currentnamespace,

      })
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据
        this.setState({
            currentcluster:nextProps.currentcluster,
            currentnamespace:nextProps.currentnamespace,

        }) 
        console.log('ingress get props currentcluster:',nextProps.currentcluster)
        console.log('ingress get props currentnamespaces:',nextProps.currentnamespace)

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
                title:'名称',
                key:'name',
                dataIndex: 'name',
            }, 
            { 
                title:'状态',
                key:'status',
                dataIndex: 'status',
                render(status){
                    let config = {
                        'running': <Tag  color="#87d068" style={{cursor:'auto' }} >running</Tag>,
                        'initializing': <Tag  color="#faad14" style={{cursor:'auto' }} >Initializing</Tag> ,  
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
                    return(
                        <span> <a href={'http://'+target[0]} target='_blank'>{target[0]}</a><Icon type="right" />{ target[1]} </span>
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
                     
                </Col>
                <Col span='4' className='Button-right'> 
                    <CreateIng namespaces={this.props.namespaces} ></CreateIng>
                </Col>
                </Row>
                <Table  
                    dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                    rowSelection={rowSelection }
                    columns={columns }  
                    rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                />
                <EditIng dataSource={this.state.operationdata} namespaces={this.props.namespaces} editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}/>
               
            </div>
        )
    }
} 