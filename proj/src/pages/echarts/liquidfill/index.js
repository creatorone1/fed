import React from 'react'
import  'echarts-liquidfill' 
import echarts from 'echarts/lib/echarts'
import   'echarts/lib/component/tooltip'

export default class Liquid_pie extends React.Component {

    componentDidMount() { 

        var myChart = echarts.init(document.getElementById(this.props.domid) );
        
        var left=this.props.data1;
        var rate=this.props.data2;
        myChart.setOption({ 
            backgroundColor:'white',
            tooltip: {
                trigger: 'item', 
                formatter:  'memory<br>Left:  '+left+'Gi' ,
                confine:true
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                selectedMode:false,
                data:['已使用'],
                itemWidth:15,
                itemHeight:15,
                textStyle:{fontSize:13}
            },
                series: [{
                    name:'内存',
                    type: 'liquidFill',
                    radius: '70%',//设置占容器的大小
                    data:[rate],
                    backgroundStyle: { 
                        color: 'white', //背景颜色  
                    } ,
                    color:['#91c7ae',],
                    outline:{
                        itemStyle: {
                            borderWidth: 8,
                            borderColor: '#104E8B',
                        }
                    },
                    label:{//设置字体大小
                        normal:{
                            textStyle:{
                                fontSize:12
                            }
                        }
                    },
                     
                }],
               
        }); 
                
            
                     
 
    }

    render(){
        
        return(
             <div id={this.props.domid} style={{width:230,height:100}} > </div>  
        )
    }

}