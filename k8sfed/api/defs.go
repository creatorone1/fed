package api

import "k8sfed/cluster"

/**定义数据结构
  返回的数据

*/

/**定义数据结构
  错误err
*/
type Err struct {
	Error     string `json:"error"`
	ErrorCode string `json:"error_code"`
}

type ErrResponse struct {
	HttpSC int
	Error  Err
}

var (
	ErrorRequestBodyParseFailed = ErrResponse{HttpSC: 400, Error: Err{Error: "Request body is not correct", ErrorCode: "001"}}
	ErrorNotAuthUser            = ErrResponse{HttpSC: 401, Error: Err{Error: "User authentication failed.", ErrorCode: "002"}}
	ErrorDBError                = ErrResponse{HttpSC: 500, Error: Err{Error: "DB ops failed", ErrorCode: "003"}}
	ErrorInternalFaults         = ErrResponse{HttpSC: 500, Error: Err{Error: "Internal service error", ErrorCode: "004"}}
	ErrorDelete                 = ErrResponse{HttpSC: 501, Error: Err{Error: "Delete wrong", ErrorCode: "005"}}
	ErrorGet                    = ErrResponse{HttpSC: 501, Error: Err{Error: "Get wrong", ErrorCode: "006"}}
	ErrorCreate                 = ErrResponse{HttpSC: 501, Error: Err{Error: "Create wrong", ErrorCode: "007"}}
	ErrorUpdate                 = ErrResponse{HttpSC: 501, Error: Err{Error: "update wrong", ErrorCode: "008"}}
)

type Nor struct {
	NormalInfo string `json:"normalinfo"`
	NormalCode string `json:"normal_code"`
}
type NorResponse struct {
	HttpSC int
	Normal Nor
}

var (
	NormalOp = NorResponse{HttpSC: 200, Normal: Nor{NormalInfo: "ok", NormalCode: "200"}}
)

type Label struct {
	Name  string `json:"name,omitempty"`
	Value string `json:"value,omitempty"`
}
type Env struct {
	Name  string `json:"name,omitempty"`
	Value string `json:"value,omitempty"`
}
type Port struct {
	Name          string `json:"name,omitempty"`
	ContainerPort int64  `json:"containerPort,omitempty"`
	Protocol      string `json:"protocol,omitempty"`
}
type LabelMatch struct {
	Label string `json:"label,omitempty"`
	Op    string `json:"op,omitempty"`
	Value string `json:"value,omitempty"`
}
type ReRequest struct {
	Cpurequest    int64 `json:"cpurequest,omitempty"`
	Memoryrequest int64 `json:"memoryrequest,omitempty"`
	Gpurequest    int64 `json:"gpurequest,omitempty"`
}
type ReLimit struct {
	Cpulimit    int64 `json:"cpulimit,omitempty"`
	Memorylimit int64 `json:"memorylimit,omitempty"`
	Gpulimit    int64 `json:"gpulimit,omitempty"`
}
type Deployment struct {
	Name         string       `json:"name,omitempty"`
	Status       string       `json:"status,omitempty"`
	Namespace    string       `json:"namespace,omitempty"`
	Image        string       `json:"image,omitempty"`
	Createtime   string       `json:"createtime,omitempty"`
	Podsnum      []int64      `json:"podsnum,omitempty"`
	Revision     string       `json:"revision,omitempty"`
	Env          []Env        `json:"env,omitempty"`
	Label        []Label      `json:"label,omitempty"`
	Ports        []Port       `json:"ports,omitempty"`
	Schedule     string       `json:"schedule,omitempty"`
	Clustermatch []LabelMatch `json:"clustermatch,omitempty"`
	Nodematch    []LabelMatch `json:"nodematch,omitempty"`
	Request      ReRequest    `json:"request,omitempty"`
	Limit        ReLimit      `json:"limit,omitempty"`
	Schnodename  string       `json:"schnodename,omitempty"`
	Volumes      []Volume     `json:"volumes,omitempty"`
}
type Volume struct {
	Name         string        `json:"name,omitempty"`
	Pvcname      string        `json:"pvcname,omitempty"`
	VolumeMounts []VolumeMount `json:"volumemounts,omitempty"`
}
type VolumeMount struct {
	Name      string `json:"name,omitempty"`
	MountPath string `json:"mountpath,omitempty"`
	ReadOnly  bool   `json:"readonly,omitempty"`
	SubPath   string `json:"subpath,omitempty"`
}
type TemRes struct {
	Name string    `json:"name,omitempty"`
	Re   ReRequest `json:"request,omitempty"`
	Li   ReLimit   `json:"limit,omitempty"`
}
type Rule struct {
	Host    string   `json:"host,omitempty"`
	Backend []Backen `json:"backend,omitempty"`
}
type Backen struct {
	Path        string      `json:"path,omitempty"`
	Servicename string      `json:"servicename,omitempty"`
	Serviceport interface{} `json:"serviceport,omitempty"`
}
type IngTarget struct {
	Domin string `json:"domin,omitempty"`
	Des   string `json:"des,omitempty"`
}
type Ingress struct {
	Name       string      `json:"name,omitempty"`
	Status     string      `json:"status,omitempty"`
	Namespace  string      `json:"namespace,omitempty"`
	Rules      []Rule      `json:"rules,omitempty"`
	Target     []IngTarget `json:"target,omitempty"`
	Backend    Backen      `json:"backend,omitempty"`
	Createtime string      `json:"createtime,omitempty"`
}

type Service struct {
	Name       string            `json:"name,omitempty"`
	Namespace  string            `json:"namespace,omitempty"`
	Createtime string            `json:"createtime,omitempty"`
	Target     map[string]string `json:"target,omitempty"`
	Selectors  []SvcSelector     `json:"selectors,omitempty"`
	Type       string            `json:"type,omitempty"`
	Ports      []SVCPort         `json:"ports,omitempty"`
	Label      []Label           `json:"label,omitempty"`
	Externalip []string          `json:"externalip,omitempty"`
	Workload   []string          `json:"workload,omitempty"`
}
type SvcSelector struct {
	Name  string `json:"name,omitempty"`
	Value string `json:"value,omitempty"`
}
type SVCPort struct {
	Name       string      `json:"name,omitempty"`
	Port       int64       `json:"port,omitempty"`
	Protocol   string      `json:"protocol,omitempty"`
	Targetport interface{} `json:"targetport,omitempty"`
	Nodeport   int64       `json:"nodeport,omitempty"`
}

type PV struct {
	Name         string   `json:"name,omitempty"`
	Status       string   `json:"status,omitempty"`
	Capacity     string   `json:"capacity,omitempty"`
	Pvc          string   `json:"pvc,omitempty"`
	Path         string   `json:"path,omitempty"`
	Server       string   `json:"server,omitempty"`
	Storageclass string   `json:"storageclass,omitempty"`
	Createtime   string   `json:"createtime,omitempty"`
	Accessmodes  []string `json:"accessmodes,omitempty"`
}

type PVC struct {
	Name         string   `json:"name,omitempty"`
	Namespace    string   `json:"namespace,omitempty"`
	Status       string   `json:"status,omitempty"`
	Size         string   `json:"size,omitempty"`
	Volume       string   `json:"volume,omitempty"`
	Storageclass string   `json:"storageclass,omitempty"`
	Createtime   string   `json:"createtime,omitempty"`
	Accessmodes  []string `json:"accessmodes,omitempty"`
}
type StorageClass struct {
	Name          string `json:"name,omitempty"`
	Status        string `json:"status,omitempty"`
	Provisioner   string `json:"provisioner,omitempty"`
	Createtime    string `json:"createtime,omitempty"`
	ReclaimPolicy string `json:"reclaimPolicy,omitempty"`
}

type Node struct {
	Name                  string               `json:"name,omitempty"`
	Status                string               `json:"status,omitempty"`
	Pods                  []string             `json:"pods,omitempty"`
	Role                  string               `json:"role,omitempty"`
	Version               string               `json:"version,omitempty"`
	Cpu                   []string             `json:"cpu,omitempty"`
	Memory                []float64            `json:"memory,omitempty"`
	Cluster               string               `json:"cluster,omitempty"`
	Labels                []Label              `json:"labels,omitempty"`
	Ip                    string               `json:"ip,omitempty"`
	Kubeletver            string               `json:"kubeletver,omitempty"`
	Kubeproxyver          string               `json:"kubeproxyver,omitempty"`
	Dockerver             string               `json:"dockerver,omitempty"`
	Os                    string               `json:"os,omitempty"`
	Annotations           []Label              `json:"annotations,omitempty"`
	Images                []Image              `json:"images,omitempty"`
	Conditions            []*cluster.Condition `json:"conditions,omitempty"`
	Nodeinfo              []NoInfo             `json:"nodeinfo,omitempty"`
	NodeComponentstatuses NodeComstatuses      `json:"nodecomponentstatuses,omitempty"`
}
type NodeComstatuses struct {
	OutOfDisk      string `json:"outofdisk,omitempty"`
	DiskPressure   string `json:"diskpressure,omitempty"`
	MemoryPressure string `json:"memorypressure,omitempty"`
	Kubelet        string `json:"kubelet,omitempty"`
}
type Image struct {
	Name string  `json:"name,omitempty"`
	Size float64 `json:"size,omitempty"`
}
type NoInfo struct {
	Name string `json:"name,omitempty"`
	Info string `json:"info,omitempty"`
}
type Cluster struct {
	Name              string      `json:"name,omitempty"`
	Nodes             int         `json:"nodes,omitempty"`
	Status            string      `json:"status,omitempty"`
	Role              string      `json:"role,omitempty"`
	Deployments       []int       `json:"deployments,omitempty"`
	Createtime        string      `json:"createtime,omitempty"`
	Labels            []Label     `json:"labels,omitempty"`
	Version           string      `json:"version,omitempty"`
	Serveraddress     string      `json:"serveraddress,omitempty"`
	Pods              []string    `json:"pods,omitempty"`
	Cpu               []string    `json:"cpu,omitempty"`
	Memory            []float64   `json:"memory,omitempty"`
	Namespaces        []Namespace `json:"namespaces,omitempty"`
	Componentstatuses Comstatuses `json:"componentstatuses,omitempty"`
}
type Comstatuses struct {
	Controller string `json:"controller,omitempty"`
	Scheduler  string `json:"scheduler,omitempty"`
	Etcd       string `json:"etcd,omitempty"`
	Node       string `json:"node,omitempty"`
}

type Namespace struct {
	Name       string `json:"name,omitempty"`
	Status     string `json:"status,omitempty"`
	Createtime string `json:"createtime,omitempty"`
}

type ConfigMap struct {
	Name       string                 `json:"name,omitempty"`
	Namespace  string                 `json:"namespace,omitempty"`
	ConfigData map[string]interface{} `json:"configdata,omitempty"`
	Createtime string                 `json:"createtime,omitempty"`
}

type MetaData struct {
	Name        string `json:"name,omitempty"`
	Namespace   string `json:"namespace,omitempty"`
	Clustername string `json:"clustername,omitempty"`
	Version     string `json:"version,omitempty"`
}
type MetaDatas struct {
	Items []MetaData `json:"items,omitempty"`
}

type ReplicaSet struct {
	Name       string `json:"name,omitempty"`
	Namespace  string `json:"namespace,omitempty"`
	Deployment string `json:"deployment,omitempty"`
	Revision   string `json:"revision,omitempty"`
	Createtime string `json:"createtime,omitempty"`
}

type DepPause struct {
	Spe DepSpec `json:"spec"`
}
type DepRollback struct {
	Revision int64 `json:"revision,omitempty"`
}
type DepSpec struct {
	Paused     bool         `json:"paused"`
	RollbackTo *DepRollback `json:"rollbackTo,omitempty"`
}

type NodePause struct {
	Spe NodeSpec `json:"spec"`
}
type NodeSpec struct {
	Unschedulable bool `json:"unschedulable"`
}
type Pod struct {
	Name      string `json:"name,omitempty"`
	Namespace string `json:"namespace,omitempty"`
	Nodename  string `json:"nodename,omitempty"`
	Own       Owner  `json:"owner,omitempty"`
}
type Owner struct {
	Name string `json:"name,omitempty"`
	Kind string `json:"kind,omitempty"`
}

type Chart struct {
	Name        string    `json:"name,omitempty"`
	Description string    `json:"description,omitempty"`
	Iconurl     string    `json:"iconurl,omitempty"`
	Versions    []Version `json:"versions,omitempty"`
}
type Version struct {
	Version string `json:"version,omitempty"`
	Url     string `json:"url,omitempty"`
}

type AppRelease struct {
	Name         AppName `json:"name,omitempty"`
	Chartname    string  `json:"chartname,omitempty"`
	Chartversion string  `json:"chartversion,omitempty"`
	Version      int64   `json:"version,omitempty"`
	Status       string  `json:"status,omitempty"`
	Namespace    string  `json:"namespace,omitempty"`
	Cluster      string  `json:"cluster,omitempty"`
	Createtime   string  `json:"createtime,omitempty"`
	Appversion   string  `json:"appversion,omitempty"`
}
type AppName struct {
	Name    string `json:"name,omitempty"`
	Iconurl string `json:"iconurl,omitempty"`
}

type ReleaseMeta struct {
	Name      string `json:"name,omitempty"`
	Namespace string `json:"namespace,omitempty"`
	Cluster   string `json:"cluster,omitempty"`
	Charturl  string `json:"charturl,omitempty"`
	Version   string `json:"version,omitempty"`
}
