package configmap

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type ConfigMap struct {
	Kind       string            `json"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Data       interface{}       `json:"data,omitempty"`
}

func NewConfigMap(name, namespace string, labels map[string]string, data interface{}) *ConfigMap {

	if namespace == "" {
		namespace = "default"
	}

	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
		Labels:    labels,
	}
	return &ConfigMap{
		Kind:       "ConfigMap",
		ApiVersion: "v1",
		Meta:       meta,
		Data:       data,
	}
}

func (config *ConfigMap) ToJsonString() string {
	strs, err := json.Marshal(config)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}

func (config *ConfigMap) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+config.Meta.Namespace+"/configmaps", master, config)
}

func (config *ConfigMap) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces/"+config.Meta.Namespace+"/configmaps/"+config.Meta.Name, master, nil)
}

func (config *ConfigMap) Delete(master string) (io.ReadCloser, int, error) {
	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/api/v1/namespaces/"+config.Meta.Namespace+"/configmaps/"+config.Meta.Name, master, b)
}
