package pv

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Pvs struct {
	Kind       string `json:"kind,omitempty"`
	ApiVersion string `json:"apiVersion,omitempty"`
	Items      []*Pv  `json:"items,omitempty"`
}

func (pvs *Pvs) List(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/persistentvolumes", master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, pvs); err != nil {
		return err
	}

	return nil
}

func (pvs *Pvs) DELETE(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/persistentvolumes", master, nil)
}

func (pvs *Pvs) ToJsonString() string {
	strs, err := json.Marshal(pvs)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
