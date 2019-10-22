package service

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Services struct {
	Kind       string
	ApiVersion string
	Items      []*Service
}

func (services *Services) List(master string) error {

	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/services", master, nil))

	if err != nil {
		return err
	}
	
	if err := json.Unmarshal(body, services); err != nil {
		return err
	}

	return nil
}

func (services *Services) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if namespace == "" {
		namespace = "default"
	}
	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/services", master, nil)
}

func (services *Services) ToJsonString() string {
	strs, err := json.Marshal(services)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)

}
