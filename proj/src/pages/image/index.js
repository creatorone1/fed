import React from 'react';
 import {Modal,message,Badge,InputNumber,Form,Spin,Alert,Upload,Tag,Table, Select,Tabs,Divider,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
} from 'antd'; 
import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
 
import utils from '../../utils/utils';
import Imagetags from './form/imagetags'
import UpdateRepo from './form/updaterepo'

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
 class Images extends React.Component {
      
    state = {
       
        selectedRowKeys:[],
        selectedRows:null, 
        cluster:[ 
            'Cluster1',
            'Cluster2'
        ],
        searchname:'',
        searchdata:[],
         dataSource:[
           /* {
                "id": 2,
                "name": "library/mysql",
                "project_id": 1,
                "description": "",
                "pull_count": 1,
                "star_count": 0,
                "labels": [],
                "creation_time": "2019-11-21T09:04:28.150037Z",
                "update_time": "2019-11-21T09:11:15.956942Z",
                "tagnum": 1,
                "images": [
                    {
                        "digest": "sha256:1a34eeb78ca4e8043c771055319a21488bc2f9eaaab7b3ee5b2f6fba89215d5c",
                        "name": "5.7.14",
                        "size": 127.88,
                        "architecture": "amd64",
                        "os": "linux",
                        "os.version": "",
                        "docker_version": "1.10.3",
                        "author": "",
                        "created": "2016-08-22T19:20:13.661099365Z",
                        "config": {
                            "labels": {}
                        },
                        "labels": [],
                        "push_time": "2019-11-21T09:04:28.147594Z",
                        "pull_time": "2019-11-21T09:11:15.95726Z",
                        "pullname": "core.harbor.domain/library/mysql:5.7.14"
                    }
                ]
            },
            {
                "id": 1,
                "name": "library/nginx",
                "project_id": 1,
                "description": "",
                "pull_count": 2,
                "star_count": 0,
                "labels": [],
                "creation_time": "2019-11-21T08:51:01.789668Z",
                "update_time": "2019-11-22T08:44:08.767248Z",
                "tagnum": 1,
                "images": [
                    {
                        "digest": "sha256:ec3b09634ad6b611e2e0969a3c0f2a66658ce5b1d3c18706442f0e54cf1d68f6",
                        "name": "latest",
                        "size": 48.45,
                        "architecture": "amd64",
                        "os": "linux",
                        "os.version": "",
                        "docker_version": "18.06.1-ce",
                        "author": "NGINX Docker Maintainers <docker-maint@nginx.com>",
                        "created": "2019-10-23T00:26:03.830480202Z",
                        "config": {
                            "labels": {
                                "maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"
                            }
                        },
                        "labels": [],
                        "push_time": "2019-11-21T08:51:01.78371Z",
                        "pull_time": "2019-11-22T08:44:08.767407Z",
                        "pullname": "core.harbor.domain/library/nginx:latest"
                    }
                ]
            }*/
        ], 
        alldatas:[] //所有集群下的node数据
        ,
        loading:false,
        btnloading:false,
        currentcluster:'fed',
        upload:false
    }
    componentDidMount(){//请求数据
        //按集群读取节点数据
        this.request()
     }
    // 动态获取mock数据
    request = () => { //初始化数据请求
        fetch(utils.urlprefix+'/api/images',{
                method:'GET'
            }).then((response) => {
                    console.log('response:',response.ok)
                    return response.json();
            }).then((data) => {
                    console.log('data:',data)
                    this.setState({
                        dataSource:data,
                        btnloading:false,
                    })
                }).catch( (e)=>{
                    this.setState({
                        dataSource:[] ,
                         loading:false,
                         btnloading:false,
                    })
                    console.log(e);
                    
                })

         
    }  
    
    handleClustertChange=(value)=> {
        var data=[]
        if(value!='All'){
            data=this.state.alldatas.filter(item=>item.cluster==value)

        }else{
            data=this.state.alldatas 
        }
        
        this.setState({
            currentcluster:value ,
            dataSource:data
        })

        //进行筛选Clustert数据操作
        console.log(`cluster selected ${value}`);
    }
        //点击暂停
     handleMutiDelete = ()=>{
            console.log("MutiDelete!")
            console.log("selectedRowKeys",this.state.selectedRowKeys)
            console.log("selectedRows",this.state.selectedRows) 
            //let id = record.id;
            
            if(this.state.selectedRowKeys.length===0){
                Modal.info({
                    title:'删除镜像',
                    content:'请选择一行',
                })
            }  else
            Modal.confirm({
                title:'删除镜像',
                content:'您确认要删除这些镜像吗？'+this.state.selectedRows.map(item=>item.name) ,
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
                    
                    fetch(utils.urlprefix+'/api/imagerepos?data='+JSON.stringify(datas),{
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
         
                
    
     //下拉菜单item点击响应
     onClick = ( key,text,record ) => { //点击下拉菜单选则
        //message.info(`Click on item ${key}`);
        this.setState({ 
            operationdata:record, // 传入要操作数据
        })
        //console.log( "key",key);
        //console.log( "text",text);
        //console.log( "item",record);
        if(key==='1'){ //如果是暂停
            this.handlePause(key, text, record)  
        }
        if(key==='2'){ //如果是驱逐
            this.handleDrain(key, text, record)
        }
        if(key==='3'){ //如果是编辑
            this.handleUpdate(true) //显示编辑对话框
            
        }
        if(key==='4'){ //如果是删除
            this.handleDelete(key, text, record)
        }
        if(key==='5'){ //如果是恢复
            this.handleResume(key, text, record)
        }
        
    }; 

    
     
      // 编辑操作
      handleUpdate = (visible)=>{
        //console.log("编辑！") 
        if(visible)   
        this.setState({
            editvisible:true
        }) 
        else
        this.setState({
            editvisible:false
        }) 

    }
     
    
    // 删除操作
    handleDelete = (key, text, record)=>{
        console.log("删除！")  
        console.log("key",key)
        console.log("text",text)
        console.log("record",record)
        //let id = record.id;
        Modal.confirm({
            title:'删除镜像',
            content:'您确认要删除此镜像吗？'+record.name ,
            onOk:()=>{ 
                var datas={
                    items:[]
                }  
                var ditem={
                        name:record.name,  
                 }
                datas.items=datas.items.concat(ditem)
               
               // console.log(JSON.stringify(datas))
                fetch(utils.urlprefix+'/api/imagerepos?data='+JSON.stringify(datas),{
                    method:'DELETE',
                    mode: 'cors', 
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        this.setState({  //取消选中行
                            selectedRowKeys: [ ],  
                            selectedRows: null
                        })
                        message.success('删除成功');
                        //发送删除请求
                        this.request();
                        return data;
                    }).catch( (e)=> {  
                        this.setState({  //取消选中行
                            selectedRowKeys: [ ],  
                            selectedRows: null
                        })
                        message.success('删除失败');
                        //发送删除请求
                        this.request();
                        console.log(e);
                    }) 
                
            }
        })
    }
        //搜索输入框响应变化
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
                    searchdata:this.state.dataSource.filter(item=>item.name.indexOf(content)!==-1),
                    search:true
                })
                 
            }
        }
        //点击搜索按钮
    handleSearch = ()=>{
            //console.log('this.state.searchname:',this.state.searchname)
            if(this.state.searchname!==''){
                //console.log('this.state.searchname:',this.state.searchname)
                //console.log(this.state.dataSource.map(item=>item.name.indexOf(this.state.searchname)))
                this.setState({
                    searchdata:this.state.dataSource.filter(item=>item.name.indexOf(this.state.searchname)!==-1),
                    search:true
                })
                 
            }else{
                this.setState({ 
                    search:false
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
    statechange=()=>{ //创建服务之后回调
        console.log('refresh!')
        this.request()
    } 
    handleRepoAdd=(e)=>{
        let content=e.target.value
        this.setState({
            imagerepoadd:content
        })
    }
    handleChangeRepo=()=>{
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
        Modal.confirm({
            title:'更新镜像仓库地址',
            content:(
                <Row  style={{marginTop:20,height:32}}>
                <Col span='6' style={{display:'flex',height:'100%',alignItems:'center'  }}> 
                {'  仓库地址:  ' } 
                </Col>
                <Col span='18'> 
                <Input onChange={this.handleRepoAdd} placeholder='例如：core.harbor.domain' style={{display:'inline-block',width:'90%'}}/>
                </Col>
                </Row> ),
            onOk:()=>{ 
                var add=this.state.imagerepoadd  
                
                fetch(utils.urlprefix+'/api/imagerepo',{
                    method:'PUT',
                    mode: 'cors', 
                    body:add,
                    }).then((response) => {
                        console.log('response:',response.ok)
                        return response.json();
                    }).then((data) => {
                        
                        message.success('更新成功');
                        //发送删除请求
                        this.request(); 
                        return data;
                    }).catch( (e)=> {  
                         
                        message.success('网络错误');
                        //发送删除请求
                        this.request(); 
                        console.log(e);
                    })
               
            }
            })
    }
    render(){ 
        const columns=[
            {
                title:'镜像名称',
                key:'name',
                dataIndex: 'name',
                 width:"20%"
            },
            {
                title:'镜像标签数',
                key:'tagnum',
                dataIndex: 'tagnum', 
               
            }, 
            {
                title:'下载次数',
                key:'pull_count',
                dataIndex: 'pull_count',
            },
            {
                title:'创建时间',
                key:'creation_time',
                dataIndex: 'creation_time',
                render(text){
                    return utils.formateDate(text)
                }
            },
            {
                title:'更新时间',
                key:'update_time',
                dataIndex: 'update_time',
                render(text){
                    return utils.formateDate(text)
                }
            },
            {
                title:'操作',
                key:'operation', 
                render:(text,record)=>{
                    var opration  
                    opration = ( <Dropdown overlay={  
                                    <Menu onClick={({key})=>this.onClick(key,text,record)}> 
                                    <Menu.Item key="3">查看标签</Menu.Item>
                                    <Menu.Item key="4">删除</Menu.Item> 
                                    </Menu> 
                                } trigger={['click']}>
                                <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                            </Dropdown> )
                    return opration 
                }
            },

        ] 
        
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
        var _this =this;
        const props = {   
            onChange(info) {
           //console.log(info)
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
            showUploadList:false,
            customRequest({ action,
                data,
                file,
                filename,
                headers,
                onError,
                onProgress,
                onSuccess,
                withCredentials,}){

                console.log('post file',file)
                console.log('filename',file.name)
                //通过formData来传文件
                var formData = new FormData();
                formData.append("file", file);  //后台读取的变量名为 "file"
                formData.append("filename", file.name);    
                _this.setState({
                    upload:true
                })    
                fetch(utils.urlprefix+'/api/images',{
                    method:'POST',
                    body:formData, 
                    }).then((response) => {
                        //console.log('response:',response)
                        
                        return response.json();
                    }).then((data) => {
                        console.log('data:',data)
                        onSuccess(data, file); 
                        _this.setState({
                            upload:false
                        })  
                        _this.request()
                        return data;
                    }).catch((e)=>{
                        message.error(`${file.name} file upload failed.`);
                        _this.setState({
                            upload:false
                        }) 
                    })
            }
          };

        return (
            
            <div> 
                { this.state.loading?(  
                <Spin tip="Loading...">
                    <Alert
                    message="Loading"
                    description="数据加载中"
                    type="info"
                    />
                </Spin>
                ): 
            (  
            <div style={{ minHeight:'calc(60vh)'}}>  
               
               <div className="Dropdown-wrap" style={{marginTop:10}}> 
                    <span style={{marginRight:10,fontSize:15}}>镜像列表 </span>  
                </div> 
                <div style={{backgroundColor:'white',marginTop:-10,padding:10 }}>
                    <Divider style={{marginTop:-5}}></Divider>
                    <Row className='Button-wrap' style={{ marginTop:-10}}> 
                    <Col span='12'> 
                        <Button onClick={this.handleMutiDelete}>删除<Icon type='delete'></Icon></Button>
                        <UpdateRepo statechange={this.statechange}/>           
                       
                                                
                    </Col>
                    <Col span='12' className='Button-right'> 
                        <div style={{display:'inline-block'}}> 
                            <Upload  {...props} >
                            <Button disabled={this.state.upload?true:false}>
                            <Icon type={this.state.upload?"loading":"upload"}   /> 上传镜像
                            </Button>
                            </Upload>  
                        </div> 
                        <Button onClick={this.handleRefresh} loading={this.state.btnloading}>刷新 </Button>
                        <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                        <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                    </Col>
                    </Row>
                   {this.state.btnloading?(  
                        <Spin tip="Loading...">
                            <Alert
                            message="Loading"
                            description="数据加载中"
                            type="info"
                            />
                        </Spin>
                        ): 
                    (  
                    <Table  
                        style={{marginTop:16}}
                        dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                        rowKey={record => record.name}
                        rowSelection={rowSelection }
                        columns={columns }  
                        rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                    />)}
                   <Imagetags statechange={this.statechange}  dataSource={this.state.operationdata}  editvisible={this.state.editvisible} handleUpdate={this.handleUpdate}></Imagetags>  
                </div>   
                
            </div>
                 )} 

            </div>
            
        )
    }
}

export default Form.create()(Images); 