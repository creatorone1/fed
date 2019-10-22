package serviceaccount

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
	"strings"
)

type ServiceAccounts struct {
	Kind       string            `json:"kind"`
	ApiVersion string            `json:"apiVersion"`
	Items      []*ServiceAccount `json:"items"`
}

func (serviceaccounts *ServiceAccounts) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/serviceaccounts", master, nil)
}

func (serviceaccounts *ServiceAccounts) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if namespace == "" || strings.TrimSpace(namespace) == "" {
		namespace = "default"
	}
	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/serviceaccounts", master, nil)
}

func (serviceaccount *ServiceAccounts) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace+"/serviceaccounts", master, nil)
}

func (serviceaccounts *ServiceAccounts) ToJsonString() string {
	strs, err := json.Marshal(serviceaccounts)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
