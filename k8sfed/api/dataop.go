package api

import (
	"fmt"
	"k8sfed/cluster"
	css "k8sfed/cluster/clusters"
	"k8sfed/cluster/configmap"
	"k8sfed/cluster/deployment"
	"k8sfed/cluster/namespace"
	nm "k8sfed/cluster/namespace"
	"k8sfed/cluster/node"
	"k8sfed/cluster/pod"
	"k8sfed/cluster/pv"
	"k8sfed/cluster/pvc"
	"k8sfed/cluster/service"
	"strconv"
	"strings"
)

func ListDeps(clustername string) ([]Deployment, error) {
	deps := &deployment.Deployments{} //声明结构体
	if err := deps.List(clustername + ":8080"); err != nil {
		return nil, err
	}
	//dataSource = append(dataSource, deps.Items...)
	dataSource := []Deployment{}
	for _, item := range deps.Items {
		var dep = Deployment{}
		var envs = []Env{}
		var labels = []Label{}
		var ports = []Port{}

		dep.Name = item.Meta.Name
		dep.Namespace = item.Meta.Namespace
		dep.Image = item.Spe.Template.Spe.Containers[0].Image
		dep.Createtime = item.Meta.CreationTimeStamp
		dep.Podsnum = append(dep.Podsnum, item.Status.ReadyReplicas)
		dep.Podsnum = append(dep.Podsnum, item.Spe.Replicas)

		dep.Revision = item.Meta.Annotation[`deployment.kubernetes.io/revision`]
		for _, env := range item.Spe.Template.Spe.Containers[0].Envs {
			var e Env
			e.Name = env.Name
			e.Value = env.Value
			envs = append(envs, e)
		}
		dep.Env = envs
		for k, v := range item.Meta.Labels {
			var l Label
			l.Name = k
			l.Value = v
			labels = append(labels, l)
		}
		dep.Label = labels
		for _, p := range item.Spe.Template.Spe.Containers[0].Ports {
			var port Port
			port.Name = p.Name
			port.ContainerPort = p.ContainerPort
			port.Protocol = p.Protocol
			ports = append(ports, port)
		}
		dep.Ports = ports
		dep.Schnodename = item.Spe.Template.Spe.NodeName
		if dep.Schnodename != "" {
			dep.Schedule = "NODE"
		}
		var cpuri int64
		var memoryri int64
		if item.Spe.Template.Spe.Containers[0].Resources != nil {
			if item.Spe.Template.Spe.Containers[0].Resources.Requests != nil {
				var cpur = item.Spe.Template.Spe.Containers[0].Resources.Requests.Cpu
				var memoryr = item.Spe.Template.Spe.Containers[0].Resources.Requests.Memory
				//var gpur=item.Spe.Template.Spe.Containers[0].Resources.Requests.cpu
				if strings.Index(cpur, "m") != -1 {
					x, _ := strconv.ParseInt((cpur[0:strings.Index(cpur, "m")]), 10, 64)
					cpuri = x
				}

				if strings.Index(memoryr, "M") != -1 {
					//fmt.Print(memoryr)
					x, _ := strconv.ParseInt((memoryr[0:strings.Index(memoryr, "M")]), 10, 64)
					memoryri = x
				} else if strings.Index(memoryr, "G") != -1 {
					x, _ := strconv.ParseInt((memoryr[0:strings.Index(memoryr, "G")]), 10, 64)
					memoryri = x * 1000
				}
			}

		}

		var request = ReRequest{
			Cpurequest:    cpuri,
			Memoryrequest: memoryri,
			//Gpurequest
		}
		dep.Request = request
		var cpuli int64
		var memoryli int64
		if item.Spe.Template.Spe.Containers[0].Resources != nil {
			if item.Spe.Template.Spe.Containers[0].Resources.Limits != nil {
				var cpul = item.Spe.Template.Spe.Containers[0].Resources.Limits.Cpu
				var memoryl = item.Spe.Template.Spe.Containers[0].Resources.Limits.Memory
				//var gpur=item.Spe.Template.Spe.Containers[0].Resources.Requests.cpu

				if strings.Index(cpul, "m") != -1 {
					x, _ := strconv.ParseInt((cpul[0:strings.Index(cpul, "m")]), 10, 64)
					cpuli = x
				}

				if strings.Index(memoryl, "M") != -1 {
					//fmt.Print(memoryr)
					x, _ := strconv.ParseInt((memoryl[0:strings.Index(memoryl, "M")]), 10, 64)
					memoryli = x
				} else if strings.Index(memoryl, "G") != -1 {
					x, _ := strconv.ParseInt((memoryl[0:strings.Index(memoryl, "G")]), 10, 64)
					memoryli = x * 1000
				}
			}

		}

		var limit = ReLimit{
			Cpulimit:    cpuli,
			Memorylimit: memoryli,
		}
		dep.Limit = limit

		/*节点亲和 node label*/
		var nodematchs = []LabelMatch{}
		if item.Spe.Template.Spe.Affinity != nil && item.Spe.Template.Spe.Affinity.NodeAffinity != nil {
			var nodematch = item.Spe.Template.Spe.Affinity.NodeAffinity.RequiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms[0].MatchExpressions
			for _, item := range nodematch {
				var x = LabelMatch{
					Label: item.Key,
					Op:    item.Operator,
					Value: item.Values[0],
				}
				nodematchs = append(nodematchs, x)
			}
			dep.Nodematch = nodematchs
			dep.Schedule = "LABEL"
		}

		var status string
		if item.Spe.Paused == true {
			status = "pause"
		} else {
			if dep.Podsnum[0] == dep.Podsnum[1] && dep.Podsnum[0] > 0 {
				status = "running"
			} else {
				status = "waiting"
			}
			/*var flag = false
			for _, item := range item.Status.Conditions {
				flag = true
				if item.Type == "Available" {
					if item.Status == "True" {
						status = "true"
					} else {
						status = "waiting"
					}
				}
			}
			if flag == false {
				status = "waiting"
			}*/
		}
		dep.Status = status
		/**待完善clustermatch*/
		//var clustermatchs = []LabelMatch{}
		dataSource = append(dataSource, dep)
	}
	/*depsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return nil, err
	}*/
	return dataSource, nil
}
func ListPV(clustername string) ([]PV, error) {
	pvs := &pv.Pvs{} //声明结构体
	if err := pvs.List(clustername + ":8080"); err != nil {
		return nil, err
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []PV{}
	for _, item := range pvs.Items {
		var pv = PV{}

		pv.Name = item.Meta.Name
		pv.Status = item.Status.Phase
		if strings.Index(item.Spe.Capacity.Storage, "M") != -1 {
			var m1 = item.Spe.Capacity.Storage[0:strings.Index(item.Spe.Capacity.Storage, "M")]
			m1i, err1i := strconv.Atoi(m1)
			if err1i != nil {
				// handle error
				return nil, err1i
			}
			m1f := float64(m1i) / 1000.0
			pv.Capacity = fmt.Sprintf("%fGi", m1f)
		} else {
			pv.Capacity = item.Spe.Capacity.Storage
		}

		pv.Storageclass = item.Spe.StorageClassName
		pv.Createtime = item.Meta.CreationTimeStamp
		pv.Accessmodes = item.Spe.AccessModes

		if item.Spe.Nfs != nil {
			pv.Path = item.Spe.Nfs.Path
			pv.Server = item.Spe.Nfs.Server
		}
		if item.Spe.ClaimRef != nil {
			//fmt.Print(item.Spe.ClaimRef)
			pv.Pvc = item.Spe.ClaimRef.Name
		}

		dataSource = append(dataSource, pv)
	}
	//fmt.Print(dataSource)
	return dataSource, nil
}
func ListPVC(clustername string) ([]PVC, error) {
	pvcs := &pvc.Pvcs{} //声明结构体
	if err := pvcs.List(clustername + ":8080"); err != nil {
		return nil, err
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
	}
	return dataSource, nil
}

func ListNode(clustername string) ([]Node, error) {
	nodes := &node.Nodes{} //声明结构体
	if err := nodes.List(clustername + ":8080"); err != nil {
		return nil, err
	}
	//fmt.Printf("%v", nodes)
	//dataSource = append(dataSource, deps.Items...)
	dataSource := []Node{}
	for _, item := range nodes.Items {
		//fmt.Printf("item!")
		var node = Node{}
		var labels = []Label{}
		var pods []string
		var cpu []string
		var memory []float64
		var annos = []Label{}
		var images = []Image{}
		var nodeinfo = []NoInfo{}

		node.Name = item.Meta.Name
		node.Cluster = clustername
		node.Version = item.Stat.NodeInfo.KubeletVersion
		if _, ok := item.Meta.Labels["node-role.kubernetes.io/master"]; ok {
			node.Role = "Master"
		} else {
			node.Role = "Worker"
		}

		if item.Spe.Unschedulable {
			node.Status = "unschedulable"
		} else if item.Stat.Conditions[4].Status == "True" {
			node.Status = "Ready"
		} else {
			node.Status = "NotReady"
		}
		for k, v := range item.Meta.Labels {
			var l Label
			l.Name = k
			l.Value = v
			labels = append(labels, l)
		}
		node.Labels = labels

		podsdata := &pod.Pods{} //声明结构体
		if err := podsdata.List(clustername + ":8080"); err != nil {
			return nil, err
		}
		var poddata = []*pod.Pod{}
		for _, poditem := range podsdata.Items {
			if poditem.Status.Reason != "Evicted" && poditem.Status.Reason != "MatchNodeSelector" {
				if poditem.Spe.NodeName == item.Meta.Name {
					poddata = append(poddata, poditem)
				}
			}
		}
		pods = append(pods, strconv.Itoa(len(poddata)))
		pods = append(pods, item.Stat.Capacity.Pods)
		node.Pods = pods

		cpu = append(cpu, item.Stat.Allocate.Cpu)
		cpu = append(cpu, item.Stat.Capacity.Cpu)
		node.Cpu = cpu

		var m1 = item.Stat.Allocate.Memory[0:strings.Index(item.Stat.Allocate.Memory, "K")]
		m1i, err1i := strconv.Atoi(m1)
		if err1i != nil {
			// handle error
			return nil, err1i
		}
		m1f := float64(m1i) / 1024.0 / 1024.0
		//memory = append(memory, strconv.Itoa(m1f))
		//memory = append(memory, fmt.Sprintf("%.2f", m1f))
		memory = append(memory, Decimal(m1f))

		var m2 = item.Stat.Capacity.Memory[0:strings.Index(item.Stat.Capacity.Memory, "K")]
		m2i, err2i := strconv.Atoi(m2)
		if err2i != nil {
			// handle error
			return nil, err2i
		}
		m2f := float64(m2i) / 1024.0 / 1024.0
		//fmt.Printf("%v", m2f)
		//memory = append(memory, fmt.Sprintf("%.2f", m2f))
		memory = append(memory, Decimal(m2f))
		node.Memory = memory

		for k, v := range item.Meta.Annotation {
			var l Label
			l.Name = k
			l.Value = v
			annos = append(labels, l)
		}
		node.Annotations = annos
		node.Ip = item.Meta.Annotation["flannel.alpha.coreos.com/public-ip"]
		node.Kubeletver = item.Stat.NodeInfo.KubeletVersion
		node.Kubeproxyver = item.Stat.NodeInfo.KubeProxyVersion
		node.Os = item.Stat.NodeInfo.OsImage
		node.Conditions = item.Stat.Conditions

		var docker = item.Stat.NodeInfo.ContainerRuntimeVersion
		docker = strings.Replace(docker, "docker://", "", 1)
		node.Dockerver = docker

		//var poddata = []*pod.Pod{}
		for _, imitem := range item.Stat.Images {
			var im = Image{}
			im.Name = imitem.Names[0]
			var size = float64(imitem.SizeBytes) / 1000000
			im.Size = Decimal(size)
			images = append(images, im)
		}
		node.Images = images

		{
			var ni = NoInfo{}
			ni.Name = "machineID"
			ni.Info = item.Stat.NodeInfo.MachineID
			nodeinfo = append(nodeinfo, ni)
			ni.Name = "systemUUID"
			ni.Info = item.Stat.NodeInfo.SystemUUID
			nodeinfo = append(nodeinfo, ni)
			ni.Name = "bootID"
			ni.Info = item.Stat.NodeInfo.BootID
			nodeinfo = append(nodeinfo, ni)
			ni.Name = "kernelVersion"
			ni.Info = item.Stat.NodeInfo.KernelVersion
			nodeinfo = append(nodeinfo, ni)
			ni.Name = "osImage"
			ni.Info = item.Stat.NodeInfo.OsImage
			nodeinfo = append(nodeinfo, ni)
			ni.Name = "containerRuntimeVersion"
			ni.Info = item.Stat.NodeInfo.ContainerRuntimeVersion
			nodeinfo = append(nodeinfo, ni)
			ni.Name = "kubeletVersion"
			ni.Info = item.Stat.NodeInfo.KubeletVersion
			nodeinfo = append(nodeinfo, ni)
			ni.Name = "kubeProxyVersion"
			ni.Info = item.Stat.NodeInfo.KubeProxyVersion
			nodeinfo = append(nodeinfo, ni)
			ni.Name = "operatingSystem"
			ni.Info = item.Stat.NodeInfo.OperatingSystem
			nodeinfo = append(nodeinfo, ni)
			ni.Name = "architecture"
			ni.Info = item.Stat.NodeInfo.Architecture
			nodeinfo = append(nodeinfo, ni)
		}
		node.Nodeinfo = nodeinfo

		var comstatus = NodeComstatuses{}
		for _, citem := range item.Stat.Conditions {
			if citem.Type == "OutOfDisk" {
				if citem.Status == "False" {
					comstatus.OutOfDisk = "True"
				} else {
					comstatus.OutOfDisk = "False"
				}
			}
			if citem.Type == "MemoryPressure" {
				if citem.Status == "False" {
					comstatus.MemoryPressure = "True"
				} else {
					comstatus.MemoryPressure = "False"
				}
			}
			if citem.Type == "DiskPressure" {
				if citem.Status == "False" {
					comstatus.DiskPressure = "True"
				} else {
					comstatus.DiskPressure = "False"
				}
			}
			if citem.Type == "Ready" {
				if citem.Status == "True" {
					comstatus.Kubelet = "True"
				} else {
					comstatus.Kubelet = "False"
				}
			}
		}

		node.NodeComponentstatuses = comstatus

		dataSource = append(dataSource, node)
	}
	return dataSource, nil
}
func ListNamespace(clustername string) ([]Namespace, error) {
	nms := &namespace.Namespaces{} //声明结构体
	if clustername == "fed" {
		if err := nms.List(fedclustername + ":8001"); err != nil {
			return nil, err
		}
	} else {
		if err := nms.List(clustername + ":8080"); err != nil {
			return nil, err
		}
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []Namespace{}
	for _, item := range nms.Items {
		var nm = Namespace{}

		nm.Name = item.Meta.Name
		nm.Status = item.Status.Phase
		nm.Createtime = item.Meta.CreationTimeStamp
		//fmt.Print(nm)
		dataSource = append(dataSource, nm)
	}
	//fmt.Print(dataSource)
	return dataSource, nil
}

func ListCluster(fedclustername string) ([]Cluster, error) {
	clusters := &css.Clusters{} //声明结构体
	if err := clusters.List(fedclustername + ":8001"); err != nil {
		return nil, err
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []Cluster{}
	for _, item := range clusters.Items {
		var cs = Cluster{}
		var labels = []Label{}
		//var nms = []Namespace{}
		var pods []string
		var cpu []string
		var memory []float64

		cs.Name = item.Meta.Name
		cs.Createtime = item.Meta.CreationTimeStamp
		cs.Serveraddress = item.Spe.ServerAddressByClientCIDRs[0].ServerAddress
		if item.Status != nil && len(item.Status.Conditions) != 0 {
			if item.Status.Conditions[0].Status == "True" {
				cs.Status = "Ready"
			} else {
				cs.Status = "NotReady"
			}

		} else {
			cs.Status = "NotReady"
		}

		if fedclustername == item.Meta.Name {
			cs.Role = "Controller"
		} else {
			cs.Role = "SubCluster"
		}

		for k, v := range item.Meta.Labels {
			var l Label
			l.Name = k
			l.Value = v
			labels = append(labels, l)
		}
		cs.Labels = labels

		versionmp, errv := css.GetVersion(item.Meta.Name + ":8080")
		if errv != nil {
			return nil, errv
		}
		//fmt.Print(versionmp)
		cs.Version = versionmp["gitVersion"]

		var cts = &css.Comstatuses{}
		var comstatus = Comstatuses{}
		cts.GetComstatuses(item.Meta.Name + ":8080")
		for _, citem := range cts.Items {
			if citem.Meta.Name == "controller-manager" {
				if citem.Conditions[0].Status == "True" {
					comstatus.Controller = "True"
				} else {
					comstatus.Controller = "False"
				}
			}
			if citem.Meta.Name == "scheduler" {
				if citem.Conditions[0].Status == "True" {
					comstatus.Scheduler = "True"
				} else {
					comstatus.Scheduler = "False"
				}
			}
			if citem.Meta.Name == "etcd-0" {
				if citem.Conditions[0].Status == "True" {
					comstatus.Etcd = "True"
				} else {
					comstatus.Etcd = "False"
				}
			}
		}
		comstatus.Node = "True"
		cs.Componentstatuses = comstatus

		nmdata, errnm := ListNamespace(item.Meta.Name)
		if errnm != nil {
			return nil, errnm
		}
		cs.Namespaces = nmdata

		nodes, errn := ListNode(item.Meta.Name)
		if errn != nil {
			return nil, errn
		}
		cs.Nodes = len(nodes)
		var pod1, pod2 int
		var cpu1, cpu2 int
		var memory1, memory2 float64
		for _, nitem := range nodes {
			p1i, errp1i := strconv.Atoi(nitem.Pods[0])
			if errp1i != nil {
				return nil, errp1i
			}
			p2i, errp2i := strconv.Atoi(nitem.Pods[1])
			if errp2i != nil {
				return nil, errp2i
			}
			pod1 += p1i
			pod2 += p2i

			c1i, errc1i := strconv.Atoi(nitem.Cpu[0])
			if errc1i != nil {
				return nil, errc1i
			}
			c2i, errc2i := strconv.Atoi(nitem.Cpu[1])
			if errc2i != nil {
				return nil, errc2i
			}
			cpu1 += c1i
			cpu2 += c2i

			memory1 += nitem.Memory[0]
			memory2 += nitem.Memory[1]
		}
		pods = append(pods, strconv.Itoa(pod1))
		pods = append(pods, strconv.Itoa(pod2))
		cpu = append(cpu, strconv.Itoa(cpu1))
		cpu = append(cpu, strconv.Itoa(cpu2))
		memory = append(memory, memory1)
		memory = append(memory, memory2)
		cs.Pods = pods
		cs.Cpu = cpu
		cs.Memory = memory

		deps, errd := ListDeps(item.Meta.Name)
		if errd != nil {
			return nil, errd
		}
		var d1, d2 int
		d2 = len(deps)
		for _, citem := range deps {
			if citem.Status == "running" {
				d1++
			}
		}
		cs.Deployments = append(cs.Deployments, d1)
		cs.Deployments = append(cs.Deployments, d2)

		//fmt.Print(nm)
		dataSource = append(dataSource, cs)
	}
	//fmt.Print(dataSource)
	return dataSource, nil
}

func ListConfigMap(clustername string) ([]ConfigMap, error) {
	cms := &configmap.ConfigMaps{} //声明结构体
	/*if clustername == "fed" {
		if err := cms.List(fedclustername + ":8001"); err != nil {
			return nil, err
		}
	} else */
	{
		if err := cms.List(clustername + ":8080"); err != nil {
			return nil, err
		}
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []ConfigMap{}
	for _, item := range cms.Items {
		var cm = ConfigMap{}

		cm.Name = item.Meta.Name
		cm.Namespace = item.Meta.Namespace
		cm.Createtime = item.Meta.CreationTimeStamp
		if item.Data != nil {
			cm.ConfigData = item.Data.(map[string]interface{})
		}

		/*for k, _ := range cm.ConfigData {
			if _, ok := cm.ConfigData[k].(string); ok {
				//value, ok := v.(string)
				fmt.Print(k)
				//fmt.Print(value)
			}
		}*/

		//fmt.Print(nm)
		dataSource = append(dataSource, cm)
	}
	//fmt.Print(dataSource)
	return dataSource, nil
}
func ListConfigMapbyNm(namespace, clustername string) ([]ConfigMap, error) {
	cms := &configmap.ConfigMaps{} //声明结构体
	/*if clustername == "fed" {
		if err := cms.List(fedclustername + ":8001"); err != nil {
			return nil, err
		}
	} else */
	{
		if err := cms.ListOfNamespace(namespace, clustername+":8080"); err != nil {
			return nil, err
		}
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []ConfigMap{}
	for _, item := range cms.Items {
		var cm = ConfigMap{}

		cm.Name = item.Meta.Name
		cm.Namespace = item.Meta.Namespace
		cm.Createtime = item.Meta.CreationTimeStamp
		if item.Data != nil {
			cm.ConfigData = item.Data.(map[string]interface{})
		}

		/*for k, _ := range cm.ConfigData {
			if _, ok := cm.ConfigData[k].(string); ok {
				//value, ok := v.(string)
				fmt.Print(k)
				//fmt.Print(value)
			}
		}*/

		//fmt.Print(nm)
		dataSource = append(dataSource, cm)
	}
	//fmt.Print(dataSource)
	return dataSource, nil
}
func DeleteDep(clustername, namespace, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	var dep = deployment.Deployment{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(dep.Delete(clustername + ":8080"))
	if err != nil {
		return body, err
	}

	return body, nil
}
func DeleteSvc(clustername, namespace, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	var svc = service.Service{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(svc.Delete(clustername + ":8080"))
	if err != nil {
		return body, err
	}

	return body, nil
}
func DeletePV(clustername, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name: name,
	}
	var pv = pv.Pv{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(pv.Delete(clustername + ":8080"))
	if err != nil {
		return body, err
	}

	return body, nil
}
func DeletePVC(clustername, namespace, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	var pvc = pvc.Pvc{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(pvc.Delete(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}

func DeleteNode(clustername, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name: name,
	}
	var nd = node.Node{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(nd.Delete(clustername + ":8080"))
	if err != nil {
		return body, err
	}

	return body, nil
}
func DeleteNamespace(clustername, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name: name,
	}
	var nmdata = nm.Namespace{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(nmdata.Delete(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func DeleteConfigMap(clustername, namespace, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	var cmdata = configmap.ConfigMap{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(cmdata.Delete(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func DeleteCluster(name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name: name,
	}
	var cs = css.Cluster{
		Meta: meta,
	}
	body, _, err := cluster.ReadBody(cs.Delete(fedclustername + ":8001"))
	if err != nil {
		return body, err
	}
	return body, nil
}

func CreateDep(dep Deployment, clustername string) ([]byte, error) {
	var labels = dep.Label
	var mplabels map[string]string = make(map[string]string)
	mplabels["app"] = dep.Name
	for _, label := range labels {
		mplabels[label.Name] = label.Value
	}

	var depmeta = &cluster.Metadata{
		Name:      dep.Name,
		Namespace: dep.Namespace,
		Labels:    mplabels,
	}
	/*dep spe begin*/
	var mpmls map[string]string = make(map[string]string)
	mpmls["app"] = dep.Name

	var selector = &cluster.Selector{
		MatchLabels: mpmls,
	}
	/*spe.template begin*/
	var podlabels map[string]string = make(map[string]string)
	for k, v := range mplabels {
		podlabels[k] = v
	}
	for k, v := range mpmls {
		podlabels[k] = v
	}
	var podmeta = &cluster.Metadata{
		Labels: podlabels,
	}
	var envs = dep.Env
	var podenvs []*pod.Env
	for _, env := range envs {
		var podenv = &pod.Env{
			Name:  env.Name,
			Value: env.Value,
		}
		podenvs = append(podenvs, podenv)
	}

	var ports = dep.Ports
	var podports []*pod.Port
	for _, port := range ports {
		var podenv = &pod.Port{
			Name:          port.Name,
			ContainerPort: port.ContainerPort,
			Protocol:      port.Protocol,
		}
		podports = append(podports, podenv)
	}
	var podrsli = &pod.Limit{
		Cpu:    strconv.FormatInt(dep.Limit.Cpulimit, 10) + "m",
		Memory: strconv.FormatInt(dep.Limit.Memorylimit, 10) + "Mi",
		Gpu:    strconv.FormatInt(dep.Limit.Gpulimit, 10),
	}
	var podrsre = &pod.Limit{
		Cpu:    strconv.FormatInt(dep.Request.Cpurequest, 10) + "m",
		Memory: strconv.FormatInt(dep.Request.Memoryrequest, 10) + "Mi",
		Gpu:    strconv.FormatInt(dep.Request.Gpurequest, 10),
	}
	var podrs = &pod.Resource{
		Limits:   podrsli,
		Requests: podrsre,
	}
	var container = &pod.Container{
		Name:      dep.Name,
		Image:     dep.Image,
		Envs:      podenvs,
		Ports:     podports,
		Resources: podrs,
	}
	var containers []*pod.Container
	containers = append(containers, container)
	var temspe = &pod.Spec{
		Containers: containers,
	}

	if dep.Schedule == "NODE" {
		temspe.NodeName = dep.Schnodename
	} else {
		var matchlabels []*pod.MatchExpression
		for _, item := range dep.Nodematch {
			var v []string
			var me = &pod.MatchExpression{
				Key:      item.Label,
				Operator: item.Op,
				Values:   append(v, item.Value),
			}
			matchlabels = append(matchlabels, me)
		}
		var nosete = &pod.NodeSelectorTerm{
			MatchExpressions: matchlabels,
		}
		var nodesetes []*pod.NodeSelectorTerm
		nodesetes = append(nodesetes, nosete)

		var redesch = &pod.RequiredDuringSchedulingIgnoredDuringExecution{
			NodeSelectorTerms: nodesetes,
		}
		var nodeaff = &pod.NodeAffinity{
			RequiredDuringSchedulingIgnoredDuringExecution: redesch,
		}

		var affinity = &pod.Affinity{
			NodeAffinity: nodeaff,
		}
		temspe.Affinity = affinity
	}
	var tem = &pod.Pod{
		Meta: podmeta,
		Spe:  temspe,
	}

	/*end template*/
	var depspe = &deployment.Spec{
		Replicas: dep.Podsnum[0], //有待商榷，应该是0还是1
		Select:   selector,
		Template: tem,
	}
	/* end dep spe  */
	var newdep = &deployment.Deployment{
		Kind:       "Deployment",
		ApiVersion: "apps/v1beta1",
		Meta:       depmeta,
		Spe:        depspe,
	}
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	body, _, err := cluster.ReadBody(newdep.Create(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}

//float64 保留两位小数
func Decimal(value float64) float64 {

	value, _ = strconv.ParseFloat(fmt.Sprintf("%.2f", value), 64)

	return value

}
