import React from 'react';
import {  Spin, Alert,Card, Tabs,Table, Modal, Button, message, Badge ,Menu,Dropdown,Icon,Select} from 'antd';
import './service.less'
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import Workload from './workload'
import Ingress from './ingress'
import Services from './services'
import { height } from 'window-size';
import CreateWl from  './form/create_wl'
import utils from './../../utils/utils'
import cookie from 'react-cookies'
const Option = Select.Option;
const TabPane = Tabs.TabPane;
export default class Service extends React.Component {
      
    state = {
        cluster:[ 
            'Cluster1',
            'Cluster2'
        ],
        namespaces:[ ],
        fednamespaces:[],
        currentcluster:'All',
        currentnamespace:'All',
        loading:true,  //设置为true则可以显示加载状态框
        accessmode:""    
    }
    componentDidMount(){//请求数据
        this.request();
        /*setTimeout(()=> {
              this.setState({
                  loading:false,  //数据加载结束则取消加载框
              })
            }
        ,3000)*/
          
    }
    // 动态获取mock数据 
    request = () => {
        fetch(utils.urlprefix+'/api/mode',{
            method:'GET',
            headers: { 
                "Authorization":"Basic "+cookie.load("at") 
                },
            }).then((response) => {
                console.log('response:',response.ok)
                return response.json();
            }).then((data) => {
                console.log('accessmode:',data)
                var accessmode=data.mode
                this.setState({
                    accessmode:data.mode
                }) 
                
                fetch(utils.urlprefix+'/api/clusters',{
                    method:'GET',
                    headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        },
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        console.log('data:',data)
                        this.setState({
                             cluster:data.filter(item=>item.status!="NotReady"),
                             
                        })
                        if(accessmode=="fed"){ //如果是联邦，则请求联邦的命名空间
                            fetch(utils.urlprefix+'/api/cluster/fed/namespaces',{
                                method:'GET',
                                headers: { 
                                    "Authorization":"Basic "+cookie.load("at") 
                                    },
                                }).then((response) => {
                                    console.log('response:',response.ok)
                                    return response.json();
                                }).then((data) => {
                                    console.log('data:',data)
                                    var nms=[]
                                    data.map(nm=>{
                                        nms=nms.concat(nm.name)
                                    })    
                                    this.setState({
                                        namespaces:nms,
                                        fednamespaces:nms,
                                        loading:false, 
                                    })
                                    
                                    return data;
                                }).catch((e)=>{
                                    this.setState({
                                        loading:false, 
                                    })
                                    console.log(e);
                                }) 
                        }else{
                            var cluster = data.filter(item=>item.status!="NotReady")[0]
                                //console.log(cluster)
                                if(cluster){
                                    var nms=[] 
                                    cluster.namespaces.map(nm=>{
                                        nms=nms.concat(nm.name)
                                    })   
                                }
                            this.setState({
                                namespaces:nms,
                                currentcluster:data.filter(item=>item.status!="NotReady")[0].name,
                                loading:false, 
                            })
                        }
                        
                        return data;
                    }).catch((e)=>{
                        this.setState({
                            loading:false, 
                            
                        })
                        console.log(e);
                    })
                return data;
            }).catch((e)=>{
                this.setState({
                    loading:false, 
                })
                console.log(e);
            })

        
    }

    handleClustertChange=(value)=> {
        var cluster = this.state.cluster.filter(item=>item.name==value)[0]
        //console.log(cluster)
        if(cluster){
            var nms=[] 
            cluster.namespaces.map(nm=>{
                nms=nms.concat(nm.name)
            })    
            this.setState({
                namespaces:nms
            })
        }else{
            this.setState({
                namespaces:this.state.fednamespaces
             })
        } 
        this.setState({
            currentcluster:value 
        })
        //进行Clustert数据操作
        console.log(`cluster selected ${value}`);
    }

    handleNamespaceChange=(value)=> {
        //进行Namespace数据操作
        this.setState({
            currentnamespace:value 
        }) 
        console.log(`ns selected ${value}`);
    }
         
    
    render(){ 

        const clusterdata=this.state.cluster.map( (item)=>( 
            <Option value={item.name} key={item.name}>{item.name}</Option>
         )
        )
        const namespacesdata=this.state.namespaces.map( (item)=>(
            <Option value={item} key={item} >{item}</Option>
         )
        )
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
            <div> 
               <div className="Dropdown-wrap"> 
                    <span style={{marginRight:10,fontSize:15}}>集群：</span>
                    <Select  defaultValue={this.state.cluster.length>0&&this.state.accessmode=="single"?this.state.cluster[0].name:'All'} style={{ width: 120 }} onSelect={this.handleClustertChange}  >
                    {this.state.cluster.length>0&&this.state.accessmode=="fed"?
                        <Option value='All'  key='All'>全局</Option>:null
                    }

                    {clusterdata}
                    </Select>

                    <span style={{margin:"0px 10px",fontSize:15}}>命名空间：</span>
                    
                    <Select defaultValue='All'  style={{ width: 120 }} onSelect={this.handleNamespaceChange}  >
                    
                         <Option value='All'  key='All'>全局</Option>
                         {namespacesdata}
                    </Select>  
                </div>
                   
                <Tabs defaultActiveKey="1" type="card"  onChange={this.handleCallback} style={{marginTop:20 ,minHeight:'calc(60vh)'}}> 
                    <TabPane tab="工作负载" key="1"  style={{backgroundColor:'white',marginTop:-16 }} ><Workload currentcluster={this.state.currentcluster} currentnamespace={this.state.currentnamespace}  namespaces={this.state.namespaces} /> </TabPane>
                    <TabPane tab="负载均衡" key="2"  style={{backgroundColor:'white',marginTop:-16 }}><Ingress  currentcluster={this.state.currentcluster} currentnamespace={this.state.currentnamespace}  namespaces={this.state.namespaces}/></TabPane>
                    <TabPane tab="服务发现" key="3"  style={{backgroundColor:'white',marginTop:-16 }}><Services currentcluster={this.state.currentcluster} currentnamespace={this.state.currentnamespace}  namespaces={this.state.namespaces}/></TabPane>
                </Tabs>   
            </div>
                 )} 
            </HashRouter>
            
        )
    }
}