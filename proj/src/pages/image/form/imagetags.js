//部署一个工作负载的表单
import React from 'react'
//import {Modal,message,Badge,Table, Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu, }from 'antd'
 
import {
    Modal,Form, Input, Popover,Icon, Button,InputNumber ,Collapse , Select,message,Badge,Table, Checkbox, Row,Col,Dropdown,Menu, Divider,
} from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { height } from 'window-size';
 import utils from './../../../utils/utils.js'

let id = 0;
const FormItem = Form.Item;
const Option=Select.Option;
const Panel = Collapse.Panel;
class Imagetags extends React.Component {
    state = { 
        visible: false, 
        deletelabels:[] ,
        selectedRowKeys:[],
        selectedRows:null, 
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
          deletelabels:[], //初始化,
          selectedRowKeys:[],
          selectedRows:null, 
          }) 
          console.log('dataSource:',  JSON.parse(data)) 
        }
        
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

    request = () => { //初始化数据请求
      fetch(utils.urlprefix+'/api/images',{
              method:'GET'
          }).then((response) => {
                  console.log('response:',response.ok)
                  return response.json();
          }).then((data) => {
                  console.log('data:',data.filter(item=>item.name==this.state.dataSource.name)[0])
                  this.setState({
                      dataSource:data.filter(item=>item.name==this.state.dataSource.name)[0],
                      btnloading:false,
                  })
                  this.props.statechange() 
              }).catch( (e)=>{
                  this.setState({ 
                       loading:false,
                       btnloading:false,
                  })
                  console.log(e);
                  
              })

       
    } 
      
    //点击暂停
    handleMutiDelete = ()=>{
      console.log("MutiDelete!")
      console.log("selectedRowKeys",this.state.selectedRowKeys)
      console.log("selectedRows",this.state.selectedRows) 
      //let id = record.id;
      
      if(this.state.selectedRowKeys.length===0){
          Modal.info({
              title:'删除镜像标签',
              content:'请选择一行',
          })
      }  else
      Modal.confirm({
          title:'删除镜像标签',
          content:'您确认要删除这些镜像标签吗？'+this.state.selectedRows.map(item=>item.name) ,
          onOk:()=>{
              var datas={
                  items:[]
              }  
              this.state.selectedRows.map(item=>{
                  var imageitem={
                      name:item.name , 
                  }
                  datas.items=datas.items.concat(imageitem)
              })
              
              fetch(utils.urlprefix+'/api/imagetags?reponame='+this.state.dataSource.name+'&data='+JSON.stringify(datas),{
                  method:'DELETE',
                  mode: 'cors', 
                  }).then((response) => {
                      console.log('response:',response.ok)
                      return response.json();
                  }).then((data) => {
                      this.setState({  //取消选中行
                          selectedRowKeys: [],  
                          selectedRows: null
                      })
                      message.success('删除成功'); 
                      //刷新数据
                      this.request();
                      return data;
                  }).catch( (e)=> {  
                      this.setState({  //取消选中行
                          selectedRowKeys: [],  
                          selectedRows: null
                      })
                      message.success('网络错误');
                      //this.requestnode(this.state.selectedRows[0].cluster);
                      this.request();
                      console.log(e);
                  }) 
               
          }
      })
  }
  searchChange = (e)=>{
      //console.log('e.target.value',e.target.value)
      let content=e.target.value
      this.setState({
          searchname:content
      })
      if(content===''){
          this.setState({
              search:false
          })    
      }
      if(content!==''){
          //console.log('this.state.searchname:',this.state.searchname)
          //console.log(this.state.dataSource.map(item=>item.name.indexOf(this.state.searchname)))
          this.setState({
              searchdata:this.state.dataSource.images.filter(item=>item.name.indexOf(content)!==-1),
              search:true
          })
           
      }
  }
  handleRefresh =() =>{
    console.log('refresh !')
    this.setState({ 
        btnloading:true
    })
    //this.request()
    setTimeout(()=> {//模拟数据加载结束则取消加载框 
        this.request()
      }
    ,1000)
     
  }
    render() {  
      //console.log(' render dataSource:',this.state.dataSource )
      var dataSource=this.state.dataSource 
      const columns=[
        {
            title:'标签名称',
            key:'name',
            dataIndex: 'name',
            width:"12%",
            /*sorter:(a,b)=>{  
              
              return a.name - b.name; 
            },
            sortOrder:'d',*/

        },
        {
            title:'镜像大小',
            key:'size',
            dataIndex: 'size', 
            render(text){
              return  text+'MB' 
            }
        }, 
        {
          title:'作者',
          key:'author',
          dataIndex: 'author', 
          width:"15%"
         
      },
        {
            title:'操作系统',
            key:'os',
            dataIndex: 'os',
        },
        {
          title:'docker版本',
          key:'docker_version',
          dataIndex: 'docker_version',
      },
        {
            title:'创建时间',
            key:'created',
            dataIndex: 'created',
            
            sorter:(a,b)=>{ 
              var  timea=new Date(a.created)
              var timeb=new Date(b.created)
            
              return timea - timeb; 
            },
            sortOrder:'descend', 
            render(text){
                return utils.formateDate(text)
            }
        },
        {
            title:'上传时间',
            key:'push_time',
            dataIndex: 'push_time',
            render(text){
                return utils.formateDate(text)
            }
        },
        {
            title:'复制镜像',
            key:'pullname', 
            dataIndex: 'pullname',
            render:(text,record)=>{
                var opration  
                opration = (<div>  
                  <CopyToClipboard text={text}
                    onCopy={() => {
                      this.setState({copied: true})
                      record.copied=true
                      console.log(text)
                    }}>
                      <Popover placement="rightBottom"   content={'已复制'} trigger="click"> 
                      <Icon type="copy" theme="twoTone"    style={{cursor:'pointer',fontSize:20,color:record.copied==true?"#69c0ff":"" }}></Icon> 
                      </Popover>
                  </CopyToClipboard> 
                 
                </div>)
                return opration 
            }
        },

    ] 
      
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
       
      
      const wwidth='80%' //定义表单中空间宽度
      const selectedRowKeys=this.state.selectedRowKeys;
        const rowSelection={ 
            type: 'checkbox',
            selectedRowKeys,
            onChange:(selectedRowKeys,selectedRows)=>{
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            }
        } 
       
      return (
        <div>   
        {dataSource?    
        <Modal
          title="镜像标签列表"
          visible={this.props.editvisible}
          width={960} 
          onOk={this.handleOk}
          onCancel={this.hideModal}
          maskClosable={false}
          destroyOnClose={true}
          footer={null}  
          afterClose={()=>{
           // console.log('close!')
         }}
        >
         <span style={{ width: wwidth ,marginLeft:10,fontSize:20}}>镜像: {dataSource.name}</span>  
         <Divider></Divider>
         <Row className='Button-wrap' style={{ marginTop:10}}> 
                    <Col span='12'> 
                        <Button onClick={this.handleMutiDelete}>删除<Icon type='delete'></Icon></Button>
                                                 
                    </Col>
                        <Col span='12' className='Button-right'> 
                        <Button onClick={this.handleRefresh} loading={this.state.btnloading}>刷新 </Button>
                        <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                        <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                    </Col>
                    </Row>
             <Table  
                        style={{marginTop:16}}
                        dataSource={this.state.search?this.state.searchdata:this.state.dataSource.images}
                        rowKey={record => record.name}
                        rowSelection={rowSelection }
                        columns={columns }  
                        rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                    />
        </Modal>
        :''}
        </div>
      );
    }
  }
  
  //const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(CreateWL);
  export default Form.create()(Imagetags); 

 