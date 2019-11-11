 
import React from 'react'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select ,Radio ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class CreateSC extends React.Component {
    state = {
        /**
         * 
        */
       /* pvData:[{
            name:'pv1',
            namespace:'default',
            status:'Available',
            size:'10GB',
            pvc:'myvo1',
            storageclass:'nfs',
            accessmodes:['RWO','ROX'],
            createtime:'2019-5-10',
            key:'1',

        },{
            name:'pv2',
            status:'Bound', 
            size:'20GB',
            pvc:'myvo2',
            storageclass:'nfs',
            accessmodes:['RWX','ROX'],
            createtime:'2019-5-11',
            key:'2',
        },{
            name:'pv3',
            status:'Released',   
            size:'30GB',
            pvc:'',
            storageclass:'',
            accessmodes:['RWX'],
            createtime:'2019-5-11', 
            key:'3',
        },{
            name:'pv4',
            status:'Failed',   
            size:'30GB',
            pvc:'',
            storageclass:'',
            accessmodes:['ROX','RWO','RWX'],
            createtime:'2019-5-11',
            key:'4',
        },
       ] ,
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
        ], */
        
        selectdata:[],// 存储源数据，pv或sc 
        accessmodes: [
            { label: '单主机读写', value: 'RWO' },
            { label: '多主机只读', value: 'ROX' },
            { label: '多主机读写', value: 'RWX' },
        ] 
    }
    showModal = () => {
        const { form } = this.props;
        form.resetFields(); //重置表单数据 
        this.setState({
          visible: true, 
          selectdata:[],
          accessmodes: [
            { label: '单主机读写', value: 'RWO' },
            { label: '多主机只读', value: 'ROX' },
            { label: '多主机读写', value: 'RWX' },
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
            const { name,   
                reclaimPolicy 
              } = values;  
            
              var sc=new SC(values)
              //console.log('svc',pvc)
               //console.log(JSON.stringify(pvc))
              fetch('http://localhost:9090/api/cluster/'+this.props.currentcluster+'/sc',{
               method:'POST',
               mode: 'cors', 
               body:JSON.stringify(sc)
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
        const namespaces=this.props.namespaces //根据父组件传来的参数配置命名空间 
        const namespacesdata=namespaces.map( (item)=>(  
            <Option value={item} key={item} >{item}</Option>
        )
        );
        
        const wwidth='80%' //定义表单中空间宽度
        const nodedata=['node1','node2','node3'] //先获取主机数据
        const nodenames = nodedata.map((item)=>(
            <Option value={item} key={item}>
                {item}
            </Option>
            ) ) 
        return(
                <div>
                <Button type='primary' onClick={this.showModal}><Icon type='plus'/>添加存储类</Button>  
                            
                <Modal
                title="添加存储类"
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
                       
                        <FormItem   label= '提供者'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('provisioner',{ 
                            initialValue:'example.com/nfs',//初始化  
                                  
                            }) (
                                <span style={{ width: wwidth }}> 
                                    example.com/nfs
                                </span> 
                                )
                            } 
                        </FormItem>
                       
                        <FormItem   label= '回收策略'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('reclaimPolicy',{ 
                            initialValue:'',//初始化   
                            }) (
                                
                                <Radio.Group style={{ width: wwidth }} >
                                      <Radio value={'Retain'}>保留数据卷</Radio>
                                      <Radio value={'Delete'}>删除数据卷</Radio>
                                </Radio.Group>
                                )
                            } 
                        </FormItem>  
                    </Form>
                </Modal>
                </div>
                )
        }
    }
export default Form.create()(CreateSC); 
function SC(values){
    var sc=new Object(); 
    const { name,
            provisioner,
            reclaimPolicy,  
            } = values;
    sc.name=name 
    sc.provisioner=provisioner
    sc.reclaimPolicy=reclaimPolicy 

    return sc
}