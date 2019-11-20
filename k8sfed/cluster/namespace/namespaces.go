package namespace

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Namespaces struct {
	Kind       string       `json:"kind,omitempty"`
	ApiVersion string       `json:"apiVersion,omitempty"`
	Items      []*Namespace `json:"items,omitempty"`
}

/*func (namespaces *Namespaces) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces", master, nil)
}*/
func (namespaces *Namespaces) List(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/namespaces", master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, namespaces); err != nil {
		return err
	}

	return nil
}

 
func (namespaces *Namespaces) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces", master, nil)
}

func (namespaces *Namespaces) ToJsonString() string {
	strs, err := json.Marshal(namespaces)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
