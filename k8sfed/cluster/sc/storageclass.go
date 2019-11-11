package sc

import (
	"encoding/json"
	"io"
	"k8sfed/cluster"
)

type StorageClass struct {
	Kind              string            `json"kind,omitempty"`
	ApiVersion        string            `json:"apiVersion,omitempty"`
	Meta              *cluster.Metadata `json:"metadata,omitempty"`
	Provisioner       string            `json:"provisioner,omitempty"`
	ReclaimPolicy     string            `json:"reclaimPolicy,omitempty"`
	VolumeBindingMode string            `json:"volumeBindingMode,omitempty"`
}

/*
type StorageClass struct {
	Kind       string            `json"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	//Data       interface{}       `json:"data,omitempty"`
	MountOption          []string
	Parameters           interface{}
	Provisioner          string
	ReclaimPolicy        string
	VolumeBindingMode    string
	AllowVolumeExpansion bool
	//AllowedTopologies []*TopologySelectorTerm
}*/

type DeleteOption struct {
	ApiVersion         string `json:"apiVersion,omitempty"`
	GracePeriodSeconds int
	Kind               string
	OrphanDependents   bool
	Preconditions      *Predictions
	PropagationPolicy  string
}

type Predictions struct {
	Preference *NodeSelectorTerm
	Weight     int
}

type NodeSelectorTerm struct {
	MatchExpression []*NodeSelectorRequirement
}

type NodeSelectorRequirement struct {
	Key      string
	Operator string
	Values   []string
}

/*
func NewSc(name, provisioner, reclaimpolicy, volumebindingmode string, mountoption []string, parameters interface{}, alowedtopologies bool) *StorageClass {

	meta := &cluster.Metadata{
		Name: name,
	}

	return &StorageClass{
		Kind:                 "StorageClass",
		ApiVersion:           "v1",
		Meta:                 meta,
		MountOption:          mountoption,
		Parameters:           parameters,
		Provisioner:          provisioner,
		ReclaimPolicy:        reclaimpolicy,
		VolumeBindingMode:    volumebindingmode,
		AllowVolumeExpansion: allowedtopologies,
	}
}*/

func NewDeleteOption(graceperiodseconds int, preconditions *Predictions, propagationpolicy string, orphandependents bool) *DeleteOption {
	return &DeleteOption{
		Kind:               "StorageClass",
		ApiVersion:         "storage.k8s.io/v1",
		GracePeriodSeconds: graceperiodseconds,
		Preconditions:      preconditions,
		PropagationPolicy:  propagationpolicy,
		OrphanDependents:   orphandependents,
	}
}

func (sc *StorageClass) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/apis/storage.k8s.io/v1/storageclasses/", master, sc)
}

func (sc *StorageClass) Get(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/storage.k8s.io/v1/storageclasses/"+sc.Meta.Name, master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, sc); err != nil {
		return err
	}

	return nil
	//return cluster.Call("GET", "/apis/storage.k8s.io/v1beta1/storageclasses/"+sc.Meta.Name, master, nil)
}
func (sc *StorageClass) Replace(master string) (io.ReadCloser, int, error) {
	return cluster.Call("PUT", "/apis/storage.k8s.io/v1/storageclasses/"+sc.Meta.Name, master, sc)
}
func (sc *StorageClass) Delete(master string) (io.ReadCloser, int, error) {
	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/apis/storage.k8s.io/v1/storageclasses/"+sc.Meta.Name, master, b)
	//return cluster.Call("DELETE", "/apis/storage.k8s.io/v1beta1/storageclasses/"+sc.Meta.Name, master, do)
}

func (sc *StorageClass) Update(master string, update []byte) (io.ReadCloser, int, error) {
	return cluster.PatchCall("PATCH", "/apis/storage.k8s.io/v1/storageclasses/"+sc.Meta.Name, master, update)
}

func (sc *StorageClass) Put(master string) (io.ReadCloser, int, error) {
	return cluster.Call("PUT", "/apis/storage.k8s.io/v1/storageclasses/"+sc.Meta.Name, master, sc)
}
