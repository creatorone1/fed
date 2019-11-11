// 用于暴露服务 
import React from 'react'
import './service.less'
import {Modal,message,Badge,InputNumber,Tag,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import CreateSvc from './form/create_svc'  
import EditSvc from './form/edit_svc' 
export default class Services extends React.Component {
      
    state = {
        selectedRowKeys:[],
        selectedRows:null,
        currentcluster:'',
        currentnamespace:'',
        searchname:'',
        searchdata:[],
        search:false,
        dataSource:[{
            name:'nginxService', 
            namespace:'default',
          //  target: 'nginx' ,
            type:'NodePort',
            createtime:"2019-4-11",
            port:['30637','TCP'] , //第一个是targetport端口，第二个是协议
            key:'1',
            workload:['nginx1','nginx2'], //在后台根据selector的label键值对查找到相应deployments
            selectors:[{
                name:'app',
                value:'nginx1'
            },{
                name:'app',
                value:'nginx2'
            },{
                name:'app',
                value:'nginx3'
            },],
            ports:[{
                name:'http-port',
                port:80,
                protocol:'TCP',
                targetport:80,
                nodeport:31520
            },{
                name:'https-port',
                port:443,
                protocol:'TCP',
                targetport:443,
                nodeport:31522
            }], 
            label:[{
                name:'a',
                value:'b',
            },{
                name:'c',
                value:'d',
            },],
            externalip:['10.103.240.195','10.103.240.133']
        },
        {
            name:'webBlogService', 
            namespace:'default',
          //  target: 'wordpress',
            type:'ClusterIP',
            createtime:"2019-4-12", 
            port:['30509','TCP'],  
            selectors:[{
                name:'app2',
                value:'nginx1'
            },{
                name:'app2',
                value:'nginx2'
            },{
                name:'app2',
                value:'nginx3'
            },],
            key:'2',
            ports:[{
                name:'http-port',
                port:80,
                protocol:'TCP',
                targetport:80, 
            }]
        }, 
        ],


    }
    componentDidMount(){//请求数据
        
        this.setState({
            currentcluster:this.props.currentcluster,
            currentnamespace:this.props.currentnamespace,
    
          })
        this.request(this.props.currentcluster,this.props.currentnamespace)
        console.log("change")
    }
    request = (clustername,namespace) => { //初始化数据请求
        fetch('http://localhost:9090/api/cluster/'+clustername+'/services',{
        method:'GET',
        mode: 'cors', 
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
                dataSource:datas
            })
             
            return data;
        }).catch( (e)=> {  
            console.log(e);
        })
    } 
    componentWillReceiveProps(nextProps){  //接收参数后更新数据
        this.setState({
            currentcluster:nextProps.currentcluster,
            currentnamespace:nextProps.currentnamespace,

        }) 
        this.request(nextProps.currentcluster,nextProps.currentnamespace)
        console.log('ingress get props currentcluster:',nextProps.currentcluster)
        console.log('ingress get props currentnamespaces:',nextProps.currentnamespace)

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
                fetch('http://localhost:9090/api/cluster/'+this.props.currentcluster+'/services?data='+JSON.stringify(datas),{
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
                fetch('http://localhost:9090/api/cluster/'+this.props.currentcluster+'/services?data='+JSON.stringify(datas),{
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
        console.log('refresh!')
        this.request(this.props.currentcluster,this.props.currentnamespace)
    } 
    render(){
        const columns=[
            { 
                title:'名称',
                key:'name',
                dataIndex: 'name',
                width:"20%"
                /* render(text,record){
                    if(record.type==='NodePort')
                    {
                         return (
                            <div>
                                {text} <br/>
                               
                                <a  href={'http://192.168.1.132:'+record.port[0]} target='_blank' style={{fontSize:10}} >{record.port[0]} / {record.port[1]} </a>
                            </div>
                        ) 
                        
                    }else 
                    return text
                }*/
            }, 
            { 
                title:'状态',
                key:'status',
                dataIndex: 'status',
                render(){ 
                    return<Tag  color="#87d068" style={{cursor:'auto' }} >Active</Tag>;
                }
            },
            { 
                title:'命名空间',
                key:'namespace',
                dataIndex: 'namespace',
            },
            { 
                title:'类型',
                key:'type',
                dataIndex: 'type',
                // 四种类型
                //ExternalName, ClusterIP, NodePort, and LoadBalancer.
                 
            },
            { 
                title:'目标',
                key:'target',
                dataIndex: 'target',
                width:'10%',
                render(target){
                    //console.log(target)
                    var tags=[]
                    if(target!=undefined)
                    Object.keys(target).forEach(function(key){ 
                        //console.log(key,target[key]); 
                        var tag=<Tag  key={key} color="#5cdbd3" style={{cursor:'auto' }} >{key}={target[key]}</Tag>;
                        tags=tags.concat(tag)
                    });
                    return <div>{tags}</div>
                }
                
            },  
            { 
                title:'创建时间',
                key:'createtime',
                dataIndex: 'createtime',
            },
            {
                title:'操作',
                key:'operataion', 
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
                <CreateSvc statechange={this.statechange} currentcluster={this.props.currentcluster} namespaces={this.props.namespaces} ></CreateSvc>
            </Col>
            </Row>

            <Table  
                dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                rowSelection={rowSelection }
                columns={columns }  
                rowClassName={(record,index)=>index%2===0?'table1':'table2'}
            />
            <EditSvc statechange={this.statechange} currentcluster={this.props.currentcluster}  dataSource={this.state.operationdata} namespaces={this.props.namespaces} editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}></EditSvc>
         </div>
        )
    }
}