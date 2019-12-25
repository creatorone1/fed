//部署一个ingress的表单
import React from 'react'
//import {Modal,message,Badge,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, }from 'antd'
 
import {
    Modal,Form, Input, Icon, Button,InputNumber ,Collapse , Select,Divider,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu,
} from 'antd';
import { height } from 'window-size';
import './../service.less' 
import utils from './../../../utils/utils'
import cookie from 'react-cookies'
let id = 0;
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class CreateIng extends React.Component {
    state = { 
        visible: false, 
        Servicesdata:[  //根据当前命名空间获取的服务
            {
                name:'mynginx',
                port:[80,443]
            },
            {
                name:'mynginx2',
                port:[8080,445]
            },
            {
                name:'mynginx3',
                port:[88,446]
            },
              
       ],
        defaultport:[],
        
    }
    componentWillUnmount(){
       // console.log('CreateIng destroy')
    }
    componentWillReceiveProps(nextProps){ 
        if(nextProps.editvisible!==this.props.editvisible&&nextProps.editvisible){
            console.log('打开时候深拷贝dataSource') 
            //先把原数据 转换为json字符串 再转化为 对象
            let data=JSON.stringify( nextProps.dataSource)
           // console.log('data:',data)
            //console.log('object:',JSON.parse(data)) 
            this.setState({  
            //这儿 必须是深拷贝，不然会影响传入的值,并且只能初始化这个参数一次，以后的form的set操作不能影响该值
            dataSource:JSON.parse(data) //
            }) 
           // console.log('dataSource',JSON.parse(data))
            this.request(this.props.currentcluster,nextProps.dataSource.namespace)
          }
           
    }
    request = (clustername,namespace) => { //初始化数据请求
        fetch(utils.urlprefix+'/api/cluster/'+clustername+'/services',{
        method:'GET',
        mode: 'cors', 
        headers: { 
            "Authorization":"Basic "+cookie.load("at") 
            },
        }).then((response) => {
            console.log('response:',response.ok)
            return response.json();
        }).then((data) => {
            console.log('data:',data)
            var services=[]
            data.map(item=>{
                var ports=[]
                item.ports.map(p=>{
                    ports=ports.concat(p.port)
                })
              var service={
                name:item.name,
                port:ports,
                namespace:item.namespace
              } 
              services=services.concat(service)
            })
            var sdata=services.filter(item=>item.namespace==namespace)
            
            this.setState({ //表格选中状态清空 
              services:services,
              Servicesdata:sdata
            })
             
            return data;
        }).catch( (e)=> {  
            console.log(e);
        })
    } 
    hideModal = () => { //点击取消按钮
        const { form } = this.props; 
        form.resetFields();  //重置表单
        id=0;
        this.setState({defaultport:[]}) //重置默认   
        this.props.handleUpdate(false)
    }
    handleSlectn=(value)=>{ //选择当前命名空间下的服务
        console.log('select namespaces: 配置当前命名空间下的服务'+value)
        //选取当前命名空间下的服务 给后端backend中 的 option 选项
        this.setState({
            //selectsvcdata:this.state.svcdata.filter(item=>item.namespace===value)
        })  
       
    }  
    handleOk =()=>{ //点击确认按钮 
        this.props.form.validateFields((err, values) => {
          if (!err) {   //如果没有错则传输数据 
            console.log(' values  : ', values); 
            //rulekeys数组 表示rule数组的key
            //backendkeys是map对象，  包含与rule相同个数的 数组  
                //backendkeys[ rulekeys[i] ]来获取每个数组，对应每个rule下的backend数组
            //dnsname是map对象，dnsname[rulekey[i]] 对应每个rule的域名
            //path是map对象，path[ backendkeys[rulekey][i] ] 对应该rule下某个backend的路径  
            //servicename是map对象，servicename [ backendkeys[rulekey][i] ] 对应该rule下某个backend的服务名  
            //serviceport是map对象，serviceport[ backendkeys[rulekey][i] ] 对应该rule下某个backend的服务端口  
            
             const { name,namespace,
                rulekeys,dnsname,
                backendkeys,path,servicename, serviceport, 
                defaultname,defaultport
                 } = values;   
            //console.log('env_label name :', keys.map(key => env_label[key]));
            //成功了则关闭弹窗且初始化
            var ing = new Ingress(values)
            console.log('ing:',JSON.stringify(ing)) 
            fetch(utils.urlprefix+'/api/cluster/'+this.props.currentcluster+'/namespace/'+namespace+'/ingress/'+name,{
              method:'PUT',
              mode: 'cors', 
              headers: { 
                "Authorization":"Basic "+cookie.load("at") 
                },
              body:JSON.stringify(ing)
              }).then((response) => {
                  console.log('response:',response.ok)
                  return response.json();
              }).then((data) => {
                  console.log('data:',data)
                 //成功了则关闭弹窗且初始化
                 const { form } = this.props; 
                    form.resetFields();  //重置表单
                    id=0; 
                 this.props.handleUpdate(false)  //通知父节点关闭弹窗 
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
            /*const { name,podsnum,image,namepace,
              keys,labelkeys,portkeys,env_label,value
              , portnum, porttype,
              cpurequst,cpulimit,memoryrequst,memorylimit,gpurequst,
              nodename
              } = values;  */
            console.log(' values: ', values);   
            return
          }
        });
    }
    remove = (keytype,k,rulekey,ruleindex,backendindex) => { //移除
        const { form } = this.props;
        // can use data-binding to get 
        if(keytype=='backendkeys'){
            //console.log('delete backendkeys'+rulekey) 
            let  backendkeys=form.getFieldValue(`backendkeys[${rulekey}]`) //backendkeys是一个map对象map对象每个值是数组
            //console.log('backendkeys',backendkeys)
            //console.log('delete key',k) 
            backendkeys=backendkeys.filter(key=>key !==k )
            form.setFieldsValue({
                [`backendkeys[${rulekey}]`]:backendkeys, 
            });
            if(k.indexOf('default')!==-1){ //如果删除的是原数据中存在的后端，则删除原数据中的该后端
                //console.log('backendindex',backendindex)
                let data=this.state.dataSource
                //console.log('before remove data:',data )
                data.rules[ruleindex].backend=data.rules[ruleindex].backend.filter((item,index)=>index!==backendindex)
               
            } 
        }
        else 
        { 
            const keys = form.getFieldValue(keytype); 
            // 移除keys数组的一个值
            if(keytype=='keys')  
            form.setFieldsValue({
            keys: keys.filter(key => key !== k),
            });  
            
            if(keytype=='ruleskeys'){
                form.setFieldsValue({
                    ruleskeys: keys.filter(key => key !== k),
                });
                if(k.indexOf('default')!==-1){ //如果删除的是默认规则，则删除原数据中的该条规则
                    //console.log('ruleindex',ruleindex)
                    let data=this.state.dataSource
                    //console.log('before remove data:',data )
                    data.rules=data.rules.filter((item,index)=>index!==ruleindex)
                   
                }
            }  
             
        }
      }
    /**四个问题  , 3可以这样实现  [`backendkeys[${k}]`]:backendkeys,
     *1 通过改变某个对象为null再试一下
     *2 提前设置一个二元数组
      3 通过属性名字变量来改变变量
      4 set设置之后是否立刻改变（state与表单属性都试一下） 
     */
    add = (keytype,k) => {   //点击添加按钮执行的方法
  
        const { form } = this.props; 
        if(keytype==='backendkeys'){

            let  backendkeys=form.getFieldValue(`backendkeys[${k}]`) //backendkeys是一个map对象map对象每个值是数组
            //console.log('backendkeys',backendkeys)
            backendkeys=backendkeys.concat(keytype+id++)
            //通过getFieldDecorator初始化来给表单属性赋值，但是它不会更新界面
            //form.getFieldDecorator(`backendkeys[${k}]`, { initialValue: backendkeys })  
            form.setFieldsValue({
                [`backendkeys[${k}]`]:backendkeys, 
            })
            //console.log('backendkeysk',form.getFieldValue(`backendkeys[${k}]`)) 
            
        }
        else{
            const keys = form.getFieldValue(keytype);
            
            //给keys数组添加一个值
            const nextKeys = keys.concat(keytype+id++); 
            if(keytype==='keys')  
            form.setFieldsValue({
            keys: nextKeys,
            });
        
        
            if(keytype==='ruleskeys'){
                form.setFieldsValue({
                    ruleskeys: nextKeys,
                    });
                 
            }  
           
        }
    }
    Selectsvc=(value,rulekey,k)=>{  //选中某个服务，在后边对应显示该服务的ports
        const { form } = this.props;           
        let ports=form.getFieldValue(`ports[${k}]`) //backendkeys是一个map对象map对象每个值是数组
        console.log('value',value)
        console.log('k',k)
        this.state.Servicesdata.map(item=>{ 
            if(item.name==value)
                ports=item.port
        })  
        //form.getFieldDecorator(`ports[${k}]`, { initialValue: ports }) 
        form.setFieldsValue({
            [`ports[${k}]`]:ports, 
        })
        form.resetFields(`serviceport[${k}]`)  //重置右边下拉菜单
         
    }
    Selectdefaultsvc=(value)=>{  //默认后端选择服务，在后边对应显示该服务的ports
        const { form } = this.props;           
        let ports  
        this.state.Servicesdata.map(item=>{ 
            if(item.name==value)
                ports=item.port
        })  
        //form.getFieldDecorator(`ports[${k}]`, { initialValue: ports }) 
        this.setState({
            defaultport : ports, 
        }) 
        form.setFieldsValue({ //重置右边下拉菜单
            defaultport:''
        })  
        
    }
    //初始化backend数组
    initBackendKeysItem =(keytype,keys,rulekey,dataSource,backendlength,ruleindex)=>{
            const { getFieldDecorator,getFieldValue } = this.props.form;
            //console.log('rulekey ',rulekey)
            //console.log('Backendkeys ',keys) 
            const formItems = keys.map((k, index) => { //根据后端key的数量显示当前rule下后端的条数
            //if(!getFieldValue(`ports[${k}]`))  //为空才创建
            getFieldDecorator(`ports[${k}]`, { initialValue: [] })
            return( 
            <Row key={k} gutter={16}> 
            <Col span='8'  > 
            <FormItem 
                label={index === 0 ? '访问路径' : ''} 
            >
                {getFieldDecorator(`path[${k}]`, {
                initialValue:(rulekey.indexOf('default')!==-1&&index<backendlength)?dataSource.rules[ruleindex].backend[index].path:'' , 
                })( 
                <Input placeholder="例如: /foo" style={{width:'80%',marginRight:'8%' }}  />   
                )}
                
            </FormItem>
            </Col>

            <Col span='8'  > 
            <FormItem 
                label={index === 0 ? '服务' : ''} 
            >
                {getFieldDecorator(`servicename[${k}]`, {
                initialValue:(rulekey.indexOf('default')!==-1&&index<backendlength)?dataSource.rules[ruleindex].backend[index].servicename:'', 
                })( 
                <Select  style={{width:'80%',marginRight:'8%' }} onSelect={(value)=>this.Selectsvc(value,rulekey,k)}  >
                  {   this.state.Servicesdata.map(item=>
                        <Option value={item.name} key={item.name} >{item.name}</Option>
                      ) 
                  }    
                </Select>
                )}
                
            </FormItem>
            </Col>

            <Col span='8'  > 
            <FormItem
                label={index === 0 ? '端口号' : ''} 
            >
                <div> 
                {getFieldDecorator(`serviceport[${k}]`, {
                initialValue:(rulekey.indexOf('default')!==-1&&index<backendlength)?dataSource.rules[ruleindex].backend[index].serviceport:'',
                rules:[
                        {
                        required:true,
                        message:'端口号不能为空'
                        },
                   ] 
                })(  
                    <Select   style={{width:'80%',marginRight:'8%' }} onchange={(value)=>this.Selectsvc(value)} >
                    {
                         getFieldValue(`ports[${k}]`).map(item=>
                            <Option value={item} key={item} >{item}</Option>
                         )  
                    }    
                   </Select>  
                )}
                { keys.length > 0 ? (
                <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.remove(keytype,k,rulekey,ruleindex,index)}
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

    //初始化rules的表单数组
    initKeysItem =(keytype,keys,dataSource,ruleslength)=>{
        const { getFieldDecorator,getFieldValue } = this.props.form;
        
        const formItems = keys.map((k, index) => {
        //if(!getFieldValue(`backendkeys[${k}]`))
        let backend,backendlength  //初始化默认后端列表
        if(dataSource){
            if(index<ruleslength) //如果存在默认rule，则记录该规则的后端
              {
                //console.log('dataSource :',dataSource)
                backend=dataSource.rules[index].backend
              }
        }
        if(backend){
            //这初始化backend 的 keys的时注意到keys不能相同 
            //'defaultbackendkeys'+k+index 中的 k 确保所有规则下的backend的keys都不相同
            this.props.form.getFieldDecorator(`backendkeys[${k}]`, { initialValue: backend.map((item,index)=>'defaultbackendkeys'+k+index) });//定义变量的key
            //this.add('keys')  //修改了props 导致无线调用 死循环
            backendlength=backend.length; 
        }else{
            getFieldDecorator(`backendkeys[${k}]`, { initialValue: [] });//定义backendkeys的key  
            backendlength=0; 
        }
        const backendkeys = getFieldValue(`backendkeys[${k}]`); //获取backendkeys的key 
        const backendItems = this.initBackendKeysItem('backendkeys',backendkeys,k,dataSource,backendlength,index) //根据key数量设定backendkeys表单item
                
             
         return( //根据key的数量显示form内容行数 
        <div key={index}> 
        <Row> 
          <Col span='4'>
            <FormItem >规则{index+1}</FormItem> 
          </Col> 
          <Col span='10'> 
            <FormItem 
                label=  '域名'  
                labelCol= {{
                    xs: { span: 24 },
                    sm: { span: 4 },
                  }}
                wrapperCol={{
                    xs: { span: 24 },
                    sm: { span: 20 },
                }}
            >
                {getFieldDecorator(`dnsname[${k}]`, {
                initialValue:index<ruleslength?dataSource.rules[index].host:'' , 
                })( 
                <Input placeholder="例如: expample.com" style={{width:'80%',marginRight:'8%' }}  />  
                )}
                
            </FormItem>
          </Col> 
          <Col span='10'   > 
            <FormItem > 
                <div> 
                <Button type='primary' onClick={()=>this.add('backendkeys',k)}    >
                    <Icon type="plus" />添加后端
                </Button>
                { keys.length > 0 ? (
                <span
                 onClick={() => this.remove(keytype,k,k,index)}
                 style={{marginLeft:16,fontSize:16,cursor:'pointer',lineHeight:'100%'}}
                 
                > <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    style={{marginRight:6,fontSize:16 ,verticalAlign:'text-top'}}
                    
                    />
                    移除此规则
                
                </span>
                ) : null }
                </div> 
            </FormItem > 
          </Col>  
        </Row>   
          {backendItems}
        
          <Divider />
          </div>
        )
        });
        return  formItems; 
    }
    
    render(){
        var dataSource=this.state.dataSource
        var defaultservicename ,defaultserviceport=undefined 
        if(dataSource)
        if(dataSource.backend){
            defaultservicename=dataSource.backend.servicename
            defaultserviceport=dataSource.backend.serviceport
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
        let rules,ruleslength
        if(dataSource){
           // console.log('rules',rules)
            rules=dataSource.rules
        }
        if(rules){
           // console.log('rules',rules)
            this.props.form.getFieldDecorator('ruleskeys', { initialValue: rules.map((item,index)=>'defaultrulekeys'+index) });//定义环境变量的key
            //this.add('keys')  //修改了props 导致无线调用 死循环
            ruleslength=rules.length; 
        }else{
            getFieldDecorator('ruleskeys', { initialValue: [] });//定义label的key   
            ruleslength=0
        } 
        const ruleskeys = getFieldValue('ruleskeys'); //获取label的key
        const rulesItems = this.initKeysItem('ruleskeys',ruleskeys,dataSource,ruleslength) //根据key数量设定label表单item
   
        const wwidth='80%' //定义表单中空间宽度
        const Servicesdata=this.state.Servicesdata  //根据当前命名空间获取服务
              
        const defautServices=Servicesdata.map( (item)=>(  
            <Option value={item.name} key={item.name} >{item.name}</Option>
           )
        );

        return(
            <div > 
                {dataSource?   
                <Modal
                    title="创建负载均衡器"
                    visible={this.props.editvisible}
                    onOk={this.handleOk}
                    onCancel={this.hideModal}
                    maskClosable={false} 
                    okText="确认"
                    cancelText="取消"
                    width='750px' 
                    destroyOnClose={true}
                    afterClose={()=>{
                        //console.log('close!')
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
                        <Panel header='定义规则' key="1" >   
                            { //规则数组
                            rulesItems 
                            }  
                        <FormItem  >
                        <Button type='primary' onClick={()=>this.add('ruleskeys')}    >
                        <Icon type="plus" />添加规则
                        </Button>
                        </FormItem>  
                        </Panel>
 
                        <Panel header="默认后端" key="2" >
                            <Row gutter={16}> 
                            <Col span='12'>  
                            <FormItem   label= '默认后端'   
                            > 
                                {
                                getFieldDecorator('defaultname' ,{ 
                                   initialValue:defaultservicename,//初始化  
                                       
                                }) (
                                    <Select  style={{ width: wwidth }} onSelect={this.Selectdefaultsvc} >
                                        {
                                            defautServices
                                        }
                                    </Select>
                                    )
                                } 
                            </FormItem> 
                            </Col> 
                            <Col span='12'> 
                            <FormItem   label= '端口'  
                            > 
                                 {
                                getFieldDecorator('defaultport',{ 
                                    initialValue:defaultserviceport,//初始化   
                                 } )( 
                                <Select   style={{width:'80%',marginRight:'8%' }} onchange={(value)=>this.Selectsvc(value)} >
                                    {
                                         this.state.defaultport.map(
                                             item=>(
                                                <Option value={item} key={item} >{item}</Option>
                                             )
                                         )   
                                    }    
                                </Select>
                                 )  
                                }
                            </FormItem>
                            </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </Form>

                </Modal>
                :''}
            </div>
        )
    }
}

 
export default Form.create()(CreateIng); //创建表单
function Ingress(values) {
    var ing=new Object(); 
    const { name,namespace,
            defaultport,
            defaultname,  
            
            ruleskeys, 
            dnsname, 
            
            backendkeys,
            servicename,
            serviceport,
            path, 
             
            } = values;
    ing.name=name;
    ing.namespace=namespace
    var backend={
        servicename:defaultname,
        serviceport:defaultport
    }   
    ing.backend= backend    
    var rules=[]
    ruleskeys.map(key =>{
      var backends=[]
       backendkeys[key].map(bkey=>{
        var b={
            path:path[bkey],
            servicename:servicename[bkey],
            serviceport:serviceport[bkey],
        }
        backends=backends.concat(b)
      })  
      var r ={
        host: dnsname[key],
        backend:backends, 
      }

      
      rules=rules.concat(r)
    })       
    ing.rules= rules    

     
    return ing
}