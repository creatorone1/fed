package replicaset

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
	"k8s_v2/cluster/pod"
)

type Spec struct {
	Replicas        int64             `json:"replicas,omitempty"`
	MinReadySeconds int64             `json:"minReadySeconds,omitempty"`
	Selector        *cluster.Selector `json:"selector,omitempty"`
	Template        *pod.Pod          `json:"template,omitempty"`
}

type State struct {
	Replicas             int64                `json:"replicas,omitempty"`
	FullyLabeledReplicas int64                `json:"fullyLabeledReplicas,omitempty"`
	ReadyReplicas        int64                `json:"readyReplicas,omitempty"`
	AvailableReplicas    int64                `json:"availableReplicas,omitempty"`
	ObservedGeneration   int64                `json:"observedGeneration,omitempty"`
	Conditions           []*cluster.Condition `json:"conditions,omitempty"`
}

type Replicaset struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

func NewReplicaset(name, namespace string, replicas int64, selector *cluster.Selector, podTemplate *pod.Pod) *Replicaset {

	if cluster.IsSpace(namespace) {
		namespace = "default"
	}

	meta := &cluster.Metadata{
		Namespace: namespace,
		Name:      name,
	}

	spec := &Spec{
		Replicas: replicas,
		Selector: selector,
		Template: podTemplate,
	}

	return &Replicaset{
		Kind:       "ReplicaSet",
		ApiVersion: "extensions/v1beta1",
		Meta:       meta,
		Spe:        spec,
	}

}

func (r *Replicaset) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/apis/extensions/v1beta1/namespaces/"+r.Meta.Namespace+"/replicasets", master, r)
}

func (r *Replicaset) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/apis/extensions/v1beta1/namespaces/"+r.Meta.Namespace+"/replicasets/"+r.Meta.Name, master, nil)
}

func (r *Replicaset) GetScale(master string) (io.ReadCloser, int, error) {
	scale := &Scale{}
	return scale.get(r.Meta.Name, r.Meta.Namespace, master)
}

func (r *Replicaset) PutScale(scale *Scale, master string) (io.ReadCloser, int, error) {
	return scale.put(r.Meta.Name, r.Meta.Namespace, master)
}

func (r *Replicaset) ToJsonString() string {
	strs, err := json.Marshal(r)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
