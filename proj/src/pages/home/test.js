
 import React from 'react'
 import './index.less'
 import {Card,Button,Radio, Row, Col} from 'antd'
 import echarts from 'echarts/lib/echarts'
 import 'echarts/lib/chart/bar'
 import 'echarts/lib/chart/line'
 import 'echarts/lib/component/tooltip'
 import 'echarts/lib/component/title'
 import 'echarts/lib/component/legend'
 import 'echarts/lib/component/toolbox'
 import 'echarts/lib/component/markPoint'
 import 'echarts/lib/component/markLine' 
 import  'echarts-liquidfill'
 import { width } from 'window-size';
 export default class Home extends React.Component{
     state = {
         loading:true,
         size:'default'
     }
     componentDidMount() {
         // 初始化
         var myChart = echarts.init(document.getElementById('main'));
         
         // 绘制图表
         myChart.setOption({
             tooltip: {
                 trigger: 'item',
                 formatter: "{a} <br/>{b}: {c} ({d}%)",
                 confine:true
             },
             
             series: [
                 {
                     name:'访问来源',
                     type:'pie',
                     radius: ['50%', '70%'],
                     avoidLabelOverlap: false,
                     label: {
                         normal: {
                             show: false,
                             position: 'center'
                         },
                         emphasis: {
                             show: true,
                             textStyle: {
                                 fontSize: '10',
                                 fontWeight: 'bold'
                             }
                         }
                     },
                     labelLine: {
                         normal: {
                             show: false
                         }
                     },
                     data:[
                         {value:335, name:'直接访问'},
                         {value:310, name:'邮件营销'},
                         {value:234, name:'联盟广告'},
                         {value:135, name:'视频广告'},
                         {value:1548, name:'搜索引擎'}
                     ]
                 }
             ]
         });
     }
  
 
     handleCloseLoading=()=>{
         this.setState({
             loading:false
         });
     }
 
     handleChange = (e)=>{
         this.setState({
             size:e.target.value
         })
     }
     render(){
       
         return (
             <div >
                 <Card title ='集群状态' className='card-wrap'   > 
                 <Row>
                     <Col span={6}>
                          <Card  > 
                          <div id='main' style={ { height:100,width:100 } }></div>
                        
                         </Card> 
                     </Col>
                     <Col span={6}>
                          <Card  > 
                         asdas
                         </Card> 
                     </Col>
                     <Col span={6}>
                          <Card  > 
                         asd
                         </Card> 
                     </Col>
                     <Col span={6}>
                          <Card  > 
                         asdasd
                         </Card> 
                     </Col>
                 </Row>
                 </Card> 
             </div> 
         );
     }
 }