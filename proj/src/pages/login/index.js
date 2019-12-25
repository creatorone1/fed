import React from 'react'
import {Form, Input, Button} from 'antd'
import axios from '../../axios/index'
import Footer from '../../components/Footer'
import Utils from '../../utils/utils'
import './index.less'
import cookie from 'react-cookies' 
import utils from '../../utils/utils'
const FormItem = Form.Item;


export default class Login extends React.Component {
    state = {
        name:"",
        password:""
    };

    componentDidMount() {//每次进入登录页清除之前的登录信息
        
    }

    loginReq = (params) => {
        //window.location.href = '/#/';
        window.location.href = '/#/application';
    };
    /*
    loadUserInfo(){
        var userName=cookie.load("username")
        return userName
    };*/
    
    

    render() {
        return (
            <div className="login-page">
                <div className="login-header">
                    <div className="logo"> 
                         联邦云后台管理系统
                    </div>
                </div>
                <div className="login-content-wrap">
                    <div className="login-content">
                        <div className="word">联邦云 <br />让运维更加高效</div>
                        <div className="login-box">
                            <div className="error-msg-wrap">
                                <div
                                    className={this.state.errorMsg?"show":""}>
                                    {this.state.errorMsg}
                                </div>
                            </div>
                            <div className="title">欢迎登陆</div>
                            <LoginForm ref="login" loginSubmit={this.getConnect}/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

class LoginForm extends React.Component {
    state = {
        name:"",
        password:""
    };

    authRequired(modulename){
        console.log('test:')
        //fetch(`http://192.168.119.129:9090/api/users/`+cookie.load(username)+`/module/application`,{   //Fetch方法
        //fetch(`http://192.168.119.129:9090/api/users/oijdasd/module/`+modulename,{   //Fetch方法
        fetch(utils.urlprefix+'/api/users/'+cookie.load("username")+`/module/`+modulename,{   //Fetch方法
        method: 'GET', 
        mode:'cors',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            "Authorization":"Basic "+cookie.load("at") 
            },
    }).then((response) => {
            console.log('response:',response.ok)
            if(response.ok) {
                switch(modulename){
                    case "application":cookie.save("appauth",true); break;
                    case "service":cookie.save("serviceauth",true); break;
                    case "store":cookie.save("storeauth",true); break;
                    case "node":cookie.save("nodeauth",true); break;
               }
               //console.log("*******",this.state.appauth,this.state.serviceauth,this.state.storeauth,this.state.nodeauth)
            }
            return response.ok;
        }).then((data) => {
            console.log(data)
            return data;
        }).catch( (e)=> {  

            console.log(e);
        }) 

    };

    fedRequired(){
        console.log('test:')
        //fetch(`http://192.168.119.129:9090/api/users/`+cookie.load(username)+`/module/application`,{   //Fetch方法
        //fetch(`http://192.168.119.129:9090/api/users/oijdasd/fed/`,{   //Fetch方法
        fetch(utils.urlprefix+'/api/users/'+cookie.load("username")+`/fed`,{   //Fetch方法
        method: 'GET',
        mode:'cors',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            "Authorization":"Basic "+cookie.load("at") 
            },
        }).then((response) => {
                console.log('response:',response.ok)           
                if(response.ok) {
                    cookie.save("clusterauth",true)
                }
                return response.ok;
            }).then((data) => {
                console.log(data)
                return data;
            }).catch( (e)=> {  

                console.log(e);
            }) 
    };


    loginSubmit = (e)=> {
        e && e.preventDefault();
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var formValue = _this.props.form.getFieldsValue();
                var text = {
                    Name:formValue.username,
                    Password:formValue.password
                } //获取数据
                cookie.remove("username")
                cookie.remove("clusterauth")
                cookie.remove("appauth")
                cookie.remove("serviceauth")
                cookie.remove("storeauth")
                cookie.remove("nodeauth")
                cookie.remove("at")
                cookie.save("username",formValue.username,{path:"/"})
                cookie.save("at",utils.basicauth(formValue.username+":"+formValue.password))
                
                cookie.save("clusterauth",true) 
                this.fedRequired()
                this.authRequired("application")
                this.authRequired("service")
                this.authRequired("store")
                this.authRequired("node")
                
                
                //cookie.maxAge(60*60)
                var send = JSON.stringify(text);   //重要！将对象转换成json字符串
                fetch(utils.urlprefix+'/api/login',{   //Fetch方法
                    method: 'POST',
                    mode:'cors',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        "Authorization":"Basic "+utils.basicauth(formValue.username+":"+formValue.password)
                        },
                    body: send
                }).then((response) => {
                        console.log('response:',response)
                        if(response.ok) window.location.href = '/#/home';
                        else window.alert('验证失败，用户名或密码错误')
                        return response.json();
                    }).then((data) => {
                        return data;
                    }).catch( (e)=> {  

                        console.log(e);
                    }) 



            }
        });
    };

    checkUsername = (rule, value, callback) => {
        var reg = /^\w+$/;
        if (!value) {
            callback('请输入用户名!');
        } else if (!reg.test(value)) {
            callback('用户名只允许输入英文字母');
        } else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码!');
        } else {
            callback();
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        initialValue:'',
                        rules: [{validator: this.checkUsername}]
                    })(
                        <Input placeholder="用户名"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        initialValue:'',
                        rules: [{validator: this.checkPassword}]
                    })(
                        <Input type="password" placeholder="密码" wrappedcomponentref={(inst) => this.pwd = inst } />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.loginSubmit} className="login-form-button">
                        登录
                    </Button>
                </FormItem>
            </Form>
        )
    }
}
LoginForm = Form.create({})(LoginForm);
