// 管理
import React from 'react'
import {Modal,message,Badge,InputNumber,Collapse,Spin,Alert,Tag,Table, Select,Tabs,Divider,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import Header from './../../components/Header'
 
import EPanel from'./../echarts/panel/panelv2'
import Bar from'./../echarts/bar/index'
import FedNamespaceList from './fednamespace'
import utils from '../../utils/utils';
const Panel = Collapse.Panel;
export default class DetaiCluster extends React.Component {
    state = {
        clustername:undefined, 
        dataSource:{   //有后台此数据需要到后台获取 
            name:'cluster1',
            nodes:'2',
            status:'Ready',
            role:'Controller', 
            serveraddress:'https://192.168.0.16:6443',
            createtime:'2019-08-05T07:27:57Z',
            labels:[{
                name:'serverAddress',
                value:'https://192.168.0.16:6443'
            },{
                name:'clientCIDR',
                value:'0.0.0.0/0'
            } ],
            pods:['36','220'], 
            version:'v1.10.0',
            cpu:['22.7','48'],
            memory:['25','64'],  
            namespaces:[{
                name:'default1', 
                status:'Active', 
                createtime:'2019-08-07T07:27:57Z',
              
            },{
                name:'system1',  
                status:'Active', 
                createtime:'2019-08-07T07:27:57Z', 
    
            }
            ]
        },
        getdata:false,//判断是否获取到数据
        selectedRowKeys:[],
        selectedRows:null, 
        searchname:'',
        searchdata:[],
        crvisible:false,
    }
    componentDidMount(){//请求数据
        /***有了后台下面两行删除 */
        var data=this.state.dataSource
        data.name=sessionStorage.getItem('clustername') 
        //console.log('cluster',utils.clusterdetail)
        this.setState({
            clustername:sessionStorage.getItem('clustername'),
            dataSource:utils.clusterdetail
        })
        
        //根据nodename和nodecluster来请求数据
        this.request();
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据

    }
    request = () => {
        // 这先直接写获取数据成功，有了后台删掉这
        this.setState({
            getdata:true
        })

        fetch('url',{
        method:'GET'
        }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
        }).then((data) => {
            console.log('data:',data)
            //获取到数据后进行显示
            this.setState({
                getdata:true
            })
            return data;
        }).catch((e)=>{
            console.log(e);
        })
    }

 
    render(){
        console.log('clustername:',  this.state.clustername) 
        let config = {
            'Ready': <Tag  color="#87d068" style={{cursor:'auto' }} >Ready</Tag>,
            'NotReady': <Tag  color="#ff7875" style={{cursor:'auto' }} >NotReady</Tag> ,  
 
        }
        var status=config[this.state.dataSource.status] 
        if(this.state.dataSource.status=="Ready"){
             //标签labels
        var labeldata=this.state.dataSource.labels
        var  labelcolumns=[ {
            title:'标签名',
            key:'name',
            dataIndex: 'name',
            width: '50%',
            align:'left',   
        },
        {
            title:'标签值',
            key:'value',
            dataIndex: 'value', 
            width: '50%',
            align:'left',  
        },
        ]
        
        var cpurate =this.state.dataSource.cpu[0]/this.state.dataSource.cpu[1]+''
        var memoryrate =this.state.dataSource.memory[0]/this.state.dataSource.memory[1]+''
        var podrate =this.state.dataSource.pods[0]/this.state.dataSource.pods[1]+''
        cpurate=cpurate.substr(0,cpurate.indexOf(".")+3) //保留三位小数
        memoryrate=memoryrate.substr(0,memoryrate.indexOf(".")+3)
        podrate=podrate.substr(0,podrate.indexOf(".")+3)
        }
        
        
        return(

        <div style={{  minHeight:'calc(60vh)'}}> 
        {this.state.getdata&&this.state.clustername?   
        <div >  
          
           <div className="Dropdown-wrap" style={{marginTop:10}}> 
              <Row> 
              <Col span='16'> 
              <span style={{marginRight:10,fontSize:20}}>集群:{'  '+this.state.clustername} </span>  
              {status}
               </Col>
              <Col span='8' style={{textAlign:"right"}}>  
              </Col>
                </Row>
                  
            </div>
            {
                this.state.dataSource.status=="Ready"? 
                
                <div style={{backgroundColor:'white',marginTop:-10,padding:10 }}>
                {//节点详细信息
                }
                <Divider style={{marginTop:-5}}></Divider>
                <div  className='banner' style={{ marginTop:-10}}> 
                    <div className='item'><label style={{ marginRight:10,color: '#8B959C'}}>集群名:</label>{this.state.dataSource.name}</div>
                    <div className='item'><label style={{ marginRight:10,color: '#8B959C'}}>角色:</label>{this.state.dataSource.role}</div>
                    <div className='lastitem'><label style={{ marginRight:10,color: '#8B959C'}}>主机数:</label>{this.state.dataSource.nodes}</div>
                </div>
               
                 <div  className='banner' > 
                    <div className='item'><label style={{ marginRight:10,color: '#8B959C'}}>kubernetes版本:</label>{this.state.dataSource.version}</div>
                    <div className='item'><label style={{ marginRight:10,color: '#8B959C'}}>服务器地址:</label>{this.state.dataSource.serveraddress}</div>
                    <div className='lastitem'><label style={{ marginRight:10,color: '#8B959C'}}>创建时间:</label>{this.state.dataSource.createtime}</div>
                </div>

                

                {/*** 仪表盘信息*/}
                <Row gutter={16}>
                <Col span='8' >
                   <EPanel domid='cpu' rate={cpurate}  ></EPanel>
                </Col>
                <Col span='8'>
                <EPanel domid='内存'  rate={memoryrate} ></EPanel>
                </Col>
                <Col span='8' >
                <EPanel domid='pod' rate={podrate} ></EPanel> 
                </Col> 
                 </Row>


                {/*** 状态信息*/}
                <Row gutter={16} style={{marginTop: -16}}>
                <Col span='6' className='status'>
                    <div className={this.state.dataSource.componentstatuses.etcd=="True"?'statussuccess':'statuserror'} >
                        <div className='icon'><Icon type={this.state.dataSource.componentstatuses.etcd=="True"?"check":'close'}   /> </div>
                        <div className='message'>Etcd</div>
                    </div>
                    
                </Col>
                <Col span='6'className='status'>
                    <div className={this.state.dataSource.componentstatuses.controller=="True"?'statussuccess':'statuserror'}>
                        <div className='icon'><Icon type={this.state.dataSource.componentstatuses.etcd=="True"?"check":'close'}  /> </div>
                        <div className='message'>Controller Manager</div>
                    </div> 
                </Col>
                <Col span='6' className='status'>
                    <div className={this.state.dataSource.componentstatuses.scheduler=="True"?'statussuccess':'statuserror'}>
                        <div className='icon'><Icon type={this.state.dataSource.componentstatuses.etcd=="True"?"check":'close'} /> </div>
                        <div className='message'>Scheduler</div>
                    </div>
                    
                </Col>
                <Col span='6'className='status'>
                    <div className={this.state.dataSource.componentstatuses.node=="True"?'statussuccess':'statuserror'}>
                        <div className='icon'><Icon type={this.state.dataSource.componentstatuses.etcd=="True"?"check":'close'}  /> </div>
                        <div className='message'>Nodes</div>
                    </div> 
                </Col>
                
                 </Row>
                 

                {/*** 详细信息*/}
                <Collapse   className="collwrap" style={{marginBottom:24}} >
                  <Panel header="命名空间" key="1"  >  
                   <FedNamespaceList  type='cluster' currentcluster={this.state.dataSource.name} data={this.state.dataSource.namespaces}/>
                  </Panel> 
              </Collapse>  

              <Collapse   className="collwrap" style={{marginBottom:24}} >
                  <Panel header="标签" key="1"  >
                  <Table    
                       dataSource={labeldata}
                       
                       columns={labelcolumns}   
                         
                    />
                  </Panel> 
              </Collapse> 
            </div>  
                :""
            }
             
        </div> 
        :''}
        </div> 
         
        )}  
    }