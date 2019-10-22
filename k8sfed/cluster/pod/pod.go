package pod

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type Item struct {
	Key  string `json:"key,omitempty"`
	Path string `json:"path,omitempty"`
	Mode int64  `json:"mode,omitempty"`
}

type SecretConfig struct {
	SecretName  string  `json:"secretName,omitempty"`
	Items       []*Item `json:"items,omitempty"`
	DefaultMode int64   `json:"defaultMode,omitempty"`
	Optional    bool    `json:"optional,omitempty"`
}

type Path struct {
	Path string `json:"path,omitempty"`
}

type Dir struct {
	Medium string `json:"medium,omitempty"`
}

type NfsConfig struct {
	Server   string `json:"server,omitempty"`
	Path     string `json:"path,omitempty"`
	ReadOnly bool   `json:"readOnly,omitempty"`
}

type MapConfig struct {
	Name        string  `json:"name,omitempty"`
	items       []*Item `json:"items,omitempty"`
	DefaultMode int64   `json:"defaultMode,omitempty"`
	Optional    bool    `json:"optional,omitempty"`
}

type PVC struct {
	ClaimName string `json:"claimName,omitempty"`
	ReadOnly  bool   `json:"readOnly,omitempty"`
}

type Volume struct {
	Name                  string        `json:"name,omitempty"`
	HostPath              *Path         `json:"hostPath,omitempty"`
	EmptyDir              *Dir          `json:"emptyDir,omitempty"`
	Secret                *SecretConfig `json:"secret,omitempty"`
	Nfs                   *NfsConfig    `json:"nfs,omitempty"`
	ConfigMap             *MapConfig    `json:"configMap,omitempty"`
	PersistentVolumeClaim *PVC          `json:"persistentVolumeClaim,omitempty"`
}

type Port struct {
	Name          string `json:"name,omitempty"`
	HostPort      int64  `json:"hostPort,omitempty"`
	ContainerPort int64  `json:"containerPort,omitempty"`
	Protocol      string `json:"protocol,omitempty"`
	HostIp        string `json:"hostIP,omitempty"`
}

type Limit struct {
	Cpu    string `json:"cpu,omitempty"`
	Memory string `json:"memory,omitempty"`
	Gpu    string `json:"alpha.kubernetes.io/nvidia-gpu,omitempty"`
}

type Resource struct {
	Limits   *Limit `json:"limits,omitempty"`
	Requests *Limit `json:"requests,omitempty"`
}

type VolumeMount struct {
	Name      string `json:"name,omitempty"`
	ReadOnly  bool   `json:"readOnly,omitempty"`
	MountPath string `json:"mountPath,omitempty"`
	SubPath   string `json:"subPath,omitempty"`
}

type Exec struct {
	Command []string `json:"command,omitempty"`
}

type HttpHead struct {
	Name  string `json:"name,omitempty"`
	Value string `json:"value,omitempty"`
}

type HttpGet struct {
	Path string `json:"path,omitempty"`
	//Port        int64     `json:"port,omitempty"`
	Port        interface{} `json:"port,omitempty"`
	Scheme      string      `json:"scheme,omitempty"`
	Host        string      `json:"host,omitempty"`
	HttpHeaders *HttpHead   `json:"httpHeaders,omitempty"`
}

type TcpSocket struct {
	Port int64 `json:"port,omitempty"`
}

type Command struct {
	Exec      *Exec      `json:"exec,omitempty"`
	Httpget   *HttpGet   `json:"httpGet,omitempty"`
	Tcpsocket *TcpSocket `json:"tcpSocket,omitempty"`
}

type LifeCycle struct {
	PostStart *Command `json:"postStart,omitempty"`
	PreStop   *Command `json:"preStop,omitempty"`
}

type Probe struct {
	Exec                *Exec      `json:"exec,omitempty"`
	Httpget             *HttpGet   `json:"httpGet,omitempty"`
	Tcpsocket           *TcpSocket `json:"tcpSocket,omitempty"`
	InitialDelaySeconds int64      `json:"initialDelaySeconds,omitempty"`
	TimeoutSeconds      int64      `json:"timeoutSeconds,omitempty"`
	PeriodSeconds       int64      `json:"periodSeconds,omitempty"`
	SuccessThreshold    int64      `json:"successThreshold,omitempty"`
	FailureThreshold    int64      `json:"failureThreshold,omitempty"`
}

type Capability struct {
	Add  []string `json:"add,omitempty"`
	Drop []string `json:"drop,omitmepty"`
}

type SeLinuxOption struct {
	User  string `json:"user,omitempty"`
	Role  string `json:"role,omitempty"`
	Type  string `json:"type,omitmepty"`
	Level string `json:"level,omitempty"`
}

type SecurityContext struct {
	Capabilities           *Capability    `json:"capabilities,omitempty"`
	Privileged             bool           `json:"privileged,omitempty"`
	SeLinuxOptions         *SeLinuxOption `json:"seLinuxOptions,omitmepty"`
	RunAsUser              int64          `json:"runAsUser,omitempty"`
	RunAsNonRoot           bool           `json:"runAsNonRoot,omitempty"`
	ReadOnlyRootFilesystem bool           `json:"readOnlyRootFilesystem,omitempty"`
}

type Container struct {
	Name                     string           `json:"name,omitempty"`
	Image                    string           `json:"image,omitempty"`
	Command                  []string         `json:"command,omitempty"`
	Args                     []string         `json:"args,omitempty"`
	WorkingDir               string           `json:"workingDir,omitempty"`
	Ports                    []*Port          `json:"ports,omitempty"`
	EnvFrom                  []*EnvFrom       `json:"envFrom,omitempty"`
	Envs                     []*Env           `json:"env,omitempty"`
	Resources                *Resource        `json:"resources,omitempty"`
	VolumeMounts             []*VolumeMount   `json:"volumeMounts,omitempty"`
	LivenessProbe            *Probe           `json:"livenessProbe,omitempty"`
	ReadinessProbe           *Probe           `json:"readinessProbe,omitempty"`
	Lifecycle                *LifeCycle       `json:"lifecycle,omitempty"`
	TerminationMessagePath   string           `json:"terminationMessagePath,omitempty"`
	TerminationMessagePolicy string           `json:"terminationMessagePolicy,omitempty"`
	ImagePullPolicy          string           `json:"imagePullPolicy,omitempty"`
	Securitycontext          *SecurityContext `json:"securityContext,omitempty"`
	Stdin                    bool             `json:"stdin,omitempty"`
	StdinOnce                bool             `json:"stdinOnce,omitempty"`
	Tty                      bool             `json:"tty,omitempty"`
}

type Toleration struct {
	Key               string `json:"key,omitempty"`
	Operator          string `json:"operator,omitempty"`
	Value             string `json:"value,omitempty"`
	Wffect            string `json:"effect,omitempty"`
	TolerationSeconds int64  `json:"tolerationSeconds,omitempty"`
}
type Affinity struct {
	NodeAffinity *NodeAffinity `json:"nodeAffinity,omitempty"`
}
type NodeAffinity struct {
	RequiredDuringSchedulingIgnoredDuringExecution *RequiredDuringSchedulingIgnoredDuringExecution `json:"requiredDuringSchedulingIgnoredDuringExecution,omitempty"`
}
type RequiredDuringSchedulingIgnoredDuringExecution struct {
	NodeSelectorTerms []*NodeSelectorTerm `json:"nodeSelectorTerms,omitempty"`
}
type NodeSelectorTerm struct {
	MatchExpressions []*MatchExpression `json:"matchExpressions,omitempty"`
}
type MatchExpression struct {
	Key      string   `json:"key,omitempty"`
	Operator string   `json:"operator,omitempty"`
	Values   []string `json:"values,omitempty"`
}
type Spec struct {
	Affinity                      *Affinity                `json:"affinity,omitempty"`
	Volumes                       []*Volume                `json:"volumes,omitempty"`
	InitContainers                []*Container             `json:"initContainers,omitempty"`
	Containers                    []*Container             `json:"containers,omitempty"`
	RestartPolicy                 string                   `json:"restartPolicy,omitempty"`
	TerminationGracePeriodSeconds int64                    `json:"terminationGracePeriodSeconds,omitempty"`
	ActiveDeadlineSeconds         int64                    `json:"activeDeadlineSeconds,omitempty"`
	DnsPolicy                     string                   `json:"dnsPolicy,omitempty"`
	NodeSelector                  interface{}              `json:"nodeSelector,omitempty"`
	ServiceAccountName            string                   `json:"serviceAccountName,omitempty"`
	ServiceAccount                string                   `json:"serviceAccount,omitempty"`
	AutomountServiceAccountToken  bool                     `json:"automountServiceAccountToken,omitempty"`
	NodeName                      string                   `json:"nodeName,omitempty"`
	HostNetwork                   bool                     `json:"hostNetwork,omitempty"`
	HostPID                       bool                     `json:"hostPID,omitempty"`
	HostIPC                       bool                     `json:"hostIPC,omitempty"`
	SchedulerName                 string                   `json:"schedulerName,omitempty"`
	Tolerations                   []*Toleration            `json:"tolerations,omitempty"`
	ImagePullSecrets              []map[string]interface{} `json:"imagePullSecrets,omitempty"`
	Hostname                      string                   `json:"hostname,omitempty"`
	Subdomain                     string                   `json:"subdomain,omitempty"`
}

type Condition struct {
	Type               string `json:"type,omitempty"`
	Status             string `json:"status,omitempty"`
	LastProbeTime      string `json:"lastProbeTime,omitempty"`
	LastTransitionTime string `json:"lastTransitionTime,omitempty"`
	Reason             string `json:"reason,omitempty"`
	Message            string `json:"message,omitempty"`
}

type Waiting struct {
	Reason  string `json:"reason,omitempty"`
	Message string `json:"message,omitempty"`
}

type Running struct {
	StartedAt string `json:"startedAt,omitempty"`
}

type Terminated struct {
	ExitCode    int64  `json:"exitCode,omitempty"`
	Signal      int64  `json:"signal,omitempty"`
	Reason      string `json:"reason,omitempty"`
	Message     string `json:"message,omitempty"`
	StartedAt   string `json:"startedAt,omitempty"`
	FinishedAt  string `json:"finishedAt,omitempty"`
	ContianerID string `json:"containerID,omitempty"`
}

type State struct {
	Wait      *Waiting    `json:"waiting,omitempty"`
	Run       *Running    `json:"running,omitempty"`
	Terminate *Terminated `json:"terminated,omitempty"`
}

type ContainerState struct {
	Name         string `json:"name,omitempty"`
	CurrnetState *State `json:"state,omitempty"`
	LastState    *State `json:"lastState,omitempty"`
	Ready        bool   `json:"ready,omitempty"`
	RestartCount int64  `json:"restartCount,omitempty"`
	Image        string `json:"image,omitempty"`
	ImageID      string `json:"imageID,omitempty"`
	ContainerID  string `json:"containerID,omitempty"`
}

type PodState struct {
	Phase                 string            `json:"phase,omitempty"`
	Conditions            []*Condition      `json:"conditions,omitempty"`
	Message               string            `json:"message,omitempty"`
	Reason                string            `json:"reason,omitempty"`
	HostIP                string            `json:"hostIP,omitempty"`
	PodIP                 string            `json:"podIP,omitempty"`
	StartTime             string            `json:"startTime,omitempty"`
	InitContainerStatuses []*ContainerState `json:"initContainerStatuses,omitempty"`
	ContainerStatuses     []*ContainerState `json:"containerStatuses,omitempty"`
	QosClass              string            `json:"qosClass,omitempty"`
}

type Pod struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *PodState         `json:"status,omitempty"`
}

func NewPort(name, protocol, hostIP string, hostPort, containerPort int64) *Port {
	return &Port{
		Name:          name,
		HostPort:      hostPort,
		ContainerPort: containerPort,
		Protocol:      protocol,
		HostIp:        hostIP,
	}
}

func NewEnv(name, value string) *Env {
	return &Env{
		Name:  name,
		Value: value,
	}
}

func NewVolumeMount(name, mountPath, subPath string, readonly bool) *VolumeMount {

	if cluster.IsSpace(mountPath) {
		mountPath = "/tmp"
	}

	return &VolumeMount{
		Name:      name,
		ReadOnly:  readonly,
		MountPath: mountPath,
		SubPath:   subPath,
	}
}

func NewContainer(name, image, imagePullPolicy, workingDir string, command, args []string,
	ports []*Port, envs []*Env, volumeMounts []*VolumeMount, limit, request *Limit) *Container {

	resource := &Resource{
		Limits:   limit,
		Requests: request,
	}

	if cluster.IsSpace(imagePullPolicy) {
		imagePullPolicy = "IfNotPresent"
	}

	c := &Container{
		Name:            name,
		Image:           image,
		ImagePullPolicy: imagePullPolicy,
	}

	if !cluster.IsSpace(workingDir) {
		c.WorkingDir = workingDir
	}

	for _, s := range command {
		if !cluster.IsSpace(s) {
			c.Command = command
			break
		}
	}

	for _, s := range args {
		if !cluster.IsSpace(s) {
			c.Args = args
		}
	}

	if limit != nil {
		resource.Limits = limit
	}

	if request != nil {
		resource.Requests = request
	}

	if limit != nil || request != nil {
		c.Resources = resource
	}

	if envs != nil {
		c.Envs = envs
	}

	if volumeMounts != nil {
		c.VolumeMounts = volumeMounts
	}

	if ports != nil {
		c.Ports = ports
	}

	return c

}

func NewNfs(server, path string, readOnly bool) *NfsConfig {
	return &NfsConfig{
		Server:   server,
		Path:     path,
		ReadOnly: readOnly,
	}
}

func NewVolume(name, hostPath, medium, secretName, congigMapName, pvcName string) *Volume {
	v := &Volume{
		Name: name,
		// HostPath:              &Path{Path: hostPath},
		// EmptyDir:              &Dir{Medium: medium},
		// Secret:                &SecretConfig{SecretName: secretName},
		// ConfigMap:             &MapConfig{Name: congigMapName},
		// PersistentVolumeClaim: &PVC{ClaimName: pvcName},
	}

	if !cluster.IsSpace(hostPath) {
		v.HostPath = &Path{Path: hostPath}
	}

	if !cluster.IsSpace(medium) {
		v.EmptyDir = &Dir{Medium: medium}
	}

	if !cluster.IsSpace(secretName) {
		v.Secret = &SecretConfig{SecretName: secretName}
	}

	if !cluster.IsSpace(pvcName) {
		v.PersistentVolumeClaim = &PVC{ClaimName: pvcName}
	}

	return v

}

func NewPod(name, namespace string, labels map[string]string, initContainers, containers []*Container, volumes []*Volume) *Pod {
	if namespace == "" {
		namespace = "default"
	}

	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
		Labels:    labels,
	}

	spec := &Spec{
		InitContainers: initContainers,
		Containers:     containers,
		Volumes:        volumes,
	}

	return &Pod{
		Kind:       "Pod",
		ApiVersion: "v1",
		Meta:       meta,
		Spe:        spec,
	}

}
func NewSelcectPod(name, namespace, selector string, labels map[string]string, initContainers, containers []*Container, volumes []*Volume) *Pod {
	if namespace == "" {
		namespace = "default"
	}

	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
		Labels:    labels,
	}
	selectormap := make(map[string]string)
	selectormap["selector"] = selector
	spec := &Spec{
		InitContainers: initContainers,
		Containers:     containers,
		Volumes:        volumes,
		NodeSelector:   selectormap,
	}

	return &Pod{
		Kind:       "Pod",
		ApiVersion: "v1",
		Meta:       meta,
		Spe:        spec,
	}

}

func (pod *Pod) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+pod.Meta.Namespace+"/pods", master, pod)
}

func (pod *Pod) Get(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/namespaces/"+pod.Meta.Namespace+"/pods/"+pod.Meta.Name, master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, pod); err != nil {
		return err
	}

	return nil

}

func (pod *Pod) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces/"+pod.Meta.Namespace+"/pods/"+pod.Meta.Name, master, nil)
}

func (pod *Pod) ToJsonString() string {
	strs, err := json.Marshal(pod)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
