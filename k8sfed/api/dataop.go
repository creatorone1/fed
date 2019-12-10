package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net"
	"os/exec"

	css "k8sfed/cluster/clusters"
	"k8sfed/cluster/configmap"
	"k8sfed/cluster/deployment"
	"k8sfed/cluster/image"
	"k8sfed/cluster/ingress"
	"k8sfed/cluster/namespace"
	nm "k8sfed/cluster/namespace"
	"k8sfed/cluster/node"
	"k8sfed/cluster/pod"
	"k8sfed/cluster/pv"
	"k8sfed/cluster/pvc"
	"k8sfed/cluster/replicaset"
	"k8sfed/cluster/sc"
	"k8sfed/cluster/service"
	"strconv"
	"strings"
	"time"

	"k8sfed/cluster"
	"k8sfed/cluster/application"
)

//get 获取数据列表
func ListDeps(clustername string) ([]Deployment, error) {
	deps := &deployment.Deployments{} //声明结构体
	if clustername == "fed" || clustername == "All" {
		if err := deps.ListFed(fedclustername + ":31667"); err != nil {
			return nil, err
		}
	} else {
		if err := deps.List(clustername + ":8080"); err != nil {
			return nil, err
		}
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []Deployment{}
	for _, item := range deps.Items {
		var dep = Deployment{}
		var envs = []Env{}
		var labels = []Label{}
		var ports = []Port{}
		var volumes = []Volume{}

		dep.Name = item.Meta.Name
		dep.Namespace = item.Meta.Namespace
		dep.Image = item.Spe.Template.Spe.Containers[0].Image
		dep.Createtime = item.Meta.CreationTimeStamp
		dep.Podsnum = append(dep.Podsnum, item.Status.ReadyReplicas)
		dep.Podsnum = append(dep.Podsnum, item.Spe.Replicas)
		/**修改的时候先把非 pvc 的卷读出来再修改*/
		for _, v := range item.Spe.Template.Spe.Volumes {

			if v.PersistentVolumeClaim != nil {
				var newv = Volume{}
				newv.Name = v.Name
				newv.Pvcname = v.PersistentVolumeClaim.ClaimName
				var volumemounts = []VolumeMount{}
				for _, m := range item.Spe.Template.Spe.Containers[0].VolumeMounts {
					if m.Name == newv.Name {
						var newvm = VolumeMount{}
						newvm.Name = m.Name
						newvm.MountPath = m.MountPath
						newvm.ReadOnly = m.ReadOnly
						newvm.SubPath = m.SubPath
						volumemounts = append(volumemounts, newvm)
					}
				}
				newv.VolumeMounts = volumemounts
				volumes = append(volumes, newv)
			}
		}
		dep.Volumes = volumes

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
		var Gpuri int64
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
				Gpuri, _ = strconv.ParseInt(item.Spe.Template.Spe.Containers[0].Resources.Requests.Gpu, 10, 64)
			}

		}

		var request = ReRequest{
			Cpurequest:    cpuri,
			Memoryrequest: memoryri,
			Gpurequest:    Gpuri,
		}
		dep.Request = request
		var cpuli int64
		var memoryli int64
		var Gpuli int64
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
				Gpuli, _ = strconv.ParseInt(item.Spe.Template.Spe.Containers[0].Resources.Limits.Gpu, 10, 64)
			}

		}

		var limit = ReLimit{
			Cpulimit:    cpuli,
			Memorylimit: memoryli,
			Gpulimit:    Gpuli,
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

func ListRS(clustername string) ([]ReplicaSet, error) {
	rss := &replicaset.Replicasets{} //声明结构体
	if clustername == "fed" || clustername == "All" {
		if err := rss.List(fedclustername + ":31667"); err != nil {
			return nil, err
		}
	} else {

		if err := rss.List(clustername + ":8080"); err != nil {
			return nil, err
		}
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []ReplicaSet{}
	for _, item := range rss.Items {
		var rs = ReplicaSet{}

		rs.Name = item.Meta.Name
		rs.Namespace = item.Meta.Namespace
		rs.Createtime = item.Meta.CreationTimeStamp

		var annos = item.Meta.Annotation

		if _, ok := annos["deployment.kubernetes.io/revision"]; ok {
			rs.Revision = annos["deployment.kubernetes.io/revision"]
		}
		var owner *cluster.OwnerReference
		if len(item.Meta.OwnerReferences) > 0 {
			owner = item.Meta.OwnerReferences[0]
		} else {
			owner = &cluster.OwnerReference{
				Name: "nothing",
			}
		}

		rs.Deployment = owner.Name
		dataSource = append(dataSource, rs)
	}
	/*depsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return nil, err
	}*/
	return dataSource, nil
}
func ListHistory(clustername, namespace, deployment string) ([]ReplicaSet, error) {

	datas, err := ListRS(clustername)
	if err != nil {
		// handle error
		return nil, err
	}

	var dataSource = []ReplicaSet{}
	for _, item := range datas {
		if item.Namespace == namespace && item.Deployment == deployment {
			dataSource = append(dataSource, item)
		}
	}
	return dataSource, nil
}

func ListSvc(clustername string) ([]Service, error) {
	svcs := &service.Services{} //声明结构体
	if clustername == "fed" || clustername == "All" {
		if err := svcs.List(fedclustername + ":31667"); err != nil {
			return nil, err
		}
	} else {
		if err := svcs.List(clustername + ":8080"); err != nil {
			return nil, err
		}
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []Service{}
	for _, item := range svcs.Items {
		var svc = Service{}
		var ports = []SVCPort{}
		var labels = []Label{}
		var annos = []Label{}
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

		for k, v := range item.Meta.Annotation {
			var l Label
			l.Name = k
			l.Value = v
			annos = append(annos, l)
		}
		svc.Annotations = annos

		for _, item := range item.Spe.ExternalIPs {
			externalip = append(externalip, item)
		}
		svc.Externalip = externalip
		svc.Target = item.Spe.Selector
		var selectors []SvcSelector

		for k, v := range svc.Target {
			var svcs = SvcSelector{
				Name:  k,
				Value: v,
			}
			selectors = append(selectors, svcs)
		}
		svc.Selectors = selectors
		var workloads []string
		//deps, _ := ListDeps(clustername)
		deps := &deployment.Deployments{} //声明结构体
		if clustername == "fed" || clustername == "All" {
			if err := deps.ListFed(fedclustername + ":31667"); err != nil {
				return nil, err
			}
		} else {
			if err := deps.List(clustername + ":8080"); err != nil {
				return nil, err
			}
		}

		/*if svc.Target == nil {
			fmt.Printf("%v", svc.Target)
			fmt.Printf("\n %v", svc.Name)
		}*/
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
	//fmt.Print(dataSource)
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
			/*
				应该除以1024
			*/
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
			annos = append(annos, l)
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
	if clustername == "fed" || clustername == "All" {
		if err := nms.List(fedclustername + ":31667"); err != nil {
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
	if err := clusters.List(fedclustername + ":31667"); err != nil {
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
			if item.Status.Conditions[0].Status == "True" && item.Status.Conditions[0].Type == "Ready" {
				cs.Status = "Ready"
			} else {
				cs.Status = "NotReady"
			}

		} else {
			cs.Status = "NotReady"
		}
		addr, errip := net.ResolveIPAddr("ip", item.Meta.Name)
		if errip != nil {
			fmt.Print(errip)
			if fedclustername == item.Meta.Name || cs.Serveraddress == fedclustername {
				cs.Role = "Controller"
			} else {
				cs.Role = "SubCluster"
			}

		} else {
			//fmt.Printf(addr.String())
			if fedclustername == item.Meta.Name || cs.Serveraddress == fedclustername || addr.String() == fedclustername {
				cs.Role = "Controller"
			} else {
				cs.Role = "SubCluster"
			}
		}

		/**待完善,ok
		如果该集群未准备好，不读取其内容
		*/
		if cs.Status != "NotReady" {
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
			//comstatus.Node = "True"

			nmdata, errnm := ListNamespace(item.Meta.Name)
			if errnm != nil {
				return nil, errnm
			}
			cs.Namespaces = nmdata

			nodes, errn := ListNode(item.Meta.Name)
			if errn != nil {
				return nil, errn
			}
			var nodes_status = true
			for _, item := range nodes {
				//fmt.Println(item.Status)
				if item.Status == "NotReady" {
					//fmt.Println("find NotReady")
					nodes_status = false
				}
			}
			if nodes_status {
				comstatus.Node = "True"
			} else {
				comstatus.Node = "False"
			}
			cs.Componentstatuses = comstatus
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
		}
		//fmt.Print(nm)
		dataSource = append(dataSource, cs)
	}
	//fmt.Print(dataSource)
	return dataSource, nil
}

func ListCluster2(clusters []string) ([]Cluster, error) {

	dataSource := []Cluster{}
	for _, clustername := range clusters {
		var cs = Cluster{}
		//var labels = []Label{}
		//var nms = []Namespace{}
		var pods []string
		var cpu []string
		var memory []float64

		cs.Name = clustername
		cs.Createtime = ""
		addr, errip := net.ResolveIPAddr("ip", clustername)
		if errip != nil {
			cs.Serveraddress = ""
		} else {
			cs.Serveraddress = addr.String()
		}

		health, errh := css.GetHealth(clustername + ":8080")

		if errh == nil && health == "ok" {
			cs.Status = "Ready"
		} else {
			cs.Status = "NotReady"
		}

		cs.Role = "SubCluster"

		/**待完善,
		如果该集群未准备好，不读取其内容
		*/
		if cs.Status != "NotReady" {
			/*for k, v := range item.Meta.Labels {
				var l Label
				l.Name = k
				l.Value = v
				labels = append(labels, l)
			}
			cs.Labels = labels*/

			versionmp, errv := css.GetVersion(clustername + ":8080")
			if errv != nil {
				return nil, errv
			}
			//fmt.Print(versionmp)
			cs.Version = versionmp["gitVersion"]

			var cts = &css.Comstatuses{}
			var comstatus = Comstatuses{}
			cts.GetComstatuses(clustername + ":8080")
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

			nmdata, errnm := ListNamespace(clustername)
			if errnm != nil {
				return nil, errnm
			}
			cs.Namespaces = nmdata

			nodes, errn := ListNode(clustername)
			if errn != nil {
				return nil, errn
			}
			var nodes_status = true
			for _, item := range nodes {
				//fmt.Println(item.Status)
				if item.Status == "NotReady" {
					//fmt.Println("find NotReady")
					nodes_status = false
				}
			}
			if nodes_status {
				comstatus.Node = "True"
			} else {
				comstatus.Node = "False"
			}
			cs.Componentstatuses = comstatus
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

			deps, errd := ListDeps(clustername)
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
		}
		//fmt.Print(nm)
		dataSource = append(dataSource, cs)
	}
	//fmt.Print(dataSource)
	return dataSource, nil
}

func ListConfigMap(clustername string) ([]ConfigMap, error) {
	cms := &configmap.ConfigMaps{} //声明结构体
	/*if clustername == "fed" {
		if err := cms.List(fedclustername + ":31667"); err != nil {
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
	if clustername == "fed" || clustername == "All" {
		if err := cms.List(fedclustername + ":31667"); err != nil {
			return nil, err
		}
	} else {
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

func ListTemDep(clustername string) ([]ConfigMap, error) {
	configdata, errc := ListConfigMapbyNm("default", clustername)
	if errc != nil {
		return nil, errc
	}
	var dataSource = []ConfigMap{}
	for _, item := range configdata {
		if value, ok := item.ConfigData["type"]; ok {
			if value == "deployment" {
				dataSource = append(dataSource, item)
			}
		}
	}
	return dataSource, nil
}

func ListTemRes(clustername string) ([]ConfigMap, error) {
	configdata, errc := ListConfigMapbyNm("default", clustername)
	if errc != nil {
		return nil, errc
	}
	var dataSource = []ConfigMap{}
	for _, item := range configdata {
		if value, ok := item.ConfigData["type"]; ok {
			if value == "resource" {
				dataSource = append(dataSource, item)
			}
		}
	}
	return dataSource, nil
}
func ListPods(clustername string) ([]Pod, error) {
	pos := &pod.Pods{} //声明结构体
	if err := pos.List(clustername + ":8080"); err != nil {
		return nil, err
	}
	//dataSource = append(dataSource, deps.Items...)
	dataSource := []Pod{}
	for _, item := range pos.Items {
		var po = Pod{}

		po.Name = item.Meta.Name
		po.Namespace = item.Meta.Namespace
		po.Nodename = item.Spe.NodeName
		if len(item.Meta.OwnerReferences) > 0 {
			var owner = item.Meta.OwnerReferences[0]
			var own = Owner{
				Name: owner.Name,
				Kind: owner.Kind,
			}
			po.Own = own
		} else {
			var own = Owner{
				Name: "no",
				Kind: "no",
			}
			po.Own = own
		}

		dataSource = append(dataSource, po)
	}
	/*depsdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return nil, err
	}*/
	return dataSource, nil
}

func ListSC(clustername string) ([]StorageClass, error) {

	scs := &sc.StorageClassList{} //声明结构体
	if err := scs.List(clustername + ":8080"); err != nil {
		return nil, err
	}
	//dataSource = append(dataSource, deps.Items...)
	dataSource := []StorageClass{}
	for _, item := range scs.Items {
		var nsc = StorageClass{}

		nsc.Name = item.Meta.Name
		nsc.Status = "Active"
		nsc.Createtime = item.Meta.CreationTimeStamp
		nsc.Provisioner = item.Provisioner
		nsc.ReclaimPolicy = item.ReclaimPolicy
		dataSource = append(dataSource, nsc)
	}
	return dataSource, nil
}
func ListIngress(clustername string) ([]Ingress, error) {
	ings := &ingress.IngressList{} //声明结构体

	if clustername == "fed" || clustername == "All" {
		if err := ings.List(fedclustername + ":31667"); err != nil {
			return nil, err
		}
	} else {
		if err := ings.List(clustername + ":8080"); err != nil {
			return nil, err
		}
	}

	//dataSource = append(dataSource, deps.Items...)
	dataSource := []Ingress{}
	for _, item := range ings.Items {
		var ing = Ingress{}

		ing.Name = item.Meta.Name
		ing.Namespace = item.Meta.Namespace
		ing.Createtime = item.Meta.CreationTimeStamp

		if len(item.Status.LoadBalancer.Ingress) == 0 {
			ing.Status = "Initializing"
		} else {
			ing.Status = "Active"
		}
		if item.Spe.Backend != nil {
			var defaultb = Backen{
				Servicename: item.Spe.Backend.ServiceName,
				Serviceport: item.Spe.Backend.ServicePort,
			}
			ing.Backend = defaultb
		}

		var rules []Rule
		var targets []IngTarget
		for _, ritem := range item.Spe.Rules {
			var rule = Rule{}
			var host = ritem.Host
			var backends = []Backen{}
			for _, pitem := range ritem.Http.Paths {
				var target = IngTarget{}
				var backend = Backen{
					Path:        pitem.Path,
					Servicename: pitem.Backend.ServiceName,
					Serviceport: pitem.Backend.ServicePort,
				}
				backends = append(backends, backend)

				target.Domin = host + backend.Path
				target.Des = backend.Servicename
				targets = append(targets, target)
			}
			rule.Host = host
			rule.Backend = backends
			rules = append(rules, rule)
		}
		ing.Rules = rules
		ing.Target = targets
		dataSource = append(dataSource, ing)
	}
	return dataSource, nil
}
func ListImages(master, username, password string) (*image.Repos, error) {

	var repos *image.Repos = new(image.Repos) //声明结构体
	if err := repos.ListRepos(master, username, password); err != nil {
		return nil, err
	}

	for _, repo := range *repos {
		for _, image := range repo.Images {
			var size = image.Size
			sizef := float64(size) / 1024.0 / 1024.0
			image.Size = Decimal(sizef)
		}
	}
	/*if clustername == "fed" || clustername == "All" {
		if err := ings.List(fedclustername + ":31667"); err != nil {
			return nil, err
		}
	} else {
		if err := ings.List(clustername + ":8080"); err != nil {
			return nil, err
		}
	}*/

	//dataSource = append(dataSource, deps.Items...)

	return repos, nil
}

/*
chartmuseum的mastername 从配置文件中读取
*/
func ListChart(chartmastername string) ([]Chart, error) {

	var chartlist = &application.ChartList{}

	//if err := chartlist.GetAllCharts(chartmastername + ":8089"); err != nil {
	if err := chartlist.GetAllCharts(chartmastername); err != nil {

		return nil, err
	}
	//dataSource = append(dataSource, deps.Items...)
	dataSource := []Chart{}
	for k, charts := range chartlist.Charts {
		var chart = Chart{}
		var versions = []Version{}

		chart.Name = k
		if len(charts) > 0 {
			chart.Description = charts[0].Description
			chart.Iconurl = charts[0].Icon
		}
		for _, citem := range charts {
			var version = Version{}
			if len(citem.Urls) > 0 {
				// dns地址解析ip地址
				// dns地址解析ip地址
				/*
					addr, errip := net.ResolveIPAddr("ip", chartmastername)

					if errip != nil {
						return nil, errip
					}
					fmt.Println("addr:", addr)
					version.Version = citem.Version
					version.Url = "http://" + addr.String() + ":8089/" + citem.Urls[0]
				*/
				version.Version = citem.Version
				version.Url = "http://" + chartmastername + "/" + citem.Urls[0]

			}
			versions = append(versions, version)
		}
		chart.Versions = versions
		dataSource = append(dataSource, chart)
	}
	return dataSource, nil
}

/*
	release的swift的mastername
	从配置文件中读取
*/
func ListRelease(swiftmastername string) ([]AppRelease, error) {

	var relist = &application.ReleaseList{}
	if err := relist.GetReleases(swiftmastername + ":31589"); err != nil {
		return nil, err
	}
	//dataSource = append(dataSource, deps.Items...)
	dataSource := []AppRelease{}
	for _, item := range relist.Releases {
		var re = AppRelease{}
		var appname = AppName{}
		appname.Iconurl = item.Chart_metadata.Icon
		appname.Name = item.Name
		re.Name = appname
		re.Version = item.Version
		re.Namespace = item.Namespace

		if item.Info.Status.Code == "DEPLOYED" {
			re.Status = "Active"
		} else {
			re.Status = "Pending"
		}
		re.Appversion = item.Chart_metadata.AppVersion
		re.Chartname = item.Chart_metadata.Name
		re.Chartversion = item.Chart_metadata.Version
		re.Createtime = item.Info.Last_deployed
		/*待补充
		re.cluster=?
		*/
		re.Cluster = swiftmastername
		dataSource = append(dataSource, re)
	}
	return dataSource, nil
}

/**delete 删除数据*/
func DeleteDep(clustername, namespace, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name:       name,
		Namespace:  namespace,
		Finalizers: nil,
	}
	var dep = deployment.Deployment{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(dep.DeleteFed(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		var pathdata = `{"metadata":{"finalizers":null}}`
		body2, _, err2 := cluster.ReadBody(dep.UpdateFed(fedclustername+":31667", []byte(pathdata)))
		if err2 != nil {
			return body2, err2
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(dep.Delete(clustername + ":8080"))
		if err != nil {
			return body, err
		}

		return body, nil
	}
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
	if clustername == "All" || clustername == "fed" {
		body, _, err := cluster.ReadBody(svc.Delete(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		var pathdata = `{"metadata":{"finalizers":null}}`
		body2, _, err2 := cluster.ReadBody(svc.Update(fedclustername+":31667", []byte(pathdata)))
		if err2 != nil {
			return body2, err2
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(svc.Delete(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}
}
func DeletePV(clustername, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name:       name,
		Finalizers: nil,
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
	var pathdata = `{"metadata":{"finalizers":null}}`

	body2, _, err2 := cluster.ReadBody(pv.Patch(clustername+":8080", []byte(pathdata)))
	if err2 != nil {
		return body2, err2
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
	var pathdata = `{"metadata":{"finalizers":null}}`

	body2, _, err2 := cluster.ReadBody(pvc.Patch(clustername+":8080", []byte(pathdata)))
	if err2 != nil {
		return body2, err2
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
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(nmdata.Delete(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		var pathdata = `{"metadata":{"finalizers":null}}`
		body2, _, err2 := cluster.ReadBody(nmdata.Update(fedclustername+":31667", []byte(pathdata)))
		if err2 != nil {
			return body2, err2
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(nmdata.Delete(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}

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
	body, _, err := cluster.ReadBody(cs.Delete(fedclustername + ":31667"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func DeleteTemRes(clustername, namespace, name string) ([]byte, error) {
	return DeleteConfigMap(clustername, namespace, name)
}
func DeletePod(clustername, namespace, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	var newpod = pod.Pod{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(newpod.Delete(clustername + ":8080"))
	if err != nil {
		return body, err
	}

	return body, nil
}
func DeleteIngress(clustername, namespace, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	var newing = ingress.Ingress{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(newing.Delete(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		var pathdata = `{"metadata":{"finalizers":null}}`
		body2, _, err2 := cluster.ReadBody(newing.Update(fedclustername+":31667", []byte(pathdata)))
		if err2 != nil {
			return body2, err2
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newing.Delete(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}

}
func DeleteSC(clustername, name string) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name: name,
	}
	var newsc = sc.StorageClass{
		Meta: meta,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(newsc.Delete(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func DeleteChart(chartmastername, name, version string) ([]byte, error) {
	var newchart = application.Chart{
		Name:    name,
		Version: version,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(newchart.Delete(chartmastername))
	if err != nil {
		return body, err
	}
	return body, nil
}
func DeleteRelease(swiftclustername, name string) ([]byte, error) {

	var newre = application.Release{
		Name: name,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(newre.Delete(swiftclustername + ":31589"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func DeleteImageRepo(harbormaster, name, uname, pwd string) ([]byte, error) {

	var newrepo = &image.Repository{
		Name: name,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(newrepo.DeleteRepo(harbormaster, uname, pwd))
	if err != nil {
		return body, err
	}
	return body, nil
}
func DeleteImageTag(harbormaster, tagname, reponame, uname, pwd string) ([]byte, error) {

	var newtag = &image.Image{
		Name: tagname,
	}
	/*data, _ := json.Marshal(dep)
	fmt.Printf("%s",data)*/
	body, _, err := cluster.ReadBody(newtag.DeleteImageTag(harbormaster, reponame, uname, pwd))
	if err != nil {
		return body, err
	}
	return body, nil
}

/**create 创建资源*/
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

	var podrsli = &pod.Limit{}

	if dep.Limit.Cpulimit != 0 {
		podrsli.Cpu = strconv.FormatInt(dep.Limit.Cpulimit, 10) + "m"
	}
	if dep.Limit.Memorylimit != 0 {
		podrsli.Memory = strconv.FormatInt(dep.Limit.Memorylimit, 10) + "Mi"
	}
	if dep.Limit.Gpulimit != 0 {
		podrsli.Gpu = strconv.FormatInt(dep.Limit.Gpulimit, 10)
	}

	var podrsre = &pod.Limit{}
	if dep.Request.Cpurequest != 0 {
		podrsre.Cpu = strconv.FormatInt(dep.Request.Cpurequest, 10) + "m"
	}
	if dep.Request.Memoryrequest != 0 {
		podrsre.Memory = strconv.FormatInt(dep.Request.Memoryrequest, 10) + "Mi"
	}
	if dep.Request.Gpurequest != 0 && dep.Limit.Gpulimit != 0 {
		podrsre.Gpu = strconv.FormatInt(dep.Request.Gpurequest, 10)
	}
	/*var podrsli = &pod.Limit{
		Cpu:    strconv.FormatInt(dep.Limit.Cpulimit, 10) + "m",
		Memory: strconv.FormatInt(dep.Limit.Memorylimit, 10) + "Mi",
		//Gpu:    strconv.FormatInt(dep.Limit.Gpulimit, 10),
	}*/

	/*var podrsre = &pod.Limit{
		Cpu:    strconv.FormatInt(dep.Request.Cpurequest, 10) + "m",
		Memory: strconv.FormatInt(dep.Request.Memoryrequest, 10) + "Mi",
		Gpu:    strconv.FormatInt(dep.Request.Gpurequest, 10),
	}*/

	var podrs = &pod.Resource{
		Limits:   podrsli,
		Requests: podrsre,
	}
	var container = &pod.Container{
		Name:            dep.Name,
		Image:           dep.Image,
		Envs:            podenvs,
		Ports:           podports,
		Resources:       podrs,
		ImagePullPolicy: "IfNotPresent", //默认镜像拉取规则为 存在则不拉取
	}
	//spe.template.container.volumemounts 数据卷添加
	var vms []*pod.VolumeMount
	for _, vitem := range dep.Volumes {
		for _, vmitem := range vitem.VolumeMounts {
			var newvm = &pod.VolumeMount{
				Name:      vmitem.Name,
				MountPath: vmitem.MountPath,
				ReadOnly:  vmitem.ReadOnly,
				SubPath:   vmitem.SubPath,
			}
			vms = append(vms, newvm)
		}
	}
	container.VolumeMounts = vms
	var containers []*pod.Container
	containers = append(containers, container)
	var temspe = &pod.Spec{
		Containers: containers,
	}
	fmt.Printf("Schedule \n")
	if dep.Schedule == "NODE" {
		fmt.Printf("NODE")
		temspe.NodeName = dep.Schnodename
	}

	if dep.Schedule == "LABEL" {
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
	//spe.template.spe.volumes 数据卷添加
	var volumes []*pod.Volume
	for _, vitem := range dep.Volumes {
		var pvc = &pod.PVC{
			ClaimName: vitem.Pvcname,
		}
		var newv = &pod.Volume{
			Name:                  vitem.Name,
			PersistentVolumeClaim: pvc,
		}
		volumes = append(volumes, newv)
	}
	temspe.Volumes = volumes

	var tem = &pod.Pod{
		Meta: podmeta,
		Spe:  temspe,
	}

	/*end template*/
	var depspe = &deployment.Spec{
		Replicas: dep.Podsnum[1], //有待商榷，应该是0还是1
		Select:   selector,
		Template: tem,
	}
	/* end dep spe  */
	if clustername == "fed" || clustername == "All" {
		var newdep = &deployment.Deployment{
			Kind:       "Deployment",
			ApiVersion: "extensions/v1beta1", //对于联邦应该是 extensions/v1beta1
			Meta:       depmeta,
			Spe:        depspe,
		}
		//datas, _ := json.Marshal(newdep) //d
		//fmt.Printf("%s", datas)          //d
		body, _, err := cluster.ReadBody(newdep.CreateFed(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		var newdep = &deployment.Deployment{
			Kind:       "Deployment",
			ApiVersion: "apps/v1beta1", //对于联邦应该是 extensions/v1beta1
			Meta:       depmeta,
			Spe:        depspe,
		}
		//datas, _ := json.Marshal(newdep) //d
		//fmt.Printf("%s", datas)          //d
		body, _, err := cluster.ReadBody(newdep.Create(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}

}
func CreateSvc(svc Service, clustername string) ([]byte, error) {
	var labels = svc.Label
	var mplabels map[string]string = make(map[string]string)
	//mplabels["app"] = svc.Name
	for _, label := range labels {
		mplabels[label.Name] = label.Value
	}
	var annos = svc.Annotations
	var mpannos map[string]string = make(map[string]string)
	for _, anno := range annos {
		mpannos[anno.Name] = anno.Value
	}

	var svcmeta = &cluster.Metadata{
		Name:       svc.Name,
		Namespace:  svc.Namespace,
		Labels:     mplabels,
		Annotation: mpannos,
	}
	/*svc spe begin*/
	var svcports []*service.Port
	for _, item := range svc.Ports {
		var port = &service.Port{
			Name:       item.Name,
			Protocol:   item.Protocol,
			Port:       item.Port,
			TargetPort: item.Targetport,
			NodePort:   item.Nodeport,
		}
		//fmt.Print(port)
		svcports = append(svcports, port)
	}
	var svcselector = svc.Target
	/*for k, v := range svc.Target {
		svcselector[k] = v
	}*/
	var svctype = svc.Type
	var exip = svc.Externalip
	var svcspe = &service.Spec{
		Ports:       svcports,
		Selector:    svcselector,
		Type:        svctype,
		ExternalIPs: exip,
	}
	/* end svc spe  */
	var newsvc = &service.Service{
		Kind:       "Service",
		ApiVersion: "v1",
		Meta:       svcmeta,
		Spe:        svcspe,
	}
	//datas, _ := json.Marshal(newsvc)
	//fmt.Printf("%s", datas)
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(newsvc.Create(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newsvc.Create(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}

}
func CreatePV(p PV, clustername string) ([]byte, error) {

	var pvmeta = &cluster.Metadata{
		Name: p.Name,
	}
	/*svc spe begin*/
	var capacity = &pv.Resource{}
	capacity.Storage = p.Capacity
	var nfs = &pv.NFS{
		Server: p.Server,
		Path:   p.Path,
	}
	var accessModes = p.Accessmodes
	var storageClassName = p.Storageclass
	var pvspe = &pv.Spec{
		Capacity:         capacity,
		Nfs:              nfs,
		AccessModes:      accessModes,
		StorageClassName: storageClassName,
	}
	/* end pv spe  */
	var newpv = &pv.Pv{
		Kind:       "PersistentVolume",
		ApiVersion: "v1",
		Meta:       pvmeta,
		Spe:        pvspe,
	}
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	body, _, err := cluster.ReadBody(newpv.Create(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func CreatePVC(pc PVC, clustername string) ([]byte, error) {

	var pvcmeta = &cluster.Metadata{
		Name:      pc.Name,
		Namespace: pc.Namespace,
	}
	/*pvc spe begin*/
	var accessMode = pc.Accessmodes
	var volumeName = pc.Volume
	var storageClassName = pc.Storageclass
	var sto = pvc.Sto{
		Storage: pc.Size,
	}
	var resource = &pvc.Resource{
		Requests: sto,
	}
	var pvcspe = &pvc.Spec{
		AccessModes:      accessMode,
		Resources:        resource,
		VolumeName:       volumeName,
		StorageClassName: storageClassName,
	}
	/* end pvc spe  */
	var newpvc = &pvc.Pvc{
		Kind:       "PersistentVolumeClaim",
		ApiVersion: "v1",
		Meta:       pvcmeta,
		Spe:        pvcspe,
	}
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)

	body, _, err := cluster.ReadBody(newpvc.Create(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func CreateNamespace(n Namespace, clustername string) ([]byte, error) {

	var nmeta = &cluster.Metadata{
		Name: n.Name,
	}

	/* end svc spe  */
	var newnm = &nm.Namespace{
		Kind:       "Namespace",
		ApiVersion: "v1",
		Meta:       nmeta,
	}
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(newnm.Create(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newnm.Create(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}

}
func CreateConfigMap(cm ConfigMap, clustername string) ([]byte, error) {

	var cmmeta = &cluster.Metadata{
		Name:      cm.Name,
		Namespace: cm.Namespace,
	}
	/*cm data begin*/
	var cmdata = cm.ConfigData
	/* end cm data  */
	var newcm = &configmap.ConfigMap{
		Kind:       "ConfigMap",
		ApiVersion: "v1",
		Meta:       cmmeta,
		Data:       cmdata,
	}
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(newcm.Create(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newcm.Create(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}
}

func CreateTemDep(depdatas []byte, clustername string) ([]byte, error) {

	var dep = &Deployment{}
	if err := json.Unmarshal(depdatas, dep); err != nil {
		return nil, err
	}
	var cmdatas map[string]interface{} = make(map[string]interface{})
	cmdatas["type"] = "deployment"
	cmdatas["data"] = string(depdatas[:])
	now := time.Now().Format("2006-01-02-15-04-05")
	//fmt.Printf("\n %v", now)
	var cm = ConfigMap{
		Name:      dep.Name + fmt.Sprintf("-%v", now),
		Namespace: "default", /*遗留问题*/
		// default下面创建模板还是根据dep创建
		ConfigData: cmdatas,
	}
	body, err := CreateConfigMap(cm, clustername)
	return body, err
}
func CreateTemRes(resdatas []byte, clustername string) ([]byte, error) {

	var temres = &TemRes{}
	if err := json.Unmarshal(resdatas, temres); err != nil {
		return nil, err
	}
	var cmdatas map[string]interface{} = make(map[string]interface{})
	cmdatas["type"] = "resource"
	cmdatas["data"] = string(resdatas[:])
	//now := time.Now().Format("2006-01-02-15-04-05")
	//fmt.Printf("\n %v", now)
	var cm = ConfigMap{
		Name:       temres.Name,
		Namespace:  "default",
		ConfigData: cmdatas,
	}
	body, err := CreateConfigMap(cm, clustername)
	return body, err
}
func CreateIngress(ing Ingress, clustername string) ([]byte, error) {

	var ingmeta = &cluster.Metadata{
		Name:      ing.Name,
		Namespace: ing.Namespace,
	}

	/*ing spe begin*/
	/**
	用不用判断是否存在默认后端 ing.Backend.Servicename=="" ？
	*/
	var backend *ingress.Backend
	if ing.Backend.Servicename == "" {
		//fmt.Print("ing.Backend.Servicename" + ing.Backend.Servicename)
		//backend = nil
	} else {
		backend = &ingress.Backend{
			ServiceName: ing.Backend.Servicename,
			ServicePort: ing.Backend.Serviceport,
		}

	}

	var rules []*ingress.Rule
	for _, item := range ing.Rules {
		var rule = &ingress.Rule{}
		rule.Host = item.Host
		var http = &ingress.HttpIngressRuleValue{}
		var paths []*ingress.HttpIngressPath
		for _, path := range item.Backend {
			var newpath = &ingress.HttpIngressPath{}
			newpath.Path = path.Path
			var pathbackend = &ingress.Backend{
				ServiceName: path.Servicename,
				ServicePort: path.Serviceport,
			}
			newpath.Backend = pathbackend
			paths = append(paths, newpath)
		}
		http.Paths = paths
		rule.Http = http
		rules = append(rules, rule)
	}
	var ingspe = &ingress.Spec{
		Backend: backend,
		Rules:   rules,
	}
	/* end ing spe  */
	var newing = &ingress.Ingress{
		Kind:       "Ingress",
		ApiVersion: "extensions/v1beta1",
		Meta:       ingmeta,
		Spe:        ingspe,
	}
	//datas, _ := json.Marshal(newing)
	//fmt.Printf("%s", datas)
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(newing.Create(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newing.Create(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}

}
func CreateSC(scd StorageClass, clustername string) ([]byte, error) {

	var scmeta = &cluster.Metadata{
		Name: scd.Name,
	}

	var provisioner = scd.Provisioner
	var reclaimPolicy = scd.ReclaimPolicy

	var newsc = &sc.StorageClass{
		Kind:          "StorageClass",
		ApiVersion:    "storage.k8s.io/v1",
		Meta:          scmeta,
		Provisioner:   provisioner,
		ReclaimPolicy: reclaimPolicy,
	}
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	body, _, err := cluster.ReadBody(newsc.Create(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func CreateRelease(re ReleaseMeta) ([]byte, error) {

	var releaseMeta = application.ReleaseMeta{
		Name:      re.Name,
		Namespace: re.Namespace,
		Cluster:   re.Cluster, //这个是要安装的集群的名称，需要每个集群都安装一个helm，swift
		Charturl:  re.Charturl,
		Version:   re.Version,
	}
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	body, _, err := cluster.ReadBody(releaseMeta.Create(re.Cluster + ":31589"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func uploadChart(chartmastername string, file io.Reader) ([]byte, error) {

	body, _, err := cluster.ReadBody(application.UploadCharts(chartmastername, file))
	if err != nil {
		return body, err
	}
	return body, nil
}

func uploadImage(filename, username, password, master string) ([]byte, error) {
	//fmt.Println("loading image: ", filename)

	command := `./loadimage.sh ` + filename + ` ` + username + ` ` + password + ` ` + master

	cmd := exec.Command("/bin/bash", "-c", command)
	output, err := cmd.Output()

	//fmt.Println("loading over")

	if err != nil {
		fmt.Printf("Execute Shell:%s failed with error:%s", command, err.Error())
		return nil, err
	}
	return output, nil
}

/**update status 对资源状态进行更新*/
func PauseDep(clustername, namespace, name string) ([]byte, error) {
	var spe = &DepPause{}
	spe.Spe.Paused = true

	var meta = &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	var newdep = &deployment.Deployment{
		Meta: meta,
	}

	var datas, errj = json.Marshal(spe)
	if errj != nil {
		return nil, errj
	}
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(newdep.UpdateFed(fedclustername+":31667", datas))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newdep.Update(clustername+":8080", datas))
		if err != nil {
			return body, err
		}
		return body, nil
	}
}

func ResumeDep(clustername, namespace, name string) ([]byte, error) {
	var spe = &DepPause{}
	spe.Spe.Paused = false

	var meta = &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	var newdep = &deployment.Deployment{
		Meta: meta,
	}

	var datas, errj = json.Marshal(spe)
	if errj != nil {
		return nil, errj
	}
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(newdep.UpdateFed(fedclustername+":31667", datas))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newdep.Update(clustername+":8080", datas))
		if err != nil {
			return body, err
		}
		return body, nil
	}

}
func ScaleDep(clustername, namespace, name string, replicanum int64) ([]byte, error) {
	var meta = &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	var spec = &deployment.ScaleSpec{
		Replicas: replicanum,
	}

	if clustername == "fed" || clustername == "All" {
		var scale = &deployment.Scale{
			Kind:       "Scale",
			ApiVersion: "extensions/v1beta1",
			Meta:       meta,
			Spe:        spec,
		}
		body, _, err := cluster.ReadBody(scale.PutFed(name, namespace, fedclustername+":31667"))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		var scale = &deployment.Scale{
			Kind:       "Scale",
			ApiVersion: "apps/v1beta1",
			Meta:       meta,
			Spe:        spec,
		}
		body, _, err := cluster.ReadBody(scale.Put(name, namespace, clustername+":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}

	//body, err := PatchDeployment(cm, clustername)
	//return body, err
}
func RollbackDep(clustername, namespace, name string, revision int64) ([]byte, error) {
	var spe = &DepPause{}
	var rollback = &DepRollback{
		Revision: revision,
	}
	spe.Spe.RollbackTo = rollback

	var meta = &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	var newdep = &deployment.Deployment{
		Meta: meta,
	}

	var datas, errj = json.Marshal(spe)
	if errj != nil {
		return nil, errj
	}
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(newdep.UpdateFed(fedclustername+":31667", datas))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newdep.Update(clustername+":8080", datas))
		if err != nil {
			return body, err
		}
		return body, nil
	}
}
func PauseNode(clustername, nodename string) ([]byte, error) {
	var ns = NodeSpec{
		Unschedulable: true,
	}
	var np = NodePause{
		Spe: ns,
	}
	npdatas, errj := json.Marshal(np)
	if errj != nil {
		return nil, errj
	}

	var meta = &cluster.Metadata{
		Name: nodename,
	}
	var newnode = &node.Node{
		Meta: meta,
	}

	body, _, err := cluster.ReadBody(newnode.Update(clustername+":8080", npdatas))
	if err != nil {
		return body, err
	}
	return body, nil

}
func ResumeNode(clustername, nodename string) ([]byte, error) {
	var ns = NodeSpec{
		Unschedulable: false,
	}
	var np = NodePause{
		Spe: ns,
	}
	npdatas, errj := json.Marshal(np)
	if errj != nil {
		return nil, errj
	}

	var meta = &cluster.Metadata{
		Name: nodename,
	}
	var newnode = &node.Node{
		Meta: meta,
	}

	body, _, err := cluster.ReadBody(newnode.Update(clustername+":8080", npdatas))
	if err != nil {
		return body, err
	}
	return body, nil

}
func RollbackRelease(clustername, name string) ([]byte, error) {

	var newre = &application.ReleaseMeta{
		Name: name,
	}
	body, _, err := cluster.ReadBody(newre.Rollback(clustername + ":31589"))
	if err != nil {
		return body, err
	}
	return body, nil

}

//节点驱逐命令，先设置为不可调度，再删除该node所有pod
func DrainNode(clustername, nodename string) ([]byte, error) {
	var ns = NodeSpec{
		Unschedulable: true,
	}
	var np = NodePause{
		Spe: ns,
	}
	npdatas, errj := json.Marshal(np)
	if errj != nil {
		return nil, errj
	}

	var meta = &cluster.Metadata{
		Name: nodename,
	}
	var newnode = &node.Node{
		Meta: meta,
	}

	body, _, err := cluster.ReadBody(newnode.Update(clustername+":8080", npdatas))
	if err != nil {
		return body, err
	}

	//删除 pods (非Deamonset)
	podlist, errl := ListPods(clustername)
	if errl != nil {
		return nil, errl
	}
	//var poddatas = []Pod{} //d
	for _, item := range podlist {
		if item.Own.Kind != "DaemonSet" && item.Nodename == nodename {
			//poddatas = append(poddatas, item) //d
			_, errd := DeletePod(clustername, item.Namespace, item.Name)
			if errd != nil {
				fmt.Print(errd)
			}
		}
	}
	//podsjson, _ := json.Marshal(poddatas) //d
	return body, nil
}

/**Update 资源
先get，再replace
*/
func PatchUpdateDep(dep Deployment, clustername string) ([]byte, error) {

	var labels = dep.Label
	var mplabels map[string]*string = make(map[string]*string)
	//mplabels["app"] = dep.Name
	for _, label := range labels {
		var v = label.Value
		if v == "delete=nil" {
			mplabels[label.Name] = nil
		} else {
			mplabels[label.Name] = &v
		}
	}

	var depmeta = &PatchMetadata{
		Name:      dep.Name,
		Namespace: dep.Namespace,
		Labels:    mplabels,
	}
	/*dep spe begin*/

	/*spe.template begin*/
	var podlabels map[string]*string = make(map[string]*string)
	for k, v := range mplabels {
		podlabels[k] = v
	}

	var podmeta = &PatchMetadata{
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

	/**pod.spec 中的亲和性 begin*/
	fmt.Printf("Schedule \n")
	if dep.Schedule == "NODE" {
		fmt.Printf("NODE")
		temspe.NodeName = dep.Schnodename
	}
	if dep.Schedule == "LABEL" {
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
	/**pod.spec 中的亲和性end*/

	var tem = &PatchPod{
		Meta: podmeta,
		Spe:  temspe,
	}

	/*end template*/
	var depspe = &PatchSpec{
		Replicas: dep.Podsnum[1], //有待商榷，应该是0还是1
		Template: tem,
	}
	/* end dep spe  */
	var newdep = &PatchDeployment{
		Meta: depmeta,
		Spe:  depspe,
	}
	datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)

	//return datas, nil
	body, _, err := cluster.ReadBody(newdep.Update(clustername+":8080", datas))
	if err != nil {
		return body, err
	}
	return body, nil
}

func UpdateDep(dep Deployment, clustername string) ([]byte, error) {
	//get dep
	var depmeta = &cluster.Metadata{
		Name:      dep.Name,
		Namespace: dep.Namespace,
	}
	var newdep = &deployment.Deployment{
		Meta: depmeta,
	}
	if clustername == "fed" || clustername == "All" {
		if err := newdep.GetFed(fedclustername + ":31667"); err != nil {
			return nil, err
		}
	} else {
		if err := newdep.Get(clustername + ":8080"); err != nil {
			return nil, err
		}
	}

	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)

	//update dep
	//update meta
	var labels = dep.Label
	var mplabels map[string]string = make(map[string]string)
	//mplabels["app"] = dep.Name
	for _, label := range labels {
		mplabels[label.Name] = label.Value
	}
	// ！注意：先获取原来的Meta再进行修改更新
	depmeta = newdep.Meta
	depmeta.Labels = mplabels

	//update spe
	// ! 注意更新Spec 先获取原来的Spec
	var depspe = newdep.Spe
	depspe.Replicas = dep.Podsnum[1]

	/*var mpmls map[string]string = make(map[string]string)
	mpmls["app"] = dep.Name

	var selector = &cluster.Selector{
		MatchLabels: mpmls,
	}*/
	//重新自动生成selector
	//depspe.Select = nil
	//禁止修改 app="asfaf"
	/*更新 spe.template begin*/
	//	先获取原来的 Template
	var tem = newdep.Spe.Template
	var podlabels map[string]string = make(map[string]string)
	for k, v := range mplabels {
		podlabels[k] = v
	}
	/*for k, v := range mpmls {
		podlabels[k] = v
	}*/

	//！更新template 的 Meta需要先获取Meta
	var podmeta = tem.Meta
	podmeta.Labels = podlabels

	//!更新template 的 Spec需要先获取Spec
	var temspe = tem.Spe

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

	var podrsli = &pod.Limit{}

	if dep.Limit.Cpulimit != 0 {
		podrsli.Cpu = strconv.FormatInt(dep.Limit.Cpulimit, 10) + "m"
	}
	if dep.Limit.Memorylimit != 0 {
		podrsli.Memory = strconv.FormatInt(dep.Limit.Memorylimit, 10) + "Mi"
	}
	if dep.Limit.Gpulimit != 0 {
		podrsli.Gpu = strconv.FormatInt(dep.Limit.Gpulimit, 10)
	}

	var podrsre = &pod.Limit{}
	if dep.Request.Cpurequest != 0 {
		podrsre.Cpu = strconv.FormatInt(dep.Request.Cpurequest, 10) + "m"
	}
	if dep.Request.Memoryrequest != 0 {
		podrsre.Memory = strconv.FormatInt(dep.Request.Memoryrequest, 10) + "Mi"
	}
	if dep.Request.Gpurequest != 0 && dep.Limit.Gpulimit != 0 {
		podrsre.Gpu = strconv.FormatInt(dep.Request.Gpurequest, 10)
	}

	/*var podrsli = &pod.Limit{
		Cpu:    strconv.FormatInt(dep.Limit.Cpulimit, 10) + "m",
		Memory: strconv.FormatInt(dep.Limit.Memorylimit, 10) + "Mi",
		//Gpu:    strconv.FormatInt(dep.Limit.Gpulimit, 10),
	}*/

	/*var podrsre = &pod.Limit{
		Cpu:    strconv.FormatInt(dep.Request.Cpurequest, 10) + "m",
		Memory: strconv.FormatInt(dep.Request.Memoryrequest, 10) + "Mi",
		Gpu:    strconv.FormatInt(dep.Request.Gpurequest, 10),
	}*/

	var podrs = &pod.Resource{
		Limits:   podrsli,
		Requests: podrsre,
	}
	var container *pod.Container
	if len(temspe.Containers) > 0 {
		container = temspe.Containers[0]
	} else {
		container = &pod.Container{}
	}
	container.Name = dep.Name
	container.Image = dep.Image
	container.Envs = podenvs
	container.Ports = podports
	container.Resources = podrs
	//container.Name=dep.Name

	//更新数据卷挂载 spe.template.container.volumemounts
	var newvms []*pod.VolumeMount
	var oldvms = container.VolumeMounts
	for _, vitem := range dep.Volumes {
		for _, vmitem := range vitem.VolumeMounts {
			var newvm = &pod.VolumeMount{
				Name:      vitem.Name,
				MountPath: vmitem.MountPath,
				ReadOnly:  vmitem.ReadOnly,
				SubPath:   vmitem.SubPath,
			}
			newvms = append(newvms, newvm)
		}
	}
	var oldvolumes = temspe.Volumes
	//添加原来就存在的数据卷挂载(非PVC)
	for _, vmitem := range oldvms {
		if !IsPVC(vmitem.Name, oldvolumes) {
			newvms = append(newvms, vmitem)
		}
	}
	container.VolumeMounts = newvms

	//!更新 temspec 的container先获取Containers
	var containers = temspe.Containers
	if len(containers) > 0 {
		containers[0] = container
	} else {
		containers = append(containers, container)
	}
	temspe.Containers = containers

	fmt.Printf("Schedule= %s \n", dep.Schedule)
	if dep.Schedule == "NODE" {
		fmt.Printf("NODE= %s \n", dep.Schnodename)
		temspe.NodeName = dep.Schnodename
	}

	if dep.Schedule == "LABEL" {
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
	//spe.template.spe.volumes 数据卷添加
	var newvs []*pod.Volume
	var oldvs = temspe.Volumes
	for _, vitem := range dep.Volumes {
		var pvc = &pod.PVC{
			ClaimName: vitem.Pvcname,
		}
		var newv = &pod.Volume{
			Name:                  vitem.Name,
			PersistentVolumeClaim: pvc,
		}
		newvs = append(newvs, newv)
	}
	//判断这个是否为PVC数据卷，上面数据卷挂载也需要判断
	for _, item := range oldvs {
		if item.PersistentVolumeClaim == nil {
			newvs = append(newvs, item)
		}
	}

	temspe.Volumes = newvs

	tem.Meta = podmeta
	tem.Spe = temspe
	/*var tem = &pod.Pod{
		Meta: podmeta,
		Spe:  temspe,
	}*/
	/*end template*/

	depspe.Template = tem
	/*var depspe = &deployment.Spec{
		Replicas: dep.Podsnum[1], //有待商榷，应该是0还是1
		Select:   selector,
		Template: tem,
	}*/
	/*var newdep = &deployment.Deployment{
		Kind:       "Deployment",
		ApiVersion: "apps/v1beta1", //对于联邦应该是 extensions/v1beta1
		Meta:       depmeta,
		Spe:        depspe,
	}*/
	newdep.Meta = depmeta
	newdep.Spe = depspe
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(newdep.ReplaceFed(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newdep.Replace(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}

}

func UpdateSvc(svc Service, clustername string) ([]byte, error) {
	//get svc
	var svcmeta = &cluster.Metadata{
		Name:      svc.Name,
		Namespace: svc.Namespace,
	}
	var newsvc = &service.Service{
		Meta: svcmeta,
	}
	if clustername == "All" || clustername == "fed" {
		if err := newsvc.Get(fedclustername + ":31667"); err != nil {
			return nil, err
		}
	} else {
		if err := newsvc.Get(clustername + ":8080"); err != nil {
			return nil, err
		}
	}

	//update svc
	//update meta
	var labels = svc.Label
	var mplabels map[string]string = make(map[string]string)
	//mplabels["app"] = svc.Name
	for _, label := range labels {
		mplabels[label.Name] = label.Value
	}

	var annos = svc.Annotations
	var mpannos map[string]string = make(map[string]string)
	for _, anno := range annos {
		mpannos[anno.Name] = anno.Value
	}
	//从原来基础上更改Meta
	svcmeta = newsvc.Meta
	svcmeta.Labels = mplabels
	svcmeta.Annotation = mpannos
	fmt.Println("Annotation", svcmeta.Annotation)
	/*svc spe begin*/
	var svcports []*service.Port
	for _, item := range svc.Ports {
		var port = &service.Port{
			Name:       item.Name,
			Protocol:   item.Protocol,
			Port:       item.Port,
			TargetPort: item.Targetport,
			NodePort:   item.Nodeport,
		}
		svcports = append(svcports, port)
	}
	var svcselector = svc.Target
	/*for k, v := range svc.Target {
		svcselector[k] = v
	}*/
	var svctype = svc.Type
	var exip = svc.Externalip

	//在原来基础上更改Spe，不能直接替换spe
	var svcspe = newsvc.Spe
	svcspe.Ports = svcports
	svcspe.Selector = svcselector
	svcspe.Type = svctype
	svcspe.ExternalIPs = exip

	/* end svc spe  */
	newsvc.Meta = svcmeta
	newsvc.Spe = svcspe
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	if clustername == "All" || clustername == "fed" {
		body, _, err := cluster.ReadBody(newsvc.Replace(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newsvc.Replace(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}

}
func UpdatePV(p PV, clustername string) ([]byte, error) {

	//get pv
	var pvmeta = &cluster.Metadata{
		Name: p.Name,
	}
	var newpv = &pv.Pv{
		Meta: pvmeta,
	}

	if err := newpv.Get(clustername + ":8080"); err != nil {
		return nil, err
	}

	//  更新PV
	//！更新Meta
	pvmeta = newpv.Meta

	//！更新Spec
	/*pv spe begin*/
	var pvspe = newpv.Spe
	var capacity = &pv.Resource{}
	capacity.Storage = p.Capacity
	var nfs = &pv.NFS{
		Server: p.Server,
		Path:   p.Path,
	}
	var accessModes = p.Accessmodes
	var storageClassName = p.Storageclass
	pvspe.Capacity = capacity
	pvspe.Nfs = nfs
	pvspe.AccessModes = accessModes
	pvspe.StorageClassName = storageClassName

	/* end pv spe  */
	newpv.Meta = pvmeta
	newpv.Spe = pvspe
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	body, _, err := cluster.ReadBody(newpv.Replace(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func UpdatePVC(pc PVC, clustername string) ([]byte, error) {
	//get pvc
	var pvcmeta = &cluster.Metadata{
		Name:      pc.Name,
		Namespace: pc.Namespace,
	}
	var newpvc = &pvc.Pvc{
		Meta: pvcmeta,
	}

	if err := newpvc.Get(clustername + ":8080"); err != nil {
		return nil, err
	}

	//更新 pvc
	//！更新Meta
	pvcmeta = newpvc.Meta
	//！更新Spec
	/*pvc spe begin*/
	var pvcspe = newpvc.Spe
	var accessMode = pc.Accessmodes
	var volumeName = pc.Volume
	var storageClassName = pc.Storageclass
	var sto = pvc.Sto{
		Storage: pc.Size,
	}
	var resource = &pvc.Resource{
		Requests: sto,
	}
	pvcspe.AccessModes = accessMode
	pvcspe.Resources = resource
	pvcspe.VolumeName = volumeName
	pvcspe.StorageClassName = storageClassName

	/* end pvc spe  */
	newpvc.Meta = pvcmeta
	newpvc.Spe = pvcspe

	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	body, _, err := cluster.ReadBody(newpvc.Replace(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func UpdateSC(scd StorageClass, clustername string) ([]byte, error) {
	//get sc
	var scmeta = &cluster.Metadata{
		Name: scd.Name,
	}
	var newsc = &sc.StorageClass{
		Meta: scmeta,
	}

	if err := newsc.Get(clustername + ":8080"); err != nil {
		return nil, err
	}

	//更新 sc
	//！更新Meta
	//scmeta = newsc.Meta
	//！更新sc
	newsc.ReclaimPolicy = scd.ReclaimPolicy

	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	body, _, err := cluster.ReadBody(newsc.Replace(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil

}
func UpdateIngress(ing Ingress, clustername string) ([]byte, error) {
	//get ingress
	var ingmeta = &cluster.Metadata{
		Name:      ing.Name,
		Namespace: ing.Namespace,
	}
	var newing = &ingress.Ingress{
		Meta: ingmeta,
	}
	if clustername == "fed" || clustername == "All" {
		if err := newing.Get(fedclustername + ":31667"); err != nil {
			return nil, err
		}
	} else {
		if err := newing.Get(clustername + ":8080"); err != nil {
			return nil, err
		}
	}

	//更新 ingress
	//！更新Meta
	//ingmeta = newing.Meta
	//！更新Spec

	/*ing spe begin*/
	var ingspe = newing.Spe
	/**
	用不用判断是否存在默认后端 ing.Backend.Servicename=="" ？
	*/
	var backend *ingress.Backend
	if ing.Backend.Servicename == "" {
		//fmt.Print("ing.Backend.Servicename" + ing.Backend.Servicename)
		//backend = nil
	} else {
		backend = &ingress.Backend{
			ServiceName: ing.Backend.Servicename,
			ServicePort: ing.Backend.Serviceport,
		}
	}

	var rules []*ingress.Rule
	for _, item := range ing.Rules {
		var rule = &ingress.Rule{}
		rule.Host = item.Host
		var http = &ingress.HttpIngressRuleValue{}
		var paths []*ingress.HttpIngressPath
		for _, path := range item.Backend {
			var newpath = &ingress.HttpIngressPath{}
			newpath.Path = path.Path
			var pathbackend = &ingress.Backend{
				ServiceName: path.Servicename,
				ServicePort: path.Serviceport,
			}
			newpath.Backend = pathbackend
			paths = append(paths, newpath)
		}
		http.Paths = paths
		rule.Http = http
		rules = append(rules, rule)
	}
	ingspe.Backend = backend
	ingspe.Rules = rules
	/* end ing spe  */
	newing.Spe = ingspe
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	if clustername == "fed" || clustername == "All" {
		body, _, err := cluster.ReadBody(newing.Replace(fedclustername + ":31667"))
		if err != nil {
			return body, err
		}
		return body, nil
	} else {
		body, _, err := cluster.ReadBody(newing.Replace(clustername + ":8080"))
		if err != nil {
			return body, err
		}
		return body, nil
	}
}
func UpdateTemRes(resdatas []byte, clustername string) ([]byte, error) {
	//get config中的 resource
	var temres = &TemRes{}
	if err := json.Unmarshal(resdatas, temres); err != nil {
		return nil, err
	}

	var temresmeta = &cluster.Metadata{
		Name:      temres.Name,
		Namespace: "default",
	}
	var newtem = &configmap.ConfigMap{
		Meta: temresmeta,
	}

	if err := newtem.Get(clustername + ":8080"); err != nil {
		return nil, err
	}

	var cmdatas map[string]interface{} = make(map[string]interface{})
	cmdatas["type"] = "resource"
	cmdatas["data"] = string(resdatas[:])
	//now := time.Now().Format("2006-01-02-15-04-05")
	//fmt.Printf("\n %v", now)
	var cm = ConfigMap{
		Name:       temres.Name,
		Namespace:  "default",
		ConfigData: cmdatas,
	}

	/*var cmmeta = &cluster.Metadata{
		Name:      cm.Name,
		Namespace: cm.Namespace,
	}*/

	/*cm data begin*/
	var cmdata = cm.ConfigData
	/* end cm data  */

	newtem.Data = cmdata
	//datas, _ := json.Marshal(newdep)
	//fmt.Printf("%s", datas)
	body, _, err := cluster.ReadBody(newtem.Replace(clustername + ":8080"))
	if err != nil {
		return body, err
	}
	return body, nil
}
func UpdateRelease(re ReleaseMeta) ([]byte, error) {

	var releaseMeta = application.ReleaseMeta{
		Name:      re.Name,
		Namespace: re.Namespace,
		Cluster:   re.Cluster, //这个是要安装的集群的名称，需要每个集群都安装一个helm，swift
		Charturl:  re.Charturl,
		Version:   re.Version,
	}
	body, _, err := cluster.ReadBody(releaseMeta.Update(re.Cluster + ":31589"))
	if err != nil {
		return body, err
	}
	return body, nil

}

//更新节点标签
func UpdateNode(nd Node, clustername string) ([]byte, error) {
	var labels = nd.Labels
	var mplabels map[string]*string = make(map[string]*string)

	for _, label := range labels {
		var v = label.Value
		if v == "delete=nil" {
			mplabels[label.Name] = nil
		} else {
			mplabels[label.Name] = &v
		}
	}

	var ndmeta = &PatchMetadata{
		Name:   nd.Name,
		Labels: mplabels,
	}

	var newnd = &PatchNode{
		Meta: ndmeta,
	}
	datas, _ := json.Marshal(newnd)
	//fmt.Printf("%s", datas)

	//return datas, nil
	body, _, err := cluster.ReadBody(newnd.Update(clustername+":8080", datas))
	if err != nil {
		return body, err
	}
	return body, nil
}

//更新集群标签
func UpdateCluster(cs Cluster) ([]byte, error) {
	var labels = cs.Labels
	var mplabels map[string]*string = make(map[string]*string)

	for _, label := range labels {
		var v = label.Value
		if v == "delete=nil" {
			mplabels[label.Name] = nil
		} else {
			mplabels[label.Name] = &v
		}
	}

	var csmeta = &PatchMetadata{
		Name:   cs.Name,
		Labels: mplabels,
	}

	var newcs = &PatchCluster{
		Meta: csmeta,
	}

	datas, _ := json.Marshal(newcs)
	//fmt.Printf("%s", datas)
	//return datas, nil

	body, _, err := cluster.ReadBody(newcs.Update(fedclustername+":31667", datas))
	if err != nil {
		return body, err
	}
	return body, nil
}

func UpdateClusterOld(clustername string, datas []byte) ([]byte, error) {
	/*var labels = cs.Labels
	var mplabels map[string]string = make(map[string]string)

	for _, label := range labels {
		if label.Value == "delete=nil" {
			mplabels[label.Name] = "null"
		} else {
			mplabels[label.Name] = label.Value
		}

	}*/

	var csmeta = &cluster.Metadata{
		Name: clustername,
		//Labels: mplabels,
	}

	var newcs = &css.Cluster{
		Meta: csmeta,
	}

	/*datas, _ := json.Marshal(newcs)
	fmt.Printf("%s", datas)
	return datas, nil*/

	body, _, err := cluster.ReadBody(newcs.Update(fedclustername+":31667", datas))
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

// 判断该挂载卷是否为PVC卷
func IsPVC(name string, volumes []*pod.Volume) bool {
	for _, item := range volumes {
		if item.Name == name && item.PersistentVolumeClaim != nil {
			return true
		}
	}
	return false
}
