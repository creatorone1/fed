package pvc

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type Sto struct {
	Storage string `json:"storage,omitempty"`
}
type Resource struct {
	Limits   interface{} `json:"limits,omitempty"`
	Requests Sto         `json:"requests,omitempty"`
}

type Spec struct {
	AccessModes      []string          `json:"accessModes,omitempty"`
	Select           *cluster.Selector `json:"selector,omitempty"`
	Resources        *Resource         `json:"resources,omitempty"`
	VolumeName       string            `json:"volumeName,omitempty"`
	StorageClassName string            `json:"storageClassName,omitempty"`
}

type State struct {
	Phase       string      `json:"phase,omitempty"`
	AccessModes []string    `json:"accessModes,omitempty"`
	Capacity    interface{} `json:"capacity,omitempty"`
}

type Pvc struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

func NewPvc(name, namespace, volumeName, storageClassName string, limits interface{}, requests Sto, accessMode []string) *Pvc {

	if namespace == "" {
		namespace = "default"
	}

	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}

	resource := &Resource{
		Limits:   limits,
		Requests: requests,
	}

	spec := &Spec{
		AccessModes:      accessMode,
		Resources:        resource,
		VolumeName:       volumeName,
		StorageClassName: storageClassName,
	}

	return &Pvc{
		Kind:       "PersistentVolumeClaim",
		ApiVersion: "v1",
		Meta:       meta,
		Spe:        spec,
	}
}

func (pvc *Pvc) ToJsonString() string {
	strs, err := json.Marshal(pvc)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}
	return string(strs)
}

func (pvc *Pvc) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+pvc.Meta.Namespace+"/persistentvolumeclaims", master, pvc)
}

func (pvc *Pvc) Get(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/namespaces/"+pvc.Meta.Namespace+"/persistentvolumeclaims/"+pvc.Meta.Name, master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, pvc); err != nil {
		return err
	}

	return nil
}
func (pvc *Pvc) Replace(master string) (io.ReadCloser, int, error) {
	return cluster.Call("PUT", "/api/v1/namespaces/"+pvc.Meta.Namespace+"/persistentvolumeclaims/"+pvc.Meta.Name, master, pvc)
}
func (pvc *Pvc) Patch(master string, datas []byte) (io.ReadCloser, int, error) {
	return cluster.PatchCall("PATCH", "/api/v1/namespaces/"+pvc.Meta.Namespace+"/persistentvolumeclaims/"+pvc.Meta.Name, master, datas)
}
func (pvc *Pvc) Delete(master string) (io.ReadCloser, int, error) {
	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/api/v1/namespaces/"+pvc.Meta.Namespace+"/persistentvolumeclaims/"+pvc.Meta.Name, master, b)
}
