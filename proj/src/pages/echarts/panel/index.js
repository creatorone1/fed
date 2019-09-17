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
        //console.log('rate:',rate)
        perrate=perrate.substr(0,perrate.indexOf(".")+3)
        var option = {
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
         var value_ = (100 - rate*100) * 266 / 360;
        //console.log(parseInt(value_))
         option.series[1].data[0].value = value_;
         option.series[1].data[1].value = 100 - value_

       myChart.setOption(option); 
 

 
                
            
                     
 
    }

    render(){
       
        return(
             <div id={this.props.domid} style={{width:300, height:200}} > </div>  
        )
    }

}