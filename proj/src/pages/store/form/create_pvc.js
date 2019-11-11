 
import React from 'react'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select ,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class CreatePVC extends React.Component {
    state = {
        /**pv与存储类sc的数据从网络获取 
         * 
        */
        pvData:[{
            name:'pv1',
            namespace:'default',
            status:'Available',
            capacity:'10GB',
            pvc:'myvo1',
            storageclass:'nfs',
             
            accessmodes:['RWO','ReadOnlyMany'],
            createtime:'2019-5-10',
            key:'1',

        },{
            name:'pv2',
            status:'Bound', 
            capacity:'20GB',
            pvc:'myvo2',
            storageclass:'nfs',
            accessmodes:['ReadWriteMany','ReadOnlyMany'],
            createtime:'2019-5-11',
            key:'2',
        },{
            name:'pv3',
            status:'Released',   
            capacity:'30GB',
            pvc:'',
            storageclass:'',
            accessmodes:['ReadWriteMany'],
            createtime:'2019-5-11', 
            key:'3',
        },{
            name:'pv4',
            status:'Failed',   
            capacity:'30GB',
            pvc:'',
            storageclass:'',
            accessmodes:['RWO','ReadOnlyMany','ReadWriteMany'],
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
            const { name,namespace,
                storesourcetype,storesourcename,
                capacity,accessmodes 
              } = values;  
            
              var pvc=new PVC(values)
              //console.log('svc',pvc)
               //console.log(JSON.stringify(pvc))
              fetch('http://localhost:9090/api/cluster/'+this.props.currentcluster+'/pvc',{
               method:'POST',
               mode: 'cors', 
               body:JSON.stringify(pvc)
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
    request = (clustername) => { //初始化数据请求
        fetch('http://localhost:9090/api/cluster/'+clustername+'/pvs',{
        method:'GET',
        mode: 'cors', 
        }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
        }).then((data) => {
            console.log('data:',data)

            this.setState({ //表格选中状态清空
                selectedRowKeys:[],
                selectedRows:null,
                pvData:data
            })
             
            return data;
        }).catch( (e)=> {  
            console.log(e);
        })

        fetch('http://localhost:9090/api/cluster/'+clustername+'/scs',{
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
    handleSelecttype=(value)=>{ //选择存储源类型
        console.log('select type: '+value)
        const {form}=this.props
        form.resetFields('storesourcename') //重置存储源选项 
         
        //给工作负载选择组件中配置合适的 option 选项 
        if(value=='PV'){ 
            this.setState({
                selectdata:this.state.pvData, 
            })
        }   
        else
        {
            form.resetFields('capacity') //重置容量大小
            this.setState({     
                selectdata:this.state.SCData,
                accessmodes: [
                    { label: '单主机读写', value: 'ReadWriteOnce' },
                    { label: '多主机只读', value: 'ReadOnlyMany' },
                    { label: '多主机读写', value: 'ReadWriteMany' },
                ]
            })
        } 
    } 
    handleSelectPv=(value)=>{ //选择存储源PV之后定义可以选择的访问类型
        if(this.props.form.getFieldValue('storesourcetype')=='PV'){
            this.props.form.resetFields('accessmodes') //重置访问类型 
            console.log('select name: '+value)
            const {form}=this.props
            //获取pv数据
            const pv=this.state.pvData.filter(item=>item.name===value) 
            
            this.props.form.setFieldsValue({ //设置容量大小
                capacity:parseInt(pv[0].capacity.substring(0,pv[0].capacity.indexOf('G')),10)
            })
                          
            //设置访问模式
            var options=this.state.accessmodes 
           
             options[0].disabled=!pv[0].accessmodes.includes('ReadWriteOnce')&&!pv[0].accessmodes.includes('RWO')
             options[1].disabled=!pv[0].accessmodes.includes('ReadOnlyMany')&&!pv[0].accessmodes.includes('ROX')
             options[2].disabled=!pv[0].accessmodes.includes('ReadWriteMany')&&!pv[0].accessmodes.includes('RWX')
            console.log(options)
            this.setState({
                accessmodes:options
            })
        }
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
                <Button type='primary' onClick={this.showModal}><Icon type='plus'/>添加数据卷</Button>  
                            
                <Modal
                title="添加数据卷"
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
                       
                        <FormItem   label= '命名空间'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('namespace',{ 
                            initialValue:'',//初始化  
                                rules:[       //规则数组
                                {
                                required:true,
                                message:'命名空间不能为空'
                                },   
                                ] 
                            }) (
                                <Select style={{ width: wwidth }}> 
                                    { namespacesdata
                                    }
                                </Select> 
                                )
                            } 
                        </FormItem>
                       
                        <FormItem   label= '存储源类型'  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('storesourcetype',{ 
                            initialValue:'',//初始化   
                            }) (
                                <Select style={{ width: wwidth }} onSelect={this.handleSelecttype}> 
                                    <Option value='PV'>持久卷</Option>
                                    <Option value='StorageClass'>存储类</Option>
                                </Select> 
                                )
                            } 
                        </FormItem>
                       
                        <FormItem   label= {'存储源'}  
                            {...formItemLayout}
                        > 
                            {
                            getFieldDecorator('storesourcename',{ 
                              
                            }) (
                                <Select placeholder={this.props.form.getFieldValue('storesourcetype')===""?'先选择存储源类型':''}  style={{ width: wwidth }} onSelect={this.handleSelectPv}> 
                                     {
                                          this.state.selectdata.map((item)=>(
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
                                max={this.props.form.getFieldValue('storesourcetype')==='PV'&&this.props.form.getFieldValue('storesourcename')!==undefined?
                                parseInt(this.state.pvData.filter(item=>item.name===this.props.form.getFieldValue('storesourcename'))[0].capacity.substring(0,this.state.pvData.filter(item=>item.name===this.props.form.getFieldValue('storesourcename'))[0].capacity.indexOf('G')),10)
                                :undefined} 
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
export default Form.create()(CreatePVC); 

function PVC(values){
    var pvc=new Object(); 
    const { name,namespace,
             capacity,
             storesourcename,
             storesourcetype,
             accessmodes, 
            } = values;
    pvc.name=name
    pvc.namespace=namespace
    pvc.size=capacity+'Gi'
    if(storesourcetype=='PV'){
        pvc.volume=storesourcename
    }else{
        pvc.storageclass=storesourcename
    }
    pvc.accessmodes=accessmodes

    return pvc
}