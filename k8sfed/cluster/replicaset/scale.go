package replicaset

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type ScaleSpec struct {
	Replicas int64 `json:"replicas,omitempty"`
}

type ScaleState struct {
	Replicas       int64       `json:"replicas,omitempty"`
	Selector       interface{} `json:"selector,omitempty"`
	TargetSelector string      `json:"targetSelector,omitempty"`
}

type Scale struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *ScaleSpec        `json:"spec,omitempty"`
	Status     *ScaleState       `json:"status,omitempty"`
}

func NewScale(name, namespace string, relicas int64) *Scale {

	meta := &cluster.Metadata{
		Namespace: namespace,
		Name:      name,
	}

	spec := &ScaleSpec{
		Replicas: relicas,
	}

	return &Scale{
		Meta: meta,
		Spe:  spec,
	}
}

func (s *Scale) get(rName, namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/apis/extensions/v1beta1/namespaces/"+namespace+"/replicasets/"+rName+"/scale", master, nil)
}

func (s *Scale) put(rName, namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("PUT", "/apis/extensions/v1beta1/namespaces/"+namespace+"/replicasets/"+rName+"/scale", master, s)
}

func (s *Scale) ToJsonString() string {
	strs, err := json.Marshal(s)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
