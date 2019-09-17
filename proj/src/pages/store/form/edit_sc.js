//编辑存储类 
import React from 'react' 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select ,Radio ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class EditSC extends React.Component {
    state = {
        /**pv与存储类的数据从网络获取 
         * 
        */
        pvData:[{
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
        ], 
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
        
        this.props.handleUpdate(false)
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
            
            //成功了则关闭弹窗且初始化
            const { form } = this.props; 
            form.resetFields();  //重置表单 
            this.props.handleUpdate(false)
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
    componentWillReceiveProps(nextProps){ //应该使用这个方法初始化dataSource
        //console.log('componentWillReceiveProps nextProps',nextProps)
   
        //每次打开 modal 的时候调用 数据 更新操作
        if(nextProps.editvisible!==this.props.editvisible&&nextProps.editvisible){
          console.log('打开时候深拷贝dataSource') 
          //先把原数据 转换为json字符串 再转化为 对象
          let data=JSON.stringify( nextProps.dataSource)
          //console.log('json:',data)
          //console.log('object:',JSON.parse(data)) 
          this.setState({  
          //这儿 必须是深拷贝，不然会影响传入的值,并且只能初始化这个参数一次，以后的form的set操作不能影响该值
          dataSource:JSON.parse(data) //
          }) 
        }
        //console.log('nextProps:',  nextProps) 
        //console.log('nextProps.dataSource:', nextProps.dataSource) 
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
        

        return(
                <div>
                {dataSource?    
                    <Modal
                    title="编辑"
                    visible={this.props.editvisible}
                    onOk={this.handleOk}
                    onCancel={this.hideModal}
                    maskClosable={false}
                    destroyOnClose={true}
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
                            initialValue:dataSource.name,//初始化   
                            }) (
                                <Input style={{ width: wwidth,display:'none' }}/> 
                                )
                            }
                            <span style={{ width: wwidth }}>{dataSource.name}</span>  
                            
                        </FormItem>
                       
                        <FormItem   label= '提供者'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('provisioner',{ 
                            initialValue:'',//初始化  
                                  
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
                            initialValue:dataSource.reclaimPolicy,//初始化   
                            }) (
                                
                                <Radio.Group style={{ width: wwidth }} >
                                      <Radio value={'Retain'}>保留数据卷</Radio>
                                      <Radio value={'Delete'}>删除数据卷</Radio>
                                </Radio.Group>
                                )
                            } 
                        </FormItem>  
                    </Form>
                </Modal> :''}

                </div>
                )
        }
    }
export default Form.create()(EditSC); 
