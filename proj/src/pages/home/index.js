import React from 'react'
import './index.less'
import {Card,Button,Radio, Row, Col} from 'antd'
import {Link} from 'react-router-dom'
import Pie from './../echarts/pie/index.js'
import Liquid_pie  from './../echarts/liquidfill/index.js'
import { Line } from 'echarts/lib/util/graphic';
import  Panel from './../echarts/pie/panel'
import axios from '../../axios'
export default class Home extends React.Component{
    state = {
        loading:true,
        depdata:'',
        clusterdata:'',
        nodedata:'',
        application:'',
        size:'default' ,
        //下面通过后台请求获取数据
        dep_total:12, 
        dep_runing:5
    }
     
    componentDidMount() {
        //this.request()
        
    } 
    request=()=>{
         // 初始化   /apis/apps/v1beta1/deployments 
            //http://localhost:9091/apis/apps/v1beta1/deployments
            fetch(' /apis/apps/v1beta1/deployments  ',{ 
            }).then((response) => {
                console.log('home_dep_get:',response.ok)
                console.log('response:',response)   
                return response.json(); 
            }).then((data) => {
                console.log('data:',data)   
                var dep_total=(data.items)?data.items.length:0;
                var dep_runing=0; 
                data.items.map(item=>{ 
                        if(item.status.availableReplicas)
                            dep_runing++;
                }) 
                this.setState({
                    dep_total:dep_total, 
                    dep_runing:dep_runing
                })
                console.log('get_dep_total:',this.state.dep_total);
                console.log('get_dep_runing:',this.state.dep_runing);
            }).catch(function (e) {
                console.log(e);
            }) 
     
            //get cluster1 nodes
            fetch('/1/api/v1/nodes',{
                method:'GET' 
            }).then((response) => {
                console.log('nodes1:',response.ok)
                return response.json(); 
            }).then((data) => {
                console.log('nodes1_data:',data)   
                var nodes=[]
                data.items.map(item=>{
                    let name,cpu,cpul,memory,memoryl
                    name=item.metadata.name;
                    cpu=item.status.capacity.cpu;
                    memory=item.status.capacity.memory.substring(0,item.status.capacity.memory.indexOf('K'));
                    cpul=item.status.allocatable.cpu;
                    //console.log('memory   ',item.status.capacity.memory )
                    //console.log('K index: ',item.status.capacity.memory.indexOf('K'))
                    memoryl=item.status.allocatable.memory.substring(0,item.status.allocatable.memory.indexOf('K')); 
                    var node = new Node(name,cpu,cpul,memory,memoryl,0,0)
                    nodes=nodes.concat(node) 
                        
                })
                console.log('nodes1:',nodes); 
                this.setState({
                    nodes1:nodes, 
                })
               
            }).catch(function (e) {
                console.log(e);
            })  
    
             //get cluster2nodes
             fetch('/2/api/v1/nodes',{
                method:'GET' 
            }).then((response) => {
                console.log('nodes2:',response.ok)
                return response.json(); 
            }).then((data) => {
                console.log('nodes2_data:',data)   
                var nodes=[]
                data.items.map(item=>{
                    let name,cpu,cpul,memory,memoryl
                    name=item.metadata.name;
                    cpu=item.status.capacity.cpu;
                    memory=item.status.capacity.memory.substring(0,item.status.capacity.memory.indexOf('K'));
                    cpul=item.status.allocatable.cpu;
                    //console.log('memory   ',item.status.capacity.memory )
                    //console.log('K index: ',item.status.capacity.memory.indexOf('K'))
                    memoryl=item.status.allocatable.memory.substring(0,item.status.allocatable.memory.indexOf('K')); 
                    var node = new Node(name,cpu,cpul,memory,memoryl,0,0)
                    nodes=nodes.concat(node)     
                })
                console.log('nodes2:',nodes); 
                this.setState({
                    nodes2:nodes, 
                })
               
            }).catch(function (e) {
                console.log(e);
            })   
    }
    render(){
        console.log('dep_total//:',this.state.dep_total);
        console.log('dep_runing//:',this.state.dep_runing);
 
        var dep_total=this.state.dep_total;
        /***通过后台请求设置nodes */
        var nodes1=[],nodes2=[]
        let name11,name21,name22,cpu,cpul,memory,memoryl
            name11='node1';name21='controller';name22='node2.bupt.edu.cn';
            cpu='24';
            memory='32828740';
            cpul='24';
            //console.log('memory   ',item.status.capacity.memory )
             //console.log('K index: ',item.status.capacity.memory.indexOf('K'))
            memoryl='32726340';
            var node11 = new Node(name11,cpu,cpul,memory,memoryl,0,0)
            nodes1=nodes1.concat(node11)  
            var node21 = new Node(name21,cpu,cpul,memory,memoryl,0,0)
            nodes2=nodes2.concat(node21) 
            var node22 = new Node(name22,cpu,cpul,memory,memoryl,0,0)
            nodes2=nodes2.concat(node22) 
            



        var data=[
            {cluster:'集群1',
            ready:1,
            notready:0,
            //nodes:this.state.nodes1
            nodes:nodes1
         },
         {cluster:'集群2',
            ready:2,
            notready:0,
            //nodes:this.state.nodes2
            nodes:nodes2
         },
        ];  
        //console.log(this.state.nodes1)
        //if(this.state.nodes1&&this.state.nodes2){
      if(nodes1&&nodes2){     
        var cluster_info=(
            data.map(item=>(<Card key={item.cluster} title ={item.cluster}  className='card-wrap'> 
                <Row> 
                <Col span='6' style={{display:'flex',alignItems:'center',justifyContent:'center' }}>
                     <div className="card-wrap1"   > 
                        <Card  title={'节点总数: '+  item.nodes.length}   > 
                        <Panel domid={item.cluster} pietype='节点状态' ready={item.ready} notready={item.notready} />  
                        </Card>  
                     </div >
                </Col>
                <Col span='18' style={{borderLeftStyle:'solid',borderLeftWidth:1,borderLeftColor:'#d7d7d7'}} >  
                {
                    item.nodes.map(item2=>( //显示每个集群中每个节点的信息

                    <div key={item.cluster+item2.name}> 
                        <div className="card-wrap1"> 
                        <Card title={item2.name+' CPU'} >  
                        <Pie domid= {item.cluster+item2.name+'cpu_info'} pietype='cpu' data1={item2.cpu-item2.cpul}  data2={item2.cpul} /> 
                        </Card>  
                         </div>
                         <div className="card-wrap1"> 
                         <Card title={item2.name+' GPU'} >  
                         <Pie domid= {item.cluster+item2.name+'gpu_info'} pietype='gpu'data1={item2.gpu-item2.gpul}  data2={item2.gpul}/> 
                         </Card>  
                          </div>
                          <div className="card-wrap1"> 
                          <Card title={item2.name+' Memory'} >  
                          <Liquid_pie domid= {item.cluster+item2.name+'memory_info' } data1={item2.memoryl}  data2={item2.memoryl/item2.memory}/> 
                          </Card>  
                           </div>
                        </div>
                    ))
                }
                 </Col>
                </Row>
            </Card>)) 
             
        );
        }


        return (this.state.dep_total)?
            (
            <div >
                <Card title = '联邦状态总览'  className='card-wrap'   > 
                    <div className="card-wrap1"> 
                        <Card  title={'集群总数: '+ data.length}  > 
                                                {/***通过后台请求设置data */}
                        <Panel domid='集群'pietype='集群总览' wid={350} ready={2} notready={0} />  
                        </Card>  
                    </div   >
                    <div className="card-wrap1">
                        <Card title='应用'   >  {/***通过后台请求设置data */}
                        <Pie domid='应用' wid='350px' pietype='应用' data1={10} data2={5} />    
                        </Card>  
                    </div>
                    <div className="card-wrap1">
                        <Card  title='服务' >   
                        <Pie domid='服务'wid={350} pietype='服务' data1={this.state.dep_runing}  data2={this.state.dep_total-this.state.dep_runing}/>  
                        </Card>  
                    </div> 
                </Card>

                {cluster_info}
            </div> 
        ):''
    }
}

function Node(name,cpu,cpul,memory,memoryl,gpu,gpul) {
    var node=new Object(); 
    node.name=name;
    node.cpu=cpu;
    node.cpul=cpul;
    node.memory=memory;
    node.memoryl=memoryl;
    node.gpu=gpu;
    node.gpul=gpul; 

    return node
}