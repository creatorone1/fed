//部署一个工作负载的表单
import React from 'react'
//import {Modal,message,Badge,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, }from 'antd'
 
import {
    Modal,Form,Radio, Input, Icon, Button,InputNumber ,Collapse , Select,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
import { height } from 'window-size';
import './../service.less' 

let id = 0;
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class ConfigWL extends React.Component {
    state = { 
        visible: false, 
        advanced:false, 
        schedule:'',
        dataSource:undefined,
        /***从后台获取configmap */
        configmap:[{
            name:'nginx1',
            status:'running',
            namespace:'default',
            image:'nginx:v1.0',
            createtime:"2019-4-5", 
            node:'node2', 
            podsnum:[6,6] ,
            key:'1',
            revision:1,
            env:[{
                    name:'a',
                    value:'b'

                 },{
                    name:'c',
                    value:'d'

                 },
            ],  
            label:[{
                name:'label1',
                value:'value1'

             },{
                name:'label2',
                value:'value2'

             },
            ],
            ports:[{
                containerPort:80,
                protocol:'TCP'
            },{
                containerPort:81,
                protocol:'UDP'
            },],
            schedule:'LABEL',
            clustermatch:[{
                label:'a',
                op:'In',
                value:'b'
            },{
                label:'b',
                op:'NotIn',
                value:'c'
            },],
            nodematch:[{
                label:'e',
                op:'In',
                value:'f'
            },{
                label:'g',
                op:'In',
                value:'h'
            },],
            request:{
                cpurequst:100,
                memoryrequst:96
            },
            limit:{
                cpulimit:200,
                memorylimit:128
            }
                 
            
        },
        {
            name:'nginx2',
            status:'pause',
            namespace:'default',
            image:'nginx:v2.0',
            createtime:"2019-4-5", 
            node:'node2', 
            podsnum:[2,2],
            key:'2',
            revision:2,
            env:[{
                name:'e',
                value:'f'

             },{
                name:'g',
                value:'h'

             },
            ],
            schedule:'LABEL',
            nodematch:[{
                label:'ee',
                op:'NotIn',
                value:'ff'
            },{
                label:'gg',
                op:'In',
                value:'hh'
            },],
             ports:[{
                containerPort:90,
                protocol:'TCP'
                },{
                    containerPort:91,
                    protocol:'UDP'
                },]
        },
        {
            name:'nginx3',
            status:'waiting',
            namespace:'default',
            image:'nginx:v3.0',
            createtime:"2019-4-10", 
            node:'node2', 
            podsnum:[2,3],
            key:'3',
            revision:3,
            schnodename:'node2',
            schedule:'NODE',
            env:[{
                name:'w',
                value:'v'

             },{
                name:'u',
                value:'x'

             },
            ],
             ports:[{
                containerPort:30,
                protocol:'UDP'
                },{
                    containerPort:31,
                    protocol:'UDP'
                },]
        },
        {
            name:'nginx4',
            status:'running',
            namespace:'default',
            image:'nginx:v4.0',
            createtime:"2019-4-11", 
            node:'node2', 
            podsnum:[4,4],
            key:'4',
            revision:2,
            env:[{
                name:'q',
                value:'a'

             },{
                name:'j',
                value:'k'

             },
            ],
             ports:[{
                containerPort:40,
                protocol:'TCP'
                },{
                    containerPort:41,
                    protocol:'TCP'
                },]
        },
        ] ,
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
   
        //只在每次打开 modal 的时候调用 数据 更新操作 , 
        //避免表单属性发生变化时，重新调拷贝数据
        
        //console.log('nextProps:',  nextProps) 
        //console.log('nextProps.dataSource:', nextProps.dataSource) 
    }
  
    showModal = () => {
        const { form } = this.props;
        form.resetFields(); 
        id=0;
        this.setState({
          visible: true, 
          advanced:false,
          schedule:'',
          dataSource:undefined,
        }); 
       
      }
 
  
 
    hideModal = () => { //点击取消按钮
        const { form } = this.props; 
        form.resetFields();  //重置表单
        id=0;
        this.setState({
          visible: false, 
          advanced:false,
          schedule:'',
          dataSource:undefined,
        });
      }

    handleOk =()=>{ //点击确认按钮
     
      this.props.form.validateFields((err, values) => {
        if (!err) {   //如果没有错则传输数据 
          console.log(' values  : ', values); 
           //keys表示env名字env_label与值value的key
          //labelkeys表示label名字env_label与值value的key
          //portkeys表示portnum与porttype的key
          const { name,podsnum,image,namespace,
            keys,labelkeys,portkeys,env_label,value
            , portnum, porttype,
            cpurequst,cpulimit,memoryrequst,memorylimit,gpurequst,
            nodename
            } = values;  
          console.log('env_label name :', keys.map(key => env_label[key]));
          
          //成功了则关闭弹窗且初始化
          const { form } = this.props; 
          form.resetFields();  //重置表单
          id=0;
          this.setState({
            visible: false, 
            advanced:false,
            schedule:''
            //dataSource:undefined
          });
          //通知父节点关闭弹窗
        }
        else{ //否则报错 
          const { name,podsnum,image, 
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
    
   

    remove = (keytype,k) => { //移除
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue(keytype);
      const env_label=form.getFieldValue('env_label');
      const portnum=form.getFieldValue('portnum');
      const matchlabel=form.getFieldValue('matchlabel');

      // 移除keys数组的一个值
      if(keytype=='keys'){   
        form.setFieldsValue({
          keys: keys.filter(key => key !== k), 
        }); 
        if(k.indexOf('default')!==-1){ //如果是默认env则记得删除默认env
          /***待修改 解决浅拷贝问题
           * 已解决，在每次打开modal的时候初始化数据，
           */
          let data=this.state.dataSource   
          //state中的dataSource也发生了变化，符合要求，不用在setState来改变
          data.env=data.env.filter(item=>item.name!==env_label[k]) 
          //console.log('data in remove:',data) 
           
        }
       
      }  
      if(keytype=='portkeys'){  //如果是默认端口则记得删除默认端口
        form.setFieldsValue({
          portkeys: keys.filter(key => key !== k),
        });
        if(k.indexOf('default')!==-1){ //如果是默认port则记得删除默认port
          let data=this.state.dataSource  
          data.ports=data.ports.filter(item=>item.containerPort!==portnum[k]) 
          //console.log('data in remove:',data)  
        }
      }

      if(keytype=='labelkeys') { //如果是默认label则记得删除默认端口label
      form.setFieldsValue({
        labelkeys: keys.filter(key => key !== k),
      });
      if(k.indexOf('default')!==-1){ //如果是默认label则记得删除默认label
         let data=this.state.dataSource   
         //state中的dataSource也发生了变化，符合要求，不用在setState来改变
         data.label=data.label.filter(item=>item.name!==env_label[k]) 
         //console.log('data in remove:',data)  
       }
       
      }

      if(keytype=='clustermatchkeys') { //如果是默认clustematch则记得删除默认端口label
        form.setFieldsValue({
          clustermatchkeys: keys.filter(key => key !== k),
        });
        if(k.indexOf('default')!==-1){ //如果是默认label则记得删除默认label
           let data=this.state.dataSource   
           //state中的dataSource也发生了变化，符合要求，不用在setState来改变
           data.clustermatch=data.clustermatch.filter(item=>item.label!==matchlabel[k]) 
           //console.log('data in remove:',data)  
         } 
      }

      if(keytype=='nodematchkeys') { //如果是默认label则记得删除默认端口label
        form.setFieldsValue({
          nodematchkeys: keys.filter(key => key !== k),
        });
        if(k.indexOf('default')!==-1){ //如果是默认label则记得删除默认label
           let data=this.state.dataSource   
           //state中的dataSource也发生了变化，符合要求，不用在setState来改变
           data.nodematch=data.nodematch.filter(item=>item.label!==matchlabel[k]) 
           //console.log('data in remove:',data)  
         } 
      }

    }
  
    add = (keytype) => {   //点击添加按钮执行的方法
      const { form } = this.props; 
      const keys = form.getFieldValue(keytype);
      //给keys数组添加一个值
      const nextKeys = keys.concat(keytype+id++);
      if(keytype=='keys')  
      form.setFieldsValue({
        keys: nextKeys,
      });
      if(keytype=='portkeys')  
      form.setFieldsValue({
        portkeys: nextKeys,
      });
      if(keytype=='labelkeys')  
      form.setFieldsValue({
        labelkeys: nextKeys,
      });
      if(keytype=='clustermatchkeys')  
      form.setFieldsValue({
        clustermatchkeys: nextKeys,
      });
      if(keytype=='nodematchkeys')  
      form.setFieldsValue({
        nodematchkeys: nextKeys,
      });
    }
   

    handleAdvanced= ()=>{  //是否显示高级选项
      this.setState({
        advanced:!this.state.advanced
      }
      );
    }
    //初始化环境变量env key表单数组
    initKeysEnvItem =(keytype,keys,dataSource,envlength)=>{
      const { getFieldDecorator } = this.props.form;
      //console.log(envlength)
      //console.log(dataSource)
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}> 
        <Col span='12'  > 
        <FormItem 
          label={index === 0 ? '变量' : ''} 
        >
          {getFieldDecorator(`env_label[${k}]`, {
              initialValue:index<envlength?dataSource.env[index].name:'' ,
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
              initialValue:index<envlength?dataSource.env[index].value:'' 
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

    //初始化label变量key表单数组
    initKeysLabelItem =(keytype,keys,dataSource,lablength)=>{
      const { getFieldDecorator } = this.props.form;
      //console.log(envlength)
      //console.log(dataSource)
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}> 
        <Col span='12'  > 
        <FormItem 
          label={index === 0 ? '变量' : ''} 
        >
          {getFieldDecorator(`env_label[${k}]`, {
              initialValue:index<lablength?dataSource.label[index].name:'' ,
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
              initialValue:index<lablength?dataSource.label[index].value:'' 
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
    initPortsItem =(keytype,keys,dataSource,envlength)=>{
      const { getFieldDecorator } = this.props.form;
     
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}> 
        <Col span='12'  > 
        <FormItem 
          label={index === 0 ? '容器端口' : ''}  
        >
          {getFieldDecorator(`portnum[${k}]`, {
             initialValue:index<envlength?dataSource.ports[index].containerPort:'' ,
             rules: [{
              required: true, 
              message: "不能为空",
            }],  
          })( 
            <InputNumber 
              style={{width:'80%',marginRight:'8%' }}
              min={0}
            ></InputNumber> 
          )}  
          
        </FormItem>
        </Col> 
        <Col span='12'  >
        <FormItem
          label={index === 0 ? '协议' : ''} 
        >  
          {getFieldDecorator(`porttype[${k}]`, { 
             initialValue:index<envlength?dataSource.ports[index].protocol:'TCP' ,
             rules: [{
              required: true, 
              message: "不能为空",
            }],
          })(     
             <Select    style={{width:'80%',marginRight:'8%'}} > 
              <Option value="TCP" key="TCP">{'TCP'}</Option>
              <Option value="UDP" key="UDP">{'UDP'}</Option>  
             </Select>  
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
        </Row>
      ));
      return formItems;
    }
     //初始化标签匹配规则match表单数组
    initClusterMatchKeysItem =(keytype,keys,dataSource,matchlength)=>{
      const { getFieldDecorator } = this.props.form;
     
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}> 
        <Col span='8'  > 
        <FormItem 
          label={index === 0 ? '标签' : ''} 
        >
          {getFieldDecorator(`matchlabel[${k}]`, {
              initialValue:index<matchlength?dataSource.clustermatch[index].label:'' ,
              rules: [{
                required: true,
                whitespace: true,
                message: "不能为空",
              }],
            })( 
              <Input placeholder=""    />   
            )} 
        </FormItem>
        </Col>

        <Col span='4'  > 
        <FormItem 
          label={index === 0 ? '操作符' : ''} 
        >
          {getFieldDecorator(`matchop[${k}]`, {
               initialValue:index<matchlength?dataSource.clustermatch[index].op:'' ,
              rules: [{
                required: true,
                whitespace: true,
                message: "不能为空",
              }],
            })( 
              <Select    style={{}} > 
                <Option value="In" key="In">{'='}</Option>
                <Option value="NotIn" key="NotIn">{'≠'}</Option>  
             </Select>   
            )}
            
        </FormItem>
        </Col>

        <Col span='12'  > 
        <FormItem
            label={index === 0 ? '值' : ''} 
          >
            <div> 
            {getFieldDecorator(`matchvalue[${k}]`, {
               initialValue:index<matchlength?dataSource.clustermatch[index].value:'' ,
              rules: [{
                required: true,
                whitespace: true,
                message: "不能为空",
              }],
            })(   
              <Input placeholder="" style={{width:'70%',marginRight:'8%'}}  />    
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

    initNodeMatchKeysItem =(keytype,keys,dataSource,matchlength)=>{
      const { getFieldDecorator } = this.props.form;
     
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}> 
        <Col span='8'  > 
        <FormItem 
          label={index === 0 ? '标签' : ''} 
        >
          {getFieldDecorator(`matchlabel[${k}]`, {
              initialValue:index<matchlength?dataSource.nodematch[index].label:'' ,
              rules: [{
                required: true,
                whitespace: true,
                message: "不能为空",
              }],
            })( 
              <Input placeholder=""    />   
            )} 
        </FormItem>
        </Col>

        <Col span='4'  > 
        <FormItem 
          label={index === 0 ? '操作符' : ''} 
        >
          {getFieldDecorator(`matchop[${k}]`, {
               initialValue:index<matchlength?dataSource.nodematch[index].op:'' ,
              rules: [{
                required: true,
                whitespace: true,
                message: "不能为空",
              }],
            })( 
              <Select    style={{}} > 
                <Option value="In" key="In">{'='}</Option>
                <Option value="NotIn" key="NotIn">{'≠'}</Option>  
             </Select>   
            )}
            
        </FormItem>
        </Col>

        <Col span='12'  > 
        <FormItem
            label={index === 0 ? '值' : ''} 
          >
            <div> 
            {getFieldDecorator(`matchvalue[${k}]`, {
               initialValue:index<matchlength?dataSource.nodematch[index].value:'' ,
              rules: [{
                required: true,
                whitespace: true,
                message: "不能为空",
              }],
            })(   
              <Input placeholder="" style={{width:'70%',marginRight:'8%'}}  />    
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
    handleScheduleChange =(e)=>{
        this.setState({
          schedule:e.target.value
      })

      if(e.target.value=='NODE'){
           this.props.form.resetFields('nodename')
      }else{
        this.props.form.resetFields('clustermatchkeys')
        this.props.form.resetFields('nodematchkeys')
      }
    } 

    handleConfigChange=(value)=>{
        console.log('value',value)
        
        
        var data=this.state.configmap.filter(item=>item.name==value)
        let datastring=JSON.stringify(data[0])
        let datacopy=JSON.parse(datastring)
        console.log('data',data)
        this.setState({  
        //这儿 必须是深拷贝，不然会影响传入的值,并且只能初始化这个参数一次，以后的form的set操作不能影响该值
        dataSource:datacopy, //
        schedule:datacopy.schedule
        }) 
        this.props.form.resetFields()
        this.props.form.setFieldsValue({
          name:datacopy.name,
          schedule:datacopy.schedule,
          podsnum:datacopy.podsnum[1],
          image:datacopy.image,
          namespace:datacopy.namespace,
        })
    }
    render() {  
      //console.log(' render dataSource:',this.state.dataSource )
      var dataSource=this.state.dataSource 
      let  cpurequst,memoryrequst,gpurequst,cpulimit,memorylimit=undefined
      var podsnum

      if(dataSource){ //不为空再获取dataSource的属性值
        if(dataSource.request)//request不空
        {
          cpurequst=dataSource.request.cpurequst  
          memoryrequst= dataSource.request.memoryrequst
          gpurequst= dataSource.request.gpurequst 
        }
        if(dataSource.limit)//limit不空
        {
          cpulimit= dataSource.limit.cpulimit
          memorylimit= dataSource.limit.memorylimit 
        }
        podsnum=dataSource.podsnum[1]
      }
      
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
    
      let env
      if(dataSource){ //读取默认的环境变量env值 
            env=dataSource.env
      }   
      let envlength=0 
      if(env){//如果存在env变量则添加默认值 
            this.props.form.getFieldDecorator('keys', { initialValue: env.map((item,index)=>'defaultkeys'+index) });//定义环境变量的key
            //this.add('keys')  //修改了props 导致无线调用 死循环
            envlength=env.length; 
      }else{
          this.props.form.getFieldDecorator('keys', { initialValue: [] });//定义环境变量的key
      }
      const keys = getFieldValue('keys'); //获取环境变量的key
      const formItems = this.initKeysEnvItem('keys',keys,dataSource,envlength) //根据key数量设定环境变量表单item
      

      let ports
      if(dataSource){ //读取默认的环境变量env值 
          ports=dataSource.ports
      }   
      let portslength=0 
      if(ports){//如果存在env变量则添加默认值 
            this.props.form.getFieldDecorator('portkeys', { initialValue: ports.map((item,index)=>'defaultportkeys'+index) });//定义环境变量的key
            //this.add('keys')  //修改了props 导致无线调用 死循环
            portslength=ports.length; 
      }else{
          this.props.form.getFieldDecorator('portkeys', { initialValue: [] });//定义环境变量的key
      }
      //getFieldDecorator('portkeys', { initialValue: [] });//定义port的key 
      const portkeys = getFieldValue('portkeys'); //获取port的key
      const portformItems = this.initPortsItem('portkeys',portkeys,dataSource,portslength) //根据key数量设定port表单item
     
      let label
      if(dataSource){ //读取默认的环境变量env值 
          label=dataSource.label
      }   
      let lablength=0 
      if(label){//如果存在env变量则添加默认值 
            this.props.form.getFieldDecorator('labelkeys', { initialValue: label.map((item,index)=>'defaultlabelkeys'+index) });//定义环境变量的key
            //this.add('keys')  //修改了props 导致无线调用 死循环
            lablength=label.length; 
      }else{
          this.props.form.getFieldDecorator('labelkeys', { initialValue: [] });//定义环境变量的key
      } 
      //getFieldDecorator('labelkeys', { initialValue: [] });//定义label的key 
      const labelkeys = getFieldValue('labelkeys'); //获取label的key
      const labelformItems = this.initKeysLabelItem('labelkeys',labelkeys,dataSource,lablength) //根据key数量设定label表单item

      let clustermatch
      if(dataSource){ //读取默认的环境变量env值 
        clustermatch=dataSource.clustermatch
      }   
      let clustermatchlength=0 
      if(clustermatch){//如果存在env变量则添加默认值 
            this.props.form.getFieldDecorator('clustermatchkeys', { initialValue: clustermatch.map((item,index)=>'defaultclustermatchkeys'+index) });//定义环境变量的key
            //this.add('keys')  //修改了props 导致无线调用 死循环
            clustermatchlength=clustermatch.length; 
      }else{
          this.props.form.getFieldDecorator('clustermatchkeys', { initialValue: [] });//定义环境变量的key
      } 
      //getFieldDecorator('labelkeys', { initialValue: [] });//定义label的key 
      const clustermatchkeys = getFieldValue('clustermatchkeys'); //获取label的key
      const clustermatchformItems = this.initClusterMatchKeysItem('clustermatchkeys',clustermatchkeys,dataSource,clustermatchlength) //根据key数量设定label表单item

      let nodematch
      if(dataSource){ //读取默认的环境变量env值 
        nodematch=dataSource.nodematch
      }   
      let nodematchlength=0 
      if(nodematch){//如果存在env变量则添加默认值 
            this.props.form.getFieldDecorator('nodematchkeys', { initialValue: nodematch.map((item,index)=>'defaultnodematchkeys'+index) });//定义环境变量的key
            //this.add('keys')  //修改了props 导致无线调用 死循环
            nodematchlength=nodematch.length; 
      }else{
          this.props.form.getFieldDecorator('nodematchkeys', { initialValue: [] });//定义环境变量的key
      } 
      //getFieldDecorator('labelkeys', { initialValue: [] });//定义label的key 
      const nodematchkeys = getFieldValue('nodematchkeys'); //获取label的key
      const nodematchformItems = this.initNodeMatchKeysItem('nodematchkeys',nodematchkeys,dataSource,nodematchlength) //根据key数量设定label表单item

      const currentcluster=this.props.currentcluster
      


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
      const  configdata =this.state.configmap.map((item)=>(  
        <Option value={item.name} key={item.name} >{item.name}</Option>
        )
      )

     const radioStyle = {
          display: 'block',
          height: '40px',
          lineHeight: '40px',
          marginLeft:10
          
      };
      

      return (
        <div>  
        <Button type='primary' onClick={this.showModal}><Icon type='tool'/>一键配置</Button>  
      
          
        <Modal
          title="创建工作负载"
          visible={this.state.visible} 
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
           
           <FormItem   label= '配置文件'  
             {...formItemLayout}
           > 
            {
               getFieldDecorator('configname',{ 
                rules:[       //规则数组
                    {
                      required:true, 
                      message:'请选择模板服务'
                    },   
                   ]
               }) (
                 <Select style={{ width: wwidth }} onChange={this.handleConfigChange}> 
                    {configdata}
                 </Select>
                  )
             } 
           </FormItem>

           <FormItem   label= '名称'  
             {...formItemLayout}
           > 
            {
               getFieldDecorator('name',{ 
               initialValue:dataSource!==undefined?dataSource.name:'',//初始化
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
           <FormItem   label= '实例个数'  
             {...formItemLayout}
           > 
           <div style={{   lineHeight:'100%', backgroundColor:'#d9d9d9',width: wwidth  }}> 
             {
               getFieldDecorator('podsnum',{
                initialValue:podsnum,  
                rules:[       //规则数组
                 {
                   required:true, 
                   message:'实例个数不能为空'
                 },   
                ] 
               }) (
                  <InputNumber style={{ width: '90%' ,marginRight:'5px' }} 
                    min={1}
                     />       
                )
             } 
              个 </div>
           </FormItem>

           <FormItem   label= '镜像'  
             {...formItemLayout}
           > 
            
             {
               getFieldDecorator('image',{ 
               initialValue:dataSource?dataSource.image:'',//初始化  
                rules:[       //规则数组
                 {
                   required:true,
                   message:'镜像不能为空'
                 },   
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
               initialValue:dataSource?dataSource.namespace:'',//初始化   
               rules:[       //规则数组
                {
                  required:true,
                  message:'命名空间不能为空'
                },   
               ]
               }) (
                    <Select style={{ width: wwidth }}> 
                    { 
                        namespacesdata
                    }
                    </Select> 
                  )
             }   
           </FormItem>  

           <FormItem    
             {...formItemLayout}
             style={{           //靠右显示高级按钮
               textAlign:"right"
             }}
           >  
               <Button  onClick={this.handleAdvanced} type={this.state.advanced?'primary':''} >高级选项</Button>
              
           </FormItem> 
          
           {
             this.state.advanced? ( //控制是否显示高级选项
               <div   >
                <Collapse defaultActiveKey={['1']}  className="collwrap">
                  <Panel header="环境变量" key="1" >  
                   <Row   >
                    { //环境变量数组
                      formItems 
                    } 
                   </Row> 
                  <FormItem  >
                   <Button type='primary' onClick={()=>this.add('keys')}    >
                   <Icon type="plus" />添加变量
                   </Button>
                   </FormItem>  
                  </Panel>

                  <Panel header="端口映射" key="2" >
                    { //端口映射数组
                      portformItems
                    } 
                    <FormItem  >
                    <Button type='primary' onClick={()=>this.add('portkeys')}    >
                    <Icon type="plus" />添加端口
                    </Button>
                    </FormItem>  
                  </Panel> 

                  <Panel header="标签" key="3">
                    { //标签数组
                      labelformItems
                    } 
                    <FormItem  >
                    <Button type='primary' onClick={()=>this.add('labelkeys')}    >
                    <Icon type="plus" />添加标签
                    </Button>
                    </FormItem> 
                  </Panel>

                  <Panel header="资源配置" key="4" >
                    <Row   gutter={10}> 
                      <Col span='12'  > 
                      <FormItem 
                        label='CPU'
                        labelCol={{span:'8'}} 
                        wrapperCol={{span:'16'}}
                      >
                       <div style={{  lineHeight:'100%', backgroundColor:'#d9d9d9'  }}>
                        {getFieldDecorator('cpurequst', { 
                            initialValue:cpurequst?cpurequst:undefined
                        })(
                           <InputNumber style={{ width: '50%' ,marginRight:'5px' }} 
                             min={0}  
                          /> 
                        )}
                        milli CPUs</div>
                      </FormItem>
                      </Col> 
                      <Col span='12'  >  
                      <FormItem
                        label={'限制'} 
                        labelCol={{span:'6'}}
                        wrapperCol={{span:'18'}}
                      >  
                        <div style={{  lineHeight:'100%', backgroundColor:'#d9d9d9'  }}>
                        {getFieldDecorator('cpulimit' , {
                            initialValue:cpulimit?cpulimit:undefined
                        })(     
                          <InputNumber style={{ width: '55%' ,marginRight:'5px' }}
                          min={0}  
                          />             
                        )} 
                        milli CPUs</div> 
                      </FormItem> 
                      </Col>   
                      </Row> 
                      
                      <Row   gutter={10}> 
                      <Col span='12'  > 
                      <FormItem 
                        label='Memory'
                        labelCol={{span:'8'}} 
                        wrapperCol={{span:'16'}}
                      >
                       <div style={{  lineHeight:'100%', backgroundColor:'#d9d9d9'  }}>
                        {getFieldDecorator('memoryrequst', { 
                            initialValue:memoryrequst?memoryrequst:undefined
                        })(
                          <InputNumber style={{ width: '70%' ,marginRight:'5px' }}
                          min={0}   
                          />  
                        )} 
                        MB</div>
                      </FormItem>
                      </Col> 
                      <Col span='12'  >  
                      <FormItem
                        label={'限制'} 
                        labelCol={{span:'6'}}
                        wrapperCol={{span:'18'}}
                      >  
                       <div style={{  lineHeight:'100%', backgroundColor:'#d9d9d9'  }}>
                        {getFieldDecorator('memorylimit' , { 
                           initialValue:memorylimit?memorylimit:undefined
                        })(     
                          <InputNumber style={{ width: '75%' ,marginRight:'5px' }} 
                          min={0} 
                          />            
                        )} 
                        MB</div> 
                      </FormItem> 
                      </Col>   
                      </Row> 

                      <Row   gutter={10}> 
                      <Col span='12'  > 
                      <FormItem 
                        label='GPU'
                        labelCol={{span:'8'}} 
                        wrapperCol={{span:'16'}}
                      >
                        <div style={{  lineHeight:'100%', backgroundColor:'#d9d9d9'  }}> 
                        {getFieldDecorator('gpurequst', {
                            initialValue:gpurequst?gpurequst:undefined
                           
                        })(
                           <InputNumber style={{ width: '70%' ,marginRight:'5px' }}
                            min={0} 
                           />  
                        )} 
                        GPUs</div>
                      </FormItem>
                      </Col>  
                      </Row> 

                  </Panel>

                  <Panel header="主机调度" key="5" >
                  <FormItem label='调度策略'
                          {...formItemLayout} >
                                {
                      getFieldDecorator('schedule',{  
                        initialValue:dataSource?dataSource.schedule:'', 
                         
                          }) (
                          <Radio.Group style={{ width: wwidth }} onChange={this.handleScheduleChange}  >
                              <Radio style={radioStyle} value={'NODE'}>
                                  指定主机
                              </Radio>
                              <Radio style={radioStyle} value={'LABEL'}>
                                  标签匹配
                              </Radio> 
                          </Radio.Group>
                          ) 
                        }    
                    </FormItem>  
                        {
                          this.state.schedule==='NODE'?  
                          <FormItem   label= '选择主机'  
                          {...formItemLayout}
                          > 
                          {
                            getFieldDecorator('nodename',{ 
                            initialValue:dataSource?dataSource.schnodename:'',//初始化 要是配置place需要先出去这个初始化
                            }) (
                               <Select   style={{ width: wwidth }} > 
                                 {nodenames} 
                               </Select> 
                                )
                          }  
                          </FormItem> :null
                        }

                        { /***只有在联邦层面才会选择集群匹配 */
                          this.state.schedule==='LABEL'&&currentcluster==='All'? 
                          <Collapse>
                           <Panel header="集群匹配" key="51" >
                            { //匹配规则数组
                              clustermatchformItems
                            } 
                            <FormItem  >
                            <Button type='primary' onClick={()=>this.add('clustermatchkeys')}    >
                            <Icon type="plus" />添加规则
                            </Button>
                            </FormItem> 
                           </Panel>
                          </Collapse>  
                           :null
                        }
                        { 
                          this.state.schedule==='LABEL'? 
                          <Collapse style={{ marginTop:10}}>
                           <Panel header="节点匹配" key="52" >
                            { //匹配规则数组
                              nodematchformItems
                            } 
                            <FormItem  >
                            <Button type='primary' onClick={()=>this.add('nodematchkeys')}    >
                            <Icon type="plus" />添加规则
                            </Button>
                            </FormItem> 
                           </Panel>
                          </Collapse>  
                           :null
                        }
                  </Panel>
              
              </Collapse> 
               </div>
                ):''
   
           }  
          
       </Form>

        </Modal>
       
        </div>
      );
    }
  }
  
  //const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(CreateWL);
  export default Form.create()(ConfigWL); 



