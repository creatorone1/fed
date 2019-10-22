package node

import (
	"encoding/json"
	"fmt"
	"k8s_v2/cluster"
)

type Nodes struct {
	Kind  string  `json:"kind,omitempty"`
	Items []*Node `json:"items,omitempty"`
}

/*func (nodes *Nodes) List(master string) (io.ReadCloser, int, error) {
 	return cluster.Call("GET", "/api/v1/nodes", master, nil)
}*/

func (nodes *Nodes) List(master string) error {
	//return cluster.Call("GET", "/api/v1/nodes", master, nil)
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/nodes", master, nil))

	if err != nil {
		return err
	}
	if err := json.Unmarshal(body, nodes); err != nil {
		return err
	}
	return nil
}
func (nodes *Nodes) ToJsonString() string {
	strs, err := json.Marshal(nodes)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
