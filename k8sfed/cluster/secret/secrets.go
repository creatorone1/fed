package secret

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Secrets struct {
	Kind       string    `json:"kind,omitempty"`
	ApiVersion string    `json:"apiVersion,omitempty"`
	Items      []*Secret `json:"items,omitempty"`
}

func (secrets *Secrets) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/secrets", master, nil)
}

func (secrets *Secrets) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if namespace == "" {
		namespace = "default"
	}
	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/secrets", master, nil)
}

func (secrets *Secrets) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace+"/secrets", master, nil)
}

func (secrets *Secrets) ToJsonString() string {
	strs, err := json.Marshal(secrets)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
