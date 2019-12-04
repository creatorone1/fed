 
import React from 'react'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
import utils from './../../../utils/utils'
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;

class FindClusters extends React.Component {
    state = {
        dataSource:[{
            Name:"controller",
            IP:'192.168.0.1',
            Port:'12344',
            Infed:0,
        }, {
            Name:"k8s-fed",
            IP:'192.168.0.2',
            Port:'4561',
            Infed:1,
        } ]   
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
     
        /*this.props.form.validateFields((err, values) => {
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
        });*/
    }
         
    componentDidMount(){//请求数据
        //this.request();
    }
    componentWillReceiveProps(nextProps){
        //接收参数后更新数据

    }
    request = () => {
        fetch(utils.urlprefix+'url',{
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
                title:'服务',
                key:'Port',
                dataIndex:'Port', 
                 
            }, 
            {   
                title:'操作',
                key:'operation' ,
                render:(text,record)=>{
                    var opration 
                    if(record.Infed=='0'){
                        opration = ( <Dropdown overlay={  
                            <Menu onClick={({key})=>this.onClick(key,text,record)}> 
                            <Menu.Item key="1">添加</Menu.Item>
                          </Menu> 
                         } trigger={['click']}>
                             <Button>添加</Button>
                        </Dropdown> )
                    } else{
                        opration =<div>已添加</div>
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
            <Button type='primary' onClick={this.showModal}><Icon type='plus'/>动态发现</Button>  
                        
            <Modal
            title="添加集群"
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
                    <Table  
                        style={{marginTop:16}}
                        dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                        rowKey={record => record.name}
                        rowSelection={rowSelection }
                        columns={columns }  
                        rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                    />
            </Modal>
            </div>
                )
        }
    }
export default Form.create()(FindClusters);            