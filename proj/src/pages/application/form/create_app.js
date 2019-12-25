 
import React from 'react'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
import utils from './../../../utils/utils'
import cookie from 'react-cookies'
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;

class CreateApp extends React.Component {
    state = {
        visible: false, 
        clusters:[],
        dataSource:{},
        namespaces:[],
    }
    componentDidMount(){//请求数据
       // this.request();
        //console.log('createApp')
        /*this.setState({
            clusters:[{
                name:'全局',
                namespaces:['defaultall','systemall']
            },{
                name:'cluster1',
                namespaces:['default1','system1']
            },{
                name:'cluster2',
                namespaces:['default2','system2']
            }]
        })*/
        //console.log('open the modal')
    }
    componentWillReceiveProps(nextProps){ 
        //每次打开 modal 的时候调用 数据 更新操作
        if(nextProps.createvisible!==this.props.createvisible&&nextProps.createvisible){
            console.log('打开时候深拷贝dataSource') 
            //先把原数据 转换为json字符串 再转化为 js对象
            let data=JSON.stringify(nextProps.dataSource)
            //console.log('json:',data)
            //console.log('object:',JSON.parse(data)) 
            this.setState({  
            //这儿 必须是深拷贝，不然会影响传入的值,并且只能初始化这个参数一次，以后的form的set操作不能影响该值
            dataSource:JSON.parse(data), // 
            clusters:nextProps.clusters,  
            }) 
          }
    }
    request = () => {
        fetch(utils.urlprefix+'/api/clusters',{
            method:'GET',
            headers: { 
                "Authorization":"Basic "+cookie.load("at") 
                },
            }).then((response) => {
                console.log('response:',response.ok)
                return response.json();
            }).then((data) => {
                console.log('data:',data)
                this.setState({
                    clusters:data.filter(item=>item.status!="NotReady")
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
        
        this.props.handleCreate(false)
      }  
    handleOk =()=>{ //点击确认按钮
     
        this.props.form.validateFields((err, values) => {
          if (!err) {   //如果没有错则传输数据 
            console.log(' values  : ', values); 
             //keys表示env名字env_label与值value的key
            //labelkeys表示label名字env_label与值value的key
            //portkeys表示portnum与porttype的key
            const { name,
                cluster,namespace,
                charturl,  
              } = values;  
              fetch(utils.urlprefix+'/api/app',{
                method:'POST',
                mode: 'cors',  
                headers: { 
                "Authorization":"Basic "+cookie.load("at") 
                },
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
                    this.props.handleCreate(false)
                    this.props.HandleCreated()
                    return data;
                }).catch((e)=>{
                    //成功了则关闭弹窗且初始化
                    const { form } = this.props; 
                    form.resetFields();  //重置表单
                    this.setState({
                        namespaces:[],
                    })  
                    this.props.handleCreate(false)
                    console.log(e);
                })
             
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
        let version=this.state.dataSource.versions.filter(item => item.version === value)[0]
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
        this.props.form.resetFields('namespace')

    } 

    render(){
        var dataSource=this.state.dataSource 
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
        if(dataSource.versions)
        {
            versionOption=dataSource.versions.map(item=>
                <Option  value={item.version} key={item.version}>{item.version}</Option>
            )
        }
        getFieldDecorator('charturl',{initialValue:''})
        return(
            <div >
                       
            <Modal
            title={ dataSource.name?'创建应用 '+dataSource.name:'创建应用'}
            visible={this.props.createvisible}
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
                    initialValue: '',//初始化   
                    rules:[       //规则数组
                        {
                        required:true,
                        message:'名称不能为空'
                        }, 
                        {
                            pattern:new RegExp('^\\w+$','g'),
                            message:'名称必须为字母或者数字'
                        } ,
                        ]
                    }) (
                        <Input style={{ width: wwidth  }}/> 
                        )
                    }
                      
                    
                </FormItem>
                <FormItem   label= '版本'  
                    {...formItemLayout}
                > 
                    {
                    getFieldDecorator('version',{ 
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
                        rules:[       //规则数组
                            {
                            required:true,
                            message:'集群不能为空'
                            }, ]
                    }) (
                        <Select  style={{ width: wwidth }} onSelect={this.handleSelectCluster}> 
                            {this.state.clusters.map(item=>(
                                <Option key={item.name} value={item.name}>{item.name}</Option>
                            ) 
                            )}
                        </Select> 
                        )
                    }
                    
                    
                </FormItem>
                <FormItem   label= '命名空间'  
                    {...formItemLayout}
                > 
                    {
                    getFieldDecorator('namespace',{ 
                        rules:[       //规则数组
                            {
                            required:true,
                            message:'命名空间不能为空'
                            }, ]
                    }) ( 
                        <Select  placeholder={this.state.namespaces.length===0?'请先选择集群':''}  style={{ width: wwidth }} onSelect={()=>this.handleSelectCluster}> 
                            {this.state.namespaces.map(item=>(
                                <Option key={item.name} value={item.name}>{item.name}</Option>
                            ) 
                            )}
                        </Select> 
                        )
                    } 
                </FormItem>
            </Modal>
            </div>
                )
        }
    }

export default Form.create()(CreateApp);            