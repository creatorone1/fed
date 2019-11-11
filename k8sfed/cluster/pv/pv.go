package pv

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type HostPath struct {
	Path string `json:"path,omitempty"`
}

type NFS struct {
	Server   string `json:"server,omitempty"`
	Path     string `json:"path,omitempty"`
	ReadOnly bool   `json:"readOnly,omitempty"`
}

type State struct {
	Phase   string `json:"phase,omitempty"`
	Message string `json:"message,omitempty"`
	Reason  string `json:"reason,omitempty"`
}

type Resource struct {
	Storage string `json:"storage,omitempty"`
}
type CR struct {
	kind            string `json:"kind,omitempty"`
	Namespace       string `json:"namespace,omitempty"`
	Name            string `json:"name,omitempty"`
	Uid             string `json:"uid,omitempty"`
	ApiVersion      string `json:"apiVersion,omitempty"`
	ResourceVersion string `json:"resourceVersion,omitempty"`
}
type Spec struct {
	Capacity                      *Resource `json:"capacity,omitempty"`
	Nfs                           *NFS      `json:"nfs,omitempty"`
	Hostpath                      *HostPath `json:"hostPath,omitempty"`
	AccessModes                   []string  `json:"accessModes,omitempty"`
	PersistentVolumeReclaimPolicy string    `json:"persistentVolumeReclaimPolicy,omitempty"`
	StorageClassName              string    `json:"storageClassName,omitempty"`
	ClaimRef                      *CR       `json:"claimRef,omitempty"`
}

type Pv struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

func NewPv(name string, nfs *NFS, hostPath *HostPath, capacity *Resource, accessModes []string,
	persistentVolumeReclaimPolicy, storageClassName string) *Pv {

	meta := &cluster.Metadata{
		Name: name,
	}

	if cluster.IsSpace(persistentVolumeReclaimPolicy) {
		persistentVolumeReclaimPolicy = "Recycle"
	}

	spec := &Spec{
		Capacity:                      capacity,
		Nfs:                           nfs,
		Hostpath:                      hostPath,
		AccessModes:                   accessModes,
		PersistentVolumeReclaimPolicy: persistentVolumeReclaimPolicy,
		StorageClassName:              storageClassName,
	}

	return &Pv{
		Kind:       "PersistentVolume",
		ApiVersion: "v1",
		Meta:       meta,
		Spe:        spec,
	}
}

func (pv *Pv) Get(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/persistentvolumes/"+pv.Meta.Name, master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, pv); err != nil {
		return err
	}

	return nil
}

func (pv *Pv) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/persistentvolumes", master, pv)
}
func (pv *Pv) Replace(master string) (io.ReadCloser, int, error) {
	return cluster.Call("PUT", "/api/v1/persistentvolumes/"+pv.Meta.Name, master, pv)
}
func (pv *Pv) Delete(master string) (io.ReadCloser, int, error) {
	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/api/v1/persistentvolumes/"+pv.Meta.Name, master, b)
}

func (pv *Pv) ToJsonString() string {
	strs, err := json.Marshal(pv)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
