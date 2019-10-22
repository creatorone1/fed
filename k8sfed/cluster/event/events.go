package event

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Events struct {
	Kind       string   `json:"kind,omitempty"`
	ApiVersion string   `json:"apiVersion,omitempty"`
	Items      []*Event `json:"items,omitempty"`
}

func (events *Events) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/events", master, nil)
}

func (events *Events) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if cluster.IsSpace(namespace) {
		namespace = "default"
	}
	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/events", master, nil)
}
func (events *Events) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {

	if cluster.IsSpace(namespace) {
		return nil, -1, cluster.ParameterNotNULL("namespace")
	}
	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace+"/events", master, nil)
}

func (events *Events) ToJsonString() string {
	strs, err := json.Marshal(events)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
