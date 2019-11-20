package deployment

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type ScaleSpec struct {
	Replicas int64 `json:"replicas,omitempty"`
}

type ScaleState struct {
	Replicas       int64       `json:"replicas,omitempty"`
	Select         interface{} `json:"selector,omitempty"`
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
		Kind:       "Scale",
		ApiVersion: "apps/v1beta1",
		Meta:       meta,
		Spe:        spec,
	}
}

func (scale *Scale) Get(dName, namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/apis/apps/v1beta1/namespaces/"+namespace+"/deployments/"+dName+"/scale", master, nil)
}

func (scale *Scale) Put(dName, namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("PUT", "/apis/apps/v1beta1/namespaces/"+namespace+"/deployments/"+dName+"/scale", master, scale)
}
func (scale *Scale) PutFed(dName, namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("PUT", "/apis/extensions/v1beta1/namespaces/"+namespace+"/deployments/"+dName+"/scale", master, scale)
}
func (scale *Scale) ToJsonString() string {
	strs, err := json.Marshal(scale)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
