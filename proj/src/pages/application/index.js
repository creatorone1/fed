// 应用管理
import React from 'react'
import './application.less'
import {  Spin, Alert,Card, Tabs,Table, Modal, Button, message, Badge ,Menu,Dropdown,Icon,Select} from 'antd';
import AppRepo from './apprepo'
import AppRelease from './apprelease'
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
    }
    componentDidMount(){//请求数据
        this.request();
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据

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
    
    handleClustertChange=(value)=> {
        this.setState({
            currentcluster:value 
        })
        //进行Clustert数据操作
        console.log(`cluster selected ${value}`);
    }

    render()
    { 


        const clusterdata=this.state.cluster.map( (item)=>( 
            <Option value={item} key={item}>{item}</Option>
         )
        )
        return(
                <div >
                    <div className="Dropdown-wrap"> 
                    <span style={{marginRight:10,fontSize:15}}>集群：</span>
                    <Select defaultValue='All' style={{ width: 120 }} onSelect={this.handleClustertChange}  >
                         <Option value='All'  key='All'>全局</Option>
                         {clusterdata}
                    </Select> 
                  </div> 
                   <Tabs defaultActiveKey="1" type="card"  onChange={this.handleCallback} style={{marginTop:20 ,minHeight:'calc(60vh)'}}> 
                    <TabPane tab="应用库" key="1"  style={{backgroundColor:'white',marginTop:-16 }} >    
                    <AppRepo currentcluster={this.state.currentcluster} />
                     </TabPane>
                    <TabPane tab="应用实例" key="2"  style={{backgroundColor:'white',marginTop:-16 }} >  
                    <AppRelease currentcluster={this.state.currentcluster} />
                     </TabPane> 
                  </Tabs> 
                     
                </div>
                )
        }
    }