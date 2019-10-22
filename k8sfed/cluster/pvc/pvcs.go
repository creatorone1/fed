package pvc

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Pvcs struct {
	Kind       string `json:"kind,omitempty"`
	ApiVersion string `json:"apiVersion,omitempty"`
	Items      []*Pvc `josn:"items,omitempty"`
}

func (pvcs *Pvcs) ToJsonString() string {
	strs, err := json.Marshal(pvcs)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}

func (pvcs *Pvcs) List(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/persistentvolumeclaims", master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, pvcs); err != nil {
		return err
	}

	return nil
}

func (pvcs *Pvcs) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {

	if namespace == "" {
		namespace = "default"
	}
	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/persistentvolumeclaims", master, nil)
}

func (pvcs *Pvcs) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace+"/persistentvolumeclaims", master, nil)
}
