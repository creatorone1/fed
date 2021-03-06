import React from 'react';
import {  Spin, Alert,Card, Tabs,Table, Modal, Button, message, Badge ,Menu,Dropdown,Icon,Select} from 'antd';
import './store.less'
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import Pv from './pv'
import PvC from './pvc'
import StorageClass from './storageclass'
import utils from './../../utils/utils'
import cookie from 'react-cookies'
import { len } from 'zrender/lib/core/vector';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
export default class Store extends React.Component {
      
    state = {
        cluster:[
            {name:'fed1'}
        ],
        namespaces:[ 
            'default',
            'system'
        ],
        currentcluster:'All',
        currentnamespace:'All',
        loading:false,  //设置为true则可以显示加载状态框
        requested:true,
    }
    componentDidMount(){//请求数据
        this.request();
     }
    // 动态获取mock数据
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
                var nms=[]
                if(data.length>0){
                   // console.log('data>0' )
                    data[0].namespaces.map(nm=>{
                        nms=nms.concat(nm.name)
                    }) 
                 }
                   

                     
                this.setState({
                    cluster:data.filter(item=>item.status!="NotReady")
                    ,requested:false,
                    namespaces:nms,
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
        console.log('namespaces',this.state.namespaces)
        const namespacesdata=this.state.namespaces.map( (item)=>(
            <Option value={item} key={item} >{item}</Option>
         )
        )
        return (
            
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
            <div> 
               <div className="Dropdown-wrap"> 
                    <span style={{marginRight:10,fontSize:15}}>集群：</span>
                    {
                        //<Select defaultValue='All' style={{ width: 120 }} onSelect={this.handleClustertChange}  ></Select>
                       // console.log(this.state.cluster)
                        
                   } 
                    {
                        //<Select defaultValue='All' style={{ width: 120 }} onSelect={this.handleClustertChange}  ></Select>
                     //   console.log('name',this.state.cluster.length>0?this.state.cluster[0].name:'')
                        
                   }
                    <Select  defaultValue={this.state.cluster.length>0?this.state.cluster[0].name:''}  style={{ width: 120 }} onSelect={this.handleClustertChange}  >
                         
                        {
                           // <Option value='All'  key='All'>全局</Option>
                          
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
                    <TabPane tab="数据卷" key="1"  style={{backgroundColor:'white',marginTop:-16 }} >    
                    <PvC currentcluster={this.state.currentcluster} currentnamespace={this.state.currentnamespace}  namespaces={this.state.namespaces}/>
                     </TabPane>
                    <TabPane tab="持久卷" key="2"  style={{backgroundColor:'white',marginTop:-16 }} >  
                    <Pv currentcluster={this.state.currentcluster} currentnamespace={this.state.currentnamespace}  namespaces={this.state.namespaces}/>
                     </TabPane>
                    
                    <TabPane tab="存储类" key="3"  style={{backgroundColor:'white',marginTop:-16 }} >  
                    <StorageClass currentcluster={this.state.currentcluster} currentnamespace={this.state.currentnamespace}  namespaces={this.state.namespaces} /> 
                     </TabPane>
                    
                 </Tabs>   
            </div>
                 )} 
            </HashRouter>
            
        )
    }
}