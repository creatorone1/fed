import React from 'react'
import { HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import App from './App'
import Login from './pages/login'
import Admin from './admin'
import Home from './pages/home';
import Buttons from './pages/ui/buttons'
import Modals from './pages/ui/modals'
import NoMatch from './pages/nomatch'
import Loadings from './pages/ui/loadings'
import Notice from './pages/ui/notice'
import Messages from './pages/ui/messages'
import Tabs from './pages/ui/tabs'
import Gallery from './pages/ui/gallery'
import Carousel from './pages/ui/carousel'
import FormLogin from './pages/form/login'
import FormRegister from './pages/form/register'
import BasicTable from './pages/table/basicTable'
import HighTable from './pages/table/highTable'
import Rich from './pages/rich' 
import Common from './common' 
import User from './pages/user/index'
import Bar from './pages/echarts/bar/index'
import Pie from './pages/echarts/pie/index'
import Line from './pages/echarts/line/index'
import Permission from './pages/permission'
import Service from './pages/service'
import Store from './pages/store'
import Application from './pages/application'
import Cluster from './pages/cluster'
import Node from './pages/node'
import DetaiNode from './pages/node/detailpage'
import DetaiCluster from './pages/cluster/detailpage'
import cookie from 'react-cookies' 
import Monitor from './pages/monitor'
import ImagePage from './pages/image'
import Auth from './pages/auth'

export default class ERouter extends React.Component{

    render(){

        //console.log("test:::::",this.state.appauth,this.state.serviceauth,this.state.storeauth,this.state.clusterauth,this.state.nodeauth)
        return (
            
            <HashRouter>
                <App>
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/common" render={() =>
                            <Common>
                               
                            </Common>
                        }
                        />
                        
                        <Route path="/" render={()=>
                            <Admin>
                                <Switch>
                                    <Route path='/home' component={Home} />
                                    <Route exact path="/application" render={() => (
                                        cookie.load("appauth") ? (
                                            <Redirect to="/applicationauth"/>
                                            ) : (
                                            <Redirect to="/auth"/>
                                            )
                                        )}/>
                                     <Route exact path="/image" render={() => (
                                        cookie.load("appauth") ? (
                                            <Redirect to="/imageauth"/>
                                            ) : (
                                            <Redirect to="/auth"/>
                                            )
                                        )}/>
                                    <Route exact path="/service" render={() => (
                                        cookie.load("serviceauth") ? (
                                            <Redirect to="/serviceauth"/>
                                            ) : (
                                            <Redirect to="/auth"/>
                                            )
                                        )}/>
                                    <Route exact path="/cluster" render={() => (
                                        cookie.load("clusterauth") ? (
                                            <Redirect to="/clusterauth"/>
                                            ) : (
                                            <Redirect to="/auth"/>
                                            )
                                        )}/>
                                    <Route exact path="/node" render={() => (
                                        cookie.load("nodeauth") ? (
                                            <Redirect to="/nodeauth"/>
                                            ) : (
                                            <Redirect to="/auth"/>
                                            )
                                        )}/>
                                    <Route exact path="/store" render={() => (
                                        cookie.load("storeauth") ? (
                                            <Redirect to="/storeauth"/>
                                            ) : (
                                            <Redirect to="/auth"/>
                                            )
                                        )}/>

                                    <Route path="/applicationauth" component={Application} onEnter={this.authRequired} />
                                    <Route path="/imageauth" component={ImagePage} />
                                    <Route path="/serviceauth" component={Service} />
                                    <Route path="/auth" component={Auth} />
                                    <Route path="/storeauth" component={Store} /> 
                                    <Route path='/cluster/detailpage' component={DetaiCluster}/>
                                    <Route path='/clusterauth' component={Cluster}/>
                                    <Route path='/node/detailpage' component={DetaiNode}/>
                                    <Route path='/nodeauth' component={Node}/>
                                    <Route path='/monitor' component={Monitor}/>
                                     
                                    <Route path="/ui/buttons" component={Buttons} />
                                    <Route path="/ui/modals" component={Modals} />
                                    <Route path="/ui/loadings" component={Loadings} />
                                    <Route path="/ui/notification" component={Notice} />
                                    <Route path="/ui/messages" component={Messages} />
                                    <Route path="/ui/tabs" component={Tabs} />
                                    <Route path="/ui/gallery" component={Gallery} />
                                    <Route path="/ui/carousel" component={Carousel} />
                                    <Route path="/form/login" component={FormLogin} />
                                    <Route path="/form/reg" component={FormRegister} />
                                    <Route path="/table/basic" component={BasicTable} />
                                    <Route path="/table/high" component={HighTable} />
                                    <Route path='/rich' component={Rich} />  
                                    { <Route path='/user' component={User} /> }
                                    <Route path="/charts/bar" component={Bar} />
                                    <Route path="/charts/pie" component={Pie} />
                                    <Route path="/charts/line" component={Line} />
                                    <Route path="/permission" component={Permission} />
                                    <Redirect to="/login" />
                                    {/* <Route component={NoMatch} /> */}
                                </Switch>
                            </Admin>         
                        } />
                    </Switch>
                </App>
            </HashRouter>
        );
    }
}