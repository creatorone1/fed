
import React from 'react'
import  'echarts-liquidfill' 
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine' 

 export default class panel extends React.Component {
 
     componentDidMount() {
         
         var myChart = echarts.init(document.getElementById(this.props.domid) ); 
         // 绘制饼图
         var pietype=this.props.pietype;
         var ready=this.props.ready;
         var notready=this.props.notready;
         
         //console.log(pietype);
         myChart.setOption({  
             
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                confine:true
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                selectedMode:false,
                data: ['Ready','NotReady'],
                itemWidth:15,
                itemHeight:15,
                textStyle:{fontSize:13}
                
            },
            series : [
                {
                    name: pietype,
                    type: 'pie',
                    radius : '70%',
                    center:['40%','50%'],//设置位置 
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
                        {value:ready, name:'Ready'},
                        {value:notready, name:'NotReady'}, 
                    ],
                    color:[  '#91c7ae','#104E8B' ],
                    itemStyle: {
                         
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
         });
     }
 
     render(){
        let wid=this.props.wid;

         return(
             <div>
                  
              <div id={this.props.domid} style={{width:wid?wid:230,height:100}} > </div>  
              </div>
         )
     }
 
 }


























 