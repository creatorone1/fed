//部署一个工作负载的表单
import React from 'react'
//import {Modal,message,Badge,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, }from 'antd'
 
import {
    Modal,Card,Form, Divider,AutoComplete,Radio,Input, Icon, Button,InputNumber ,Collapse , Select,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
import { height } from 'window-size';
import './../service.less' 
import utils from './../../../utils/utils'
import { POINT_CONVERSION_COMPRESSED } from 'constants';
let id = 0;
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class CreateWL extends React.Component {
    state = { 
        visible: false, 
        advanced:false,
        schedule:'',
        images:[],
        imagesearch:[],
        nodedata:[],
        pvcs:[],
        pvcdatas:[],
    }
    componentWillUnmount(){
      //console.log('CreateWL destroy')
       
    }
    request = (clustername) => { //初始化数据请求
      fetch(utils.urlprefix+'/api/cluster/'+clustername+'/nodes',{
      method:'GET',
      mode: 'cors', 
      }).then((response) => {
          console.log('response:',response.ok)
          return response.json();
      }).then((data) => {
          console.log('data:',data)
          var nodedata=[]
          data.map(item=>{  
            nodedata=nodedata.concat(item.name)
          })
          this.setState({ //表格选中状态清空 
            nodedata:nodedata
          })
           
          return data;
      }).catch( (e)=> {  
          console.log(e);
      })

      fetch(utils.urlprefix+'/api/images',{
        method:'GET',
        mode: 'cors', 
        }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
        }).then((data) => {
            console.log('data:',data)
            var images=[]
            data.map(repo=>{ 
              repo.images.map(image=>{
                images=images.concat(image.pullname) 
              })  
            }) 
            this.setState({ //表格选中状态清空 
              images:images,
              imagesearch:images
            })
             
            return data;
        }).catch( (e)=> {  
            console.log(e);
        })

        fetch(utils.urlprefix+'/api/cluster/'+clustername+'/pvcs',{
          method:'GET',
          mode: 'cors', 
          }).then((response) => {
              console.log('response:',response.ok)
              return response.json();
          }).then((data) => {
              console.log('data:',data)  

              this.setState({ //表格选中状态清空 
                  pvcs:data,
                  pvcdatas:data,
              })
               
              return data;
          }).catch( (e)=> {  
              console.log(e);
          })
     } 
    
    showModal = () => {
      this.request(this.props.currentcluster)
      const { form } = this.props;
      form.resetFields(); 
      form.resetFields('mountkeys')
      id=0;
      this.setState({
        visible: true, 
        advanced:false
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
        nodedata:[]
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
            cpurequest,cpulimit,memoryrequest,memorylimit,gpurequest,
            nodename
            } = values;  
        //  console.log('env_label name :', keys.map(key => env_label[key]));
         var dep = new Deployment(values)
         console.log('dep:',JSON.stringify(dep))
            
          
          fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/deployment',{
            method:'POST',
            mode: 'cors', 
            body:JSON.stringify(dep)
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
              const { form } = this.props; 
              form.resetFields();  //重置表单
              id=0;
              this.props.statechange()//创建成功刷新数据
              this.setState({
                visible: false, 
                advanced:false,
                schedule:''
              });
              return data;
          }).catch( (e)=> {  
            //成功了则关闭弹窗且初始化
              const { form } = this.props; 
              form.resetFields();  //重置表单
              id=0;
              this.setState({
                visible: false, 
                advanced:false,
                schedule:''
              });
              console.log(e);
          }) 


           
        }
        else{ //否则报错 
          const { name,podsnum,image,namepace,
            keys,labelkeys,portkeys,env_label,value
            , portnum, porttype,
            cpurequest,cpulimit,memoryrequest,memorylimit,gpurequest,
            nodename
            } = values;  
          console.log(' values: ', values);   
          return
        }
      });
    }
    
    handleConfig =()=>{ //点击生成配置模板按钮
     
      this.props.form.validateFields((err, values) => {
        if (!err) {   //如果没有错则传输数据 
          console.log(' values  : ', values); 
           //keys表示env名字env_label与值value的key
          //labelkeys表示label名字env_label与值value的key
          //portkeys表示portnum与porttype的key
          const { name,podsnum,image,namespace,
            keys,labelkeys,portkeys,env_label,value
            , portnum, porttype,
            cpurequest,cpulimit,memoryrequest,memorylimit,gpurequest,
            nodename
            } = values;  
         // console.log('env_label name :', keys.map(key => env_label[key]));
        

         var dep = new Deployment(values)
         console.log('dep:',JSON.stringify(dep)) 
          
          fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/template/deployment',{
            method:'POST',
            mode: 'cors', 
            body:JSON.stringify(dep)
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
              const { form } = this.props; 
              form.resetFields();  //重置表单
              id=0;
              this.setState({
                visible: false, 
                advanced:false,
                schedule:'',
                nodedata:[]
                
              });
              return data;
          }).catch( (e)=> {  
            //成功了则关闭弹窗且初始化
              const { form } = this.props; 
              form.resetFields();  //重置表单
              id=0;
              this.setState({
                visible: false, 
                advanced:false,
                schedule:'',
                nodedata:[]
              });
              console.log(e);
          }) 
        }
        else{ //否则报错 
          const { name,podsnum,image,namepace,
            keys,labelkeys,portkeys,env_label,value
            , portnum, porttype,
            cpurequest,cpulimit,memoryrequest,memorylimit,gpurequest,
            nodename
            } = values;  
          console.log(' values: ', values);   
          return
        }
      });
    }
    removevolume= (keytype,k,rulekey) => { //移除
      const { form } = this.props;
      // can use data-binding to get 
      if(keytype=='mountkeys'){
          console.log('delete mountkeys'+rulekey) 
          let  mountkeys=form.getFieldValue(`mountkeys[${rulekey}]`) //backendkeys是一个map对象map对象每个值是数组
          console.log('mountkeys',mountkeys)
          console.log('delete key',k) 
          mountkeys=mountkeys.filter(key=>key !==k )
          form.setFieldsValue({
              [`mountkeys[${rulekey}]`]:mountkeys, 
          }) 
        } 
        else 
        { 
            const keys = form.getFieldValue(keytype); 
            // 移除keys数组的一个值  
            if(keytype=='volumekeys')  
            form.setFieldsValue({
              volumekeys: keys.filter(key => key !== k),
            });
        }

    }
    remove = (keytype,k) => { //移除
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue(keytype);
     
  
      // 移除keys数组的一个值
      if(keytype=='keys')  
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
      if(keytype=='portkeys')  
      form.setFieldsValue({
        portkeys: keys.filter(key => key !== k),
      });
      if(keytype=='labelkeys')  
      form.setFieldsValue({
        labelkeys: keys.filter(key => key !== k),
      });
      if(keytype=='clustermatchkeys')  
      form.setFieldsValue({
        clustermatchkeys: keys.filter(key => key !== k),
      });
      if(keytype=='nodematchkeys')  
      form.setFieldsValue({
        nodematchkeys: keys.filter(key => key !== k),
      });
    }
    addvolume =(keytype,k)=>{
      const { form } = this.props;  

        if(keytype==='mountkeys'){

          let  mountkeys=form.getFieldValue(`mountkeys[${k}]`) //backendkeys是一个map对象map对象每个值是数组
          //console.log('backendkeys',backendkeys)
          mountkeys=mountkeys.concat(keytype+id++)
          //通过getFieldDecorator初始化来给表单属性赋值，但是它不会更新界面
          //form.getFieldDecorator(`backendkeys[${k}]`, { initialValue: backendkeys })  
          form.setFieldsValue({
              [`mountkeys[${k}]`]:mountkeys, 
          })
          //console.log('backendkeysk',form.getFieldValue(`backendkeys[${k}]`)) 
          
        }
        else{
          const keys = form.getFieldValue(keytype);
          
          //给keys数组添加一个值
          const nextKeys = keys.concat(keytype+id++);   
          if(keytype==='volumekeys'){
              form.setFieldsValue({
                volumekeys: nextKeys,
                  }); 
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
    handleSlectn=(value)=>{ //选择当前命名空间下的服务
      console.log('select namespaces: 配置当前命名空间下的pvc'+value)
      //选取当前命名空间下的服务 给后端backend中 的 option 选项
      if(this.state.pvcdatas){
          this.setState({
              pvcdatas:this.state.pvcs.filter(item=>item.namespace==value)
              //selectsvcdata:this.state.svcdata.filter(item=>item.namespace===value)
              
          })
      }
        else{
          this.setState({
            pvcdatas:[]
              //selectsvcdata:this.state.svcdata.filter(item=>item.namespace===value)
          })
      }  
      this.props.form.resetFields(`pvcname`) 
      
    } 

    // handleSubmit = (e) => { //点击提交按钮执行的方法

    //   e.preventDefault();
    //   this.props.form.validateFields((err, values) => {
    //     if (!err) {
    //       const { keys, names } = values;
    //       console.log('Received values of form: ', values);
    //       console.log('Merged values:', keys.map(key => names[key]));
    //     }
    //   });
    // }

    handleAdvanced= ()=>{  //是否显示高级选项
      this.setState({
        advanced:!this.state.advanced
      }
      );
    }
    //初始化环境变量key表单数组
    initKeysItem =(keytype,keys)=>{
      const { getFieldDecorator } = this.props.form;
     
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}> 
        <Col span='12'  > 
        <FormItem 
          label={index === 0 ? '变量' : ''} 
        >
          {getFieldDecorator(`env_label[${k}]`, {
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
    //初始化端口映射port表单数组
    initPortsItem =(keytype,keys)=>{
      const { getFieldDecorator } = this.props.form;
     
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}> 
        <Col span='12'  > 
        <FormItem 
          label={index === 0 ? '容器端口' : ''}  
        >
          {getFieldDecorator(`portnum[${k}]`, {
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
             initialValue:"TCP",
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
    initMatchKeysItem =(keytype,keys)=>{
      const { getFieldDecorator } = this.props.form;
     
      const formItems = keys.map((k, index) => ( //根据key的数量显示form内容行数
        <Row key={index} gutter={16}> 
        <Col span='8'  > 
        <FormItem 
          label={index === 0 ? '标签' : ''} 
        >
          {getFieldDecorator(`matchlabel[${k}]`, {
              initialValue:'' ,
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
              initialValue:'' ,
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
              initialValue:'',
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
    

 
     //初始化mount数组
     initMountKeysItem =(keytype,keys,volumekey)=>{
      const { getFieldDecorator,getFieldValue } = this.props.form;
      //console.log('BackendKeysItemkeys '+rulekey,keys)
      const formItems = keys.map((k, index) => { //根据后端key的数量显示当前rule下后端的条数
      //if(!getFieldValue(`ports[${k}]`))  //为空才创建
     // getFieldDecorator(`ports[${k}]`, { initialValue: [] })
      return( 
      <Row key={k} gutter={16}
      style={{margin:'auto'}}
      > 
      <Col span='10'  > 
      <FormItem 
          label={index === 0 ? '容器路径' : ''} 
      >
          {getFieldDecorator(`mountpath[${k}]`, {
          initialValue:'' ,
          rules:[
            {
            required:true,
            message:'容器路径不能为空'
            },
            ]  
          })( 
          <Input placeholder="" style={{width:'80%',marginRight:'8%' }}  />   
          )}
          
      </FormItem>
      </Col>

      <Col span='10'  > 
      <FormItem 
          label={index === 0 ? '子路径' : ''} 
      >
          {getFieldDecorator(`subpath[${k}]`, {
         // initialValue:'' , 
          })( 
            <Input placeholder="" style={{width:'80%',marginRight:'8%' }}  />   
          )}
          
      </FormItem>
      </Col>

      <Col span='4'  > 
      <FormItem
          label={index === 0 ? '只读' : ''} 
      >
          <div> 
          {getFieldDecorator(`readonly[${k}]`, {
          initialValue:false,
           
          })(  
              <Checkbox>  </Checkbox>   
          )}
          { keys.length > 0 ? (
          <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.removevolume(keytype,k,volumekey)}
          />
          ) : null }
          </div> 
      </FormItem>
      </Col> 
      </Row>
      )
      });
      return formItems;
      }
    //初始化数据卷表单数组
      initVolumeKeysItem =(keytype,keys)=>{
      const { getFieldDecorator,getFieldValue } = this.props.form;
      
      const formItems = keys.map((k, index) => {
      //if(!getFieldValue(`backendkeys[${k}]`))
      getFieldDecorator(`mountkeys[${k}]`, { initialValue: [] });//定义backendkeys的key  
      const mountkeys = getFieldValue(`mountkeys[${k}]`); //获取backendkeys的key 
      const MountItems = this.initMountKeysItem('mountkeys',mountkeys,k) //根据key数量设定backendkeys表单item
              
      const  pvcs= this.state.pvcdatas.map(item=>
        <Option key={item.name} value={item.name}>{item.name}</Option>
      )  
      const  pvcops= this.state.pvcdatas.map(item=>
        <AutoComplete.Option key={item.name} value={item.name}>{item.name}</AutoComplete.Option>
      )  
      return( //根据key的数量显示form内容行数 
      <div key={index}> 
        <Row>
        <Col span='4'>
          <FormItem >数据卷{index+1}</FormItem> 
        </Col> 
        <Col span='20'   > 
          <FormItem 
            style={{           //靠右显示高级按钮
              textAlign:"right"
            }}
            > 
              <div> 
              <Button type='primary' onClick={()=>this.addvolume('mountkeys',k)}    >
                  <Icon type="plus" />添加映射
              </Button>
              { keys.length > 0 ? (
              <span
              onClick={() => this.removevolume(keytype,k)}
              style={{marginLeft:16,fontSize:16,cursor:'pointer',lineHeight:'100%'}}
              
              > <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  style={{marginRight:6,fontSize:16 ,verticalAlign:'text-top'}}
                  
                  />
                  移除此卷
              
              </span>
              ) : null }
              </div> 
          </FormItem > 
        </Col>  
     
        </Row>
      <Row>  
        <Col span='10' 
        > 
          <FormItem 
              label=  '卷名'  
              labelCol= {{
                  xs: { span: 24 },
                  sm: { span: 6 , offset: -40},
                }}
              wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 18 },
              }} 
          >
              {getFieldDecorator(`volumename[${k}]`, {
              initialValue:'' , 
                rules:[
                  {
                  required:true,
                  message:'卷名不能为空'
                  },
                  ]
              })( 
              <Input placeholder="" style={{width:'80%',marginRight:'8%' }}  />  
              )}
              
          </FormItem>
        </Col> 
        <Col span='12'> 
          <FormItem 
              label=  '数据卷名称'  
              labelCol= {{
                  xs: { span: 24 },
                  sm: { span: 8 , offset: -40},
                }}
              wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 16 },
              }}
          >
              {getFieldDecorator(`pvcname[${k}]`, {
              initialValue:'' , 
              rules:[
                {
                required:true,
                message:'数据卷不能为空'
                },
                ]
              })( 
                <AutoComplete 
                  style={{ width: "80%" }}
                  onSelect={this.onSelectvo} 
                  onChange={this.onChangevo}
                  filterOption={(inputValue, option)=>
                     option.props.children.indexOf(inputValue) !== -1
                    }
                placeholder="PVC"

                >
                  {pvcops}
                </AutoComplete>

                //<Select  style={{width:'80%',marginRight:'8%' }}>
                 // {pvcs}
                //</Select> 
              )}
              
          </FormItem>
        </Col>
         </Row>
         <div  >   
        {MountItems}
        </div  >       
          <Divider />
          </div>
        )
        });
        return  formItems; 
      } 

    onSearch = searchText => {
      if(searchText==''){
        this.setState({
          imagesearch:  this.state.images 
        });
      }else{
        this.setState({
          imagesearch: this.state.images.filter(item=>item.indexOf(searchText)!==-1)
        });
      } 
    };
  
    onChange = imagevalue => {
      //console.log('onChange', imagevalue);
      //this.setState({ imagevalue });
    };
    onSelect =(value)=>{
      console.log('onSelect', value);
    }
    onSelectvo=(value)=>{
      console.log('onSelect', value);
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

      getFieldDecorator('keys', { initialValue: [] });//定义环境变量的key 
      const keys = getFieldValue('keys'); //获取环境变量的key
      const formItems = this.initKeysItem('keys',keys) //根据key数量设定环境变量表单item

      getFieldDecorator('portkeys', { initialValue: [] });//定义port的key 
      const portkeys = getFieldValue('portkeys'); //获取port的key
      const portformItems = this.initPortsItem('portkeys',portkeys) //根据key数量设定port表单item
     
      getFieldDecorator('labelkeys', { initialValue: [] });//定义label的key 
      const labelkeys = getFieldValue('labelkeys'); //获取label的key
      const labelformItems = this.initKeysItem('labelkeys',labelkeys) //根据key数量设定label表单item
      
      getFieldDecorator('clustermatchkeys', { initialValue: [] });//定义clustermatch的key 
      const clustermatchkeys = getFieldValue('clustermatchkeys'); //获取match的key
      const clustermatchformItems = this.initMatchKeysItem('clustermatchkeys',clustermatchkeys) //根据key数量设定label表单item

      getFieldDecorator('nodematchkeys', { initialValue: [] });//定义nodematch的key 
      const nodematchkeys = getFieldValue('nodematchkeys'); //获取match的key
      const nodematchformItems = this.initMatchKeysItem('nodematchkeys',nodematchkeys) //根据key数量设定label表单item

      getFieldDecorator('volumekeys', { initialValue: [] });//定义nodematch的key 
      const volumekeys = getFieldValue('volumekeys'); //获取match的key
      const volumeformItems = this.initVolumeKeysItem('volumekeys',volumekeys) //根据key数量设定label表单item

       

       
      const currentcluster=this.props.currentcluster

      const namespaces=this.props.namespaces //根据父组件传来的参数配置命名空间 
      const namespacesdata=namespaces.map( (item)=>(  
        <Option value={item} key={item} >{item}</Option>
       )
      );
      
      const wwidth='80%' //定义表单中空间宽度
     // const nodedata=['node1','node2','node3'] //先获取主机数据
     const nodedata=this.state.nodedata
     const nodenames = nodedata.map((item)=>(
          <Option value={item} key={item}>
              {item}
          </Option>
        ) )
      const radioStyle = {
          display: 'block',
          height: '40px',
          lineHeight: '40px',
          marginLeft:10
          
      };
      


      return (
        <div>   
        <Button type='primary' onClick={this.showModal}><Icon type='plus'/>创建</Button>  
     
        <Modal
          title="创建工作负载"
          visible={this.state.visible}
          onCancel={this.hideModal}
          maskClosable={false}
          destroyOnClose={true}
          width={720}
          afterClose={()=>{
           // console.log('close!') 
          }}
          footer={[
            <Button key="back" onClick={this.hideModal}>
              取消
            </Button>,
            <Button key="config" style={{ backgroundColor: '#d7d7d7' }} type="default" onClick={this.handleConfig}>
            生成配置模板
            </Button>,
            <Button key="submit" type="primary"  onClick={this.handleOk}>
              确认创建
            </Button>,
          ]}
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
                   message:'服务名称不能为空'
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
               initialValue:'',//初始化  
                rules:[       //规则数组
                 {
                   required:true,
                   message:'镜像不能为空'
                 },   
                ] 
               }) (
                <AutoComplete
                  dataSource={this.state.imagesearch}
                  style={{ width: wwidth }}
                  onSelect={this.onSelect} 
                  onChange={this.onChange}
                  filterOption={(inputValue, option)=>
                    option.props.children.indexOf(inputValue) !== -1
                  }
                  placeholder="输入镜像"
                />
                   //  <span><Input style={{ width: wwidth }}/> </span>
 
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
                        {getFieldDecorator('cpurequest', { 

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
                        {getFieldDecorator('memoryrequest', { 

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
                        {getFieldDecorator('gpurequest', { 
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
                  <Panel header="添加数据卷" key="5">
                    { //标签数组
                      volumeformItems
                    } 
                    <FormItem  >
                    <Button type='primary' onClick={()=>this.addvolume('volumekeys')}    >
                    <Icon type="plus" />添加数据卷
                    </Button>
                    </FormItem> 
                  </Panel>    

                  <Panel header="主机调度" key="6" >
                  <FormItem label='调度策略'
                          {...formItemLayout} >
                                {
                      getFieldDecorator('schedule',{   
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
                            initialValue:'',//初始化 要是配置place需要先出去这个初始化
                            }) (
                               <Select    style={{ width: wwidth }} > 
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

        </Modal></div>
      );
    }
  }
  
  //const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(CreateWL);
  export default Form.create()(CreateWL); 

  function Deployment(values) {
    var dep=new Object(); 
    const { name,podsnum,image,namespace,
            keys,
            labelkeys, 
            env_label, //env与label的name
            value,   //value
            
            portkeys, 
            portnum, 
            porttype,
            cpurequest,cpulimit,memoryrequest,memorylimit,gpurequest,
            schedule,
            nodename,
            nodematchkeys,
            matchlabel,
            matchop,
            matchvalue,
             
            volumekeys,
            volumename,
            pvcname,
            mountkeys,
            mountpath,
            subpath,
            readonly,
            } = values;
    dep.name=name;
    dep.namespace=namespace
    dep.image=image
    dep.podsnum=[]
    dep.podsnum[0]=0
    dep.podsnum[1]=podsnum

    var env=[]
    keys.map(key =>{
      var e ={
        name: env_label[key],
        value:value[key]
      }
      env=env.concat(e)
    })       
    dep.env= env  

    var label=[]
    labelkeys.map(key =>{
      var l ={
        name: env_label[key],
        value:value[key]
      }
      label=label.concat(l)
    })       
    dep.label= label

    dep.schedule=  schedule     
    if(schedule=="LABEL"){
        var nodematch=[]
        nodematchkeys.map(key =>{
          var nm = {
            label: matchlabel[key],
            op:matchop[key],
            value:matchvalue[key]
          }
          nodematch=nodematch.concat(nm)
        })       
        dep.nodematch= nodematch
    }
    if(schedule=="NODE"){
      dep.schnodename= nodename
    }

    var ports=[]
    portkeys.map(key =>{
      var p ={
        containerPort: portnum[key],
        protocol:porttype[key]
      }
      ports=ports.concat(p)
    })       
    dep.ports= ports

    var volumes=[]
    volumekeys.map(volumekey=>{
      var mounts=[]
      mountkeys[volumekey].map(mountkey=>{
        var m={
          name:volumename[volumekey],
          mountpath: mountpath[mountkey],
          readonly: readonly[mountkey],
          subpath: subpath[mountkey],
        }
        mounts=mounts.concat(m)
      })
      var v={
        name:volumename[volumekey],
        pvcname:pvcname[volumekey],
        volumemounts:mounts,
      }
      volumes=volumes.concat(v)
    })
    dep.volumes=volumes

    var request={
      cpurequest:cpurequest,
      memoryrequest:memoryrequest,
      gpurequest:gpurequest
    }
    dep.request= request

    var limit={
      cpulimit:cpulimit,
      memorylimit:memorylimit 
    }
    dep.limit= limit
    return dep
}

