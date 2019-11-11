package clusters

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type Clusters struct {
	Kind       string     `json:"kind,omitempty"`
	ApiVersion string     `json:"apiVersion,omitempty"`
	Items      []*Cluster `json:"items,omitempty"`
}

type Cluster struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

type Spec struct {
	ServerAddressByClientCIDRs []*ServerAddressByClientCIDR `json:"serverAddressByClientCIDRs,omitempty"`
}
type ServerAddressByClientCIDR struct {
	ClientCIDR    string `json:"clientCIDR,omitempty"`
	ServerAddress string `json:"serverAddress,omitempty"`
}
type State struct {
	Conditions []*cluster.Condition `json:"conditions,omitempty"`
}

type Comstatuses struct {
	Kind       string       `json:"kind,omitempty"`
	ApiVersion string       `json:"apiVersion,omitempty"`
	Items      []*Comstatus `json:"items,omitempty"`
}
type Comstatus struct {
	Kind       string               `json:"kind,omitempty"`
	ApiVersion string               `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata    `json:"metadata,omitempty"`
	Conditions []*cluster.Condition `json:"conditions,omitempty"`
}

/*func (cs *Clusters) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces", master, nil)
}*/
func (cs *Clusters) List(master string) error {
	//return cluster.Call("GET", "/api/v1/nodes", master, nil)
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/federation/v1beta1/clusters", master, nil))

	if err != nil {
		return err
	}
	if err := json.Unmarshal(body, cs); err != nil {
		return err
	}
	return nil
}

func (cs *Cluster) Delete(master string) (io.ReadCloser, int, error) {
	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/apis/federation/v1beta1/clusters/"+cs.Meta.Name, master, b)
}
func (cs *Cluster) Update(master string, data []byte) (io.ReadCloser, int, error) {
	return cluster.PatchCall("PATCH", "/apis/federation/v1beta1/clusters/"+cs.Meta.Name, master, data)
}
func GetVersion(master string) (map[string]string, error) {
	//return cluster.Call("GET", "/api/v1/nodes", master, nil)
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/version", master, nil))

	if err != nil {
		return nil, err
	}
	var mp map[string]string
	//fmt.Printf("%s", body)
	if err := json.Unmarshal(body, &mp); err != nil {
		return nil, err
	}

	return mp, nil
}

func (cts *Comstatuses) GetComstatuses(master string) error {
	//return cluster.Call("GET", "/api/v1/nodes", master, nil)
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/componentstatuses", master, nil))

	if err != nil {
		return err
	}
	if err := json.Unmarshal(body, cts); err != nil {
		return err
	}
	return nil
}

func (cs *Clusters) ToJsonString() string {
	strs, err := json.Marshal(cs)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
