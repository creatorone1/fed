package api

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	css "k8sfed/cluster/clusters"
	"k8sfed/cluster/deployment"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"

	"github.com/julienschmidt/httprouter"
)

var clusters []string
var clustername map[string]string
var fedclustername string
var chartrepo string
var tillermastername string
var harborusername string
var harborpassword string
var harbormaster string

/*
func init() {
	//fmt.Printf("new api")
	clusters = []string{"controller", "k8s-fed"}
	fedclustername = "k8s-fed"
	chartrepo = "k8s-fed"
	tillermastername = "k8s-fed"
	harborusername = "admin"
	harborpassword = "Harbor12345"
	harbormaster = "core.harbor.domain"
}*/
func ConfigLoad() error {

	fileName := path.Join("./", "k8s.conf")
	if _, err := os.Stat(fileName); os.IsNotExist(err) {
		fmt.Errorf("k8s.conf is not exists!")
		return err
	}

	contents := make(map[string]string)
	clusters = []string{}
	text, err := ioutil.ReadFile(fileName)
	if err != nil {
		return err
	}
	//fmt.Println("text", string(text))
	for _, line := range strings.Split(string(text), "\n") {
		//fmt.Println("line", strings.Split(string(text), "\n"))
		//fmt.Println("linelen", len(strings.Split(string(text), "\n")))
		//fmt.Println("index", index, "line", strings.HasPrefix(line, "#"))
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "#") || len(line) == 0 || len(line) == 1 {
			continue
		}

		/*if strings.Contains(line, "#") {
			line = strings.SplitN(line, "#", 2)[0]
		}*/
		if strings.HasPrefix(line, "$") {
			parts := strings.SplitN(line, "=", 2)
			//fmt.Printf("1 %d %q\n", len(parts[0]), parts[0])
			parts[0] = strings.TrimSpace(parts[0])
			parts[0] = strings.Trim(parts[0], "$")
			//fmt.Printf("2 %d %q\n", len(parts[0]), parts[0])
			parts[1] = strings.TrimSpace(parts[1])
			clusters = append(clusters, parts[1])

		} else {
			parts := strings.SplitN(line, "=", 2)
			//fmt.Printf("1 %d %q\n", len(parts[0]), parts[0])
			parts[0] = strings.TrimSpace(parts[0])
			//fmt.Printf("2 %d %q\n", len(parts[0]), parts[0])
			parts[1] = strings.TrimSpace(parts[1])

			contents[parts[0]] = parts[1]
		}

	}

	if _, ok := contents["fedclustername"]; !ok {
		return fmt.Errorf("fedclustername cann't null")
	}
	if _, ok := contents["chartrepo"]; !ok {
		return fmt.Errorf("chartrepo cann't null")
	}
	if _, ok := contents["tillermastername"]; !ok {
		return fmt.Errorf("tillermastername cann't null")
	}
	if _, ok := contents["harbormaster"]; !ok {
		return fmt.Errorf("harbormaster cann't null")
	}
	if _, ok := contents["harborusername"]; !ok {
		return fmt.Errorf("harborusername cann't null")
	}
	if _, ok := contents["harborpassword"]; !ok {
		return fmt.Errorf("harborpassword cann't null")
	}

	fedclustername = contents["fedclustername"]
	chartrepo = contents["chartrepo"]
	tillermastername = contents["tillermastername"]
	harborusername = contents["harborusername"]
	harborpassword = contents["harborpassword"]
	harbormaster = contents["harbormaster"]
	//fmt.Printf("clusters", clusters)
	//conf.ProtoAddr = contents["protoAddr"]
	//conf.Repository = contents["repository"]
	//conf.NfsServer = contents["ipAddr"]
	//conf.Heapster = contents["heapster"]
	//conf.NfsRoot = contents["path"]

	return nil
}

type middleWareHandler struct {
	r *httprouter.Router
}

/**设计Restful api*/
type HttpHandler func(w http.ResponseWriter, r *http.Request, p httprouter.Params) error

func createRouter(r *httprouter.Router) {

	m := map[string]map[string]HttpHandler{
		"GET": { //包括暂停 驱逐 恢复 等操作
			"/api/deployments":                  getAllDeps, //获取所有集群下面的dep
			"/api/cluster/:cluster/deployments": getDeps,
			//"/api/cluster/:cluster/namespace/:namespace/deployment/:deployment": getDep,
			"/api/clusters":                    getClusters,
			"/api/cluster/:cluster":            getCluster,
			"/api/nodes":                       getAllNodes,
			"/api/cluster/:cluster/nodes":      getNodes,
			"/api/cluster/:cluster/node/:node": getNode,
			"/api/charts":                      getCharts, //获取所有集群下面的app
			"/api/apps":                        getRelease,
			"/api/cluster/:cluster/apps":       getApps,
			"/api/cluster/:cluster/releases":   getRelease,
			//"/api/cluster/:cluster/namespace/:namespace/app/:app": getApp,
			"/api/cluster/:cluster/namespaces": getNamespaces,
			//"/api/fed/namespaces":                        getNamespaces,
			"/api/cluster/:cluster/template/deployments":                                getTemDeps, //获取模板服务
			"/api/cluster/:cluster/namespace/:namespace/deployment/:deployment/history": getHistory,
			"/api/cluster/:cluster/pause/deployments":                                   pauseDeps,  //批量暂停 url 传json数据 包括服务名称和服务命名空间
			"/api/cluster/:cluster/resume/deployments":                                  resumeDeps, //批量恢复 url 传json数据 包括服务名称和服务命名空间
			"/api/cluster/:cluster/configmaps":                                          getConfigMaps,
			"/api/cluster/:cluster/namespace/:namespace/configmaps":                     getConfigMapsbyNm,
			//"/api/cluster/:cluster/template/deployments": getTemDeps,
			"/api/cluster/:cluster/template/resources":  getTemRes, // 从configMap 获取模板资源数据 可以设置"type"="temRes"获取config中模板资源
			"/api/cluster/:cluster/ingresses":           getIngs,
			"/api/cluster/:cluster/services":            getSvcs,
			"/api/cluster/:cluster/pvcs":                getPVCs,
			"/api/cluster/:cluster/pvs":                 getPVs,
			"/api/cluster/:cluster/scs":                 getSCs,
			"/api/cluster/:cluster/pause/nodes":         pauseNodes,
			"/api/cluster/:cluster/resume/nodes":        resumeNodes, //恢复
			"/api/cluster/:cluster/drain/nodes":         drainNodes,  //驱逐
			"/api/users":                                getUsers,
			"/api/pause/users":                          pauseUsers,
			"/api/resume/users":                         resumeUsers,
			"/api/users/:username/module/:modulename":   getUserModulePermission,
			"/api/users/:username/fed":                  getUserFedPermission,
			"/api/users/:username/cluster/:clustername": getUserClusterPermission,
			"/api/images":                               getImages,
		},
		"POST": { //创建
			"/api/app":                                  postApp,
			"/api/chartrepo":                            postChartRepo,
			"/api/cluster/:cluster/deployment":          postDep,
			"/api/cluster/:cluster/configmap":           postConfigMap,
			"/api/cluster/:cluster/template/deployment": potTemDep,  //创建config模板服务
			"/api/cluster/:cluster/template/resource":   postTemRes, //提交一个config模板资源
			"/api/cluster/:cluster/ingress":             postIng,
			"/api/cluster/:cluster/service":             postSvc,
			"/api/cluster/:cluster/pvc":                 postPVC,
			"/api/cluster/:cluster/pv":                  postPV,
			"/api/cluster/:cluster/sc":                  postSC,
			"/api/cluster/:cluster":                     postCluster,
			"/api/cluster/:cluster/namespace":           postNamespace,
			"/api/user":                                 postUser,
			"/api/login":                                userLogin,
			"/api/logout":                               userLogout,
			"/api/pause/user":                           pauseUser,
			"/api/pause/users":                          pauseUsers,
			"/api/resume/user":                          resumeUser,
			"/api/resume/users":                         resumeUsers,
			"/api/charts":                               postChart,
		},
		"DELETE": { //删除
			"/api/cluster/:cluster/app/:app":                                    deleteApp, //不分命名空间
			"/api/cluster/:cluster/namespace/:namespace/deployment/:deployment": deleteDep,
			"/api/cluster/:cluster/releases":                                    deleteReleases, //批量删除url传json数据{items:[{name,namespace},{}]}
			"/api/charts":                                                       deleteCharts,
			"/api/cluster/:cluster/deployments":                                 deleteDeps,   //批量删除url传json数据{items:[{name,namespace},{}]}
			"/api/cluster/:cluster/template/resources":                          deleteTemRes, //批量删除url传json数据{items:[{name,namespace},{}]}
			"/api/cluster/:cluster/ingresses":                                   deleteIngs,
			"/api/cluster/:cluster/services":                                    deleteSvcs,
			"/api/cluster/:cluster/pvcs":                                        deletePVCs,
			"/api/cluster/:cluster/pvs":                                         deletePVs,
			"/api/cluster/:cluster/scs":                                         deleteSCs,
			"/api/cluster/:cluster/nodes":                                       deleteNodes,
			"/api/clusters":                                                     deleteClusters,
			"/api/cluster/:cluster/namespaces":                                  deleteNamespaces,
			"/api/users":                                                        deleteUsers,
			"/api/cluster/:cluster/configmaps":                                  deleteConfigMaps,
			"/api/cluster/:cluster/pods":                                        deletePods,
			"/api/imagerepos":                                                   deleteImageRepos,
			"/api/imagetags":                                                    deleteImageTags,
		},
		"PUT": { //更新  包括扩容,      回滚
			"/api/chartrepo":                          putChartRepo,
			"/api/cluster/:cluster/app":               updateApp,
			"/api/cluster/:cluster/app/:app/rollback": rollbackApp,
			"/api/cluster/:cluster/namespace/:namespace/deployment/:deployment":          updateDep,
			"/api/cluster/:cluster/namespace/:namespace/deployment/:deployment/scale":    scaleDep,
			"/api/cluster/:cluster/namespace/:namespace/deployment/:deployment/rollback": rollbackDep,
			"/api/cluster/:cluster/namespace/:namespace/template/resource/:resource":     updateTemRes,
			"/api/cluster/:cluster/namespace/:namespace/ingress/:ingress":                updateIng,
			"/api/cluster/:cluster/namespace/:namespace/service/:service":                updateSvc,
			"/api/cluster/:cluster/pv/:pv":                                               updatePV,
			"/api/cluster/:cluster/sc/:sc":                                               updateSC,
			"/api/cluster/:cluster/node/:node":                                           updateNode,
			"/api/cluster/:cluster":                                                      updateCluster,
			"/api/user":                                                                  updateUser,
		},
		"OPTIONS": {},
		"PATCH":   {},
	}

	for method, routes := range m { //依次读取上面map中的key value
		for route, fct := range routes {
			localRoute := route
			localFct := fct
			localMethod := method

			f := makeHttpHandler(localMethod, localRoute, localFct)
			r.Handle(localMethod, localRoute, f)
		}
	}

}

func NewMiddleWareHandler(r *httprouter.Router) http.Handler {
	m := middleWareHandler{}
	m.r = r
	return m
}

func (m middleWareHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	//check session 检测session合法性
	//把Sessionid 加在 Header 中发送过来，从Header中读取Sessionid检验它的有效性
	/*var f = false
	if !f { //如果校验通过再执行接下来的操作
		io.WriteString(w, "wrong op")
	} else {
		m.r.ServeHTTP(w, r)
	}*/

	//w.Header().Set("Content-Type", "application/json")
	writeCorsHeaders(w, r) //解决跨域访问
	m.r.ServeHTTP(w, r)

}

/**注册api*/
func RegisterHandlers() *httprouter.Router {
	router := httprouter.New()
	/**view*/
	viewRouter(router)

	/**core handlers add*/
	createRouter(router)
	return router
}

// 添加头
func makeHttpHandler(localMethod string, localRoute string, handlerFunc HttpHandler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		//writeCorsHeaders(w, r)
		w.Header().Set("Content-Type", "application/json")
		if err := handlerFunc(w, r, p); err != nil {
			fmt.Printf("%v\n", err)
		}
	}
}

//解决跨域访问的头
func writeCorsHeaders(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	w.Header().Add("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS,PATCH")
}

/**
Handlers
*/
func getDeps(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {
	//w.Header().Set("Content-Type", "application/json")
	var clustername = p.ByName("cluster")
	//dataSource = append(dataSource, deps.Items...)
	dataSource, errd := ListDeps(clustername)
	if errd != nil {
		// handle error
		return errd
	}

	depsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(depsdata)
	/*resp2, _, err2 := utils.Call("GET", "/apis/apps/v1beta1/deployments", "10.103.240.130:8080", nil)
	body2, err2 := ioutil.ReadAll(resp2)
	if err2 != nil {
		// handle error
		return err2
	}
	//fmt.Printf("body2%s /n code%v", body2, code)
	w.Write(body2)*/

	/*resp, err := http.Get("http://10.103.240.130:8080/apis/apps/v1beta1/deployments")

	if err != nil {
		// handle error
		return err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		// handle error
		return err
	}*/
	//w.Write(body)

	//deployments  :=&Deployments{} //必须这样声明
	//err2 :=json.Unmarshal(body,deployments) //解析成结构体对象
	//deps,err:=json.Marshal(deployments)     //将结构体对象在转化为json数据
	//fmt.Fprintf(w,string(deployments))
	//if err2 != nil {
	// handle error
	//}
	//fmt.Printf("%s ", body)
	fmt.Println("Getdeps被访问！")

	//uname := p.ByName("cluster")
	//io.WriteString(w, "get deps")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func getHistory(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {
	//w.Header().Set("Content-Type", "application/json")
	fmt.Println("getHistory被访问！")
	var clustername = p.ByName("cluster")
	var namespace = p.ByName("namespace")
	var dep = p.ByName("deployment")
	dataSource, errd := ListHistory(clustername, namespace, dep)
	if errd != nil {
		// handle error
		return errd
	}

	hisdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(hisdata)
	return nil
}

func getDep(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("Getdep被访问！")
	fmt.Println(p.ByName("cluster"))

	//uname := p.ByName("cluster")
	io.WriteString(w, "get dep"+p.ByName("cluster"))
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func getAllDeps(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println(" getAllDeps被访问！获取所有集群的deps")
	w.Header().Set("Content-Type", "application/json")
	//var list = append(clusters, clusters...)
	var dataSource = []*deployment.Deployment{}
	for _, item := range clusters {
		deps := &deployment.Deployments{} //声明结构体
		if err := deps.List(item + ":8080"); err != nil {
			//fmt.print
			return err
		}
		dataSource = append(dataSource, deps.Items...)
	}
	depsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	//io.WriteString(w, "get all dep")
	w.Write(depsdata) //返回json数据byte数据类型
	return nil
}

func getClusters(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	//w.Header().Set("Content-Type", "application/json")
	fmt.Println("getClusters被访问！")
	//var clustername = p.ByName("cluster")
	//var fedclustername = "k8s-fed" //以后从文件读取联邦集群的名字
	//dataSource = append(dataSource, deps.Items...)
	health, errh := css.GetFedHealth(fedclustername + ":31667")

	if errh == nil && health == "ok" { //如果联邦正常工作
		fmt.Println("fed is active")
		dataSource, errc := ListCluster(fedclustername)
		if errc != nil {
			// handle error
			return errc
		}

		depsdata, err := json.Marshal(dataSource)
		if err != nil {
			// handle error
			return err
		}
		w.Write(depsdata)
	} else {
		fmt.Println("fed is inactive")
		//fmt.Printf("clusters", clusters)
		dataSource, errc := ListCluster2(clusters)
		if errc != nil {
			// handle error
			return errc
		}

		depsdata, err := json.Marshal(dataSource)
		if err != nil {
			// handle error
			return err
		}
		w.Write(depsdata)
	}

	//fmt.Printf("%v", utils.A)
	/*resp2, _, err1 := utils.Call("GET", "/apis/federation/v1beta1/clusters", "10.103.240.130:8001", nil)
	if err1 != nil {
		// handle error
		return err1
	}
	body2, err2 := ioutil.ReadAll(resp2)
	if err2 != nil {
		// handle error
		return err2
	}
	//fmt.Printf("body2%s /n code%v", body2, code)
	w.Write(body2)*/

	//uname := p.ByName("cluster")
	//io.WriteString(w, "getClusters")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func getCluster(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getCluster被访问！")
	var clustername = p.ByName("cluster")
	//dataSource = append(dataSource, deps.Items...)

	dataSource, errc := ListCluster(clustername)
	if errc != nil {
		// handle error
		return errc
	}

	depsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(depsdata)
	//uname := p.ByName("cluster")
	return nil
}
func getAllNodes(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {
	fmt.Println("getAllNodes被访问！")
	var clusters, errc = ListCluster(fedclustername)
	if errc != nil {
		// handle error
		return errc
	}
	var clusternames []string

	for _, item := range clusters {
		clusternames = append(clusternames, item.Name)
	}
	//var clusternames = []string{"controller", "k8s-fed"}
	var dataSource = []Node{}
	for _, item := range clusternames {
		data, errl := ListNode(item)
		if errl != nil {
			// handle error
			fmt.Print(errl)
			//return errl
		}
		dataSource = append(dataSource, data...)
	}

	nodesdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(nodesdata)
	//w.Write(body) 返回json数据byte数据类型
	return nil
}
func getNodes(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getNodes被访问！")
	var clustername = p.ByName("cluster")
	dataSource, errl := ListNode(clustername)
	if errl != nil {
		// handle error
		//sendErrorResponse(w, ErrorGet)
		//fmt.Printf("get node error")
		return errl
	}
	nodesdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		//sendErrorResponse(w, ErrorGet)
		return err
	}
	w.Write(nodesdata)
	//w.Write(body) 返回json数据byte数据类型
	return nil
}
func getNode(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getNode被访问！")

	io.WriteString(w, "getNode")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func getCharts(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getAllCharts被访问！")

	dataSource, errn := ListChart(chartrepo)
	if errn != nil {
		// handle error
		return errn
	}
	nmsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(nmsdata)
	//w.Write(body) 返回json数据byte数据类型

	return nil
}

//Apps=Releases
//helm每个集群上都有，需要查询每个集群上的tiller
func getApps(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getApps被访问！")
	var clustername = p.ByName("cluster")

	dataSource, errn := ListRelease(clustername) //
	if errn != nil {
		// handle error
		return errn
	}
	nmsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(nmsdata)
	//w.Write(body) 返回json数据byte数据类型

	return nil
}
func getRelease(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getReleases被访问！")
	var clustername = p.ByName("cluster")

	dataSource, errn := ListRelease(clustername)
	if errn != nil {
		// handle error
		return errn
	}
	nmsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(nmsdata)
	//w.Write(body) 返回json数据byte数据类型

	return nil
}

func postApp(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("PostApp被访问！")

	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var ir = &ReleaseMeta{}
	if err := json.Unmarshal(data, ir); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(dep)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	_, errc := CreateRelease(*ir)

	if errc != nil {
		sendErrorResponse(w, ErrorCreate)
		return errc
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil
}

func getNamespaces(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getNamespaces被访问！")
	var clustername = p.ByName("cluster")

	dataSource, errn := ListNamespace(clustername)
	if errn != nil {
		// handle error
		return errn
	}
	nmsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(nmsdata)
	//w.Write(body) 返回json数据byte数据类型

	return nil
}

func getTemDeps(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getTemDeps被访问！")
	var clustername = p.ByName("cluster")

	dataSource, errd := ListTemDep(clustername)
	if errd != nil {
		// handle error
		return errd
	}
	depssdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(depssdata)
	return nil
}

func pauseDeps(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("pauseDeps被访问！")

	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorUpdate)
		return errj
	}
	//fmt.Print(datas)
	//var flag = false
	for _, item := range datas.Items {
		_, err := PauseDep(clustername, item.Namespace, item.Name)
		if err != nil {
			fmt.Print(err)
			//io.WriteString(w, "wrong")
			//sendErrorResponse(w, ErrorUpdate)
			//return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write(body) //返回json数据byte数据类型
	return nil
}

func resumeDeps(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("resumeDeps被访问！")

	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorUpdate)
		return errj
	}
	//fmt.Print(datas)
	//var flag = false
	for _, item := range datas.Items {
		_, err := ResumeDep(clustername, item.Namespace, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			fmt.Print(err)
			//sendErrorResponse(w, ErrorUpdate)
			//return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write(body) //返回json数据byte数据类型
	return nil
}

func getConfigMaps(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getConfigMaps被访问！")
	var clustername = p.ByName("cluster")
	dataSource, errc := ListConfigMap(clustername)
	if errc != nil {
		// handle error
		return errc
	}

	depsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(depsdata)
	return nil
}
func getConfigMapsbyNm(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getConfigMapsbyNm被访问！")
	var clustername = p.ByName("cluster")
	var namespace = p.ByName("namespace")
	dataSource, errc := ListConfigMapbyNm(namespace, clustername)

	if errc != nil {
		// handle error
		return errc
	}

	depsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(depsdata)
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func getTemRes(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	//从configMap 获取模板资源数据 可以设置"type"="temRes"获取config中模板资源
	fmt.Println("getTemRes被访问！")
	var clustername = p.ByName("cluster")

	dataSource, errt := ListTemRes(clustername)
	if errt != nil {
		// handle error
		return errt
	}
	temdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(temdata)
	return nil
}

func getIngs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {
	//w.Header().Set("Content-Type", "application/json")
	fmt.Println("getIngs被访问！")
	var clustername = p.ByName("cluster")
	dataSource, errc := ListIngress(clustername)
	if errc != nil {
		// handle error
		return errc
	}

	ingsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(ingsdata)
	return nil
}

/**
func getSvcs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getSvcs被访问！")
	svcs := &service.Services{} //声明结构体
	var clustername = p.ByName("cluster")
	if err := svcs.List(clustername + ":8080"); err != nil {
		return err
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []Service{}
	for _, item := range svcs.Items {
		var svc = Service{}
		var ports = []SVCPort{}
		var labels = []Label{}
		var externalip []string
		svc.Name = item.Meta.Name
		svc.Namespace = item.Meta.Namespace
		svc.Createtime = item.Meta.CreationTimeStamp
		svc.Type = item.Spe.Type

		for _, p := range item.Spe.Ports {
			var port SVCPort
			port.Name = p.Name
			port.Port = p.Port
			port.Protocol = p.Protocol
			port.Targetport = p.TargetPort
			port.Nodeport = p.NodePort
			ports = append(ports, port)
		}
		svc.Ports = ports

		for k, v := range item.Meta.Labels {
			var l Label
			l.Name = k
			l.Value = v
			labels = append(labels, l)
		}
		svc.Label = labels

		for _, item := range item.Spe.ExternalIPs {

			externalip = append(externalip, item)
		}
		svc.Externalip = externalip
		svc.Target = item.Spe.Selector

		var workloads []string
		//deps, _ := ListDeps(clustername)
		deps := &deployment.Deployments{} //声明结构体
		if err := deps.List(clustername + ":8080"); err != nil {
			return err
		}
		//if svc.Target == nil {
		//	fmt.Printf("%v", svc.Target)
		//	fmt.Printf("\n %v", svc.Name)
		//}
		for _, item := range deps.Items {
			var labels = item.Meta.Labels
			var flag = true
			var loop = false //判断是否存在target
			for k := range svc.Target {
				loop = true
				if svc.Target[k] != labels[k] {
					flag = false
				}
			}
			if flag && loop {
				workloads = append(workloads, item.Meta.Name)
			}
		}
		svc.Workload = workloads

		dataSource = append(dataSource, svc)

	}

	svcsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(svcsdata)
	//w.Write(body) 返回json数据byte数据类型
	return nil
}*/
func getSvcs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getSvcs被访问！")

	var clustername = p.ByName("cluster")
	dataSource, errs := ListSvc(clustername)
	if errs != nil {
		// handle error
		return errs
	}
	svcsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(svcsdata)

	return nil
}
func getPVCs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getPVCs被访问！")
	var clustername = p.ByName("cluster")

	/*pvcs := &pvc.Pvcs{} //声明结构体
	if err := pvcs.List(clustername + ":8080"); err != nil {
		return err
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []PVC{}
	for _, item := range pvcs.Items {
		var pvc = PVC{}

		pvc.Name = item.Meta.Name
		pvc.Namespace = item.Meta.Namespace
		pvc.Status = item.Status.Phase
		pvc.Size = item.Spe.Resources.Requests.Storage
		pvc.Storageclass = item.Spe.StorageClassName
		pvc.Volume = item.Spe.VolumeName
		pvc.Createtime = item.Meta.CreationTimeStamp
		pvc.Accessmodes = item.Spe.AccessModes

		dataSource = append(dataSource, pvc)
	}*/
	dataSource, errd := ListPVC(clustername)
	if errd != nil {
		// handle error
		return errd
	}
	pvcsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(pvcsdata)
	return nil
}

func getPVs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getPVs被访问！")

	var clustername = p.ByName("cluster")

	dataSource, errd := ListPV(clustername)
	if errd != nil {
		// handle error
		return errd
	}
	pvsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(pvsdata)
	return nil
}

func getSCs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getSCs被访问！")

	var clustername = p.ByName("cluster")

	dataSource, errd := ListSC(clustername)
	if errd != nil {
		// handle error
		return errd
	}
	scsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(scsdata)
	return nil
}
func getImages(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getImages被访问！")

	dataSource, errd := ListImages(harbormaster, harborusername, harborpassword)
	if errd != nil {
		// handle error
		return errd
	}
	igsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(igsdata)
	return nil
}
func pauseNodes(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("pauseNodes被访问！")

	//var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorUpdate)
		return errj
	}
	//fmt.Print(datas)
	//var flag = false
	for _, item := range datas.Items {
		_, err := PauseNode(item.Clustername, item.Name)
		if err != nil {
			fmt.Print(err)
			//io.WriteString(w, "wrong")
			//sendErrorResponse(w, ErrorUpdate)
			//return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write(body) //返回json数据byte数据类型
	return nil
}

func resumeNodes(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("resumeNodes被访问！")

	//var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorUpdate)
		return errj
	}
	//fmt.Print(datas)
	//var flag = false
	for _, item := range datas.Items {
		_, err := ResumeNode(item.Clustername, item.Name)
		if err != nil {
			fmt.Print(err)
			//io.WriteString(w, "wrong")
			//sendErrorResponse(w, ErrorUpdate)
			//return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write(body) //返回json数据byte数据类型
	return nil
}

func drainNodes(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("drainNodes被访问！")

	//var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorUpdate)
		return errj
	}
	//fmt.Print(datas)
	//var flag = false
	for _, item := range datas.Items {
		_, err := DrainNode(item.Clustername, item.Name)
		if err != nil {
			fmt.Print(err)
			//io.WriteString(w, "wrong")
			//sendErrorResponse(w, ErrorUpdate)
			//return err
		}
		//	w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	return nil
}

func postDep(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postDep被访问！")
	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var dep = &Deployment{}
	if err := json.Unmarshal(data, dep); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(dep)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	_, errc := CreateDep(*dep, clustername)

	if errc != nil {
		sendErrorResponse(w, ErrorCreate)
		return errc
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil
}

func postChartRepo(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {
	fmt.Println("postChartRepo被访问！")
	data, err := ioutil.ReadAll(r.Body)
	chartrepo = string(data[:])
	/*datas, errj := json.Marshal(dep)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	if err != nil {
		sendErrorResponse(w, ErrorCreate)
		return err
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil
}
func postConfigMap(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postConfigMap被访问！")
	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var configmap = &ConfigMap{}
	if err := json.Unmarshal(data, configmap); err != nil {
		return err
	}
	/*depdata := configmap.ConfigData["a"].(string)
	var dep = &Deployment{}
	if err := json.Unmarshal([]byte(depdata), dep); err != nil {
		return err
	}
	_, errj := json.Marshal(dep)
	if errj != nil {
		return errj
	}*/
	//w.Write(datas)

	_, errp := CreateConfigMap(*configmap, clustername)

	if errp != nil {
		sendErrorResponse(w, ErrorCreate)
		return errp
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil
}
func potTemDep(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("potTemDep被访问！")
	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	_, errt := CreateTemDep(data, clustername)

	if errt != nil {
		sendErrorResponse(w, ErrorCreate)
		return errt
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil
}

func postTemRes(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postTemRes被访问！")

	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	_, errt := CreateTemRes(data, clustername)

	if errt != nil {
		sendErrorResponse(w, ErrorCreate)
		return errt
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil
}

func postIng(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postIng被访问！")

	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var ing = &Ingress{}
	if err := json.Unmarshal(data, ing); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(svc)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	_, errc := CreateIngress(*ing, clustername)

	if errc != nil {
		sendErrorResponse(w, ErrorCreate)
		return errc
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)

	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func postSvc(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postSvc被访问！")
	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var svc = &Service{}
	if err := json.Unmarshal(data, svc); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(svc)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	_, errc := CreateSvc(*svc, clustername)

	if errc != nil {
		sendErrorResponse(w, ErrorCreate)
		return errc
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)

	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func postPVC(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postPVC被访问！")
	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var pvc = &PVC{}
	if err := json.Unmarshal(data, pvc); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(pvc)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	_, errp := CreatePVC(*pvc, clustername)

	if errp != nil {
		sendErrorResponse(w, ErrorCreate)
		return errp
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil
}

func postPV(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postPV被访问！")

	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var pv = &PV{}
	if err := json.Unmarshal(data, pv); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(pv)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	_, errp := CreatePV(*pv, clustername)

	if errp != nil {
		sendErrorResponse(w, ErrorCreate)
		return errp
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)

	return nil
}

func postSC(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postSC被访问！")

	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var sc = &StorageClass{}
	if err := json.Unmarshal(data, sc); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(pv)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	_, errp := CreateSC(*sc, clustername)

	if errp != nil {
		sendErrorResponse(w, ErrorCreate)
		return errp
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil
}

func postCluster(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postCluster被访问！")

	io.WriteString(w, "postCluster")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func postNamespace(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postNamespace被访问！")
	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var n = &Namespace{}
	if err := json.Unmarshal(data, n); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(pvc)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	_, errp := CreateNamespace(*n, clustername)

	if errp != nil {
		sendErrorResponse(w, ErrorCreate)
		return errp
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil
}
func postChart(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postChart被访问")
	//var clustername = p.ByName("cluster")
	// 根据字段名获取表单文件
	formFile, _, err := r.FormFile("file")
	//formFiles, _ := json.Marshal(formFile)
	//fmt.Print("formFile", string(formFiles))
	//headers, _ := json.Marshal(header)
	//fmt.Print("\n header", string(headers))
	//fmt.Print("\n err %s", err)

	if err != nil {
		log.Printf("Get form file failed: %s\n", err)
		return err
	}
	defer formFile.Close()
	// 创建保存文件
	/*destFile, err := os.Create("./" + "test.txt")
	if err != nil {
		log.Printf("Create failed: %s\n", err)
		return err
	}
	defer destFile.Close()

	// 读取表单文件，写入保存文件
	_, err = io.Copy(destFile, formFile)
	if err != nil {
		log.Printf("Write file failed: %s\n", err)
		return err
	}*/

	body, erru := uploadChart(chartrepo, formFile)

	if erru != nil {
		//sendErrorResponse(w, ErrorCreate)
		return erru
	}
	fmt.Print(string(body))
	io.WriteString(w, `{
		"name": "file",
		"status": "done"
	}`)

	return nil
}

func deleteApp(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteApp被访问！")

	io.WriteString(w, "deleteApp")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func deleteDep(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteDep被访问！")
	var clustername = p.ByName("cluster")
	var namespace = p.ByName("namespace")
	var name = p.ByName("deployment")

	_, err := DeleteDep(clustername, namespace, name)

	if err != nil {
		sendErrorResponse(w, ErrorDelete)
		return err
	}
	sendNormalResponse(w, NormalOp)
	return nil
}

func deleteReleases(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteReleases被访问！")

	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteRelease(clustername, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			fmt.Print(err)
			//sendErrorResponse(w, ErrorDelete)
			//return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write(body) 返回json数据byte数据类型
	return nil
}
func deleteCharts(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteCharts被访问！")

	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteChart(chartrepo, item.Name, item.Version)
		if err != nil {
			//io.WriteString(w, "wrong")
			fmt.Print(err)
			//sendErrorResponse(w, ErrorDelete)
			//return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func deleteDeps(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteDeps被访问！")
	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteDep(clustername, item.Namespace, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			//sendErrorResponse(w, ErrorDelete)
			fmt.Print(err)
			//return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func deleteTemRes(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteTemRes被访问！")

	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//fmt.Print(datas)
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteTemRes(clustername, item.Namespace, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			fmt.Printf("%v\n", err)
			//sendErrorResponse(w, ErrorDelete)
			//return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)

	return nil
}

func deleteIngs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteIngs被访问！")

	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")

	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//fmt.Print(datas)
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteIngress(clustername, item.Namespace, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			//sendErrorResponse(w, ErrorDelete)
			//return err
			fmt.Print(err)
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	return nil
}

func deleteSvcs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteSvcs被访问！")
	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteSvc(clustername, item.Namespace, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			sendErrorResponse(w, ErrorDelete)
			return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write("success")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func deletePVCs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deletePVCs被访问！")
	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeletePVC(clustername, item.Namespace, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			//sendErrorResponse(w, ErrorDelete)
			//return err
			fmt.Print(err)
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	return nil
}

func deletePVs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deletePVs被访问！")

	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeletePV(clustername, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			sendErrorResponse(w, ErrorDelete)
			return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	return nil
}

func deleteSCs(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteSCs被访问！")

	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteSC(clustername, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			sendErrorResponse(w, ErrorDelete)
			return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	return nil
}

func deleteNodes(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteNodes被访问！")

	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteNode(item.Clustername, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			sendErrorResponse(w, ErrorDelete)
			return err
		}
		//w.Write(body)
	}

	sendNormalResponse(w, NormalOp)
	return nil
}

func deleteClusters(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteClusters被访问！")

	//var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteCluster(item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			sendErrorResponse(w, ErrorDelete)
			return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	return nil
}

func deleteNamespaces(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteNamespaces被访问！")

	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteNamespace(clustername, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			sendErrorResponse(w, ErrorDelete)
			return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	return nil
}

func deleteConfigMaps(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteConfigMaps被访问！")
	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteConfigMap(clustername, item.Namespace, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			sendErrorResponse(w, ErrorDelete)
			return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write("success")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}
func deletePods(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deletePods被访问！")
	var clustername = p.ByName("cluster")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeletePod(clustername, item.Namespace, item.Name)
		if err != nil {
			//io.WriteString(w, "wrong")
			sendErrorResponse(w, ErrorDelete)
			return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write("success")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}
func deleteImageRepos(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteImageRepos被访问！")
	var jsondata = r.FormValue("data")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteImageRepo(harbormaster, item.Name, harborusername, harborpassword)
		if err != nil {
			//io.WriteString(w, "wrong")
			sendErrorResponse(w, ErrorDelete)
			return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write("success")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}
func deleteImageTags(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteImageTags被访问！")
	var jsondata = r.FormValue("data")
	var reponame = r.FormValue("reponame")
	//fmt.Print(jsondata)
	var datas = &MetaDatas{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorDelete)
		return errj
	}
	//var flag = false
	for _, item := range datas.Items {
		_, err := DeleteImageTag(harbormaster, item.Name, reponame, harborusername, harborpassword)
		if err != nil {
			//io.WriteString(w, "wrong")
			sendErrorResponse(w, ErrorDelete)
			return err
		}
		//w.Write(body)
	}
	sendNormalResponse(w, NormalOp)
	//w.Write("success")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func putChartRepo(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {
	fmt.Println("putChartRepo被访问！")
	data, err := ioutil.ReadAll(r.Body)
	chartrepo = string(data[:])
	/*datas, errj := json.Marshal(dep)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	if err != nil {
		sendErrorResponse(w, ErrorUpdate)
		return err
	}
	//w.Write(body)
	fmt.Println("new chartRepoAdd:", chartrepo)
	sendNormalResponse(w, NormalOp)
	return nil
}
func updateApp(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("updateRelease被访问！")

	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var re = &ReleaseMeta{}
	if err := json.Unmarshal(data, re); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(dep)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	body, erru := UpdateRelease(*re)

	if erru != nil {
		sendErrorResponse(w, ErrorUpdate)
		return erru
	}
	w.Write(body)
	//sendNormalResponse(w, NormalOp)
	return nil
}

func rollbackApp(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("rollbackApp被访问！")
	var clustername = p.ByName("cluster")
	var releasename = p.ByName("app")

	_, err := RollbackRelease(clustername, releasename)
	if err != nil {
		//io.WriteString(w, "wrong")
		sendErrorResponse(w, ErrorUpdate)
		return err
	}

	sendNormalResponse(w, NormalOp)
	//w.Write(body) //返回json数据byte数据类型
	return nil
}

func updateDep(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("updateDep被访问！")

	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var dep = &Deployment{}
	if err := json.Unmarshal(data, dep); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(dep)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/
	//fmt.Printf("UpdateDep NOW \n")
	//fmt.Printf("Dep NOW \v",dep)
	body, erru := UpdateDep(*dep, clustername)

	if erru != nil {
		sendErrorResponse(w, ErrorUpdate)
		return erru
	}
	w.Write(body)
	//sendNormalResponse(w, NormalOp)
	return nil
}

func scaleDep(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("scaleDep被访问！")

	var clustername = p.ByName("cluster")
	var namespace = p.ByName("namespace")
	var name = p.ByName("deployment")
	var repnum = r.FormValue("replicanum")

	//var flag = false
	var repnumi, erri = strconv.ParseInt(repnum, 10, 64)
	if erri != nil {
		//io.WriteString(w, "wrong")
		sendErrorResponse(w, ErrorUpdate)
		return erri
	}
	_, err := ScaleDep(clustername, namespace, name, repnumi)
	if err != nil {
		//io.WriteString(w, "wrong")
		sendErrorResponse(w, ErrorUpdate)
		return err
	}

	sendNormalResponse(w, NormalOp)
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func rollbackDep(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("rollbackDep被访问！")

	var clustername = p.ByName("cluster")
	var namespace = p.ByName("namespace")
	var name = p.ByName("deployment")
	var renum = r.FormValue("revision")

	//var flag = false
	var renumi, erri = strconv.ParseInt(renum, 10, 64)
	if erri != nil {
		//io.WriteString(w, "wrong")
		sendErrorResponse(w, ErrorUpdate)
		return erri
	}
	_, err := RollbackDep(clustername, namespace, name, renumi)
	if err != nil {
		//io.WriteString(w, "wrong")
		sendErrorResponse(w, ErrorUpdate)
		return err
	}

	sendNormalResponse(w, NormalOp)
	//w.Write(body) //返回json数据byte数据类型
	return nil
}

func updateTemRes(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("updateTemRes被访问！")

	io.WriteString(w, "updateTemRes")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func updateIng(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("updateIng被访问！")

	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var ing = &Ingress{}
	if err := json.Unmarshal(data, ing); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(dep)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	body, erru := UpdateIngress(*ing, clustername)

	if erru != nil {
		sendErrorResponse(w, ErrorUpdate)
		return erru
	}
	w.Write(body)
	//sendNormalResponse(w, NormalOp)
	return nil
}

func updateSvc(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("updateSvc被访问！")
	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var svc = &Service{}
	if err := json.Unmarshal(data, svc); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(svc)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	body, erru := UpdateSvc(*svc, clustername)

	if erru != nil {
		sendErrorResponse(w, ErrorUpdate)
		return erru
	}
	w.Write(body)
	return nil
}

func updatePV(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("updatePV被访问！")

	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var pv = &PV{}
	if err := json.Unmarshal(data, pv); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(svc)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	body, erru := UpdatePV(*pv, clustername)

	if erru != nil {
		sendErrorResponse(w, ErrorUpdate)
		return erru
	}
	w.Write(body)
	return nil
}

func updateSC(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("updateSC被访问！")

	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var sc = &StorageClass{}
	if err := json.Unmarshal(data, sc); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(svc)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	body, erru := UpdateSC(*sc, clustername)

	if erru != nil {
		sendErrorResponse(w, ErrorUpdate)
		return erru
	}
	w.Write(body)
	return nil
}

func updateNode(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("updateNode被访问！")

	var clustername = p.ByName("cluster")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var nd = &Node{}
	if err := json.Unmarshal(data, nd); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(dep)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	body, erru := UpdateNode(*nd, clustername)

	if erru != nil {
		sendErrorResponse(w, ErrorUpdate)
		return erru
	}
	w.Write(body)
	//sendNormalResponse(w, NormalOp)
	return nil
}

func updateCluster(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {
	fmt.Println("updateCluster被访问！")
	//var clustername = p.ByName("cluster")

	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var cs = &Cluster{}
	if err := json.Unmarshal(data, cs); err != nil {
		return err
	}
	/*datas, errj := json.Marshal(dep)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	body, erru := UpdateCluster(*cs)

	if erru != nil {
		sendErrorResponse(w, ErrorUpdate)
		return erru
	}
	w.Write(body)
	//sendNormalResponse(w, NormalOp)
	return nil

	/*data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		sendErrorResponse(w, ErrorUpdate)
		return err
	}*/
	//fmt.Println(clustername)
	//fmt.Println(data)

	/*
		var cs = &Cluster{}
		if err := json.Unmarshal(data, cs); err != nil {
			return err
		}*/
	/*datas, errj := json.Marshal(cs)
	if errj != nil {
		return errj
	}
	w.Write(datas)*/

	/*body, erru := UpdateCluster(clustername, data)

	if erru != nil {
		sendErrorResponse(w, ErrorUpdate)
		return erru
	}
	w.Write(body)
	//sendNormalResponse(w, NormalOp)
	return nil*/
}
