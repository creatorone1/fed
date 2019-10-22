package rc

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
	"k8s_v2/cluster/pod"
)

type Spec struct {
	Replicas        int64       `json:"replicas,omitempty"`
	MinReadySeconds int64       `json:"minReadySeconds,omitempty"`
	Selector        interface{} `json:"selector,omitempty"`
	Template        *pod.Pod    `json:"template,omitempty"`
}

type Condition struct {
	Type               string `json:"type,omitempty"`
	Status             string `json:"status,omitempty"`
	LastTransitionTime string `json:"lastTransitionTime,omitempty"`
	Reason             string `json:"reason,omitempty"`
	Message            string `json:"message,omitempty"`
}

type State struct {
	Replicas             int64        `json:"replicas,omitempty"`
	FullyLabeledReplicas int64        `json:"fullyLabeledReplicas,omitempty"`
	ReadyReplicas        int64        `json:"readyReplicas,omitempty"`
	AvailableReplicas    int64        `json:"availableReplicas,omitempty"`
	ObservedGeneration   int64        `json:"observedGeneration,omitempty"`
	Conditions           []*Condition `json:"conditions,omitempty"`
}

type Rc struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

func NewRc(name, namespace string, labels, selectors map[string]string, replicas int64, pod *pod.Pod) *Rc {
	if namespace == "" {
		namespace = "default"
	}

	pod.Kind = "" //template needn't kind and apiVersion
	pod.ApiVersion = ""

	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
		Labels:    labels,
	}
	spec := &Spec{
		Replicas: replicas,
		Selector: selectors,
		Template: pod,
	}

	return &Rc{
		Kind:       "ReplicationController",
		ApiVersion: "v1",
		Meta:       meta,
		Spe:        spec,
	}
}

func (rc *Rc) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+rc.Meta.Namespace+"/replicationcontrollers", master, rc)
}

func (rc *Rc) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces/"+rc.Meta.Namespace+"/replicationcontrollers/"+rc.Meta.Name, master, nil)
}

func (rc *Rc) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces/"+rc.Meta.Namespace+"/replicationcontrollers/"+rc.Meta.Name, master, nil)
}

func (rc *Rc) PutScale(scale *Scale, master string) (io.ReadCloser, int, error) {
	return scale.put(rc.Meta.Name, rc.Meta.Namespace, master)
}

func (rc *Rc) GetScale(master string) (io.ReadCloser, int, error) {
	scale := &Scale{}
	return scale.get(rc.Meta.Name, rc.Meta.Namespace, master)
}

func (rc *Rc) ToJsonString() string {
	strs, err := json.Marshal(rc)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
