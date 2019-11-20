//部署一个工作负载的表单
import React from 'react'
//import {Modal,message,Badge,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, }from 'antd'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
import { height } from 'window-size';
 import utils from './../../../utils/utils.js'

let id = 0;
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class EditNode extends React.Component {
    state = { 
        visible: false, 
        deletelabels:[] 
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
        if(nextProps.editvisible!==this.props.editvisible&&nextProps.editvisible){
          console.log('打开时候深拷贝dataSource') 
          //先把原数据 转换为json字符串 再转化为 对象
          let data=JSON.stringify( nextProps.dataSource)
          //console.log('json:',data)
          //console.log('object:',JSON.parse(data)) 
          this.setState({  
          //这儿 必须是深拷贝，不然会影响传入的值,并且只能初始化这个参数一次，以后的form的set操作不能影响该值
          dataSource:JSON.parse(data), //,
          deletelabels:[] //初始化
          }) 
        }
        //console.log('nextProps:',  nextProps) 
        //console.log('nextProps.dataSource:', nextProps.dataSource) 
    }
  

    showModal = () => {
      const { form } = this.props;
      form.resetFields(); 
      id=0;
      this.setState({
        visible: true,  
      }); 
     
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
          const { name,cluster,labelkeys,env_label,value 
            } = values;   //从values中读取数据
            //console.log('env_label name :', labelkeys.map(key => env_label[key]));
           
            var node = new Node(values,this.state.deletelabels)
            console.log('node:',JSON.stringify(node)) 
             
            fetch(utils.urlprefix+'/api/cluster/'+this.state.dataSource.cluster+'/node/'+name,{
              method:'PUT',
              mode: 'cors', 
              body:JSON.stringify(node)
              }).then((response) => {
                  console.log('response:',response.ok)
                  return response.json();
              }).then((data) => {
                  console.log('data:',data)
                  //成功了则关闭弹窗且初始化
                  const { form } = this.props; 
                  form.resetFields();  //重置表单
                  this.props.handleUpdate(false)
                 this.props.statechange()//更新成功刷新数据
                  return data;
              }).catch( (e)=>{ 
                    //成功了则关闭弹窗且初始化
                    const { form } = this.props; 
                    form.resetFields();  //重置表单
                    this.props.handleUpdate(false)
                   //通知父节点关闭弹窗 
                  console.log(e);
              })   

          //成功了则关闭弹窗且初始化
          const { form } = this.props; 
          form.resetFields();  //重置表单
          id=0;
         
          //通知父节点关闭弹窗
          this.props.handleUpdate(false)
        }
        else{ //否则报错 
           
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
         this.setState({
          deletelabels:this.state.deletelabels.concat(data.labels.filter(item=>item.name==env_label[k])[0])
        })  
         data.labels=data.labels.filter(item=>item.name!==env_label[k]) 
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
              initialValue:index<lablength?dataSource.labels[index].name:'' ,
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
              initialValue:index<lablength?dataSource.labels[index].value:'' 
            })(   
              <Input placeholder="" style={{width:'80%',marginRight:'8%',marginLeft:'-5%    '}}  />    
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

    
     
    render() {  
      //console.log(' render dataSource:',this.state.dataSource )
      var dataSource=this.state.dataSource 
      let  cpurequst,memoryrequst,gpurequst,cpulimit,memorylimit=undefined
      if(dataSource){ //不为空再获取dataSource的属性值
        
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
    
     

    
      let label
      if(dataSource){ //读取默认的环境变量env值 
          label=dataSource.labels
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
      
      const wwidth='80%' //定义表单中空间宽度
    
       
      return (
        <div>   
        {dataSource?    
        <Modal
          title="编辑主机"
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
           <FormItem   label= '主机名'  
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
           <FormItem   label= '所属集群'  
             {...formItemLayout}
           > 
            {
               getFieldDecorator('cluster',{ 
               initialValue:dataSource.cluster,//初始化   
               }) (
                 <Input style={{ width: wwidth,display:'none' }}/> 
                  )
             }
              <span style={{ width: wwidth }}>{dataSource.cluster}</span>  
             
           </FormItem> 
             
               <div >
                <Collapse defaultActiveKey={['1']}  className="collwrap">
                <Panel header="标签" key="1">
                    { //标签数组
                      labelformItems
                    } 
                    <FormItem  >
                    <Button type='primary' onClick={()=>this.add('labelkeys')}    >
                    <Icon type="plus" />添加标签
                    </Button>
                    </FormItem> 
                  </Panel>
              </Collapse> 
               </div>  
          
       </Form>

        </Modal>
        :''}
        </div>
      );
    }
  }
  
  //const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(CreateWL);
  export default Form.create()(EditNode); 


function Node(values,deletelabels){
  var node=new Object(); 
    const { name,
             labelkeys,
             env_label,
             value, 
            } = values;
    node.name=name
    var labels=[]
    deletelabels.map(item=>{
      var l={
        name:item.name,
        value:"delete=nil",
      }
      labels=labels.concat(l)
    })
    labelkeys.map(key=>{
      var l={
        name:env_label[key],
        value:value[key],
      }
      labels=labels.concat(l)
    })
     
    node.labels=labels

    return node
}
