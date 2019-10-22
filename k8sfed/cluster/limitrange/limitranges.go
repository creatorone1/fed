package limitrange

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type LimitRanges struct {
	Kind       string        `json:"kind,omitempty"`
	ApiVersion string        `json:"apiVersion,omitempty"`
	Items      []*LimitRange `json:"items,omitempty"`
}

func (limitRanges *LimitRanges) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/limitranges", master, nil)
}

func (limitRanges *LimitRanges) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {

	if cluster.IsSpace(namespace) {
		namespace = "default"
	}

	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/limitranges", master, nil)
}

func (limitRanges *LimitRanges) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {

	if cluster.IsSpace(namespace) {
		return nil, -1, cluster.ParameterNotNULL("namespace")
	}

	return cluster.Call("DELETE", "/api/v1/namespaces/"+namespace+"/limitranges", master, nil)
}

func (limitRanges *LimitRanges) ToJsonString() string {
	strs, err := json.Marshal(limitRanges)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
