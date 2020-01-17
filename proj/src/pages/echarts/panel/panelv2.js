import React from 'react'
import  'echarts-liquidfill' 
import echarts from 'echarts/lib/echarts'
import   'echarts/lib/component/tooltip'
var myChart;
export default class EPanel extends React.Component {

    componentDidMount() { 

        myChart = echarts.init(document.getElementById(this.props.domid) );
        var rate=this.props.rate;
        var perrate=this.props.rate*100+'';
        var used =this.props.used ;
        var total =this.props.total
        //console.log('rate:',rate)
        //console.log('used:',used)
       // console.log('total:',total)
        
        perrate=perrate.substr(0,perrate.indexOf(".")+3)


        var option={ 
                series: [{
                    name: '使用率',
                    type: 'gauge',
                    max:100,
                    radius: '100%',  // 半径
                    center:['50%','50%'],
                    startAngle:215,  //起始位置
                    endAngle:-35,   //终点位置
                    axisLine:{
                        lineStyle:{
                            width:15
                        }
                    },
                    splitLine:{
                        length:15
                    },
                    detail: {
                        formatter: '使用率 '+ '{value}%'+'\n \n ( '+used+' / '+total+" )",
                        fontSize: 12,
                    },
                    axisLabel:{
                        fontSize:10
                    },
                    pointer:{
                        width:6,
                        length:'70%'
                    },

                    data: [{
                        value: 0,
                        name: this.props.domid, 
                    }]
                }]
           
        }

        var option2 = {
            title: {
                "text": this.props.domid+'\n使用率',
                "x": '48%',
                "y": '38%',
                textAlign: "center",
                "textStyle": {
                    "fontWeight": 'normal',
                    "fontSize": 14
                },
                "subtextStyle": {
                    "fontWeight": 'bold',
                    "fontSize": 12,
                    "color": '#3ea1ff'
                },
                subtext: perrate+'%'
            },
            series: [ 
                {
                    "name": ' ',
                    "type": 'pie',
                    "radius": ['50%', '70%'],
                    "avoidLabelOverlap": false,
                    "startAngle": 225,
                    "color": ["#08979c", "transparent"],
                    "hoverAnimation": false,
                    "legendHoverLink": false,
                    "label": {
                        "normal": {
                            "show": false,
                            "position": 'center'
                        },
                        "emphasis": {
                            "show": false,
                            "textStyle": {
                                "fontSize": '30',
                                "fontWeight": 'bold'
                            }
                        }
                    },
                    "labelLine": {
                        "normal": {
                            "show": false
                        }
                    },
                    "data": [{
                        "value": 75,
                        "name": '1'
                    }, {
                        "value": 25,
                        "name": '2'
                    }]
                }, 
              {
                    "name": '',
                    "type": 'pie',
                    "radius": ['52%', '68%'],
                    "avoidLabelOverlap": false,
                    "startAngle": 317,
                    "color": ["#fff", "transparent"],
                    "hoverAnimation": false,
                    "legendHoverLink": false,
                    "clockwise": false,
                    "itemStyle":{
                        "normal":{
                            "borderColor":"transparent",
                            "borderWidth":"20"
                        },
                        "emphasis":{
                            "borderColor":"transparent",
                            "borderWidth":"20"
                        }
                    }
                    ,
                    "z":10,
                    "label": {
                        "normal": {
                            "show": false,
                            "position": 'center'
                        },
                        "emphasis": {
                            "show": false,
                            "textStyle": {
                                "fontSize": '30',
                                "fontWeight": 'bold'
                            }
                        }
                    },
                    "labelLine": {
                        "normal": {
                            "show": false
                        }
                    },
                    "data": [{
                        //"value":  (100 - 50) * 266 / 360,
                        //"value":  37,
                        "name": '3'
                    }, {
                        // "value": 100 - (100 - 50) * 266 / 360,
                        //"value":  63,
                        "name": '4'
                    }
                    ]
                }
        
            ]
        };	

        
        //console.log(rate)
        option.series[0].data[0].value = (rate * 100).toFixed(2) - 0;
         

       myChart.setOption(option); 
 

 
                
            
                     
 
    }

    render(){
       
        return(
             <div id={this.props.domid} style={{width:300, height:200}} > </div>  
        )
    }

}