package resourcequota

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type ResourceQuotas struct {
	Kind       string           `json:"kind,omitempty"`
	ApiVersion string           `json:"apiVersion,omitempty"`
	Items      []*ResourceQuota `json:"items,omitempty"`
}

func (resourceQuotas *ResourceQuotas) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/resourcequotas", master, nil)
}

func (resourceQuotas *ResourceQuotas) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {

	if cluster.IsSpace(namespace) {
		namespace = "default"
	}
	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/resourcequotas", master, nil)
}

func (resourceQuotas *ResourceQuotas) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if cluster.IsSpace(namespace) {
		return nil, -1, cluster.ParameterNotNULL("namespace")
	}

	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace+"/resourcequotas", master, nil)
}

func (resourceQuotas *ResourceQuotas) ToJsonString() string {
	strs, err := json.Marshal(resourceQuotas)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
