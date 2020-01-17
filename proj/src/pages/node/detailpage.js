// 管理
import React from 'react'
import {Modal,message,Badge,InputNumber,Collapse,Spin,Alert,Tag,Table, Select,Tabs,Divider,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import Header from './../../components/Header'
import './node.less'
import EPanel from'./../echarts/panel/panelv2'
import Bar from'./../echarts/bar/index'
import utils from '../../utils/utils';
import cookie from 'react-cookies'
const Panel = Collapse.Panel;
export default class DetaiNode extends React.Component {
    state = {
        nodename:undefined,
        nodecluster:undefined,
        dataSource:{   //有后台此数据需要到后台获取
            name:'node1',
            status:'Ready',
            ip:'192.168.0.17',
            kubeletver:'v1.10.0',
            kubeproxyver:'v1.10.0',
            dockerver:'17.6.1',
            os:'Ubuntu 16.04.5 LTS 4.4.0-135-generic',
            pods:['20','35'],
            role:'Master',
            version:'v1.10.0',
            cpu:['2.2','24'],
            memory:['2.7','32'],
            cluster:'cluster1',
            labels:[{
                name:'beta.kubernetes.io/arch',
                value:'amd64'
            },{
                name:'beta.kubernetes.io/os',
                value:'linux'
            },{
                name:'kubernetes.io/hostname',
                value:'node1'
            }],
            annotations:[{
                name:'flannel.alpha.coreos.com/backend-data',
                value:'{  \"VtepMAC\":\"16:a9:71:f1:c0:e9\"  }'
            },{
                name:'flannel.alpha.coreos.com/backend-type',
                value:'vxlan'
            },{
                name:'flannel.alpha.coreos.com/kube-subnet-manager',
                value:'true'
            },{
                name:'flannel.alpha.coreos.com/public-ip',
                value:'192.168.0.17'
            },{
                name:'volumes.kubernetes.io/controller-managed-attach-detach',
                value:'true'
            }],
            images:[
                {name:'k8s.gcr.io/etcd-amd64:3.2.18',
                 size:64
                },
                {name:'istio/examples-bookinfo-productpage-v1@sha256:ed65a39f8b3ec5a7c7973c8e0861b89465998a0617bc0d0c76ce0a97080694a9',
                 size:48
                },
                {name:'k8s.gcr.io/kube-controller-manager-amd64:v1.10.8',
                 size:32
                },
                {name:'kubeguide/tomcat-app:v1',
                 size:96
                },
            ]
            ,
            conditions:[{
                lasttime: "2019-08-02T08:01:49Z",
                lastTransitionTime: "2018-10-23T09:10:41Z",
                message: "kubelet has sufficient disk space available",
                reason: "KubeletHasSufficientDisk",
                status: "False",
                type: "OutOfDisk"
            },
            {
                lasttime: "2019-08-02T08:01:49Z",
                lastTransitionTime: "2018-10-23T09:10:41Z",
                message: "kubelet has sufficient memory available",
                reason: "KubeletHasSufficientMemory",
                status: "False",
                type: "MemoryPressure"
            },
            {
                lasttime: "2019-08-02T08:01:49Z",
                lastTransitionTime: "2018-10-23T09:10:41Z",
                message: "kubelet has no disk pressure",
                reason: "KubeletHasNoDiskPressure",
                status: "False",
                type: "DiskPressure"
            },
            {
                lasttime: "2019-08-02T08:01:49Z",
                 
                message: "kubelet has sufficient PID available",
                reason: "KubeletHasSufficientPID",
                status: "False",
                type: "PIDPressure"
            },
            {
                lasttime: "2019-08-02T08:01:49Z",
                message: "kubelet is posting ready status. AppArmor enabled",
                reason: "KubeletReady",
                status: "True",
                type: "Ready"
            }
            ]
            ,
            nodeinfo:[{
                name:'架构',
                info:'amd64'
            },{
                name:'Docker版本',
                info:'18.6.1'
            },
            {
                name:'操作系统',
                info:'Ubuntu 16.04.5 LTS'
            },
            {
                name:'内核版本',
                info:'4.4.0-135-generic'
            }, 
            {
                name:'kubelet版本',
                info:'v1.10.0'
            },
            {
                name:'kubeProxy版本',
                info:'v1.10.0'
            },
            ]
        
        },
        getdata:false,//判断是否获取到数据
    }
    componentDidMount(){//请求数据
        /***有了后台下面三行删除 */
        var data=this.state.dataSource
        data.name=sessionStorage.getItem('nodename')
        data.cluster=sessionStorage.getItem('nodecluster')
        
        this.setState({
            nodename:sessionStorage.getItem('nodename'),
            nodecluster:sessionStorage.getItem('nodecluster'), 
            dataSource:utils.nodedetail
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

        /*fetch(utils.urlprefix+'url',{
        method:'GET',
        headers: { 
            "Authorization":"Basic "+cookie.load("at") 
            },
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
        }).catch( (e)=>{
            console.log(e);
        })*/
    }
    render(){
        console.log('nodename:',  this.state.nodename)
        console.log('nodecluster:',  this.state.nodecluster)
        let config = {
            'Ready': <Tag  color="#87d068" style={{cursor:'auto',fontSize:15}} >Ready</Tag>,
            'NotReady': <Tag  color="#ff7875" style={{cursor:'auto',fontSize:15 }} >NotReady</Tag> ,  
            'unschedulable': <Tag  color="#fa8c16" style={{cursor:'auto',fontSize:15 }} >Unschedulable</Tag> ,  
        
        }
        var status=config[this.state.dataSource.status]
        //镜像数据
        var imagedata=this.state.dataSource.images
        const imagecolumns=[ {
            title:'镜像名称',
            key:'name',
            dataIndex: 'name',
            width: '50%',
            align:'left',   
        },
        {
            title:'镜像大小',
            key:'size',
            dataIndex: 'size',
            render: (text,record) =>
            {
                //<a href={"#/node/"+record.name}>{text}</a>      
                return (<span> {text+' MB'}</span>)
            } , 
            width: '50%',
            align:'left',  
        },
        ]
        
        //状态信息conditions
        var conditiondata=this.state.dataSource.conditions
        const conditioncolumns=[ {
            title:'类型',
            key:'type',
            dataIndex: 'type',
            width: '25%',
            align:'left',   
        },
        {
            title:'状态',
            key:'status',
            dataIndex: 'status',
            
            width: '10%',
            align:'left',  
        },
        {
            title:'最后更新时间',
            key:'lasttime',
            dataIndex: 'lasttime',
             
            width: '15%',
            align:'left',  
        },
        {
            title:'原因',
            key:'reason',
            dataIndex: 'reason',
            
            width: '25%',
            align:'left',  
        },
        {
            title:'消息',
            key:'message',
            dataIndex: 'message', 
            width: '25%',
            align:'left',  
        },

        ]
        //系统信息nodeInfo
        var nodeinfodata=this.state.dataSource.nodeinfo
        const nodeinfocolumns=[ {
            title:'组件',
            key:'name',
            dataIndex: 'name',
            width: '50%',
            align:'left',   
         },
         {
            title:'信息',
            key:'info',
            dataIndex: 'info', 
            width: '50%',
            align:'left',  
         },
        ]
        //标签labels
        var labeldata=this.state.dataSource.labels
        const  labelcolumns=[ {
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
        //注释annotations
        var annodata=this.state.dataSource.annotations
        const annocolumns=[ {
            title:'注释名',
            key:'name',
            dataIndex: 'name',
            width: '50%',
            align:'left',   
        },
        {
            title:'注释值',
            key:'value',
            dataIndex: 'value', 
            width: '50%',
            align:'left',
             
        },
        ]
        var cpurate =(this.state.dataSource.cpu[1]-this.state.dataSource.cpu[0])/this.state.dataSource.cpu[1]+''
        var cpuused=(this.state.dataSource.cpu[1]-this.state.dataSource.cpu[0]+'').substr(0,(this.state.dataSource.cpu[1]-this.state.dataSource.cpu[0]+'').indexOf(".")+3)       
        var memoryused=(this.state.dataSource.memory[1]-this.state.dataSource.memory[0]+'').substr(0,(this.state.dataSource.memory[1]-this.state.dataSource.memory[0]+'').indexOf(".")+3)
       
        var memoryrate =(this.state.dataSource.memory[1]-this.state.dataSource.memory[0])/this.state.dataSource.memory[1]+''
        var podrate =this.state.dataSource.pods[0]/this.state.dataSource.pods[1]+''
        cpurate=cpurate.substr(0,cpurate.indexOf(".")+3)
        memoryrate=memoryrate.substr(0,memoryrate.indexOf(".")+5)
        podrate=podrate.substr(0,podrate.indexOf(".")+3)
         return(
        <div style={{  minHeight:'calc(60vh)'}}> 
        {this.state.getdata&&this.state.nodename?   
        <div >  
          
           <div className="Dropdown-wrap" style={{marginTop:10}}> 
              <Row> 
              <Col span='16'> 
              <span style={{marginRight:10,fontSize:20}}>节点:{'  '+this.state.nodename} </span>  
              {status}
               </Col>
              <Col span='8' style={{textAlign:"right"}}>  
              </Col>
                </Row>
                  
            </div> 
            <div style={{backgroundColor:'white',marginTop:-10,padding:10 }}>
                {//节点详细信息
                }
                <Divider style={{marginTop:-5}}></Divider>
                <div  className='banner' style={{ marginTop:-10}}> 
                    <div className='item'><label style={{ marginRight:10,color: '#8B959C'}}>主机名:</label>{this.state.dataSource.name}</div>
                    <div className='item'><label style={{ marginRight:10,color: '#8B959C'}}>所属集群:</label>{this.state.dataSource.cluster}</div>
                    <div className='lastitem'><label style={{ marginRight:10,color: '#8B959C'}}>主机IP:</label>{this.state.dataSource.ip}</div>
                </div>
               
                 <div  className='banner' > 
                    <div className='item'><label style={{ marginRight:10,color: '#8B959C'}}>Kubelet版本:</label>{this.state.dataSource.kubeletver}</div>
                    <div className='item'><label style={{ marginRight:10,color: '#8B959C'}}>Kube-Proxy版本:</label>{this.state.dataSource.kubeproxyver}</div>
                    <div className='lastitem'><label style={{ marginRight:10,color: '#8B959C'}}>Docer版本:</label>{this.state.dataSource.dockerver}</div>
                </div>

                <div  className='banner' > 
                    <div className='item'><label style={{ marginRight:10,color: '#8B959C'}}>CPU:</label>{this.state.dataSource.cpu[1]+' Cores'}</div>
                    <div className='item'><label style={{ marginRight:10,color: '#8B959C'}}>内存:</label>{this.state.dataSource.memory[1]+' GB'}</div>
                    <div className='lastitem'><label style={{ marginRight:10,color: '#8B959C'}}>操作系统:</label>{this.state.dataSource.os}</div>
                </div>

                {/*** 仪表盘信息*/}
                <Row gutter={16}  >
                <Col span='8' >
                   <EPanel domid='cpu' rate={cpurate} used={cpuused} total={this.state.dataSource.cpu[1] }></EPanel>
                </Col>
                <Col span='8'>
                <EPanel domid='内存'  rate={memoryrate} used={memoryused} total={this.state.dataSource.memory[1]+'GB'}></EPanel>
                </Col>
                <Col span='8' >
                <EPanel domid='pod' rate={podrate}  used={this.state.dataSource.pods[0]} total={this.state.dataSource.pods[1]}></EPanel> 
                </Col> 
                 </Row>


                {/*** 状态信息*/}
                <Row gutter={16} style={{marginTop: -16}}>
                <Col span='6' className='status'>
                    <div className={this.state.dataSource.nodecomponentstatuses.outofdisk=="True"?'statussuccess':'statuserror'}>
                        <div className='icon'><Icon type={this.state.dataSource.nodecomponentstatuses.outofdisk=="True"?'check':'close'}  /> </div>
                        <div className='message'>磁盘空间</div>
                    </div>
                    
                </Col>
                <Col span='6'className='status'>
                    <div className={this.state.dataSource.nodecomponentstatuses.diskpressure=="True"?'statussuccess':'statuserror'}>
                        <div className='icon'><Icon type={this.state.dataSource.nodecomponentstatuses.diskpressure=="True"?'check':'close'} /> </div>
                        <div className='message'>磁盘负载</div>
                    </div> 
                </Col>
                <Col span='6' className='status'>
                    <div className={this.state.dataSource.nodecomponentstatuses.memorypressure=="True"?'statussuccess':'statuserror'}>
                        <div className='icon'><Icon type={this.state.dataSource.nodecomponentstatuses.memorypressure=="True"?'check':'close'} /> </div>
                        <div className='message'>内存负载</div>
                    </div>
                    
                </Col>
                <Col span='6'className='status'>
                    <div className={this.state.dataSource.nodecomponentstatuses.kubelet=="True"?'statussuccess':'statuserror'}>
                        <div className='icon'><Icon type={this.state.dataSource.nodecomponentstatuses.kubelet=="True"?'check':'close'} /> </div>
                        <div className='message'>Kubelet</div>
                    </div> 
                </Col>
                
                 </Row>
                 

                {/*** 详细信息*/}
                <Collapse   className="collwrap" style={{marginBottom:24}} >
                  <Panel header="镜像" key="1"  >  
                  <Table    
                        dataSource={imagedata}
                       
                        columns={imagecolumns }  
                         
                    />
                  </Panel> 
              </Collapse> 
              
              <Collapse   className="collwrap" style={{marginBottom:24}} > 
                  <Panel header="状态" key="1"  >
                  <Table    
                        dataSource={conditiondata}
                       
                        columns={conditioncolumns}  
                         
                    />
                  </Panel>  
              </Collapse> 

              <Collapse   className="collwrap" style={{marginBottom:24}} >
                  <Panel header="系统信息" key="1"  >  
                  <Table    
                        dataSource={nodeinfodata}
                       
                        columns={nodeinfocolumns}  
                         
                    />
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

              <Collapse   className="collwrap" style={{marginBottom:24}} >
                  <Panel header="注释" key="1"  >  
                  <Table    
                         
                        dataSource={annodata}
                       
                        columns={annocolumns}  
                         
                    />
                  </Panel>
              </Collapse> 
            
        

            </div>  
        </div> 
        :''}
        </div> 
         
        )}  
    }