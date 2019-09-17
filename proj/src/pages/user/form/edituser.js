//部署一个工作负载的表单
import React from 'react'
//import {Modal,message,Badge,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, }from 'antd'
 
import {
    Modal,Form,Tree, Input,Radio, Icon, Button,InputNumber ,Collapse , Select,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
const { TreeNode } = Tree;  

 
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class EditUser extends React.Component {
    state={
        dataSource:undefined,
        role:'', 
        confirmDirty:false,
         /***之后再comwillmount方法中初始化数据 */
        clusters:['cluster1','cluster2','cluster3'], 
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
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
          let data=JSON.stringify(nextProps.dataSource)
          //console.log('json:',data)
          //console.log('object:',JSON.parse(data)) 
          this.setState({  
          //这儿 必须是深拷贝，不然会影响传入的值,并且只能初始化这个参数一次，以后的form的set操作不能影响该值
             dataSource:JSON.parse(data), //
             role:JSON.parse(data).role, 
             checkedKeys:JSON.parse(data).auths,
          }) 
        }
        //console.log('nextProps:',  nextProps) 
        //console.log('nextProps.dataSource:', nextProps.dataSource) 
    }
  

 
  
    hideModal = () => { //点击取消按钮
      const { form } = this.props; 
      form.resetFields();  //重置表单 触发了componentWillReceiveProps 函数
       
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
            console.log(' values  : ', values); 
             //keys表示env名字env_label与值value的key
            //labelkeys表示label名字env_label与值value的key
            //portkeys表示portnum与porttype的key
            const { username,status,
                password,role, 
              } = values;  
            var auths=this.state.checkedKeys//权限数组
            
            //成功了则关闭弹窗且初始化
            const { form } = this.props; 
            form.resetFields();  //重置表单

            this.props.handleUpdate(false)
          }
          else{ //否则报错 
              
            console.log(' values: ', values);   
            return
          }
        });
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
  //  密码验证 //自定义验证规则
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入不一致！');
    } else {
      callback();
    }
  };

   handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
   };
   validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmpwd'], { force: true }); //指定验证表单的某个控件
    }  
    callback();
   };   

    handleRoleChange = (e)=>{
        this.setState({
            role:e.target.value
        })

        if(e.target.value=='CommonUser'){
            console.log('reset')
            this.setState({ checkedKeys:[],expandedKeys:[]});
        }
    }


    onExpand = expandedKeys => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
      };
    
     onCheck = checkedKeys => { //更改check内容
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
      };
    
      onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
      };
    
      renderTreeNodes = data =>
        data.map(item => {
          if (item.children) {
            return (
              <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode key={item.key} {...item} />;
        });
    
         
     
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
      const radioStyle = {
          display: 'block',
          height: '40px',
          lineHeight: '40px',
          
        };

      var clusters=[]
      this.state.clusters.map(item=>{
          clusters.push({ title: item, key: 'clustercheck:'+item })  //最后取值时好判断选择了哪些集群
      })
     
      const treeData=[{
          title:'自定义权限配置',
          key:'auth',
          children:[
              {
                  title:'联邦集群管理',
                  key:'federationauth',
                  children:[
                      { title: '联邦管理', key: 'federation' }, 
                  ]
              },
              {
                  title:'集群权限',
                  key:'clusterauth',
                  children: clusters
              },
              {
                  title:'模块权限',
                  key:'moduleauth',
                  children:[
                      { title: '应用管理', key: 'application' },
                      { title: '服务管理', key: 'service' },
                      { title: '存储管理', key: 'store' },
                      { title: '节点管理', key: 'node' }, 
                  ]
              }
          ]
          }     
      ]

      
       
      return (
        <div>   
        {dataSource?    
        <Modal
          title="编辑用户"
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
                       
                    <FormItem   label= '用户名'  
                            {...formItemLayout}
                        > 
                           {
                            getFieldDecorator('username',{ 
                            initialValue:dataSource.username?dataSource.username:'',//初始化  
                                 
                            }) (
                                <Input style={{ width: wwidth,display:'none' }}/>  
                                )
                            }
                             <span style={{ width: wwidth }}>{dataSource.username}</span>   
                        </FormItem>
                    <FormItem   label= '状态'  
                            {...formItemLayout}
                            
                        > 
                            {
                            getFieldDecorator('status',{ 
                                initialValue:dataSource.status?dataSource.status:'',
                                rules:[       //规则数组
                                    {
                                    required:true,
                                    message:'不能为空'
                                    },
                                ] 
                            }) (
                                <Radio.Group  style={{ width: wwidth }}   >
                                    <Radio value={'Active'}>启用</Radio>
                                    <Radio value={'inActive'}>停用</Radio> 
                                </Radio.Group> 
                                )
                            } 
                        </FormItem>
                    <Collapse defaultActiveKey={['1','2']}  className="collwrap">
                        <Panel header="密码管理" key="1" >   
                        <FormItem  label='新密码'
                            {...formItemLayout}
                            hasFeedback >
                              {
                            getFieldDecorator('password',{  
                                rules:[       //规则数组
                                    {
                                    required:true,
                                    message:'密码不能为空'
                                    },{
                                        min:6,
                                        message: '密码不能少于6个字符',
                                      }, {
                                        max:15,
                                        message: '密码不能大于15个字符',
                                     },{
                                        validator: this.validateToNextPassword,
                                      }, 
                                ] 
                            }) (
                                <Input type="password"style={{ width: wwidth }}/>
                                )
                            }
                        </FormItem>  

                        <FormItem  label='确认密码'
                            {...formItemLayout} 
                            hasFeedback >
                              {
                            getFieldDecorator('confirmpwd',{  
                                rules:[       //规则数组
                                    {
                                    required:true,
                                    message:'密码不能为空'
                                    }, {    //自定义密码验证规则
                                        validator: this.compareToFirstPassword
                                    }
                                ] 
                            }) (
                                <Input type="password" style={{ width: wwidth }} onBlur={this.handleConfirmBlur}/> 
                                ) 
                            }
                        </FormItem> 
                        </Panel>
                        {
                            /***根据用户身份进行选择是否显示权限管理 */
                        }
                        <Panel header="权限管理" key="2" > 
                            <FormItem label='用户角色'
                                {...formItemLayout} >
                                     {
                            getFieldDecorator('role',{  
                                initialValue:dataSource.role?dataSource.role:'',
                                rules:[       //规则数组
                                    {
                                    required:true,
                                    message:'不能为空'
                                    }
                                ] 
                                }) (
                                <Radio.Group onChange={this.handleRoleChange}  >
                                    <Radio style={radioStyle} value={'Administrator'}>
                                        管理员
                                    </Radio>
                                    <Radio style={radioStyle} value={'CommonUser'}>
                                        普通用户
                                    </Radio> 
                                </Radio.Group>
                                ) 
                             }    
                            </FormItem>  

                             {this.state.role=='CommonUser'?   
                             <FormItem label='自定义权限'
                                {...formItemLayout} >
                                {
                                getFieldDecorator('auth',{   
                                     
                                    }) (
                                        <Tree
                                            checkable
                                            onExpand={this.onExpand}
                                            expandedKeys={this.state.expandedKeys}
                                            autoExpandParent={this.state.autoExpandParent}
                                            onCheck={this.onCheck}
                                            checkedKeys={this.state.checkedKeys}
                                            onSelect={this.onSelect}
                                            selectedKeys={this.state.selectedKeys}
                                        >
                                            {this.renderTreeNodes(treeData)}
                                        </Tree>
                                    ) 
                                }    
                            </FormItem> :null}   
                          


                        </Panel>
                    </Collapse>
                        

                      
                         

                </Form>
 
            </Modal>
            
        :''}
        </div>
      );
    }
  }
  
  //const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(CreateWL);
  export default Form.create()(EditUser); 



