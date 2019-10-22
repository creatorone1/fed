package endpoint

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
	"strings"
)

type Endpoints struct {
	Kind       string      `json:"kind,omitempty"`
	ApiVersion string      `json:"apiVersion,omitempty"`
	Items      []*Endpoint `json:"items,omitempty"`
}

func (endpoints *Endpoints) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/endpoints", master, nil)
}

func (endpoints *Endpoints) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {

	if namespace == "" || strings.TrimSpace(namespace) == "" {
		namespace = "default"
	}
	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/endpoints", master, nil)
}

func (endpoints *Endpoints) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if namespace == "" || strings.TrimSpace(namespace) == "" {
		return nil, -1, cluster.ParameterNotNULL("namespace")
	}

	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace+"/endpoints", master, nil)
}

func (endpoints *Endpoints) ToJsonString() string {
	strs, err := json.Marshal(endpoints)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
