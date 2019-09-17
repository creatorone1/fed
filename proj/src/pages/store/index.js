import React from 'react';
import {  Spin, Alert,Card, Tabs,Table, Modal, Button, message, Badge ,Menu,Dropdown,Icon,Select} from 'antd';
import './store.less'
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import Pv from './pv'
import PvC from './pvc'
import StorageClass from './storageclass'

const Option = Select.Option;
const TabPane = Tabs.TabPane;
export default class Store extends React.Component {
      
    state = {
        cluster:[ 
            'Cluster1',
            'Cluster2'
        ],
        namespaces:[ 
            'default',
            'system'
        ],
        currentcluster:'All',
        currentnamespace:'All',
        loading:false,  //设置为true则可以显示加载状态框
    }
    componentDidMount(){//请求数据
        
     }
    // 动态获取mock数据
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

    handleClustertChange=(value)=> {
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
            <Option value={item} key={item}>{item}</Option>
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
                    <Select defaultValue='All' style={{ width: 120 }} onSelect={this.handleClustertChange}  >
                         <Option value='All'  key='All'>全局</Option>
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