// 应用管理
import React from 'react'
import './application.less'
import {  Row,Col,Spin,Upload,Message, Alert ,Card, Input,Tabs,Table, Modal, Button, message, Badge ,Menu,Dropdown,Icon,Select} from 'antd';
import { height } from 'window-size';
import { Z_BLOCK } from 'zlib';
import { color } from 'echarts/lib/export';
import CreateApp from './form/create_app'
import utils from './../../utils/utils'
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
        fetch(utils.urlprefix+'/api/charts',{
        method:'GET'
        }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
        }).then((data) => {
            console.log('data:',data)
            
            function compare(a,b){
                if(a.name>b.name){
                    return 1; //sort()中参数大于0，交换a b顺序，升序排列
                }else if(a.name<b.name){
                    return -1;  //sort()中参数小于0，a b顺序不变，升序排列
                }
            } 
            this.setState({
                dataSource:data.sort(compare),
                loading:false,   
            })
            return data;
        }).catch((e)=>{
            this.setState({ 
                dataSource:[],
                loading:false,   
            })
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
        if(content!==''){
            //console.log('this.state.searchname:',this.state.searchname)
            //console.log(this.state.dataSource.map(item=>item.name.indexOf(this.state.searchname)))
            this.setState({
                searchdata:this.state.dataSource.filter(item=>item.name.indexOf(content)!==-1),
                search:true
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
        //this.request()
        setTimeout(()=> {//模拟数据加载结束则取消加载框
             
            this.request()
          }
        ,1000)
         
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
    handleRepoAdd=(e)=>{
        let content=e.target.value
        this.setState({
            chartrepoadd:content
        })
    }
    handleChangeRepo=()=>{
        Modal.confirm({
            title:'更新应用仓库地址',
            content:(
                    <Row  style={{marginTop:20,height:32}}>
                        <Col span='6' style={{display:'flex',height:'100%',alignItems:'center'  }}> 
                        {'  仓库地址:  ' } 
                        </Col>
                        <Col span='18'> 
                        <Input onChange={this.handleRepoAdd} placeholder='例如：10.103.240.130:8089' style={{display:'inline-block',width:'90%'}}/>
                        </Col>
                    </Row> 
                    ),
            onOk:()=>{ 
                var add=this.state.chartrepoadd  
                //下面URL的 集群 名称 以后需要替换掉
                fetch(utils.urlprefix+'/api/chartrepo',{
                    method:'PUT',
                    mode: 'cors', 
                    body:add,
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        
                        message.success('更新成功');
                        //发送删除请求
                        this.request(); 
                        return data;
                    }).catch( (e)=> {  
                         
                        message.success('网络错误');
                        //发送删除请求
                        this.request(); 
                        console.log(e);
                    })
               
            }
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
        var _this =this;
        const props = {  
             
            onChange(info) {
           //console.log(info)
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
            showUploadList:false,
            customRequest({ action,
                data,
                file,
                filename,
                headers,
                onError,
                onProgress,
                onSuccess,
                withCredentials,}){

                console.log('post info',file)
                console.log('filename',filename)
                var formData = new FormData();
                formData.append("file", file);  //后台读取的变量名为 "file"

                fetch(utils.urlprefix+'/api/charts',{
                    method:'POST',
                    body:formData, 
                    }).then((response) => {
                        //console.log('response:',response)
                        return response.json();
                    }).then((data) => {
                        console.log('data:',data)
                        onSuccess(data, file); 
                        _this.request()
                        return data;
                    }).catch(onError)
            }
          };

        return(
                <div  style={{ padding:10  ,minHeight:'calc(60vh)'}} > 
                    <Row className='Button-wrap'> 
                    <Col span='10' >  
                        <Button type={"primary"} onClick={this.handleChangeRepo}  >更换仓库地址<Icon type="setting" /></Button>
                    </Col>

                     <Col span='14' style={{ textAlign:'right'}}>

                         <div style={{display:'inline-block'}}> 
                        <Upload  {...props} >
                        <Button>
                        <Icon type="upload" /> Click to Upload
                        </Button>
                        </Upload>  
                        </div>

                        <Button onClick={this.handleRefresh} loading={this.state.loading}>刷新 </Button>
                        <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                        <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 

                    </Col>
                     
                    </Row>
                    <Row   >
                     {card   } 
                    </Row>  
                    <CreateApp HandleCreated={this.props.HandleCreated} clusters={this.props.clusters}  dataSource={this.state.operationdata} createvisible={this.state.createvisible} handleCreate={this.handleCreate}></CreateApp>

                </div>
                )
        }
    }