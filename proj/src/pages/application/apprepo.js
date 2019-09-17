// 应用管理
import React from 'react'
import './application.less'
import {  Row,Col,Spin, Alert,Card, Input,Tabs,Table, Modal, Button, message, Badge ,Menu,Dropdown,Icon,Select} from 'antd';
import { height } from 'window-size';
import { Z_BLOCK } from 'zlib';
import { color } from 'echarts/lib/export';
import CreateApp from './form/create_app'
export default class AppRepo   extends React.Component {
    state = {
        dataSource:[{
            name:'rabbitmq-ha',
            description:'Highly available RabbitMQ cluster, the open source message broker',
            iconurl:'https://bitnami.com/assets/stacks/rabbitmq/img/rabbitmq-stack-220x234.png', 
            versions:[{
                version:'0.1.0',
                url:'http://10.103.240.133:8089/charts/gateway-0.1.0.tgz'
            },{
                version:'0.2.0',
                url:'http://10.103.240.133:8089/charts/gateway-0.2.0.tgz'
            }
            ]
        },
        {
            name:'redis',
            description:'Open source, advanced key-value store. It is often referred to asa data structure server since keys can contain strings, hashes, lists, setsand sorted sets.',
            iconurl:'https://bitnami.com/assets/stacks/redis/img/redis-stack-220x234.png', 
            versions:[{
                version:'',
                url:''
            }]
        },
        {
            name:'wordpress',
            description:'Web publishing platform for building blogs and websites',
            iconurl:'https://bitnami.com/assets/stacks/wordpress/img/wordpress-stack-220x234.png', 
            versions:[{
                version:'',
                url:''
            }]
        },
        {
            name:'prometheus',
            description:'Prometheus is a monitoring system and time series database.',
            iconurl:'https://raw.githubusercontent.com/prometheus/prometheus.github.io/master/assets/prometheus_logo-cb55bb5c346.png', 
            versions:[{
                version:'',
                url:''
            }]
        },
        {
            name:'mediawiki',
            description:'Extremely powerful, scalable software and a feature-rich wiki implementation',
            iconurl:'https://bitnami.com/assets/stacks/mediawiki/img/mediawiki-stack-220x234.png', 
            versions:[{
                version:'',
                url:''
            }]
        },
        {
            name:'mysql',
            description:'Fast, reliable, scalable, and easy to use open-source relational database system',
            iconurl:'https://www.mysql.com/common/logos/logo-mysql-170x115.png', 
            versions:[{
                version:'',
                url:''
            }]
        },
        ],

        searchname:'',
        searchdata:[],
        search:false
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
         console.log('this.state.searchname:',this.state.searchname)
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
    handleRefresh =() =>{
        console.log('refresh !')
        this.setState({ 
            loading:true
        })
        setTimeout(()=> {//模拟数据加载结束则取消加载框
            this.setState({
                loading:false,   
            })
          }
        ,3000)
        this.request()
    }
    // 创建操作
    handleCreate = (visible,data)=>{
        //console.log("创建！") 
        if(visible)   
        this.setState({
            createvisible:true,
            operationdata:data, // 传入要操作数据
        }) 
        else
        this.setState({
            createvisible:false
        }) 

    }
    render(){
        //console.log(this.state.search) 
        const data=this.state.search?this.state.searchdata:this.state.dataSource
        // console.log(data)
        const card= data.map(item=>(
            <div className="card-wrap1" style={{verticalAlign:'top'}} key={item.name }>   
            <Card style={{textAlign:'center',width:'250px' ,height:'320px',    }}  >
                <img src={item.iconurl} alt=""  style={{height:'80px',width:'80px',display:'block',margin:'auto',marginBottom:'16px'}}/> 
                <span style={{fontSize:'15px',color:'#00F' }}>{item.name}</span>
                <div style={{height:'80px',marginTop:'20px',fontSize:'12px'}}>
                <p  >
                    {item.description}
                </p>
                </div>
                <Button   type='primary'  style={{marginTop:'20px'}}  onClick={()=>this.handleCreate(true,item)}>创建</Button>
                 
                
            </Card>
            </div> 
        ))

        return(
                <div  style={{ padding:10  }} > 
                    <Row className='Button-wrap'> 
                     <Col span='23' style={{ textAlign:'right'}}>  
                        <Button onClick={this.handleRefresh} loading={this.state.loading}>刷新 </Button>
                        <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                        <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                     
                    </Col>
                     
                    </Row>
                    <Row   >
                    {card   } 
                    </Row>  
                    <CreateApp dataSource={this.state.operationdata} createvisible={this.state.createvisible} handleCreate={this.handleCreate}></CreateApp>

                </div>
                )
        }
    }