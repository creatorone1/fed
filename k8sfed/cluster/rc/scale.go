package rc

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type ScaleSpec struct {
	Replicas int64 `json:"replicas,omitempty"`
}

type ScaleState struct {
	Replicas int64  `json:"replicas,omitempty"`
	Seletcor string `json:"selector,omitempty"`
}

type Scale struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *ScaleSpec        `json:"spec,omitempty"`
	Status     *ScaleState       `json:"status,omitempty"`
	//Replicationcontroller *Rc       `json:"-"`
}

func NewScale(name, namespace string, relicas int64) *Scale {

	meta := &cluster.Metadata{
		Namespace: namespace,
		Name:      name,
	}

	spec := &ScaleSpec{
		Replicas: relicas,
	}

	return &Scale{
		Meta: meta,
		Spe:  spec,
	}
}

func (scale *Scale) get(rcName, namespace, master string) (io.ReadCloser, int, error) {
	if rcName == "" {
		return nil, -1, cluster.ParameterNotNULL("rcName")
	}

	return cluster.Call("GET", "/api/v1/namespaces/"+namespace+"/replicationcontrollers/"+rcName+"/scale", master, nil)
}

func (scale *Scale) put(rcName, namespace, master string) (io.ReadCloser, int, error) {
	if rcName == "" {
		return nil, -1, cluster.ParameterNotNULL("rcName")
	}

	return cluster.Call("PUT", "/api/v1/namespaces/"+namespace+"/replicationcontrollers/"+rcName+"/scale", master, scale)
}

func (scale *Scale) ToJsonString() string {
	strs, err := json.Marshal(scale)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
