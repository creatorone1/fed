import React from 'react'
import './index.less'
import {Card,Button,Radio, Row, Col} from 'antd'
import {Link} from 'react-router-dom'
import Pie from './../echarts/pie/index.js'
import Liquid_pie  from './../echarts/liquidfill/index.js'
import { Line } from 'echarts/lib/util/graphic';
import  Panel from './../echarts/pie/panel'
import axios from '../../axios'
import utils from './../../utils/utils'
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
        dep_runing:5,
        dataload:false,
        /*dataSource:{
            clusters:[
                {
                    clustername:'',
                    nodes:[{
                        nodename:'',
                        nodestatus:ready,
                    }]
                }
            ]
        }*/

    }
     
    componentDidMount() {  // 必须在hosts配置ip地址  C:\Windows\System32\drivers\etc
        this.requestCluster()
        
    } 

 
    requestCluster=()=>{
         // 初始化  
         /** 获取联邦里面集群 */
         fetch(utils.urlprefix+'/api/clusters'
         ,{
             method:'GET',
             mode: 'cors', 
             }).then((response) => {
                 console.log('clusters response:',response.ok)
                 return response.json();
             }).then((data) => {
                console.log('clusters data:',data)
                var items=data
                var clusternum=0;
                var ready=0;
                var notready=0;
                var deps={
                    ready:0,
                    notready:0,
                 }
                var apps={
                    ready:0,
                    notready:0,
                 };
                var clusters=[];
                 /**deps 与apps以后用网络请求获取真实数据 */
               /* deps={
                     ready:17,
                     notready:3,
                 }
                apps={
                    ready:15,
                    notready:2
                 }*/
                clusternum =items.length
                /* 以后的方法
                 在每个fetch中的 .then((data) => {
                     这里面接着写下一个 fetch

                     接着在下一个fetch里面写继续要执行的程序
                 }

                var depstatus=this.requestDeployment("fed")
                deps={
                     ready:deps.ready+depstatus.ready,
                     notready:deps.notready+depstatus.notready, 
                }
                var appstatus=this.requestApp("fed")
                apps={
                     ready:deps.ready+appstatus.ready,
                     notready:deps.notready+appstatus.notready, 
                }
                */
                //初始化数据请求
                var clusterdepcount=0
                items.map(item=>{
                    fetch(utils.urlprefix+'/api/cluster/'+item.name+'/deployments',{
                method:'GET',
                mode: 'cors', 
                }).then((response) => {
                    console.log('response:',response.ok)
                    return response.json();
                }).then((data) => {
                    clusterdepcount++
                    console.log('data:',data)
                    data.map(dep=>{
                        if(dep.status=="running"){
                            deps.ready++
                        }else{
                            deps.notready++
                        } 
                    })
                     
                    if(clusternodecount==items.length&&clusterdepcount==items.length&&clusterappcount==items.length){
                        console.log('get all clusters') 
                        this.setState({
                            dataSource:{
                                clusternum,
                                ready,
                                notready,
                                deps,
                                apps,
                                clusters,
                            },
                            dataload:true
                        } )
                    }    
                     
                    return data;
                }).catch( (e)=> {  
                    clusterdepcount++
                    if(clusternodecount==items.length&&clusterdepcount==items.length&&clusterappcount==items.length){
                        console.log('get all clusters') 
                        this.setState({
                            dataSource:{
                                clusternum,
                                ready,
                                notready,
                                deps,
                                apps,
                                clusters,
                            },
                            dataload:true
                        } )
                    }
                    console.log(e);
                }) 
                })

                var clusterappcount=0
                items.map(item=>{
                    fetch(utils.urlprefix+'/api/cluster/'+item.name+'/apps',{
                method:'GET',
                mode: 'cors', 
                }).then((response) => {
                    console.log('response:',response.ok)
                    return response.json();
                }).then((data) => {
                    clusterappcount++
                    console.log('data:',data)
                    data.map(app=>{
                        if(app.status=="Active"){
                            apps.ready++
                        }else{
                            apps.notready++
                        } 
                    }) 
                    if(clusternodecount==items.length&&clusterdepcount==items.length&&clusterappcount==items.length){
                        console.log('get all clusters') 
                        this.setState({
                            dataSource:{
                                clusternum,
                                ready,
                                notready,
                                deps,
                                apps,
                                clusters,
                            },
                            dataload:true
                        } )
                    }
                    return data;
                }).catch( (e)=> {  
                    clusterappcount++ 
                    if(clusternodecount==items.length&&clusterdepcount==items.length&&clusterappcount==items.length){
                        console.log('get all clusters') 
                        this.setState({
                            dataSource:{
                                clusternum,
                                ready,
                                notready,
                                deps,
                                apps,
                                clusters,
                            },
                            dataload:true
                        } )
                    }
                    console.log(e);
                }) 
                })

                var clusternodecount=0

                items.map((item,index)=>{

                    console.log("cluster: "+item.name)
                     let name,status
                     let nodes=[] 
                     let nodestatus={
                         ready:0,
                         notready:0
                     }
                     name=item.name
                     if(item.status)
                    {   status=item.status
                        if(status=="Ready") ready++
                        else { notready++}
                    }else{ notready++}
                    
                    //this.requestNodes(name)
                    //nodes=this.state.nodes 
                   

                    fetch(utils.urlprefix+'/api/cluster/'+item.name+'/nodes',{
                        method:'GET',
                        mode: 'cors',
                    }).then((response) => {
                        console.log(name+'nodesreq:',response.ok)
                        return response.json(); 
                    }).then((data) => {
                        console.log(name+'nodes_data:',data)   
                        data.map(node=>{
                            let name,cpu,cpul,memory,memoryl,status
                            name=node.name;
                            cpu=node.cpu[1];
                            memory=node.memory[1] ;
                            cpul=node.cpu[0];
                            memoryl=node.memory[0];
                            //console.log('memory   ',item.status.capacity.memory )
                            //console.log('K index: ',item.status.capacity.memory.indexOf('K'))
                           // memoryl=item.status.allocatable.memory.substring(0,item.status.allocatable.memory.indexOf('K')); 
                            status=node.status
                            var node = new Node(name,status,cpu,cpul,memory,memoryl,0,0)
                            nodes=nodes.concat(node)  
                        })
                           
                        nodes.map(item=>{
                            if(item.status=="Ready"){
                                nodestatus.ready++
                            }
                            else{
                                nodestatus.notready++
                            }
                        })
                        
                        var cluster = new Cluster(name,status,nodestatus,nodes)
                        clusters=clusters.concat(cluster)
                        console.log('clusters now :',clusters)
                        clusternodecount++

                        if(clusternodecount==items.length&&clusterdepcount==items.length&&clusterappcount==items.length){
                            console.log('get all clusters') 
                            this.setState({
                                dataSource:{
                                    clusternum,
                                    ready,
                                    notready,
                                    deps,
                                    apps,
                                    clusters,
                                },
                                dataload:true
                            } )
                        }
                    }).catch( (e)=>{
                        clusternodecount++ 
                        if(clusternodecount==items.length&&clusterdepcount==items.length&&clusterappcount==items.length){
                            console.log('get all clusters') 
                            this.setState({
                                dataSource:{
                                    clusternum,
                                    ready,
                                    notready,
                                    deps,
                                    apps,
                                    clusters,
                                },
                                dataload:true
                            } )
                        }
                        console.log(e); 
                    }) 

                   
                 })
                  
                 
                 
                // return data;
             }).catch(function (e) {
                 console.log(e);
             })
                
    }
    render(){
        console.log('homepage data ',this.state.dataSource);
 
       
        /***通过后台请求设置nodes */

        var data=this.state.dataSource
        /*[
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
        ]; */  
      if(data){     
        var cluster_nodeinfo=(
            data.clusters.map((item,index)=>(<Card key={index} title ={'集群'+(index+1)+': '+item.name}  className='card-wrap'> 
                <Row> 
                <Col span='6' style={{display:'flex',alignItems:'center',justifyContent:'center' }}>
                     <div className="card-wrap1"   > 
                        <Card  title={'节点总数: '+  item.nodes.length}   > 
                        <Panel domid={item.name} pietype='节点状态' ready={item.nodestatus.ready} notready={item.nodestatus.notready} />  
                        </Card>  
                     </div >
                </Col>
                <Col span='18' style={{borderLeftStyle:'solid',borderLeftWidth:1,borderLeftColor:'#d7d7d7'}} >  
                {
                    item.nodes.map(item2=>( //显示每个集群中每个节点的信息

                    <div key={item.name+item2.name}> 
                        <div className="card-wrap1"> 
                        <Card title={item2.name+' CPU'} >  
                        <Pie domid= {item.name+item2.name+'cpu_info'} pietype='cpu' data1={item2.cpu-item2.cpul}  data2={item2.cpul} /> 
                        </Card>  
                         </div>
                         <div className="card-wrap1"> 
                         <Card title={item2.name+' GPU'} >  
                         <Pie domid= {item.name+item2.name+'gpu_info'} pietype='gpu'data1={item2.gpu-item2.gpul}  data2={item2.gpul}/> 
                         </Card>  
                          </div>
                          <div className="card-wrap1"> 
                          <Card title={item2.name+' Memory'} >  
                          <Liquid_pie domid= {item.name+item2.name+'memory_info' } data1={item2.memoryl}  data2={item2.memoryl/item2.memory}/> 
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


        return (this.state.dataload)?
            (
            <div >
                <Card title = '联邦状态总览'  className='card-wrap'   > 
                    <div className="card-wrap1"> 
                        <Card  title={'集群总数: '+ data.clusternum}  > 
                                                {/***通过后台请求设置data */}
                        <Panel domid='集群'pietype='集群总览' wid={350} ready={data.ready} notready={data.notready} />  
                        </Card>  
                    </div   >
                    <div className="card-wrap1">
                        <Card title='应用'   >  {/***通过后台请求设置data */}
                        <Pie domid='应用' wid='350px' pietype='应用' data1={data.apps.ready} data2={data.apps.notready} />    
                        </Card>  
                    </div>
                    <div className="card-wrap1">
                        <Card  title='服务' >   
                        <Pie domid='服务'wid={350} pietype='服务' data1={data.deps.ready}  data2={data.deps.notready}/>  
                        </Card>  
                    </div> 
                </Card>

                {cluster_nodeinfo}
            </div> 
        ):''
    }
}

function Node(name,status,cpu,cpul,memory,memoryl,gpu,gpul) {
    var node=new Object(); 
    node.name=name;
    node.status=status;
    node.cpu=cpu;
    node.cpul=cpul;
    node.memory=memory;
    node.memoryl=memoryl;
    node.gpu=gpu;
    node.gpul=gpul; 

    return node
}
function Cluster(name,status,nodestatus,nodes){
    var cluster=new Object()
    cluster.name=name;
    cluster.status=status;
    cluster.nodestatus=nodestatus;
    cluster.nodes=nodes;
    return cluster

}