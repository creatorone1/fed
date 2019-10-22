package stateful

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type StatefulSets struct {
	Kind       string         `json:"kind,omitempty"`
	ApiVersion string         `json:"apiVersion,omitempty"`
	Items      []*StatefulSet `json:"items,omitempty"`
}

func (statefuls *StatefulSets) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/apis/apps/v1beta1/statefulsets", master, nil)
}

func (statefuls *StatefulSets) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/apis/apps/v1beta1/namespaces/"+namespace+"/statefulsets", master, nil)
}

func (statefuls *StatefulSets) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/apis/apps/v1beta1/namespaces/"+namespace+"/statefulsets", master, nil)
}

func (statefuls *StatefulSets) ToJsonString() string {
	strs, err := json.Marshal(statefuls)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
