import React from 'react';
 import {Modal,message,Badge,InputNumber,Spin,Alert,Tag,Table, Select,Tabs,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
import ClusterList from './clustelist'
import FedNamespaceList from'./fednamespace'
import utils from'./../../utils/utils'
import cookie from 'react-cookies'
const Option = Select.Option;
const TabPane = Tabs.TabPane;
export default class Cluster extends React.Component {
      
    state = {
       
        selectedRowKeys:[],
        selectedRows:null, 
        searchname:'',
        searchdata:[],
        dataSource:[{
            name:'cluster1',
            nodes:'2',
            status:'Active',
            role:'Controller',
            deployments:['22','30']
        },{
            name:'cluster2',
            nodes:'3',
            status:'Active',
            role:'SubCluster',
            deployments:['16','18']

        }
        ],
        accessmode:''
       
    }
    componentDidMount(){//请求数据
        this.request()

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
            console.log('access:',data)
            this.setState({
                accessmode:data.mode
            })
            return data;
        }).catch((e)=>{
            console.log(e);
        })
    }


 

     
         
    
       
       
    render(){ 
   
         
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
            <div style={{  minHeight:'calc(60vh)'}}> 
                <Tabs defaultActiveKey="1" type="card"  onChange={this.handleCallback} style={{minheight:'calc(60vh)'}}> 
                    <TabPane tab="集群列表" key="1"  style={{backgroundColor:'white',marginTop:-16 }} >
                        <ClusterList /> 
                        </TabPane>
                    {this.state.accessmode=="fed"?
                    <TabPane tab="联邦命名空间" key="2"  style={{backgroundColor:'white',marginTop:-16 }}>
                    <FedNamespaceList  currentcluster={'fed'} />
                    </TabPane>
                    :null} 
                     
                </Tabs> 
            </div>
                 )} 
            </HashRouter>
            
        )
    }
}