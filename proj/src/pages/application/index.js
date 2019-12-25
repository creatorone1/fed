// 应用管理
import React from 'react'
import './application.less'
import {  Spin, Alert,Card, Tabs,Table, Modal, Button, message, Badge ,Menu,Dropdown,Icon,Select} from 'antd';
import AppRepo from './apprepo'
import AppRelease from './apprelease'
import utils from './../../utils/utils'
import cookie from 'react-cookies'
import {HashRouter} from 'react-router-dom'
const Option = Select.Option;
const TabPane = Tabs.TabPane;
export default class Application extends React.Component {
    state = {
        cluster:[ 
            'Cluster1',
            'Cluster2'
        ],
        currentcluster:'All',
        currentnamespace:'All',
        loading:false,  //设置为true则可以显示加载状态框
        requested:true,
        datachange:false,
    }
    componentDidMount(){//请求数据
        this.request();
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据

    }
    request = () => {
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
                    cluster:data.filter(item=>item.status!="NotReady")
                    ,requested:false,
                    currentcluster:data.filter(item=>item.status!="NotReady")[0].name,
                })
                console.log('data[0].name',data.filter(item=>item.status!="NotReady")[0].name)
                /*fetch(utils.urlprefix+'/api/cluster/fed/namespaces',{
                    method:'GET'
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
                            fednamespaces:nms
                        })
                        
                        return data;
                    }).catch((e)=>{
                        console.log(e);
                    }) */
                return data;
            }).catch((e)=>{
                this.setState({
                     requested:false, 
                })
                console.log(e);
            })
    }    
    /*request = () => {
        fetch(utils.urlprefix+'/api/clusters',{
            method:'GET'
            }).then((response) => {
                console.log('response:',response.ok)
                return response.json();
            }).then((data) => {
                console.log('data:',data)
                this.setState({
                    cluster:data.filter(item=>item.status!="NotReady")
                })
                return data;
            }).catch((e)=>{
                console.log(e);
            })
    }*/
    
    handleClustertChange=(value)=> {
        this.setState({
            currentcluster:value 
        })
        //进行Clustert数据操作
        console.log(`cluster selected ${value}`);
    }
    HandleCreated=()=>{ //创建服务之后回调
        console.log('created!')
        this.setState({
            datachange:!this.state.datachange 
        })
    } 
    render()
    { 


        const clusterdata=this.state.cluster.map( (item)=>( 
            <Option value={item.name} key={item.name}>{item.name}</Option>
         )
        )
        return(
            <HashRouter> 
            { this.state.requested?(  <Spin tip="Loading...">
                <Alert
                message="Loading"
                description="数据加载中"
                type="info"
                />
            </Spin>
            ): 
             (  
                    <div >
                     
                    <div className="Dropdown-wrap"> 
                    <span style={{marginRight:10,fontSize:15}}>集群：</span>
                    {

                    }<Select  defaultValue={this.state.cluster.length>0?this.state.cluster[0].name:''}  style={{ width: 120 }} onSelect={this.handleClustertChange}  >
                         
                        {
                           // <Option value='All'  key='All'>全局</Option>
                          
                        }  
                        {clusterdata}
                    </Select> 
                  </div> 
                   <Tabs defaultActiveKey="1" type="card"  onChange={this.handleCallback} style={{marginTop:20 ,minHeight:'calc(60vh)'}}> 
                    <TabPane tab="应用库" key="1"  style={{backgroundColor:'white',marginTop:-16 }} >    
                    <AppRepo HandleCreated={this.HandleCreated} clusters={this.state.cluster} currentcluster={this.state.currentcluster} />
                     </TabPane>
                    <TabPane tab="应用实例" key="2"  style={{backgroundColor:'white',marginTop:-16 }} >  
                    <AppRelease  datachange={this.state.datachange} clusters={this.state.cluster}currentcluster={this.state.currentcluster} />
                     </TabPane> 
                  </Tabs> 
                </div>
             )}
             </HashRouter>
                )   
        }
    }