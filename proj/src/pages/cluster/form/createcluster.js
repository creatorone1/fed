 
import React from 'react'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';

const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;

class CreateCluster extends React.Component {
    state = {
          
    }
    showModal = () => {
        const { form } = this.props;
        form.resetFields(); //重置表单数据 
        this.setState({
          visible: true, 
          
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
            const { name,
                address,port, 
              } = values;  
            
            //成功了则关闭弹窗且初始化
            const { form } = this.props; 
            form.resetFields();  //重置表单
            this.setState({
              visible: false, 
            });
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
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据

    }
    request = () => {
        fetch('url',{
        method:'GET'
        }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
        }).then((data) => {
            console.log('data:',data)
            return data;
        }).catch(function (e) {
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
            <Button type='primary' onClick={this.showModal}><Icon type='plus'/>添加集群</Button>  
                        
            <Modal
            title="添加集群"
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
                        <FormItem   label= '服务器地址'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('address',{ 
                                rules:[       //规则数组
                                    {
                                    required:true,
                                    message:'服务器地址不能为空'
                                    },
                                ] 
                            }) (
                                <Input placeholder='例如：https://192.168.0.16' style={{ width: wwidth }}/> 
                                )
                            } 
                        </FormItem>
                        <FormItem   label= '端口号'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('path',{  
                                rules:[       //规则数组
                                {
                                required:true,
                                message:'端口号不能为空'
                                }, 
                                 
                                ] 
                            }) (
                                <InputNumber style={{ width: wwidth,  }}
                                    min={1}
                                />
                                )
                            } 
                        </FormItem>
                          
                         

                         
                            

                </Form>
 
            </Modal>
            </div>
                )
        }
    }
export default Form.create()(CreateCluster);            