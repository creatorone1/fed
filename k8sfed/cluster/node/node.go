package node

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type Address struct {
	Type   string `json:"type,omitempty"`
	IPAddr string `json:"address,omitempty"`
}

type KubeletEndpoint struct {
	Port int64 `json:"Port,omitempty"`
}

type DaemonEndpoints struct {
	Endpoint *KubeletEndpoint `json:"kubeletEndpoint,omitempty"`
}

type Info struct {
	MachineID               string `json:"machineID,omitempty"`
	SystemUUID              string `json:"systemUUID,omitempty"`
	BootID                  string `json:"bootID,omitempty"`
	KernelVersion           string `json:"kernelVersion,omitempty"`
	OsImage                 string `json:"osImage,omitempty"`
	ContainerRuntimeVersion string `json:"containerRuntimeVersion,omitempty"`
	KubeletVersion          string `json:"kubeletVersion,omitempty"`
	KubeProxyVersion        string `json:"kubeProxyVersion,omitempty"`
	OperatingSystem         string `json:"operatingSystem,omitempty"`
	Architecture            string `json:"architecture,omitempty"`
}

type Image struct {
	Names     []string `json:"names,omitempty"`
	SizeBytes int64    `json:"sizeBytes,omitempty"`
}

type VolumesAttached struct {
	Name       string `json:"name,omitempty"`
	DevicePath string `json:"devicePath,omitempty"`
}

type Resource struct {
	Gpu    string `json:"alpha.kubernetes.io/nvidia-gpu,omitempty"`
	Cpu    string `json:"cpu,omitempty"`
	Memory string `json:"memory,omitempty"`
	Pods   string `json:"pods,omitempty"`
}

type Status struct {
	Capacity         *Resource            `json:"capacity,omitempty"`
	Allocate         *Resource            `json:"allocatable,omitempty"`
	Phase            string               `json:"phase,omitempty"`
	Conditions       []*cluster.Condition `json:"conditions,omitempty"`
	Addresses        []*Address           `json:"addresses,omitempty"`
	Daemonendpoints  *DaemonEndpoints     `json:"daemonEndpoints,omitempty"`
	NodeInfo         *Info                `json:"nodeInfo,omitempty"`
	Images           []*Image             `json:"images,omitempty"`
	VolumesInUse     []string             `json:"volumesInUse,omitempty"`
	VolumesAttacheds []*VolumesAttached   `json:"volumesAttached,omitempty"`
}
type Spec struct {
	Unschedulable bool `json:"unschedulable,omitmepty"`
}
type Node struct {
	Kind       string            `json:"kind,omitmepty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        Spec              `json:"spec,omitempty"`
	Stat       *Status           `json:"status,omitempty"`
}

func (node *Node) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/nodes/"+node.Meta.Name, master, nil)
}
func (node *Node) Update(master string) (io.ReadCloser, int, error) {
	return cluster.Call("PATCH", "/api/v1/nodes/"+node.Meta.Name, master, node)
}
func (node *Node) Creatwe(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/nodes", master, node)
}

func (node *Node) Delete(master string) (io.ReadCloser, int, error) {
	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/api/v1/nodes/"+node.Meta.Name, master, b)
}

func (node *Node) ToJsonString() string {
	strs, err := json.Marshal(node)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)

}
