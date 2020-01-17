 // 用户管理
 import React from 'react'
 import {  Spin, Alert,Card, Tabs,Table, Modal, Button, message, Badge ,Menu,Dropdown,Icon,Select} from 'antd';
 import utils from './../../utils/utils'
 import cookie from 'react-cookies'
 import {HashRouter} from 'react-router-dom'
 const Option = Select.Option;
 const TabPane = Tabs.TabPane; 
 export default class User extends React.Component {
    
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
        monitorurl:'',
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

                 

                console.log('data[0].name',data.filter(item=>item.status!="NotReady")[0].name)
                var clsuter=data.filter(item=>item.status!="NotReady")[0]
                //http://192.168.0.0.1:8080
                var begin=clsuter.serveraddress.indexOf(":")+3
                var last=clsuter.serveraddress.lastIndexOf(":")
                //console.log('last',last)
                var url=clsuter.serveraddress.substring(begin,last)+":30005"

                this.setState({
                    cluster:data.filter(item=>item.status!="NotReady")
                    ,requested:false,
                    currentcluster:data.filter(item=>item.status!="NotReady")[0].name,
                    monitorurl:url
                })

                return data;
            }).catch((e)=>{
                this.setState({
                     requested:false, 
                })
                console.log(e);
            })
    }

    handleClustertChange=(value)=> { //切换集群后更改监控的url
        var clsuter=this.state.cluster.filter(item=>item.name==value)[0]
        //http://192.168.0.0.1:8080
        var begin=clsuter.serveraddress.indexOf(":")+3
        var last=clsuter.serveraddress.lastIndexOf(":")
        //console.log('last',last)
        var url=clsuter.serveraddress.substring(begin,last)+":30005"
        console.log('url',url)
        this.setState({
            monitorurl:url 
        })

        //进行Clustert数据操作
        console.log(`cluster selected ${value}`);
    }
     render(){
 
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
            <div>
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

                <card>
                    <iframe 
                    src={'http://'+this.state.monitorurl //"http://10.103.240.130:31776/d/Pa9dYw1Zz/lian-bang-yun-zong-ti-jian-kong?refresh=10s&orgId=1&from=1573801050115&to=1573801350115&var-Node=All" 
                    }
                      
                    width="100%" 
                    height="2000" 
                    frameborder="0">
                        {
                       // console.log(this.state.monitorurl)
                        }
                    </iframe>
            
                </card>
            </div>
         )}
         </HashRouter>
            )

         }
    }