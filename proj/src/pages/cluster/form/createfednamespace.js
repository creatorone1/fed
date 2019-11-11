 
import React from 'react'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';

const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;

class CreateFedNamespace extends React.Component {
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
              } = values;  
            var newnm = {
                name:name
            }
            console.log('nmjson',JSON.stringify(newnm))
              fetch('http://localhost:9090/api/cluster/'+this.props.currentcluster+'/namespace',{
               method:'POST',
               mode: 'cors', 
               body:JSON.stringify(newnm)
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
                 //成功了则关闭弹窗且初始化
                 this.props.statechange()
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
            
            console.log('error values: ', values);   
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
            <Button type='primary' onClick={this.showModal}><Icon type='plus'/>创建命名空间</Button>  
                        
            <Modal
            title="创建命名空间"
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
   
                            

                </Form>
 
            </Modal>
            </div>
                )
        }
    }
export default Form.create()(CreateFedNamespace);            