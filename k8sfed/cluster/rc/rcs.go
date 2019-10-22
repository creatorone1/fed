package rc

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Rcs struct {
	Kind       string `json:"kind,omitempty"`
	ApiVersion string `json:"apiVersion:omitempty"`
	Items      []*Rc  `json:"items,omitempty"`
}

func (rcs *Rcs) ToJsonString() string {
	strs, err := json.Marshal(rcs)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}

func (rcs *Rcs) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/replicationcontrollers", master, nil)
}

func (rcs *Rcs) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if namespace == "" {
		namespace = "default"
	}

	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/replicationcontrollers", master, nil)
}

func (rcs *Rcs) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if namespace == "" {
		namespace = "default"
	}

	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace+"/replicationcontrollers", master, nil)
}
