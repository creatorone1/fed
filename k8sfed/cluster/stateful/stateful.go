package stateful

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
	"k8s_v2/cluster/pod"
	"k8s_v2/cluster/pvc"
)

type Spec struct {
	Replicas             int64             `json:"replicas,omitempty"`
	Select               *cluster.Selector `json:"selector,omitempty"`
	Template             *pod.Pod          `json:"template,omitempty"`
	VolumeClaimTemplates []*pvc.Pvc        `json:"volumeClaimTemplates,omitempty"`
}

type State struct {
	ObservedGeneration int64 `json:"observedGeneration,omitempty"`
	Replicas           int64 `json:"replicas,omitempty"`
}

type StatefulSet struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

func NewStateful(name, namespace string, replicas int64, selector *cluster.Selector, podTemplate *pod.Pod, pvcs []*pvc.Pvc) *StatefulSet {

	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}

	spec := &Spec{
		Replicas:             replicas,
		Select:               selector,
		Template:             podTemplate,
		VolumeClaimTemplates: pvcs,
	}

	return &StatefulSet{
		Kind:       "StatefulSet",
		ApiVersion: "apps/v1beta1",
		Meta:       meta,
		Spe:        spec,
	}
}

func (stateful *StatefulSet) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/apis/apps/v1beta1/namespaces/"+stateful.Meta.Namespace+"/statefuls", master, stateful)
}

func (stateful *StatefulSet) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/apis/apps/v1beta1/namespaces/"+stateful.Meta.Namespace+"/statefuls/"+stateful.Meta.Name, master, nil)
}

func (stateful *StatefulSet) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/apis/apps/v1beta1/namespaces/"+stateful.Meta.Namespace+"/statefuls/"+stateful.Meta.Name, master, nil)
}

func (stateful *StatefulSet) ToJsonString() string {
	strs, err := json.Marshal(stateful)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
