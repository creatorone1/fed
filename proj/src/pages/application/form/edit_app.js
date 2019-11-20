 
import React from 'react'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
import utils from './../../../utils/utils'
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;

class EditApp extends React.Component {
    state = {
        visible: false, 
        clusters:[],
        dataSource:{},
        namespaces:[],
        versions:[]
    }
    componentDidMount(){//请求数据 
        //console.log('createApp')
        /* this.setState({
            clusters:[{
                name:'全局',
                namespaces:['defaultall','systemall']
            },{
                name:'cluster1',
                namespaces:['default1','system1']
            },{
                name:'cluster2',
                namespaces:['default2','system2']
            }], 
            versions:[{  //先查询到该应用的版本信息
                version:'5.2.0',
                url:'http://10.103.240.133:8089/charts/gateway-5.2.0.tgz'
            },{
                version:'5.2.1',
                url:'http://10.103.240.133:8089/charts/gateway-5.2.1.tgz'
            },{
                version:'4.3.6',
                url:'http://10.103.240.133:8089/charts/gateway-4.3.6.tgz'
            }
            ]
        })*/
        //console.log('open the modal')
    }
    componentWillReceiveProps(nextProps){ 

        //每次打开 modal 的时候调用 数据 更新操作
        if(nextProps.editvisible!==this.props.editvisible&&nextProps.editvisible){
            console.log('打开时候深拷贝dataSource') 
            //先把原数据 转换为json字符串 再转化为 js对象
            let data=JSON.stringify(nextProps.dataSource)
            //console.log('json:',data)
            //console.log('object:',JSON.parse(data)) 
            this.setState({  
            //这儿 必须是深拷贝，不然会影响传入的值,并且只能初始化这个参数一次，以后的form的set操作不能影响该值
            dataSource:JSON.parse(data) ,//  
            clusters:nextProps.clusters,   
            }) 
            //console.log(data)
            //console.log(nextProps.clusters)
            //console.log(JSON.parse(data).cluster)
            let namespaces=nextProps.clusters.filter(item => item.name ===JSON.parse(data).cluster)[0].namespaces
            this.setState({
            namespaces:namespaces
            })
            this.request();
          }
    }
    request = () => {
        fetch(utils.urlprefix+'/api/charts',{
        method:'GET',
        mode: 'cors', 
        }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
        }).then((data) => {
            console.log('data:',data)
            //console.log('dataSource',this.state.dataSource)
            //console.log('chartname',this.state.dataSource.chartname)
            var versions=[{
                version:this.state.dataSource.chartversion,
            }]
            var newvs=data.filter(item=>item.name==this.state.dataSource.chartname)
            //console.log('newvs',newvs)
            if(newvs.length>0)
            {
                versions=data.filter(item=>item.name==this.state.dataSource.chartname)[0].versions
            } 
            //console.log('versions',versions)
            this.setState({
                versions: versions
            })

            return data;
        }).catch( (e)=>{
            console.log(e);
        })
    }

     
    hideModal = () => { //点击取消按钮
        const { form } = this.props; 
        form.resetFields();  //重置表单
        this.setState({
            namespaces:[],
        }) 
        
        this.props.handleUpdate(false)
      }  
    handleOk =()=>{ //点击确认按钮
     
        this.props.form.validateFields((err, values) => {
          if (!err) {   //如果没有错则传输数据 
            console.log(' values  : ', values); 
             //keys表示env名字env_label与值value的key
            //labelkeys表示label名字env_label与值value的key
            //portkeys表示portnum与porttype的key
            let { name,
                cluster,namespace,
                version,charturl,  
              } = values;  
            if (version===this.state.dataSource.chartversion ){ //如果没有改变版本则仍使用先前的版本,不执行任何操作
                //let Version=this.state.versions.filter(item => item.version === version)[0]
                //charturl=Version.url  
                 //成功了则关闭弹窗且初始化
                 const { form } = this.props; 
                 form.resetFields();  //重置表单
                 this.setState({
                     namespaces:[],
                 })  
                 this.props.handleUpdate(false)
             } else{
                fetch(utils.urlprefix+'/api/cluster/'+this.state.dataSource.cluster+'/app',{
                    method:'PUT',
                    mode: 'cors', 
                    body:JSON.stringify(values)
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        console.log('data:',data)
                       //成功了则关闭弹窗且初始化
                        const { form } = this.props; 
                        form.resetFields();  //重置表单
                        this.setState({
                            namespaces:[],
                        })  
                        this.props.handleUpdate(false,true)
                        this.props.statechange()
                        return data;
                    }).catch( (e)=>{ 
                         //成功了则关闭弹窗且初始化
                        const { form } = this.props; 
                        form.resetFields();  //重置表单
                        this.setState({
                            namespaces:[],
                        })  
                        this.props.handleUpdate(false)
                        console.log(e);
                    })
             }
           // console.log(charturl)
            
          }
          else{ //否则报错 
            const { name,podsnum,image ,
              keys,labelkeys,portkeys,env_label,value
              , portnum, porttype,
              cpurequst,cpulimit,memoryrequst,memorylimit,gpurequst,
              nodename
              } = values;  
            console.log(' values: ', values);   
            return
          }
        });
      }
    handleVersion = (value)=>{
        console.log('value')
        let version=this.state.versions.filter(item => item.version === value)[0]
        this.props.form.setFieldsValue({
            charturl:version.url
        })

    }     
    handleSelectCluster = (value)=>{
        console.log('value')
        let namespaces=this.state.clusters.filter(item => item.name === value)[0].namespaces
        this.setState({
            namespaces:namespaces
        })
        this.props.form.setFieldsValue({
            namespace:''
        }) 
    } 

    render(){
        var dataSource=this.state.dataSource 
        let dataname
        if(dataSource)
            if(dataSource.name){
                dataname=dataSource.name.name
            }

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = { //设置每个控件的名称和组件的大小
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
          },
        };     
        const wwidth='80%' //定义表单中空间宽度  
        let versionOption
        
        /** versions要通过网络请求查到*/ 
        versionOption=this.state.versions.map(item=>
                <Option  value={item.version} key={item.version}>{item.version}</Option>
        ) 
        getFieldDecorator('charturl',{initialValue:''})
        return(
            <div >
                       
            <Modal
            title={ dataname?'升级应用 '+dataname:'升级应用'}
            visible={this.props.editvisible}
            onOk={this.handleOk}
            onCancel={this.hideModal}
            maskClosable={false}
            destroyOnClose={true}
            width='600px' 
            okText="确认"
            cancelText="取消"
            afterClose={()=>{
            // console.log('close!')
            }}
            >  
                <FormItem   label= '名称'  
                    {...formItemLayout}
                > 
                    {
                    getFieldDecorator('name',{ 
                    initialValue:dataname?dataname:'',//初始化   
                    rules:[       //规则数组
                        {
                        required:true,
                        message:'名称不能为空'
                        },  
                        ]
                    }) (
                        <Input style={{ width: wwidth,display:'none' }}/> 
                    )
                     }
                    <span style={{ width: wwidth }}>{dataname}</span> 
                </FormItem>
                <FormItem   label= '版本'  
                    {...formItemLayout}
                > 
                    {
                    getFieldDecorator('version',{ 
                        initialValue:dataSource.chartversion?dataSource.chartversion:'',//初始化   
                        rules:[       //规则数组
                            {
                            required:true,
                            message:'版本不能为空'
                            }, ] 
                    }) (
                        <Select  style={{ width: wwidth }} onSelect={this.handleVersion}> 
                        {
                             versionOption
                        }
                        </Select> 
                        )
                    } 
                </FormItem>
                <FormItem   label= '集群'  
                    {...formItemLayout}
                > 
                    {
                    getFieldDecorator('cluster',{ 
                        initialValue:dataSource.cluster?dataSource.cluster:'',//初始化
                        rules:[       //规则数组
                            {
                            required:true,
                            message:'集群不能为空'
                            }, ]
                    }) (
                        /*<Select  style={{ width: wwidth }} onChange={this.handleSelectCluster}> 
                            {this.state.clusters.map(item=>(
                                <Option key={item.name} value={item.name}>{item.name}</Option>
                            ) 
                            )}
                        </Select> */
                         <Input style={{ width: wwidth,display:'none' }}/> 
                         )
                          }
                         <span style={{ width: wwidth }}>{dataSource.cluster}</span> 
                    
                    
                </FormItem>
                <FormItem   label= '命名空间'  
                    {...formItemLayout}
                > 
                    {
                    getFieldDecorator('namespace',{ 
                        initialValue:dataSource.namespace?dataSource.namespace:'',//初始化
                        rules:[       //规则数组
                            {
                            required:true,
                            message:'命名空间不能为空'
                            }, ]
                    }) ( 
                        /*<Select  placeholder={this.state.namespaces.length===0?'请先选择集群':''}  style={{ width: wwidth }} onSelect={()=>this.handleSelectCluster}> 
                            {this.state.namespaces.map(item=>(
                                <Option key={item.name} value={item.name}>{item.name}</Option>
                            ) 
                            )}
                            </Select> */
                            <Input style={{ width: wwidth,display:'none' }}/> 
                            )
                             }
                            <span style={{ width: wwidth }}>{dataSource.namespace}</span> 
                </FormItem>
            </Modal>
            </div>
                )
        }
    }

export default Form.create()(EditApp);            