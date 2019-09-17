
import React from 'react'
 
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine' 

 export default class pie extends React.Component {
 
     componentDidMount() {
         //console.log('id0',this.props.domid)
         var myChart = echarts.init(document.getElementById(this.props.domid) ); 
         var pietype=this.props.pietype;
        // console.log('getpietype: '+pietype,pietype=='应用')
         // 绘制饼图
         var datatype=(pietype=='应用'||pietype=='服务')?{
            fir:'Running',
            sec:'Dead'
         }:{
            fir:'Used',
            sec:'Left'
         }
         var uesd=this.props.data1;
         var left=this.props.data2;
         //console.log(datatype)
         myChart.setOption({ 
             tooltip: {
                 trigger: 'item',
                 formatter: "{a} <br/>{b}: {c} ({d}%)",
                 confine:true
             },
             legend: {
                orient: 'vertical',
                x: 'right',
                selectedMode:false,
                data:[datatype.fir,datatype.sec],
                itemWidth:15,
                itemHeight:15,
                textStyle:{fontSize:13}
            },
            series: [
                {
                    name: pietype,
                    type:'pie',
                    radius: ['50%', '70%'],
                    center:['40%','50%'],//设置位置
                    avoidLabelOverlap: false,  
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '30',
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
                        {value:uesd, name:datatype.fir},
                        {value:left, name:datatype.sec},  
                    ],
                    color:['#91c7ae','#104E8B' ],
                }, 
            ],  
         });
     }
 
     render(){
        var wid=this.props.wid;
         return(
             <div>

              
              <div id={this.props.domid} style={{width:wid?wid:230,height:100}} > </div>  
              </div>
         )
     }
 
 }











































// import React from 'react'
// import {Card} from 'antd'
// import ReactEcharts from 'echarts-for-react';
// import echartTheme from '../echartTheme'
// import themeLight from '../themeLight'
// // import echarts from 'echarts'
// import echarts from 'echarts/lib/echarts'
// // 引入饼图和折线图
// import 'echarts/lib/chart/pie'
// // 引入提示框和标题组件
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/markPoint';
// export default class Bar extends React.Component {

//     state = {}

//     componentWillMount(){
//         echarts.registerTheme('Imooc',themeLight);
//     }

//     getOption() {
//         let option = {
//             title: {
//                 text: '用户骑行订单',
//                 x : 'center'
//             },
//             legend : {
//                 orient: 'vertical',
//                 right: 10,
//                 top: 20,
//                 bottom: 20,
//                 data: ['周一','周二','周三','周四','周五','周六','周日']
//             },
//             tooltip: {
//                 trigger : 'item',
//                 formatter : "{a} <br/>{b} : {c} ({d}%)"
//             },
//             series: [
//                 {
//                     name : '订单量',
//                     type : 'pie',
//                     radius : '55%',
//                     center : [
//                         '50%', '60%'
//                     ],
//                     data:[
//                         {
//                             value:1000,
//                             name:'周一'
//                         },
//                         {
//                             value: 1000,
//                             name: '周二'
//                         },
//                         {
//                             value: 2000,
//                             name: '周三'
//                         },
//                         {
//                             value: 1500,
//                             name: '周四'
//                         },
//                         {
//                             value: 3000,
//                             name: '周五'
//                         },
//                         {
//                             value: 2000,
//                             name: '周六'
//                         },
//                         {
//                             value: 1200,
//                             name: '周日'
//                         },
//                     ],
//                     itemStyle : {
//                         emphasis: {
//                             shadowBlur: 10,
//                             shadowOffsetX: 0,
//                             shadowColor: 'rgba(0, 0, 0, 0.5)'
//                         }
//                     }
//                 }
//             ]
//         }
//         return option;
//     }

//     getOption2() {
//         let option = {
//             title: {
//                 text: '用户骑行订单',
//                 x: 'center'
//             },
//             legend: {
//                 orient: 'vertical',
//                 right: 10,
//                 top: 20,
//                 bottom: 20,
//                 data: [
//                     '周一',
//                     '周二',
//                     '周三',
//                     '周四',
//                     '周五',
//                     '周六',
//                     '周日'
//                 ]
//             },
//             tooltip: {
//                 trigger: 'item',
//                 formatter: "{a} <br/>{b} : {c} ({d}%)"
//             },
//             series: [
//                 {
//                     name: '订单量',
//                     type: 'pie',
//                     radius: ['50%', '80%'],
//                     center: [
//                         '50%', '60%'
//                     ],
//                     data: [
//                         {
//                             value: 1000,
//                             name: '周一'
//                         }, {
//                             value: 1000,
//                             name: '周二'
//                         }, {
//                             value: 2000,
//                             name: '周三'
//                         }, {
//                             value: 1500,
//                             name: '周四'
//                         }, {
//                             value: 3000,
//                             name: '周五'
//                         }, {
//                             value: 2000,
//                             name: '周六'
//                         }, {
//                             value: 1200,
//                             name: '周日'
//                         }
//                     ],
//                     itemStyle: {
//                         emphasis: {
//                             shadowBlur: 10,
//                             shadowOffsetX: 0,
//                             shadowColor: 'rgba(0, 0, 0, 0.5)'
//                         }
//                     }
//                 }
//             ]
//         }
//         return option;
//     }

//     getOption3() {
//         let option = {
//             title: {
//                 text: '用户骑行订单',
//                 x: 'center'
//             },
//             legend: {
//                 orient: 'vertical',
//                 right: 10,
//                 top: 20,
//                 bottom: 20,
//                 data: [
//                     '周一',
//                     '周二',
//                     '周三',
//                     '周四',
//                     '周五',
//                     '周六',
//                     '周日'
//                 ]
//             },
//             tooltip: {
//                 trigger: 'item',
//                 formatter: "{a} <br/>{b} : {c} ({d}%)"
//             },
//             series: [
//                 {
//                     name: '订单量',
//                     type: 'pie',
//                     radius: '55%',
//                     center: [
//                         '50%', '50%'
//                     ],
//                     data: [
//                         {
//                             value: 1000,
//                             name: '周一'
//                         }, {
//                             value: 1000,
//                             name: '周二'
//                         }, {
//                             value: 2000,
//                             name: '周三'
//                         }, {
//                             value: 1500,
//                             name: '周四'
//                         }, {
//                             value: 3000,
//                             name: '周五'
//                         }, {
//                             value: 2000,
//                             name: '周六'
//                         }, {
//                             value: 1200,
//                             name: '周日'
//                         }
//                     ].sort(function (a, b) { return a.value - b.value; }),
//                     roseType: 'radius',
//                     animationType: 'scale',
//                     animationEasing: 'elasticOut',
//                     animationDelay: function (idx) {
//                         return Math.random() * 200;
//                     }
//                 }
//             ]
//         }
//         return option;
//     }

//     render() {
//         return (
//             <div>
//                 <Card title="饼形图表之一">
//                     <ReactEcharts
//                         option={this.getOption()}
//                         theme="Imooc"
//                         notMerge={true}
//                         lazyUpdate={true}
//                         style={{ height: 500 }}/>
//                 </Card>
//                 <Card title="饼形图之二" style={{marginTop:10}}>
//                     <ReactEcharts
//                         option={this.getOption2()}
//                         theme="Imooc"
//                         notMerge={true}
//                         lazyUpdate={true}
//                         style={{ height: 500 }}/>
//                 </Card>
//                 <div>
//                 <Card title="饼形图之三" style={{marginTop:10}}>
//                     <ReactEcharts
//                         option={this.getOption3()}
//                         theme="Imooc"
//                         notMerge={true}
//                         lazyUpdate={true}
//                         style={{ height: 500 }}/>
//                 </Card>
//                 <Card title="饼形图之三" style={{marginTop:10}}>
//                     <ReactEcharts
//                         option={this.getOption3()}
//                         theme="Imooc"
//                         notMerge={true}
//                         lazyUpdate={true}
//                         style={{ height: 500 }}/>
//                 </Card>
//                 </div>
//             </div>
//         );
//     }
// }