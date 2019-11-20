 
import React from 'react'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
import utils from './../../../utils/utils'
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;

class CreatePV extends React.Component {
    state = {
        /**存储类sc的数据从网络获取 
         * 
        */
      /*  pvData:[{
            name:'pv1',
            namespace:'default',
            status:'Available',
            capacity:'10GB',
            pvc:'myvo1',
            storageclass:'nfs',
            accessmodes:['RWO','ROX'],
            createtime:'2019-5-10',
            key:'1',

        },{
            name:'pv2',
            status:'Bound', 
            capacity:'20GB',
            pvc:'myvo2',
            storageclass:'nfs',
            accessmodes:['RWX','ROX'],
            createtime:'2019-5-11',
            key:'2',
        },{
            name:'pv3',
            status:'Released',   
            capacity:'30GB',
            pvc:'',
            storageclass:'',
            accessmodes:['RWX'],
            createtime:'2019-5-11', 
            key:'3',
        },{
            name:'pv4',
            status:'Failed',   
            capacity:'30GB',
            pvc:'',
            storageclass:'',
            accessmodes:['ROX','RWO','RWX'],
            createtime:'2019-5-11',
            key:'4',
        },
       ] ,
       */

        //存储类
        SCData: [{
            name:'stc1', 
            status:'Active', 
            provisioner:'example.com/nfs', 
            createtime:'2019-5-10',
            key:'1',
        },{
            name:'stc2',
            status:'Active', 
            provisioner:'example.com/nfs', 
            createtime:'2019-5-11',
            key:'2',
        },{
            name:'stc3',
            status:'Active',   
            provisioner:'example.com/nfs',  
            createtime:'2019-5-11', 
            key:'3',
        }
        ], 
        selectdata:[],// 存储源数据，pv或sc 
        accessmodes: [
            { label: '单主机读写', value: 'ReadWriteOnce' },
            { label: '多主机只读', value: 'ReadOnlyMany' },
            { label: '多主机读写', value: 'ReadWriteMany' },
        ]
    }
    showModal = () => {
        this.request(this.props.currentcluster)
        const { form } = this.props;
        form.resetFields(); //重置表单数据 
        this.setState({
          visible: true, 
          selectdata:[],
          accessmodes: [
            { label: '单主机读写', value: 'ReadWriteOnce' },
            { label: '多主机只读', value: 'ReadOnlyMany' },
            { label: '多主机读写', value: 'ReadWriteMany' },
         ]
        }); 
       
      }
    hideModal = () => { //点击取消按钮
        const { form } = this.props; 
        form.resetFields();  //重置表单
        this.setState({
          visible: false, 
        });
      }  
    handleOk =()=>{ //点击确认按钮
     
        this.props.form.validateFields((err, values) => {
          if (!err) {   //如果没有错则传输数据 
            console.log(' values  : ', values); 
             //keys表示env名字env_label与值value的key
            //labelkeys表示label名字env_label与值value的key
            //portkeys表示portnum与porttype的key
            var pv=new PV(values)
              //console.log('svc',pvc)
               //console.log(JSON.stringify(pvc))
              fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/pv',{
               method:'POST',
               mode: 'cors', 
               body:JSON.stringify(pv)
             }).then((response) => {
                 console.log('response:',response.ok)
                 return response.json();
             }).then((data) => {
                 console.log('data:',data)
                
                 /*this.setState({ //表格选中状态清空
                     selectedRowKeys:[],
                     selectedRows:null,
                     dataSource:data
                 })*/
                 
                    this.props.statechange() 
                 //成功了则关闭弹窗且初始化
                const { form } = this.props; 
                form.resetFields();  //重置表单
                this.setState({
                 visible: false, 
                    });
                 return data;
             }).catch( (e)=> {  
               //成功了则关闭弹窗且初始化
            const { form } = this.props; 
            form.resetFields();  //重置表单
            this.setState({
              visible: false, 
            });
                 console.log(e);
             }) 

             
          }
          else{ //否则报错 
            const { name,podsnum,image,namepace,
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
         
    componentDidMount(){//请求数据
        //this.request();
        //console.log(`'safaf'`)
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据

    }
    request = (clustername) => { //初始化数据请求
        fetch(utils.urlprefix+'/api/cluster/'+clustername+'/scs',{
            method:'GET'
            }).then((response) => {
                console.log('response:',response.ok)
                return response.json();
            }).then((data) => {
                console.log('data:',data) 
                this.setState({ //表格选中状态清空
                    selectedRowKeys:[],
                    selectedRows:null,
                    SCData:data
                }) 
                return data;
            }).catch((e)=>{
                console.log(e);
            })
    } 

    render(){
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
       
        return(
            <div>
            <Button type='primary' onClick={this.showModal}><Icon type='plus'/>添加持久卷</Button>  
                        
            <Modal
            title="添加持久卷"
            visible={this.state.visible}
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
                <Form onSubmit={this.handleSubmit}
                        layout='horizontal'
                    >
                       
                        <FormItem   label= '名称'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('name',{ 
                            initialValue:'',//初始化  
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
                                <Input style={{ width: wwidth }}/> 
                                )
                            } 
                        </FormItem>
                        <FormItem   label= '插件'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('fstype',{  
                            }) (
                                <span style={{ width: wwidth }} > NFS</span> 
                                )
                            } 
                        </FormItem>
                        <FormItem   label= '路径'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('path',{ 
                            initialValue:'',//初始化  
                                rules:[       //规则数组
                                {
                                required:true,
                                message:'路径不能为空'
                                }, 
                                 
                                ] 
                            }) (
                                <Input style={{ width: wwidth }}/> 
                                )
                            } 
                        </FormItem>
                        <FormItem   label= '服务器'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('server',{ 
                            initialValue:'',//初始化  
                                rules:[       //规则数组
                                {
                                required:true,
                                message:'服务器地址不能为空'
                                },  
                                ] 
                            }) (
                                <Input  placeholder='例如:10.103.240.133' style={{ width: wwidth }}/> 
                                )
                            } 
                        </FormItem>      
                        <FormItem   label= {'分配存储类'}  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('storageclass',{ 
                              
                            }) (
                                <Select  style={{ width: wwidth }} > 
                                     {
                                          this.state.SCData.map((item)=>(
                                            <Option value={item.name} key={item.name}>
                                                {item.name}
                                            </Option>
                                            ) )
                                     }
                                </Select> 
                                )
                            } 
                        </FormItem>

                        <FormItem   label= '容量'  
                            {...formItemLayout}
                        > 
                            <div style={{  lineHeight:'100%', backgroundColor:'#d9d9d9'  , width: wwidth   }}> 
                            {
                            getFieldDecorator('capacity',{ 
                            initialValue:'',//初始化  
                                rules:[       //规则数组
                                {
                                required:true,
                                message:'容量不能为空'
                                },  
                                ] 
                            }) (
                                <InputNumber placeholder={''} style={{ width: '90%' ,marginRight:'5px' }}
                                    min={0}
                                />
                                ) 
                            } 
                            GB
                            </div>
                        </FormItem> 
                        <FormItem   label= '访问类型'  
                            {...formItemLayout}
                        > 
                               {
                            getFieldDecorator('accessmodes',{ 
                            initialValue:[],//初始化  
                            rules:[       //规则数组
                                {
                                required:true,
                                message:'至少选择一个访问类型'
                                }, 
                                
                                ]  
                            }) ( 
                                <Checkbox.Group options={this.state.accessmodes}  style={{ width: wwidth }}></Checkbox.Group>
                                )
                            }  
                             
                        </FormItem>    

                </Form>
 
            </Modal>
            </div>
                )
        }
    }
export default Form.create()(CreatePV);            
function PV(values){
    var pv=new Object(); 
    const { name,
             capacity,
             path,
             server,
             storageclass,
             accessmodes, 
            } = values;
    pv.name=name 
    pv.capacity=capacity+'Gi'
    pv.path=path
    pv.server=server
    pv.storageclass=storageclass
    pv.accessmodes=accessmodes

    return pv
}