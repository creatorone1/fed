//部署一个工作负载的表单
import React from 'react'
//import {Modal,message,Badge,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, }from 'antd'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
 

let id = 0;
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class EditPV extends React.Component {
    state={
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
        accessmodes: [
            { label: '单主机读写', value: 'RWO' },
            { label: '多主机只读', value: 'ROX' },
            { label: '多主机读写', value: 'RWX' },
        ] 
    }
    componentDidMount(){//初始化数据，只调用一次
          //...
          // this.setState=({ //在这初始化无效，是因为props参数改变之后不调用这个方法
          //   dataSource:this.props.dataSource 
          // })
          // console.log('this.props.dataSource:', this.props.dataSource)
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
  

 
  
    hideModal = () => { //点击取消按钮
      const { form } = this.props; 
      form.resetFields();  //重置表单 触发了componentWillReceiveProps 函数
      id=0; 
      //console.log('this.state.dataSource:',this.state.dataSource)
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
                path,server,
                storageclass,
                capacity,accessmodes, 
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
     
    
     
    render() {  
      //console.log(' render dataSource:',this.state.dataSource )
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
      
       
      return (
        <div>   
        {dataSource?    
        <Modal
          title="编辑"
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
       <Form onSubmit={this.handleSubmit}
          
          layout='horizontal'
       > 
           <FormItem   label= '名称'  
             {...formItemLayout}
           > 
            {
               getFieldDecorator('name',{ 
               initialValue:dataSource.name?dataSource.name:'',//初始化   
               }) (
                 <Input style={{ width: wwidth,display:'none' }}/> 
                  )
             }
              <span style={{ width: wwidth }}>{dataSource.name}</span>  
             
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
                    initialValue:dataSource.path?dataSource.path:'',//初始化  
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
                            initialValue:dataSource.server?dataSource.server:'',//初始化  
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
                                initialValue:dataSource.storageclass?dataSource.storageclass:'',//初始化  
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
                            initialValue:parseInt(dataSource.capacity.substring(0,dataSource.capacity.indexOf('G')),10),//初始化  
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
                            initialValue:dataSource.accessmodes?dataSource.accessmodes:'',//初始化  
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
        :''}
        </div>
      );
    }
  }
  
  //const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(CreateWL);
  export default Form.create()(EditPV); 



