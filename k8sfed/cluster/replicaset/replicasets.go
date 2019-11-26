package replicaset

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type Replicasets struct {
	Kind       string        `json:"kind,omitempty"`
	ApiVersion string        `json:"apiVersion,omitempty"`
	Items      []*Replicaset `json:"items,omitempty"`
}

func (rs *Replicasets) List(master string) error {

	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/extensions/v1beta1/replicasets", master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, rs); err != nil {
		return err
	}

	return nil
}

func (rs *Replicasets) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/apis/extensions/v1beta1/namespaces/"+namespace+"/replicasets", master, nil)
}

func (rs *Replicasets) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/apis/extensions/v1beta1/namespaces/"+namespace+"/replicasets", master, nil)
}

func (rs *Replicasets) ToJsonString() string {
	strs, err := json.Marshal(rs)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
