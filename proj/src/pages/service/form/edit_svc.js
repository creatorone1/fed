//部署一个service的表单
import React from 'react'
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu, Divider,
} from 'antd';
import { height } from 'window-size';
import './../service.less' 
let id = 0;
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class CreateSvc extends React.Component {
    /***待完善 原数据初始化的wl的default与默认初始化一个default都包含default
     * wlkeysdefault 无法初始化默认值的问题,
     * 处理：在点击ok的时候赋予一个none值
     */
    state = { 
        visible: false, 
        advanced:false,
        workloaddata:[
            { 
                name:'nginx1',
                namespace:'default'
            },
            { 
                name:'nginx2',
                namespace:'default'
            },
            { 
                name:'nginx3',
                namespace:'default'
            },
            { 
                name:'nginx4',
                namespace:'default'
            },
        ],
        selectwldata:[]
        
    }
    componentWillUnmount(){
      //console.log('CreateSvc destroy')
    }
    componentWillReceiveProps(nextProps){ 
        if(nextProps.editvisible!==this.props.editvisible&&nextProps.editvisible){
            console.log('打开时候深拷贝dataSource') 
            //先把原数据 转换为json字符串 再转化为 对象
            let data=JSON.stringify( nextProps.dataSource)
            //console.log('json:',data)
            //console.log('object:',JSON.parse(data)) 
            this.setState({  
            //这儿 必须是深拷贝，不然会影响传入的值,并且只能初始化这个参数一次，以后的form的set操作不能影响该值
            dataSource:JSON.parse(data), // 
            selectwldata:this.state.workloaddata.filter(item=>item.namespace===nextProps.dataSource.namespace)
            //读取该命名空间下的服务
            ,
            type:nextProps.dataSource.type
            }) 
            //let data1=this.state.workloaddata.filter(item=>item.namespace===nextProps.dataSource.namespace)
            //console.log('data:',data1)
            //console.log('this.state.workloaddata:',this.state.workloaddata)
          }
    }
      
    hideModal = () => { //点击取消按钮
        const { form } = this.props; 
        form.resetFields();  //重置表单
        id=0;
        this.props.handleUpdate(false) 
      }
    handleOk =()=>{ //点击确认按钮
        /*if(this.state.dataSource.workload)
        {   
          //console.log('change')
          this.props.form.setFieldsValue({ //如果之前存在工作负载则不需要默认的
              [`wlname[${'wlkeysdefault'}]`]:'none'
            })
        } */

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
            
            var svc = new Service(values)
            console.log('svc:',JSON.stringify(svc)) 
              
            fetch('http://localhost:9090/api/cluster/'+this.props.currentcluster+'/namespace/'+namespace+'/service/'+name,{
              method:'PUT',
              mode: 'cors', 
              body:JSON.stringify(svc)
              }).then((response) => {
                  console.log('response:',response.ok)
                  return response.json();
              }).then((data) => {
                  console.log('data:',data)
                 //成功了则关闭弹窗且初始化
                 const { form } = this.props; 
                 form.resetFields();  //重置表单
                 id=0;
                 this.props.handleUpdate(false) 
                 this.props.statechange()//更新成功刷新数据
                  return data;
              }).catch( (e)=>{ 

                   //成功了则关闭弹窗且初始化
                    const { form } = this.props; 
                    form.resetFields();  //重置表单
                    id=0;
                    this.props.handleUpdate(false) 
                   //通知父节点关闭弹窗 
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
        //form.resetFields('wlkeys') //重置工作负载选项
        //form.resetFields(`wlname[${'wlkeysdefault'}]`)
        //给工作负载选择组件中配置合适的 option 选项
   //  this.setState({
     //       selectwldata:this.state.workloaddata.filter(item=>item.namespace===value)
      //  }) 
    }   
    remove = (keytype,k) => { //移除
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue(keytype);
         
    
        // 移除keys数组的一个值
        if(keytype=='wlkeys') {
          //console.log('wlkeys',k)
          form.setFieldsValue({
            wlkeys: keys.filter(key => key !== k),
          });
          if(k.indexOf('default')!==-1){
            const wlname=form.getFieldValue(`wlname[${k}]`)
            var data=this.state.dataSource
            data.workload=data.workload.filter(item=>item!=wlname)
            console.log('remove data',data)
          }  
        }  
        if(keytype=='selkeys') {
          //console.log('wlkeys',k)
          form.setFieldsValue({
            selkeys: keys.filter(key => key !== k),
          });
          if(k.indexOf('default')!==-1){
            const name=form.getFieldValue(`selname[${k}]`)
            const value=form.getFieldValue(`selvalue[${k}]`)
            var data=this.state.dataSource
            data.selectors=data.selectors.filter(item=>{
              if(item.value==value&&item.name==name)
                {return false}
                else{
                  return true
                }
            } )
            
             
            console.log('remove data',data)
          }  
        }
        if(keytype=='portkeys'){
          form.setFieldsValue({
            portkeys: keys.filter(key => key !== k),
          });
          if(k.indexOf('default')!==-1){
            const portname=form.getFieldValue(`portname[${k}]`)
            var data=this.state.dataSource
            data.ports=data.ports.filter(item=>item.name!==portname)
            console.log('remove data',data)
          }  
        }   
        if(keytype=='labelkeys'){
          //console.log('labelkeys',k)
          form.setFieldsValue({
            labelkeys: keys.filter(key => key !== k),
          });
          if(k.indexOf('default')!==-1){
            const labelname=form.getFieldValue(`label[${k}]`)
            var data=this.state.dataSource
            data.label=data.label.filter(item=>item.name!==labelname)
            console.log('remove data',data)
          }  
        }  
        
        if(keytype=='exipkeys'){
          //console.log('exipkeys',k)
          form.setFieldsValue({
            exipkeys: keys.filter(key => key !== k),
          });
          if(k.indexOf('default')!==-1){
            const exip=form.getFieldValue(`exip[${k}]`)
            var data=this.state.dataSource
            data.externalip=data.externalip.filter(item=>item!==exip)
            console.log('remove data',data)
          }  
        }      
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
        if(keytype=='exipkeys')  
        form.setFieldsValue({
          exipkeys: nextKeys,
        });
    }
 
    //初始化工作负载 key表单数组
    initWlKeysItem =(keytype,keys,dataSource,wllength)=>{
        const { getFieldDecorator } = this.props.form;
       
        const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
          <Row key={index} gutter={16}>   
          <FormItem
            label={index === 0 ? '选择工作负载' : ''} 
          > <div> 
            {getFieldDecorator(`wlname[${k}]`, {
              initialValue:index<wllength?dataSource.workload[index]:undefined, //因为要配置placeholder，所以不能初始化
              rules: [{
                required: true, 
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
    initexipKeysItem =(keytype,keys,dataSource,exiplength)=>{
      const { getFieldDecorator } = this.props.form;
     
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}>   
        <FormItem
          label={index === 0 ? '外部IP' : ''} 
        > <div> 
          {getFieldDecorator(`exip[${k}]`, {
            initialValue:index<exiplength?dataSource.externalip[index]:'', //因为要配置placeholder，所以不能初始化 
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

    //初始化标签selectors key表单数组
    initselKeysItem =(keytype,keys,dataSource,sellength)=>{
        const { getFieldDecorator } = this.props.form;
       
        const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
          <Row key={index} gutter={16}> 
          <Col span='12'  > 
          <FormItem 
            label={index === 0 ? '键' : ''} 
          >
            {getFieldDecorator(`selname[${k}]`, {
              initialValue:index<sellength?dataSource.selectors[index].name:'',
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
              initialValue:index<sellength?dataSource.selectors[index].value:'', 
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
    //初始化标签label key表单数组
    initlabelKeysItem =(keytype,keys,dataSource,labellength)=>{
      const { getFieldDecorator } = this.props.form;
     
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}> 
        <Col span='12'  > 
        <FormItem 
          label={index === 0 ? '键' : ''} 
        >
          {getFieldDecorator(`label[${k}]`, {
            initialValue:index<labellength?dataSource.label[index].name:'',
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
            initialValue:index<labellength?dataSource.label[index].value:'', 
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
    initPortsItem =(keytype,keys,svctype,dataSource,portlength)=>{
        //console.log('svctype:',svctype)
        const { getFieldDecorator } = this.props.form;
       
        const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
          <Row key={index} gutter={16}>
           <Col span='5'  > 
          <FormItem 
            label={index === 0 ? '端口名称' : ''}  
          >
            {getFieldDecorator(`portname[${k}]`, {
              initialValue:index<portlength?dataSource.ports[index].name:'',
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
               initialValue:index<portlength?dataSource.ports[index].port:0,
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
               initialValue:index<portlength?dataSource.ports[index].protocol:'TCP',
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
               initialValue:index<portlength?dataSource.ports[index].targetport:'',
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
               initialValue:index<portlength?dataSource.ports[index].nodeport:'',
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
    handleSelecttype =(value)=>{
      this.setState({
        type:value
      })
      console.log('value',value)
       
    }
    render() {
        var dataSource=this.state.dataSource
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
        /*let wl,wllength;
        if(dataSource){ //读取默认的环境变量env值
            wl=dataSource.workload
            }
          
        if(wl){//如果存在env变量则添加默认值
                this.props.form.getFieldDecorator('wlkeys', { initialValue: wl.map((item,index)=>'defaultwlkeys'+index) });//定义环境变量的key
                wllength=wl.length;
        }else{
                this.props.form.getFieldDecorator('wlkeys', { initialValue: ['wlkeysdefault'] });//定义环境变量的key
                wllength=0
        }
        const wlkeys = getFieldValue('wlkeys'); //获取port的key
        const wlformItems  = this.initWlKeysItem('wlkeys',wlkeys,dataSource,wllength) //根据key数量设定port表单item
        */
        let port,portlength,type;
        if(dataSource){ //读取默认的环境变量env值
          port=dataSource.ports
         // type=getFieldValue('type')?getFieldValue('type'):dataSource.type
         type=this.state.type
        } 
        if(port){//如果存在env变量则添加默认值
                this.props.form.getFieldDecorator('portkeys', { initialValue: port.map((item,index)=>'defaultportkeys'+index) });//定义port的key 
                portlength=port.length;
                
        }else{
                this.props.form.getFieldDecorator('portkeys', { initialValue: [] });//定义port的key 
                portlength=0
        } 
        const portkeys = getFieldValue('portkeys'); //获取port的key
        const portformItems = this.initPortsItem('portkeys',portkeys,type,dataSource,portlength) //根据key数量设定port表单item
       
        let label,labellength;
        if(dataSource){ //读取默认的环境变量env值
              label=dataSource.label
        }
        if(label){//如果存在env变量则添加默认值
                this.props.form.getFieldDecorator('labelkeys', { initialValue: label.map((item,index)=>'defaultlabelkeys'+index) });//定义环境变量的key
                labellength=label.length;
        }else{
                this.props.form.getFieldDecorator('labelkeys', { initialValue: [] });//定义label的key
                labellength=0
        }
        const labelkeys = getFieldValue('labelkeys'); //获取label的key
        const labelformItems = this.initlabelKeysItem('labelkeys',labelkeys,dataSource,labellength) //根据key数量设定label表单item
        
        let sel,sellength;
        if(dataSource){ //读取默认的环境变量env值
          sel=dataSource.selectors
        }
        if(sel){//如果存在env变量则添加默认值
                this.props.form.getFieldDecorator('selkeys', { initialValue: sel.map((item,index)=>'defaultselkeys'+index) });//定义selectors变量的key
                sellength=sel.length;
        }else{
                this.props.form.getFieldDecorator('selkeys', { initialValue: [] });//定义label的key
                labellength=0
        }
        const selkeys = getFieldValue('selkeys'); //获取label的key
        const selformItems = this.initselKeysItem('selkeys',selkeys,dataSource,sellength) //根据key数量设定label表单item
        

        let exip,exiplength;
        if(dataSource){ //读取默认的环境变量env值
          exip=dataSource.externalip
        }
        if(exip){//如果存在env变量则添加默认值
                this.props.form.getFieldDecorator('exipkeys', { initialValue: exip.map((item,index)=>'defaultexipkeys'+index) });//定义环境变量的key
                exiplength=exip.length;
        }else{
                this.props.form.getFieldDecorator('exipkeys', { initialValue: [] });//定义label的key
                exiplength=0
        }
        const exipkeys = getFieldValue('exipkeys'); 
        const exipformItems = this.initexipKeysItem('exipkeys',exipkeys,dataSource,exiplength) 
  
        const namespaces=this.props.namespaces //根据父组件传来的参数配置命名空间 
        const namespacesdata=namespaces.map( (item)=>(  
          <Option value={item} key={item} >{item}</Option>
          )
        );
        const wwidth='80%' //定义表单中空间宽度
  
       
        return ( 
        <div>   
        {dataSource?   
        <Modal
              title="创建服务发现"
              visible={this.props.editvisible}
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
                initialValue:dataSource.name,//初始化  
                  
                }) (
                  <Input style={{ width: wwidth,display:'none' }}/> 
                 )
              }
              <span style={{ width: wwidth }}>{dataSource.name}</span> 
            </FormItem>
            <FormItem   label= '命名空间'  
             {...formItemLayout}
            > 
             {
               getFieldDecorator('namespace',{ 
               initialValue:dataSource.namespace,//初始化  
                
               }) (
                <Input style={{ width: wwidth,display:'none' }}/> 
                  )
             } 
             <span style={{ width: wwidth }}>{dataSource.namespace}</span> 
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
                          initialValue:dataSource.type
                        })(
                            <Select  style={{ width: wwidth }} onSelect={this.handleSelecttype}>
                              <Option value={'ClusterIP'}>{'ClusterIP'}</Option>
                              <Option value='Headless' disabled={true}>{'Headless'}</Option> 
                              <Option value='NodePort'>{'NodePort'}</Option> 
                            </Select>
                        )}  
                         
                    </FormItem>
                    </Col>
                    { 
                    (getFieldValue('type')!=='headless')?       
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
            </Collapse>
            
           </Form>

        </Modal>
        :''} 
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
    
  var exips=[] 
  exipkeys.map(key=>{
    exips=exips.concat[exip[key]]
  })
  svc.externalip=exips 
   
  return svc
}