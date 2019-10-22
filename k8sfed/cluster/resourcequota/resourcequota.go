package resourcequota

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Spec struct {
	Hard   interface{} `json:"hard,omitempty"`
	Scopes []string    `json:"scopes,omitempty"`
}

type State struct {
	Hard interface{} `json:"hard,omitempty"`
	Used interface{} `json:"used,omitempty"`
}

type ResourceQuota struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

func NewResourceQouta(name, namespace string, scopes []string, hard interface{}) *ResourceQuota {
	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}

	spec := &Spec{
		Hard:   hard,
		Scopes: scopes,
	}

	return &ResourceQuota{
		Kind:       "ResourceQuota",
		ApiVersion: "v1",
		Meta:       meta,
		Spe:        spec,
	}
}

func (resourceQuota *ResourceQuota) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+resourceQuota.Meta.Namespace+"/resourcequotas", master, resourceQuota)
}

func (resourceQuota *ResourceQuota) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces/"+resourceQuota.Meta.Namespace+"/resourcequotas/"+resourceQuota.Meta.Name,
		master, nil)
}

func (resourceQuota *ResourceQuota) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces/"+resourceQuota.Meta.Namespace+"/resourcequotas/"+resourceQuota.Meta.Name,
		master, nil)
}

func (resourceQuota *ResourceQuota) ToJsonString() string {
	strs, err := json.Marshal(resourceQuota)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
