package configmap

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type ConfigMaps struct {
	Kind       string       `json:"kind,omitempty"`
	ApiVersion string       `josn:"apiVersion,omitempty"`
	Items      []*ConfigMap `json:"items,omitempty"`
}

func (configs *ConfigMaps) ToJsonString() string {
	strs, err := json.Marshal(configs)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}

/*func (configs *ConfigMaps) List(master string) (io.ReadCloser, int, error) {


	return cluster.Call("GET", "/api/v1/configmaps", master, nil)
}*/
func (configs *ConfigMaps) List(master string) error {

	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/configmaps", master, nil))

	if err != nil {
		return err
	}
	//fmt.Printf("%s", body)
	if err := json.Unmarshal(body, configs); err != nil {
		return err
	}

	return nil
	//return cluster.Call("GET", "/api/v1/configmaps", master, nil)
}

func (configs *ConfigMaps) ListOfNamespace(namespace, master string) error {

	if namespace == "" {
		namespace = "default"
	}
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/configmaps", master, nil))

	if err != nil {
		return err
	}
	//fmt.Printf("%s", body)
	if err := json.Unmarshal(body, configs); err != nil {
		return err
	}

	return nil
	//return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/configmaps", master, nil)
}

/*func (configs *ConfigMaps) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if namespace == "" {
		namespace = "default"
	}

	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/configmaps", master, nil)
}*/

func (configs *ConfigMaps) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if namespace == "" {
		namespace = "default"
	}

	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace+"/configmaps", master, nil)
}
