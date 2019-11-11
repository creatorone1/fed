package ingress

import (
	"encoding/json"
	"k8sfed/cluster"
)

type IngressList struct {
	Kind       string            `json"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Items      []*Ingress        `json:"items,omitempty"`
}

func (ings *IngressList) List(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/extensions/v1beta1/ingresses", master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, ings); err != nil {
		return err
	}

	return nil
}
