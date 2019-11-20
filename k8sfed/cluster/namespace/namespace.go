package namespace

import (
	"encoding/json"
	"fmt"
	"io"

	"k8sfed/cluster"
)

type Spec struct {
	Finalizers []string `json:"finalizers,omitempty"`
}

type State struct {
	Phase string `json:"phase,omitempty"`
}

type Namespace struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion, omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spec       *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

func NewNamespace(name string) *Namespace {
	meta := &cluster.Metadata{
		Name: name,
	}

	return &Namespace{
		Kind:       "Namespace",
		ApiVersion: "v1",
		Meta:       meta,
	}
}

func (namespace *Namespace) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces", master, namespace)
}

func (namespace *Namespace) Delete(master string) (io.ReadCloser, int, error) {
	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace.Meta.Name, master, b)
}

func (namespace *Namespace) Update(master string, update []byte) (io.ReadCloser, int, error) {
	return cluster.PatchCall("PATCH", "/api/v1/namespaces/"+namespace.Meta.Name, master, update)
	//return cluster.Update("PATCH", "/apis/apps/v1beta1/namespaces/"+ingress.Meta.Namespace+"/ingresses"+ingress.Meta.Name, master, update)
}

func (namespace *Namespace) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces/"+namespace.Meta.Name, master, nil)
}

func (namespace *Namespace) ToJsonString() string {
	strs, err := json.Marshal(namespace)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
