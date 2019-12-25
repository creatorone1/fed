 
import React from 'react'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Popover,Tag,Collapse , Select ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu, Spin,
} from 'antd';
import utils from './../../../utils/utils'
import cookie from 'react-cookies'
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;

class FindClusters extends React.Component {
    state = {
        dataSource:[{
            Name:"controller",
            IP:'192.168.0.1',
            Port:'8080',
            Infed:0,
        }, {
            Name:"k8s-fed",
            IP:'192.168.0.2',
            Port:'8080',
            Infed:1,
        } ]   ,
        loading:true
    }
    showModal = () => {
        const { form } = this.props;
        this.request() //打开的时候请求动态发现数据
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
    onJoin=(record)=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {   //如果没有错则传输数据 
              console.log(' values  : ', values); 
               //keys表示env名字env_label与值value的key
              //labelkeys表示label名字env_label与值value的key
              //portkeys表示portnum与porttype的key
              const { username,
                    password,
                } = values;  
              var newcluster = {
                Name:record.Name,
                IP:record.IP,
                Port:record.Port,
                Infed:record.Infed,
                username:username,
                password:password
              }
              console.log('jsondata',JSON.stringify(newcluster))
                fetch(utils.urlprefix+'/api/cluster/'+record.Name,{
                 method:'POST',
                 mode: 'cors', 
                 headers: { 
                    "Authorization":"Basic "+cookie.load("at") 
                    },
                 body:JSON.stringify(newcluster)
               }).then((response) => {
                   console.log('response:',response.ok)
                   return response.json();
               }).then((data) => {
                   console.log('data:',data) 
                   //添加成功后重新加载列表数据
                   this.request()
                   //成功了则关闭弹窗且初始化
                   this.props.statechange()
                   const { form } = this.props; 
                   form.resetFields();  //重置表单
                   this.setState({
                     visible: false, 
                   });
                   return data;
               }).catch( (e)=> {   
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
        const columns=[
            {
                title:'集群名称',
                key:'Name',
                dataIndex: 'Name',
                width: '30%',
                
            }, 
            {   
                title:'集群IP',
                key:'IP',
                dataIndex:'IP',
                 
            },
            {   
                title:'端口号',
                key:'Port',
                dataIndex:'Port', 
                 
            }, 
            {   
                title:'操作',
                key:'operation' ,
                render:(text,record)=>{
                    var opration 
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
                    var content =( 
                        <Form onSubmit={this.handleSubmit}
                                layout='horizontal'
                            >
                       
                        <FormItem   label= '用户名'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('username',{ 
                            initialValue:'',//初始化  
                                rules:[       //规则数组
                                {
                                required:true,
                                message:'username不能为空'
                                },  
                                ] 
                            }) (
                                <Input style={{ width: wwidth }}/> 
                                )
                            } 
                        </FormItem>
                        <FormItem   label= '密码'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('password',{ 
                            initialValue:'',//初始化  
                                rules:[       //规则数组
                                {
                                required:true,
                                message:'password不能为空'
                                },  
                                ] 
                            }) (
                                <Input type={"password"} style={{ width: wwidth }}/> 
                                )
                            } 
                        </FormItem>
                        <div
                        style={{textAlign:"right"}}
                        ><Button onClick={()=>this.onJoin(record)}>确定</Button>
                        </div> 
                    </Form>)
                    if(record.Infed=='0'){
                        opration = (
                      <Popover placement="bottom" content={content}   trigger="click">
                        <Button style={{fontSize:12}}>添加</Button>
                        </Popover>  )
                    } else{
                        opration =<Tag  color="#87d068" style={{cursor:'auto' }} >已添加</Tag>
                    }
                    return opration
                }
            }
        ]    
        const selectedRowKeys=this.state.selectedRowKeys;
        const rowSelection={ 
            type: 'checkbox',
            selectedRowKeys,
            onChange:(selectedRowKeys,selectedRows)=>{
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            }
        } 
        
        const wwidth='80%' //定义表单中空间宽度
       
        return(
            <div style={{display:'inline-block'}}>
            <Button type='primary' onClick={this.showModal}><Icon type="fork" />动态发现</Button>  
                        
            <Modal
            title="动态发现"
            visible={this.state.visible} 
            onCancel={this.hideModal}
            maskClosable={false}
            destroyOnClose={true}
            width='600px' 
            okText="确认"
            cancelText="取消"
            footer={null}
            afterClose={()=>{
            // console.log('close!')
            }}
            >  
                <Spin spinning={this.state.loading}>
                
                 
                    <Table  
                        style={{marginTop:16}}
                        dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                        rowKey={record => record.Name}
                        rowSelection={rowSelection }
                        columns={columns }  
                        rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                    />
                </Spin>
            </Modal>
             
            </div>
                )
        }
    }
export default Form.create()(FindClusters);            