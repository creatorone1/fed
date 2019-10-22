package pod

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
	"strings"
)

type Pods struct {
	Kind       string `json:"kind,omitempty"`
	ApiVersion string `json:"apiVersion,omitempty"`
	Items      []*Pod `json:"items"`
}

func (pods *Pods) ToJsonString() string {
	strs, err := json.Marshal(pods)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}

func (pods *Pods) List(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/pods", master, nil))

	if err != nil {
		return err
	}

	err = json.Unmarshal(body, pods)

	if err != nil {
		return err
	}

	return nil
}

func Deletes(master, name, namespace string) error {
	ps := &Pods{}

	if err := ps.ListOfNamespace(namespace, master); err != nil {
		return err
	}

	for _, item := range ps.Items {
		if strings.Contains(item.Meta.Name, name) {
			if _, _, err := item.Delete(master); err != nil {
				return err
			}
		}
	}

	return nil
}

func (pods *Pods) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if namespace == "" {
		namespace = "default"
	}
	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace+"/pods", master, nil)
}

func (pods *Pods) ListOfNamespace(namespace, master string) error {
	if namespace == "" {
		namespace = "default"
	}
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/pods", master, nil))
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, pods); err != nil {
		return err
	}

	return nil
}
