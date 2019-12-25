 // 用户管理
 import React from 'react'
 import {Modal,message,Radio,Card,Divider,Badge,InputNumber,Spin,Alert,Tag,Table, Select,Tabs,Checkbox, Button,Input, Row,Col,Icon,Dropdown,Menu,  
 } from 'antd'; 
 import { HashRouter, Route, Switch, Redirect,Link,NavLink} from 'react-router-dom'
 import CreateUser from'./form/createuser'
 import EditUser from'./form/edituser'
 import RadioGroup from 'antd/lib/radio/group';
 import './user.less'
 import utils from './../../utils/utils'
 import cookie from'react-cookies'
import Axios from 'axios';
 export default class User extends React.Component {
     state = {
         selectedRowKeys:[],
         selectedRows:null, 
         searchname:'',
         searchdata:[],
         checked:'',
         dataSource:[{
              Id: '1',
              Name:'user1',
              Status:'1',
              Rool:'Administrator',
              Fedpermission:'1',
              Clusterpermission:'1',
              Modulepermission:'1',
              Createtime:'2019-08-085T07:27:57Z',
              Permissiontime:'2019-08-095T07:27:57Z',
              /*auths:[ //管理员拥有所有权限
                 'federation',
                 'clustercheck:cluster1',
                 'clustercheck:cluster2',
                 'application'
              ]*/
              
         },{
             Id: '2',
             Name:'user2',
             Status:'0',
             Rool:'Administrator',
             Fedpermission:'1',
             Clusterpermission:'1',
             Modulepermission:'1',
             Createtime:'2019-08-085T07:27:57Z',
             Permissiontime:'2019-08-095T07:27:57Z',
             auths:[ 
                 'clustercheck:cluster3',
                 'clustercheck:cluster2',
                 'service',
                 'store' 
             ]
         }
         ],
 
         //根据登录用户的身份来显示可以管理的内容 先从cookie中获取
         loginUser:{  
             username:'use',
             role:'Administrator'
         }
          
        
     }
     componentDidMount(){//请求数据
         this.request();
         console.log('User:',this.state.dataSource)
     }
     componentWillReceiveProps(nextProps){
         //接收参数后更新数据
 
     }
     request = () => {

         fetch(utils.urlprefix+'/api'+'/users',{
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
             this.setState({ //表格选中状态清空
                 selectedRowKeys:[],
                 selectedRows:null,
                 dataSource:data
             }) 
             return data;
         }).catch(function (e) {
             console.log(e);
         })
         
     }
     //批量删除操作
     handleMutiDelete = ()=>{
         console.log("MutiDelete")
         console.log("选中的行的keys ",this.state.selectedRowKeys)
         console.log("选中的行的数据",this.state.selectedRows) 
         //let id = record.id;
         if(this.state.selectedRowKeys.length===0){
             Modal.info({
                 title:'删除用户',
                 content:'请选择一行',
             })
         } else
         Modal.confirm({
             title:'删除用户',
             content:'您确认要删除这些用户吗？'+this.state.selectedRows.map(item=>item.username) ,
             onOk:()=>{
                 this.setState({  //取消选中行
                     selectedRowKeys: [ ],  
                     selectedRows: null
                 })
                 message.success('删除成功');
                 //发送删除请求
                 this.request();
             }
         })
     }
 
     //点击暂停
     handleMutiPause = ()=>{
             console.log("Pause")
             console.log("selectedRowKeys",this.state.selectedRowKeys)
             console.log("selectedRows",this.state.selectedRows) 
             //let id = record.id;
             
             if(this.state.selectedRowKeys.length===0){
                 Modal.info({
                     title:'停用用户',
                     content:'请选择一行',
                 })
             }  else
             Modal.confirm({
                 title:'停用用户',
                 content:'您确认要将这些用户停用吗？'+this.state.selectedRows.map(item=>item.Name) ,
                 onOk:()=>{
                     var datas={
                         Items:[]
                     }  
                     
                     this.state.selectedRows.map(item=>{
                         var depitem={
                             Id:item.Id,
                             Status:item.Status,
                         }
                         datas.Items=datas.Items.concat(depitem)
                     })
                     console.log(datas)
                     fetch(utils.urlprefix+'/api/pause/users?data='+JSON.stringify(datas),{
                     method:'POST',
                     mode: 'cors', 
                     headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        },
                     }).then((response) => {
                         console.log('response:',response.ok)
                         return response.json();
                     }).then((data) => {
                         this.setState({  //取消选中行
                             selectedRowKeys: [ ],  
                             selectedRows: null
                         })
                         message.success('停用成功');
                         this.request();
                         return data;
                     }).catch( (e)=> {  
                         this.setState({  //取消选中行
                             selectedRowKeys: [ ],  
                             selectedRows: null
                         })
                         this.request();
                         console.log(e);
                     }) 
                 
                
                 }
             })
     }
     //点击恢复
     handleMutiResume = ()=>{
             console.log("Resume")
             console.log("selectedRowKeys",this.state.selectedRowKeys)
             console.log("selectedRows",this.state.selectedRows) 
             //let id = record.id;
             if(this.state.selectedRowKeys.length===0){
                 Modal.info({
                     title:'用户恢复',
                     content:'请选择一行',
                 })
             } else
             Modal.confirm({
                 title:'用户恢复',
                 content:'您确认要恢复这些用户吗？'+this.state.selectedRows.map(item=>item.Name) ,
                 onOk:()=>{
                     var datas={
                        Items:[]
                     }  
                     this.state.selectedRows.map(item=>{
                         var depitem={
                             Id:item.Id,
                             Status:item.Status,
                         }
                         datas.Items=datas.Items.concat(depitem)
                     })
                     console.log(datas)
                     fetch(utils.urlprefix+'/api/resume/users?data='+JSON.stringify(datas),{
                     method:'POST',
                     mode: 'cors',
                     headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        }, 
                     }).then((response) => {
                         console.log('response:',response.ok)
                         return response.json();
                     }).then((data) => {
                         this.setState({  //取消选中行
                             selectedRowKeys: [ ],  
                             selectedRows: null
                         })
                         message.success('恢复成功');
                         //发送恢复请求
                         this.request();
                         return data;
                     }).catch( (e)=> {  
                         this.setState({  //取消选中行
                             selectedRowKeys: [ ],  
                             selectedRows: null
                         })
                         this.request();
                         console.log(e);
                     }) 
                 }
             })
     }  
 
 
     onClick = ( key,text,record ) => { //点击下拉菜单选则
         //message.info(`Click on item ${key}`);
         this.setState({ 
             operationdata:record, // 传入要操作数据
         })
         //console.log( "key",key);
         //console.log( "text",text);
         //console.log( "item",record);
         if(key==='1'){ //如果是编辑 
             this.handleUpdate(true) //显示编辑对话框
             
         }
         if(key==='2'){ //如果是暂停
             this.handlePause(key, text, record)  
         }
         if(key==='3'){ // 如果是恢复
             this.handleResume(key, text, record)
             
         }
         if(key==='4'){ //如果是删除
             this.handleDelete(key, text, record)
         }
         
         
     }; 
 
     // 暂停操作
     handlePause = (key, text, record)=>{
         console.log("暂停！")  
         console.log("key",key)
         console.log("text",text)
         console.log("record",record)
         //let id = record.id;
        
          Modal.confirm({
             title:'停用用户',
             content:'您确认要停用这用户吗？'+record.password,
             onOk:()=>{
                 fetch(utils.urlprefix+'/api/pause/user',{
                     method:'POST',
                     mode: 'cors', 
                     headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        },
                     body:JSON.stringify(record)
                     }).then((response) => {
                         console.log('response:',response.ok)
                         return response.json();
                     }).then((data) => {
                         this.setState({  //取消选中行
                             selectedRowKeys: [ ],  
                             selectedRows: null
                         })
                         return data;
                     }).catch( (e)=> {  
                         this.setState({  //取消选中行
                             selectedRowKeys: [ ],  
                             selectedRows: null
                         })
                         console.log(e);
                     }) 
                 
                 message.success('停用成功');
                 //发送暂停请求
                 this.request();
                  
             }
         }) 
 
     }
 
     
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
 
      // 恢复操作
      handleResume = (key, text, record)=>{
         console.log("恢复！")  
         console.log("key",key)
         console.log("text",text)
         console.log("record",record)
         console.log(JSON.stringify(record.Id))
         //let id = record.id;
         Modal.confirm({
             title:'恢复用户',
             content:'您确认要恢复此用户吗？'+record.Name,
             
             onOk:()=>{ 
                 fetch(utils.urlprefix+'/api/resume/user',{
                     method:'POST',
                     mode: 'cors', 
                     headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        },
                     body: JSON.stringify(record)
                     }).then((response) => {
                         console.log('response:',response.ok)
                         return response.json();
                     }).then((data) => {
                         this.setState({  //取消选中行
                             selectedRowKeys: [ ],  
                             selectedRows: null
                         })
                         this.request();
                         message.success('恢复成功');
                         return data;
                     }).catch( (e)=> {  
                         this.setState({  //取消选中行
                             selectedRowKeys: [ ],  
                             selectedRows: null
                         })
                         console.log(e);
                     }) 
                 
                 //发送恢复请求
                
                 
                  
             }
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
             title:'删除用户',
             content:'您确认要删除此用户吗？'+record.username ,
             onOk:()=>{ 
                
                
                 fetch(utils.urlprefix+'/api/users',{
                     method:'DELETE',
                     mode: 'cors',
                     headers: { 
                        "Authorization":"Basic "+cookie.load("at") 
                        }, 
                     body:JSON.stringify(record)
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
                         message.success('删除成功');
                         //发送删除请求
                         this.request(this.props.currentcluster);
                         console.log(e);
                     }) 
                 message.success('删除成功');
                 //发送删除请求
                 this.request();
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
         }
         //点击搜索按钮
     handleSearch = ()=>{
             //console.log('this.state.searchname:',this.state.searchname)
             /*var date = new Date('2019-10-24T10:01:30Z')
             function formatDate(date) {
               var year = date.getFullYear()
               var month = format(date.getMonth() + 1)
               var da = format(date.getDate())
               var h = format(date.getHours())
               var m = format(date.getMinutes())
               var s = format(date.getSeconds())
               return year + '-' + month + '-' + da + ' ' + h + ':' + m + ':' + s
             }
             function format(val) {
               return Number(val) < 10 ? '0' + val : '' + val
             }
             console.log(formatDate(date))*/
             /*Axios.get("http://localhost:9090/api/clusters")
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });

             new Promise((resolve,reject)=>{Axios({
                url:utils.urlprefix+"/api/clusters",
                method:'get',
                baseURL:utils.urlprefix,
                timeout:5000, 
            }).then((response)=>{
                if (response.status == '200'){
                    let res = response.data;
                    if (res.code == '0'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                } 
                 })
          }); */
        
            console.log('test:')
            //fetch(`http://192.168.119.129:9090/api/users/`+cookie.load(username)+`/module/application`,{   //Fetch方法
            //fetch(`http://192.168.119.129:9090/api/users/oijdasd/fed/`,{   //Fetch方法
         
        

              if(this.state.searchname!==''){
                 //console.log('this.state.searchname:',this.state.searchname)
                 //console.log(this.state.dataSource.map(item=>item.name.indexOf(this.state.searchname)))
                 this.setState({
                     searchdata:this.state.dataSource.filter(item=>item.username.indexOf(this.state.searchname)!==-1),
                     search:true
                 })
                  
             }else{
                 this.setState({ 
                     search:false
                 })
                 
             }
         }
 
     handleConfig = (e)=>{
         console.log('select config',e.target.value)
         this.setState({
             checked:e.target.value
         })
     }   
     testClick =()=>{
         var data={
             "metadata": {
                 "name": "k8s-fed",
                 "labels": {
                     "clsuter/role": null
                 }
             }
         }
        
         console.log(JSON.stringify(data))
         var url =utils.urlprefix+'/api/cluster/k8s-fed'
         fetch( url,{
             method:'PUT',
             mode: 'cors',
             headers: { 
                "Authorization":"Basic "+cookie.load("at") 
                },
             body: JSON.stringify(data),
             }).then((response) => {
                 console.log('response:',response.ok)
                 return response.json();
             }).then((data) => {
                 console.log('data:',data)
                /* data.map(item=>{
                     var datas=item.configdata
                     console.log('depdata:',JSON.parse(datas["data"]))
                    
                 }) */
                  return data;
             }).catch( (e)=> {  
                 console.log(e);
             })
     }
     /*testClick =()=>{
         
         var data=` {
             "name": "hellox",
             "status": "running",
             "namespace": "default",
             "image": "nginx",
             "createtime": "2019-10-22T03:15:41Z",
             "podsnum": [
                 1,
                 1
             ],
             "revision": "1",
             "env": [
                 {
                     "name": "CATTLE_SERVER",
                     "value": "https://10.103.240.133"
                 },
                 {
                     "name": "CATTLE_CA_CHECKSUM",
                     "value": "1e86d8e787eb0d6b3866f997b08373d5363151fe263b34884d0952d2032414da"
                 },
                 {
                     "name": "CATTLE_CLUSTER",
                     "value": "true"
                 },
                 {
                     "name": "CATTLE_K8S_MANAGED",
                     "value": "true"
                 }
             ],
             "label": [
                 {
                     "name": "app",
                     "value": "hellox"
                 },
                 {
                     "name": "cluster",
                     "value": "k8s-fed"
                 }
             ],
             "ports": [
                 {
                     "name": "http",
                     "containerPort": 80,
                     "protocol": "TCP"
                 }
             ],
             "schedule": "LABEL",
             "nodematch": [
                 {
                     "label": "beta.kubernetes.io/os",
                     "op": "NotIn",
                     "value": "windows"
                 }
             ],
             "request": {
                 "cpurequest": 100,
                 "memoryrequest": 128
             },
             "limit": {
                 "cpulimit": 100,
                 "memorylimit": 128
             }
         }`
         var configmap= {
             "name": "helloxx",
             "namespace": "default",
             "configdata": {
                 "a":  data
             },
             "createtime": "2019-09-11T09:56:43Z"
         }
        // console.log("datajson:"+JSON.stringify(data))
         fetch('http://localhost:9090/api/cluster/k8s-fed/configmap'
         ,{
             method:'POST',
             mode: 'cors', 
             body:JSON.stringify(configmap),
             }).then((response) => {
                 console.log('response:',response.ok)
                 return response.json();
             }).then((data) => {
                 console.log('data:',data)
                 //return data;
             }).catch(function (e) {
                 console.log(e);
             })
         
     }*/
    
     render(){
         const columns=[
             {
                 title:'用户名',
                 key:'Name',
                 dataIndex: 'Name',  
                  
             },
             {   
                 title:'状态',
                 key:'Status',
                 dataIndex:'Status',
                 render(status){ //第一个是running中的pod 第二个是pod总数
                     let config = {
                         '1': <Tag  color="#87d068" style={{cursor:'auto' }} >Active</Tag>,
                         '0': <Tag  color="#ff7875" style={{cursor:'auto' }} >inActive</Tag> ,  
 
                     }
                     return config[status];
                 },
                 
             },  
             
             {   
                 title:'角色',
                 key:'Rool',
                 dataIndex:'Rool', 
                 render(role){
                     let userrole={
                         '1':'管理员',
                         '0':'普通用户',
                     }
                     return userrole[role]
                 }
             }, 
             {   
                 title:'创建时间',
                 key:'Createtime',
                 dataIndex:'Createtime',  
             }, 
             {   
                 title:'授权时间',
                 key:'Permissiontime',
                 dataIndex:'Permissiontime',  
             },
             {   
                 title:'操作',
                 key:'operation' ,
                 render:(text,record)=>{
                     var opration  
                     var pause= <Menu.Item key="2">暂停</Menu.Item> 
                     var resume=<Menu.Item key="3">恢复</Menu.Item>
                     if(this.state.loginUser.role=='普通用户'){
                          opration = ( <Dropdown overlay={  
                             <Menu onClick={({key})=>this.onClick(key,text,record)}> 
                             <Menu.Item key="1">编辑</Menu.Item>
                           </Menu> 
                          } trigger={['click']}>
                              <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                         </Dropdown> )
                     } else{
                         opration = ( <Dropdown overlay={  
                             <Menu onClick={({key})=>this.onClick(key,text,record)}>
                             <Menu.Item key="1">编辑</Menu.Item> 
                             {record.status=='Active'?pause:resume
                             }  
                             <Menu.Item key="4">删除</Menu.Item> 
                           </Menu> 
                          } trigger={['click']}>
                              <img src={require('./../../resource/image/more.png')} alt="more" height='12' style={{cursor:'pointer' }}></img> 
                         </Dropdown> )
                     }
                     return opration
                 }
             }
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
 
 
         return(
             <HashRouter  > 
             { this.state.loading?(  <Spin tip="Loading...">
                 <Alert
                 message="Loading"
                 description="数据加载中"
                 type="info"
                 />
             </Spin>
             ): 
         (  
         <div style={{backgroundColor:'white', minHeight:'calc(60vh)'}} > 
            <div className="Dropdown-wrap" > 
                     <span style={{marginRight:10,fontSize:15}}>用户列表 </span>  
                 </div> 
          
             <div style={{ padding:10 ,marginTop:-10  }}>
                  <Divider style={{marginTop:-5}}></Divider>
 
                 <Row className='Button-wrap' style={{ marginTop:-10}}> 
                 <Col span='20'> 
                     <Button onClick={this.handleMutiPause}>暂停<Icon type='pause'></Icon></Button>
                     <Button onClick={this.handleMutiResume}>恢复<Icon type="caret-right" /></Button>
                      {this.state.loginUser.role=='管理员'? 
                      <Button onClick={this.handleMutiDelete}>删除<Icon type="delete" /></Button>:''
                     }    
                     <Input style={{display:'inline-block',width:150}} onChange={this.searchChange}></Input>
                     <Button onClick={this.handleSearch}>搜索<Icon type="search"  /></Button> 
                     
                 </Col>
                     <Col span='4' className='Button-right'> 
                     <CreateUser/>
                 </Col>
                 </Row>
                 <Table  
                     style={{marginTop:16}}
                     dataSource={this.state.search?this.state.searchdata:this.state.dataSource}
                     rowKey={record => record.Name}
                     rowSelection={rowSelection }
                     columns={columns }  
                     rowClassName={(record,index)=>index%2===0?'table1':'table2'}
                 />
                 <EditUser editvisible={this.state.editvisible}  handleUpdate={this.handleUpdate} dataSource={this.state.operationdata} ></EditUser>
             </div>  
         </div>
              )} 
         </HashRouter>
                 )
         }
     }