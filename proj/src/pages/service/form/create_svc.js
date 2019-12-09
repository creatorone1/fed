//部署一个service的表单
import React from 'react'
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu, Divider,
} from 'antd';
import { height } from 'window-size';
import './../service.less' 
import utils from './../../../utils/utils'
let id = 0;
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class CreateSvc extends React.Component {
    state = { 
        visible: false, 
        advanced:false,
        /*workloaddata:[
            { 
                name:'nginx1',
                namespace:'system'
            },
            { 
                name:'nginx2',
                namespace:'default'
            },
            { 
                name:'nginx3',
                namespace:'system'
            },
            { 
                name:'nginx4',
                namespace:'default'
            },
        ],*/
        selectwldata:[]
        
    }
    componentWillUnmount(){
      //console.log('CreateSvc destroy')
    }
    showModal = () => {
        const { form } = this.props;
        form.resetFields(); 
        id=0;
        this.setState({
          visible: true, 
          advanced:false,
          selectwldata:[] //清空之前选择的数据
        }); 
       
    }
    
    hideModal = () => { //点击取消按钮
        const { form } = this.props; 
        form.resetFields();  //重置表单
        id=0;
        this.setState({
          visible: false, 
          advanced:false
        });
      }
    handleOk =()=>{ //点击确认按钮
       
        this.props.form.validateFields((err, values) => {
          if (!err) {   //如果没有错则传输数据 
            console.log(' values  : ', values); 
         
            const { name,namespace,
              wlkeys,wlname,
              type,exipkeys,exip, 
              portname, svcport,porttype,targetport,nodeport,
              labelkeys,label,value
              } = values;  
            //console.log('env_label name :', keys.map(key => env_label[key]));
           var svc=new Service(values)
           console.log('svc',svc)
            console.log(JSON.stringify(svc))
           fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/service',{
            method:'POST',
            mode: 'cors', 
            body:JSON.stringify(svc)
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
            id=0;
            this.setState({
              visible: false, 
              advanced:false
            });
              return data;
          }).catch( (e)=> {  
            //成功了则关闭弹窗且初始化
            const { form } = this.props; 
            form.resetFields();  //重置表单
            id=0;
            this.setState({
              visible: false, 
              advanced:false
            });
              console.log(e);
          }) 
             
          }
          else{ //否则报错 
              
            console.log(' values: ', values);   
            return
          }
        });
    }
    handleSlectn=(value)=>{ //选择当前命名空间下的工作负载
        console.log('select namespaces: '+value)
        const {form}=this.props
       // form.resetFields('selkeys') //重置工作负载选项
       // form.resetFields(`wlname[${'wlkeysdefault'}]`)
        //给工作负载选择组件中配置合适的 option 选项
        /*this.setState({
            selectwldata:this.state.workloaddata.filter(item=>item.namespace===value)
        }) */
    }   
    remove = (keytype,k) => { //移除
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue(keytype);
       
    
        // 移除keys数组的一个值
        if(keytype=='wlkeys')  
        form.setFieldsValue({
          wlkeys: keys.filter(key => key !== k),
        });
        if(keytype=='selkeys')  
        form.setFieldsValue({
          selkeys: keys.filter(key => key !== k),
        });
        if(keytype=='portkeys')  
        form.setFieldsValue({
          portkeys: keys.filter(key => key !== k),
        });
        if(keytype=='labelkeys')  
        form.setFieldsValue({
          labelkeys: keys.filter(key => key !== k),
        });
        if(keytype=='annokeys')  
        form.setFieldsValue({
          annokeys: keys.filter(key => key !== k),
        });
        if(keytype=='exipkeys')  
        form.setFieldsValue({
          exipkeys: keys.filter(key => key !== k),
        });
    }
    
    add = (keytype) => {   //点击添加按钮执行的方法
        const { form } = this.props; 
        const keys = form.getFieldValue(keytype);
        //给keys数组添加一个值
        const nextKeys = keys.concat(keytype+id++);
        if(keytype=='wlkeys')  
        form.setFieldsValue({
           wlkeys: nextKeys,
        });
        if(keytype=='selkeys')  
        form.setFieldsValue({
          selkeys: nextKeys,
        });
        if(keytype=='portkeys')  
        form.setFieldsValue({
          portkeys: nextKeys,
        }); 
        if(keytype=='labelkeys')  
        form.setFieldsValue({
          labelkeys: nextKeys,
        });
        if(keytype=='annokeys')  
        form.setFieldsValue({
          annokeys: nextKeys,
        });
        if(keytype=='exipkeys')  
        form.setFieldsValue({
          exipkeys: nextKeys,
        });
    }

    handleAdvanced= ()=>{  //是否显示高级选项
        this.setState({
          advanced:!this.state.advanced
        }
        );
    }
    //初始化工作负载 key表单数组
    initWlKeysItem =(keytype,keys)=>{
        const { getFieldDecorator } = this.props.form;
       
        const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
          <Row key={index} gutter={16}>   
          <FormItem
            label={index === 0 ? '选择工作负载' : ''} 
          > <div> 
            {getFieldDecorator(`wlname[${k}]`, {
              //initialValue:'', 因为要配置placeholder，所以不能初始化
              rules: [{
                required: true,
                whitespace: true,
                message: "工作负载不能为空",
              }], 
            })(  
              <Select placeholder={this.props.form.getFieldValue('namespace')===""?'先选择命名空间':''} style={{width:'80%',marginRight:'8%'}}  > 
                    {this.state.selectwldata.map(item=>(
                        <Option key={item.name} value={item.name}>{item.name}</Option>
                        ) 
                    )}
              </Select>   
            )}
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(keytype,k)}
              />
               ) : null}
            </div> 
          </FormItem> 
          </Row>
        ));
        return formItems;
    }
    //初始化外部IP表单数组
    initexipKeysItem =(keytype,keys)=>{
      const { getFieldDecorator } = this.props.form;
     
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}>   
        <FormItem
          label={index === 0 ? '外部IP' : ''} 
        > <div> 
          {getFieldDecorator(`exip[${k}]`, {
            initialValue:'', //因为要配置placeholder，所以不能初始化 
          })(  
            <Input placeholder={'例如: 10.103.240.129'} style={{width:'80%',marginRight:'8%'}}  >       
            </Input>   
          )}
          {keys.length > 0 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(keytype,k)}
            />
             ) : null}
          </div> 
        </FormItem> 
        </Row>
      ));
      return formItems;
    }

    //初始化标签label key表单数组
    initlabelKeysItem =(keytype,keys)=>{
        const { getFieldDecorator } = this.props.form;
       
        const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
          <Row key={index} gutter={16}> 
          <Col span='12'  > 
          <FormItem 
            label={index === 0 ? '键' : ''} 
          >
            {getFieldDecorator(`label[${k}]`, {
              initialValue:'' ,
              rules: [{
                required: true,
                whitespace: true,
                message: "不能为空",
              }],
            })( 
              <Input placeholder="" style={{width:'80%',marginRight:'8%' }}  />   
            )}
             =
          </FormItem>
          </Col>
           
          <Col span='12'  > 
          <FormItem
            label={index === 0 ? '值' : ''} 
          >
            <div> 
            {getFieldDecorator(`value[${k}]`, {
              initialValue:'' 
            })(   
              <Input placeholder="" style={{width:'80%',marginRight:'8%'}}  />    
             )}
            {keys.length > 0 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(keytype,k)}
              />
               ) : null}
              </div> 
          </FormItem>
          </Col> 
          </Row>
        ));
        return formItems;
    }

     //初始化标签selectors key表单数组
    initselKeysItem =(keytype,keys)=>{
      const { getFieldDecorator } = this.props.form;
     
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}> 
        <Col span='12'  > 
        <FormItem 
          label={index === 0 ? '键' : ''} 
        >
          {getFieldDecorator(`selname[${k}]`, {
            initialValue:'' ,
            rules: [{
              required: true,
              whitespace: true,
              message: "不能为空",
            }],
          })( 
            <Input placeholder="" style={{width:'80%',marginRight:'8%' }}  />   
          )}
           =
        </FormItem>
        </Col>
         
        <Col span='12'  > 
        <FormItem
          label={index === 0 ? '值' : ''} 
        >
          <div> 
          {getFieldDecorator(`selvalue[${k}]`, {
            initialValue:'' 
          })(   
            <Input placeholder="" style={{width:'80%',marginRight:'8%'}}  />    
           )}
          {keys.length > 0 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(keytype,k)}
            />
             ) : null}
            </div> 
        </FormItem>
        </Col> 
        </Row>
      ));
      return formItems;
  }
    //初始化端口映射port表单数组
    initPortsItem =(keytype,keys,svctype)=>{
        //console.log('svctype:',svctype)
        const { getFieldDecorator } = this.props.form;
       
        const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
          <Row key={index} gutter={16}>
           <Col span='5'  > 
          <FormItem 
            label={index === 0 ? '端口名称' : ''}  
          >
            {getFieldDecorator(`portname[${k}]`, {
               rules: [{
                required: true, 
                message: "端口名称不能为空",
              }],  
            })( 
              <Input  placeholder='例: http-port'
                style={{width:'90%' }} 
              ></Input > 
            )}  
            
          </FormItem>
          </Col>

          <Col span='5'  > 
          <FormItem 
            label={index === 0 ? '服务端口' : ''}  
          >
            {getFieldDecorator(`svcport[${k}]`, {
              initialValue:0,
               rules: [{
                required: true, 
                message: "不能为空",
                
              },
              {
                pattern:new RegExp('[1-9]\\d*'),
                message:'端口号必须大于0'
              },
              ],  
            })( 
              <InputNumber 
                style={{width:'80%' }}
                min={0}
              ></InputNumber> 
            )}  
            
          </FormItem>
          </Col> 

          <Col span='3'  > 
          <FormItem 
            label={index === 0 ? '协议' : ''}  
          >
            {getFieldDecorator(`porttype[${k}]`, {
               initialValue:"TCP",
               rules: [{
                required: true, 
                message: "不能为空",
              }], 
            })( 
              <Select  style={{width:'100%' }}
              > 
                <Option value='TCP'>TCP</Option>
                <Option value='UDP'>UDP</Option>
              </Select> 
            )}  
            
          </FormItem>
          </Col>
          <Col span={(svctype =='NodePort'  ) ? '5':'10'}  > 
          <FormItem 
            label={index === 0 ? '容器端口' : ''}  
          >
            {getFieldDecorator(`targetport[${k}]`, {
               initialValue:'',   
            })( 
              <InputNumber placeholder='同服务端口'
                style={{width:'80%',marginRight:'8%' }}
                min={0}
              ></InputNumber> 
            )} 
            { (svctype =='NodePort'  ) ? '':  
                (keys.length > 0 ? (
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.remove(keytype,k)}
                  />
                  ) : null ) 
            } 
          </FormItem>
          </Col>
          {  (svctype =='NodePort'  ) ?  
          <Col span='6'  >
          <FormItem
            label={index === 0 ? '主机端口' : ''} 
          >  
            {getFieldDecorator(`nodeport[${k}]`, { 
               initialValue:'',
            })(     
               <InputNumber placeholder='默认随机'
               style={{width:'70%',marginRight:'5%' }}
               min={0}
               ></InputNumber>  
            )}
              {keys.length > 0 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(keytype,k)}
              />
               ) : null}
              
          </FormItem>   
          </Col> 
          : '' 
          }  
          </Row>
        ));
        return formItems;
    }
    
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = { //设置每个控件的名称和组件的大小
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
          },
        }; 
  
      //  getFieldDecorator('wlkeys', { initialValue: ['wlkeysdefault'] });//定义工作负载的key 
        //const wlkeys = getFieldValue('wlkeys'); //获取工作负载的key
       // const wlformItems  = this.initWlKeysItem('wlkeys',wlkeys) //根据key数量设定工作负载表单item
       
        getFieldDecorator('portkeys', { initialValue: [] });//定义port的key 
        const portkeys = getFieldValue('portkeys'); //获取port的key
        const portformItems = this.initPortsItem('portkeys',portkeys,getFieldValue('type')) //根据key数量设定port表单item
       
        getFieldDecorator('labelkeys', { initialValue: [] });//定义label的key 
        const labelkeys = getFieldValue('labelkeys'); //获取label的key
        const labelformItems = this.initlabelKeysItem('labelkeys',labelkeys) //根据key数量设定label表单item
        
        getFieldDecorator('annokeys', { initialValue: [] });//定义annokeys 
        const annokeys = getFieldValue('annokeys'); //获取label的key
        const annoformItems = this.initlabelKeysItem('annokeys',annokeys) //根据key数量设定label表单item
        
        getFieldDecorator('selkeys', { initialValue: [] });//定义label的key 
        const selkeys = getFieldValue('selkeys'); //获取label的key
        const selformItems = this.initselKeysItem('selkeys',selkeys) //根据key数量设定label表单item
        

        getFieldDecorator('exipkeys', { initialValue: [] });//定义label的key 
        const exipkeys = getFieldValue('exipkeys'); //获取label的key
        const exipformItems = this.initexipKeysItem('exipkeys',exipkeys) //根据key数量设定label表单item
  
        const namespaces=this.props.namespaces //根据父组件传来的参数配置命名空间 
        const namespacesdata=namespaces.map( (item)=>(  
          <Option value={item} key={item} >{item}</Option>
          )
        );
        const wwidth='80%' //定义表单中空间宽度
  
       
        return ( 
        <div>   
        <Button type='primary' onClick={this.showModal}><Icon type='plus'/>创建</Button>  
         
        <Modal
              title="创建服务发现"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.hideModal}
              maskClosable={false} 
              destroyOnClose={true}
              width='750px' 
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
               >  {
                getFieldDecorator('name',{ 
                initialValue:'',//初始化  
                 rules:[       //规则数组
                  {
                    required:true,
                    message:'用户名不能为空'
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
                 <Select style={{ width: wwidth }} onChange={this.handleSlectn}> 
                     { namespacesdata
                     }
                 </Select> 
                  )
             } 
            </FormItem> 
            <Collapse defaultActiveKey={['1','2']}  className="collwrap">
                <Panel header="工作负载" key="1" >  
                    <Row gutter={16}> 

                    <Col span='6'> 
                    <FormItem  >
                    <Button type='primary' onClick={()=>this.add('selkeys')}    >
                    <Icon type="plus" />添加工作负载
                    </Button>
                    </FormItem>
                    </Col>

                    <Col span='18'> 
                    {selformItems}
                    </Col> 

                    </Row>
                </Panel>
                <Panel header="端口映射" key="2" > 
                    <Row gutter={16}> 
                    <Col span='12'> 
                     <FormItem label= '类型'  >  
                        {getFieldDecorator('type',{ 
                          initialValue:'ClusterIP'
                        })(
                            <Select  style={{ width: wwidth }}>
                              <Option value={'ClusterIP'}>{'ClusterIP'}</Option>
                              <Option value='Headless' disabled={true}>{'Headless'}</Option> 
                              <Option value='NodePort'>{'NodePort'}</Option> 
                            </Select>
                        )}  
                    </FormItem>
                    </Col>
                    { 
                    (getFieldValue('type')!='headless')?       
                    <Col span='12'> 
                    {
                      exipformItems
                    }     
                    <FormItem   label= {getFieldValue('exipkeys').length===0?'外部IP':''} >
                    <Button type='primary' onClick={()=>this.add('exipkeys')}    >
                    <Icon type="plus" />添加外部ip
                    </Button>
                    </FormItem>
                    </Col>
                    :''
                    }
                    </Row>
                    <Divider/>
                    {
                      portformItems
                    }     
                    <FormItem  >
                    <Button type='primary' onClick={()=>this.add('portkeys')}    >
                    <Icon type="plus" />添加端口
                    </Button>
                    </FormItem>
                </Panel>
                <Panel header="标签" key="3" >
                    {labelformItems}
                    <FormItem  >
                    <Button type='primary' onClick={()=>this.add('labelkeys')}    >
                    <Icon type="plus" />添加标签
                    </Button>
                    </FormItem>
                </Panel>
                <Panel header="注释" key="4" >
                    {annoformItems}
                    <FormItem  >
                    <Button type='primary' onClick={()=>this.add('annokeys')}    >
                    <Icon type="plus" />添加注释
                    </Button>
                    </FormItem>
                </Panel>
            </Collapse>
            
           </Form>

        </Modal>
        </div>
    )}
}

export default Form.create()(CreateSvc); 
function Service(values) {
  var svc=new Object(); 
  const { name,namespace,
          selkeys,
          selvalue,  
          selname,

          type,

          exipkeys,
          exip,

          portkeys,
          portname,
          porttype,
          svcport,
          targetport,
          nodeport,
           

          labelkeys,
          annokeys,
          label,
          value,

           
          } = values;
  svc.name=name;
  svc.namespace=namespace
  svc.type=type        
  var selectors=[]       
  selkeys.map(key=>{
    var sel={
      name:selname[key],
      value:selvalue[key],
    }
    selectors=selectors.concat(sel)
  })
  svc.selectors=selectors

  var target={}
  selectors.map(sel=>{
    target[sel.name]=sel.value
  })
  svc.target=target  
  
  var ports=[]
  portkeys.map(key=>{
    if(type=='NodePort'){
      var p={
        name:portname[key],
        port:svcport[key],
        portocol:porttype[key],
        targetport:targetport[key],
        nodeport:nodeport[key],
      }
    }else{
      var p={
        name:portname[key],
        port:svcport[key],
        portocol:porttype[key],
        targetport:targetport[key],
      }
    }
     
    ports=ports.concat(p)
  }) 
  svc.ports=ports 

  var labels=[]
  labelkeys.map(key=>{
    var l={
      name:label[key],
      value:value[key],
    }
    labels=labels.concat(l)
  }) 
  svc.label=labels

  var annotations=[]
  annokeys.map(key=>{
    var l={
      name:label[key],
      value:value[key],
    }
    annotations=annotations.concat(l)
  })  
  svc.annotations=annotations 

  var exips=[] 
  exipkeys.map(key=>{
    exips=exips.concat(exip[key])
  })
  console.log(exips)
  svc.externalip=exips 
   
  return svc
}