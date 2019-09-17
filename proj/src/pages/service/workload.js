//工作负载deployment管理
import React from 'react'
import {Modal,message,Badge,InputNumber,Table, Select,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, }from 'antd'
import './service.less'
import ButtonGroup from 'antd/lib/button/button-group';
//import CreateWl from './form/create_wl'
import CreateWl from './form/create_wl'
import ConfigWL from'./form/config_wl'
import { now } from 'moment';
import Util from './../../utils/utils'
import EditWL from './form/edit_wl';
const Option = Select.Option;
export default class Workload extends React.Component {
      
    state = {
        selectedRowKeys:[],
        selectedRows:null,
        currentcluster:'',
        currentnamespace:'',
        searchname:'',
        searchdata:[],
        search:false,
        dataSource:[{
            name:'nginx1',
            status:'running',
            namespace:'default',
            image:'nginx:v1.0',
            createtime:"2019-4-5", 
            node:'node2', 
            podsnum:[6,6] ,
            key:'1',
            revision:1,
            env:[{
                    name:'a',
                    value:'b'

                 },{
                    name:'c',
                    value:'d'

                 },
            ],  
            label:[{
                name:'label1',
                value:'value1'

             },{
                name:'label2',
                value:'value2'

             },
            ],
            ports:[{
                containerPort:80,
                protocol:'TCP'
            },{
                containerPort:81,
                protocol:'UDP'
            },],
            schedule:'LABEL',
            clustermatch:[{
                label:'a',
                op:'In',
                value:'b'
            },{
                label:'b',
                op:'NotIn',
                value:'c'
            },],
            nodematch:[{
                label:'e',
                op:'In',
                value:'f'
            },{
                label:'g',
                op:'In',
                value:'h'
            },],
            request:{
                cpurequst:100,
                memoryrequst:96
            },
            limit:{
                cpulimit:200,
                memorylimit:128
            }
                 
            
        },
        {
            name:'nginx2',
            status:'pause',
            namespace:'default',
            image:'nginx:v2.0',
            createtime:"2019-4-5", 
            node:'node2', 
            podsnum:[2,2],
            key:'2',
            revision:2, 
            env:[{
                name:'e',
                value:'f'

             },{
                name:'g',
                value:'h'

             },
            ],
            schedule:'LABEL',
            nodematch:[{
                label:'ee',
                op:'NotIn',
                value:'ff'
            },{
                label:'gg',
                op:'In',
                value:'hh'
            },],
             ports:[{
                containerPort:90,
                protocol:'TCP'
                },{
                    containerPort:91,
                    protocol:'UDP'
                },]
        },
        {
            name:'nginx3',
            status:'waiting',
            namespace:'default',
            image:'nginx:v3.0',
            createtime:"2019-4-10", 
            node:'node2', 
            podsnum:[2,3],
            key:'3',
            revision:3,
            schnodename:'node2',
            schedule:'NODE',
            env:[{
                name:'w',
                value:'v'

             },{
                name:'u',
                value:'x'

             },
            ],
             ports:[{
                containerPort:30,
                protocol:'UDP'
                },{
                    containerPort:31,
                    protocol:'UDP'
                },]
        },
        {
            name:'nginx4',
            status:'running',
            namespace:'default',
            image:'nginx:v4.0',
            createtime:"2019-4-11", 
            node:'node2', 
            podsnum:[4,4],
            key:'4',
            revision:2,
            env:[{
                name:'q',
                value:'a'

             },{
                name:'j',
                value:'k'

             },
            ],
             ports:[{
                containerPort:40,
                protocol:'TCP'
                },{
                    containerPort:41,
                    protocol:'TCP'
                },]
        },
        ]  ,
        operationdata:undefined,
        rbvisible:false, //控制回滚弹窗是否显示
        rollbackdata:[],     //回滚数据 
        scvisible:false,
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
        this.setState({
            currentcluster:nextProps.currentcluster,
            currentnamespace:nextProps.currentnamespace, 
        })
        console.log('Workload state currentcluster:',nextProps.currentcluster)
        console.log('Workload state currentnamespaces:',nextProps.currentnamespace)

        console.log('Workload get props currentcluster:',nextProps.currentcluster)
        console.log('Workload get props currentnamespaces:',nextProps.currentnamespace)

        //接收参数后更新数据
        
    }

    request = () => { //初始化数据请求
        fetch('http://localhost:9091/apis/apps/v1beta1/deployments',{
        method:'GET'
        }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
        }).then((data) => {
            console.log('data:',data)

            this.setState({ //表格选中状态清空
                selectedRowKeys:[],
                selectedRows:null,
            })
             
            return data;
        }).catch( (e)=> {  
            console.log(e);
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
            title:'确认',
            content:'您确认要删除此条数据吗？'+record.name ,
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
    // 升级操作
    handleUpdate = (visible)=>{
        //console.log("升级！") 
        if(visible)   
        this.setState({
            editvisible:true
        }) 
        else
        this.setState({
            editvisible:false
        }) 

    }
     
    // 回滚操作
    handleRollback = (key,text,record)=>{
        console.log("回滚！") 
 
        let sysTime = Util.formateDate(new Date().getTime()); //获取格式化的时间
    
        fetch('url'+record.name,{  //查找该工作负载的副本集,修改 this.state.rollback 数据
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
                        name:'nginx1-d58g7',
                        revision:1,
                        createtime:sysTime
                    },
                    {
                        name:'nginx1-d58g8',
                        revision:2,
                        createtime:sysTime
                    },
                    {
                        name:'nginx1-d58g9',
                        revision:3,
                        createtime:sysTime
                    },
                ],
                
                rbvisible:true,   
            })  
        }).catch((e)=> {  //写箭头函数，不要写function(e) {} 
             /**以后记得删除 */ 
            console.log("Error:   以后记得删除catch里的setState");
            this.setState({     //传入获取的版本数据
                //rollbackdata:data,  以后由后台传入数据
                operationdata:record, // 传入要操作数据
                rollbackdata:[
                    {
                        name:'nginx1-d58g7',
                        revision:1,
                        createtime:sysTime
                    },
                    {
                        name:'nginx1-d58g8',
                        revision:2,
                        createtime:sysTime
                    },
                    {
                        name:'nginx1-d58g9',
                        revision:3,
                        createtime:sysTime
                    },
                ],
                
                rbvisible:true,   
            })
            /**以后用以下内容替代错误信息 */
           // message.success('网络请求错误！') 
             
            console.log("Error: ",e);
        }) 
    }
    // 扩容操作
    handleScale = (key,text,record)=>{
        console.log("扩容！")   
     
        this.setState({
            scvisible:true
        })
      
    }
    //点击暂停
    handlePause = ()=>{
        console.log("Pause")
        console.log("selectedRowKeys",this.state.selectedRowKeys)
        console.log("selectedRows",this.state.selectedRows) 
        //let id = record.id;
        if(this.state.selectedRowKeys.length===0){
            Modal.info({
                title:'暂停负载',
                content:'请选择一行',
            })
        } else
        Modal.confirm({
            title:'暂停负载',
            content:'您确认要暂停此条数据吗？'+this.state.selectedRows.map(item=>item.name),
            onOk:()=>{
                this.setState({  //取消选中行
                    selectedRowKeys: [ ],  
                    selectedRows: null
                })
                message.success('暂停成功');
                //发送暂停请求
                this.request();
            }
        })
    }
    //点击恢复
    handleResume = ()=>{
        console.log("Resume")
        console.log("selectedRowKeys",this.state.selectedRowKeys)
        console.log("selectedRows",this.state.selectedRows) 
        //let id = record.id;
        if(this.state.selectedRowKeys.length===0){
            Modal.info({
                title:'恢复负载',
                content:'请选择一行',
            })
        } else
        Modal.confirm({
            title:'恢复负载',
            content:'您确认要恢复此条数据吗？'+this.state.selectedRows.map(item=>item.name) ,
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

    //下拉菜单item点击响应
    onClick = ( key,text,record ) => { //点击下拉菜单选则
        //message.info(`Click on item ${key}`);
        this.setState({ 
            operationdata:record, // 传入要操作数据
        })
        //console.log( "key",key);
        //console.log( "text",text);
        //console.log( "item",record);
        if(key==='1'){ //如果是升级
            this.handleUpdate(true) //显示升级对话框
        }
        if(key==='2'){ //如果是回滚
            this.handleRollback(key, text, record)
        }
        if(key==='3'){ //如果是扩容
            this.handleScale(key, text, record)
        }
        if(key==='4'){ //如果是删除
            this.handleDelete(key, text, record)
        }
        
    }; 
    
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
    //选择回滚版本
    handleSelectRb=(value)=>{
        this.setState({
            revision:value
        })

    }
    //更新副本数量
    handleScalenum=(value)=>{
        this.setState({
            scalenum : value
        })

    }
    render(){
        //console.log('workload:'+this.state.currentcluster+' '+this.state.currentnamespace)

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
                        'running': <Badge status="success" text="running"/>,
                        'pause': <Badge status="warning" text="pause"/> ,
                        'dead': <Badge status="error" text="dead"/> ,
                        'waiting': <Badge status="processing" text="waiting"/> , 
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
                title:'镜像',
                key:'image',
                dataIndex: 'image',
            },
            {
                title:'创建时间',
                key:'createtime',
                dataIndex: 'createtime',
            },
            /*{              //deployment没有主机
                title:'主机',
                key:'node',
                dataIndex: 'node',
            },*/
            {
                title:'副本数',
                key:'podsnum',
                dataIndex: 'podsnum',
                 render(podsnum){
                    return(podsnum[0]+'/'+podsnum[1])
                }
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
                        <Menu.Item key="3">扩容</Menu.Item>
                        <Menu.Item key="4">删除</Menu.Item>
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
        //console.log(this.state.searchdata.length)
        //const a = this.props
        //console.log("a:",a);
        //console.log("namespaces:",this.props.namespaces);

        return(
            <div  style={{ padding:10 ,minHeight:'calc(60vh)'}}>
                <Row className='Button-wrap'> 
                <Col span='16'> 
                    <Button onClick={this.handlePause}>暂停<Icon type='pause'></Icon></Button>
                    <Button onClick={this.handleResume}>恢复<Icon type="caret-right" /></Button>
                    <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                    <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                    
                </Col>
                <Col span='5' className='Button-right'> 
                    <CreateWl namespaces={this.props.namespaces} currentcluster={this.props.currentcluster}></CreateWl>
                     
                </Col>
                <Col span='3' className='Button-right'> 
                 <ConfigWL namespaces={this.props.namespaces} currentcluster={this.props.currentcluster}></ConfigWL>
                 
                </Col>
                
                </Row>

                <Table  
                    dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                    rowSelection={rowSelection}
                    columns={columns} 
                    rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                />
               
                <Modal
                    width='560px'
                    title={ this.state.operationdata===undefined ? '回滚':'回滚: '+this.state.operationdata.name}
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
                         //console.log('revision: '+this.state.revision)
                         if(this.state.revision!==undefined)
                        {   this.request('url'+this.state.operationdata.name+this.state.revision); //发送回滚请求
                            message.success('回滚成功');
                            this.setState({
                                rbvisible:false,
                                revision:undefined
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
                                    <Option key={item.name} value={item.revision} disabled={item.revision===this.state.operationdata.revision}>{item.name+'     revision  '+item.revision+' :    '+item.createtime}</Option>
                                )
                            } 
                        </Select> 
                </Modal>


                <Modal
                    width='560px'
                    title={ this.state.operationdata===undefined ? '扩容':'扩容: '+this.state.operationdata.name}
                    visible={this.state.scvisible} 
                    maskClosable={false} 
                    destroyOnClose  
                    onCancel={()=>{
                                this.setState({
                                    scvisible:false
                                 }) 
                                }
                            }
                    onOk={()=>{
                         console.log('scalenum: '+this.state.scalenum)
                         if(this.state.scalenum!==undefined)
                        {   this.request('url'+(this.state.operationdata===undefined ? '':this.state.operationdata.name)
                                              +this.state.scalenum); //发送回滚请求
                            message.success('更改成功');
                            this.setState({
                                scvisible:false,
                                scalenum:undefined
                            })

                        }else{
                            this.setState({
                                scvisible:false
                            })
                         }  
                        }}
                >       
                         
                        <Row  ><Col span='6'> {'  负载名称:  ' } </Col>
                        <Col span='18'> 
                        <Input style={{display:'inline-block',width:'60%',cursor:'default'}} disabled={true} value={this.state.operationdata===undefined ? '':this.state.operationdata.name}/>
                        </Col>
                        </Row>
                        <Row style={{marginTop:16}}> <Col span='6'> {'当前副本数:  ' } </Col>
                        <Col span='18' > 
                        <InputNumber className='nowscale' style={{display:'inline-block',width:'60%', }} disabled={true} value={this.state.operationdata===undefined ? '':this.state.operationdata.podsnum[1]}/>
                        </Col>
                        </Row>
                        <Row style={{marginTop:16}}><Col span='6'>{'更新副本为:  ' } </Col>
                        <Col span='18'> 
                        <InputNumber style={{width:'60%'}} min={1} onChange={ this.handleScalenum}  />
                        </Col>
                        </Row>
                        
                        
                </Modal>
                {//console.log('this.state.editvisible:',this.state.editvisible)
                } 
                <EditWL dataSource={this.state.operationdata} namespaces={this.props.namespaces} editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}
                    currentcluster={this.props.currentcluster}
                />
                 
                      
            </div>
        )
    }
}
