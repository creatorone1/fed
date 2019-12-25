 
import React from 'react'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Popover,Tag,Collapse , Select ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu, Spin,
} from 'antd';
import utils from './../../../utils/utils'
import cookie from 'react-cookies'
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;

class UpdateRepo extends React.Component {
    state = {
        dataSource:[  ]   ,
        loading:true
    }
    showModal = () => {
        const { form } = this.props; 

        this.setState({
            visible: true,  
          }); 
        form.resetFields(); //重置表单数据  
      }
    hideModal = () => { //点击取消按钮
        const { form } = this.props; 
        form.resetFields();  //重置表单
        this.setState({
          visible: false, 
        });
      }  
     
    componentDidMount(){//请求数据
        //this.request();
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据

    }
    request = () => {
        this.setState({
            loading: true,  
        }); 
        fetch(utils.urlprefix+'url',{
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
                loading: false,  
            }); 
            return data;
        }).catch( (e)=>{
            this.setState({
                loading: false,  
            }); 
            console.log(e);
        })
    }
    HandleOK=()=>{

        this.props.form.validateFields((err, values) => {
            if (!err) {   //如果没有错则传输数据 
              console.log(' values  : ', values); 
               //keys表示env名字env_label与值value的key
              //labelkeys表示label名字env_label与值value的key
              //portkeys表示portnum与porttype的key
              const { address,
                    username,
                    password,
                } = values;  
              var imagerepo = {
                address:address, 
                username:username,
                password:password,
              }
              console.log('jsondata',JSON.stringify(imagerepo)) 
                
              fetch(utils.urlprefix+'/api/imagerepo',{
                  method:'PUT',
                  mode: 'cors', 
                  headers: { 
                    "Authorization":"Basic "+cookie.load("at") 
                    },
                  body:JSON.stringify(imagerepo),
                  }).then((response) => {
                      console.log('response:',response.ok)
                      return response.json();
                  }).then((data) => {
                      
                      message.success('更新成功');
                      //发送删除请求
                      
                      this.props.statechange()
                      const { form } = this.props; 
                        form.resetFields();  //重置表单
                        this.setState({
                        visible: false, 
                      });
                      return data;
                      
                  }).catch( (e)=> {  
                       
                      message.success('网络错误');
                      //发送删除请求 
                      const { form } = this.props; 
                        form.resetFields();  //重置表单
                        this.setState({
                        visible: false, 
                      });
                      console.log(e);
                  }) 
                   
               
            }
            else{ //否则报错 
              
              console.log('error values: ', values);   
              return
            }
          });
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
            <div style={{display:'inline-block'}}>
            <Button type={"primary"} onClick={this.showModal}  >更换仓库地址<Icon type="setting" /></Button>             
            <Modal
            title="切换镜像仓库"
            visible={this.state.visible} 
            onCancel={this.hideModal}
            maskClosable={false}
            destroyOnClose={true}
            width='600px' 
            okText="确认"
            cancelText="取消" 
            onOk={this.HandleOK}
            afterClose={()=>{
            // console.log('close!')
            }}
            >  
                 <Form onSubmit={this.handleSubmit}
                        layout='horizontal'
                    >
                       
                        <FormItem   label= '仓库地址'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('address',{  
                                rules:[       //规则数组
                                {
                                    required:true,
                                    message:'仓库地址不能为空'
                                }  ,
                                ] 
                            }) (
                                <Input placeholder='例如：core.harbor.domain' style={{ width: wwidth }}/> 
                                )
                            } 
                        </FormItem>
                        <FormItem   label= '账号'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('username',{ 
                                rules:[       //规则数组
                                    {
                                    required:true,
                                    message:'账号不能为空'
                                    },
                                ] 
                            }) (
                                <Input  style={{ width: wwidth }}/> 
                                )
                            } 
                        </FormItem>
                        <FormItem   label= '密码'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('password',{  
                                rules:[       //规则数组
                                {
                                required:true,
                                message:'密码不能为空'
                                }, 
                                 
                                ] 
                            }) (
                                <Input type={"password"} style={{ width: wwidth,  }}
                                  
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
export default Form.create()(UpdateRepo);            