package replicaset

import (
	"fmt"
	"k8s_v2/cluster"
	"strings"
)

type body struct {
	Kind               string      `json:"kind,omitempty"`
	ApiVersion         string      `json:"apiVersion,omitempty"`
	GracePeriodSeconds int64       `json:"gracePeriodSeconds,omitempty"`
	Preconditions      interface{} `json:"preconditions,omitempty"`
	OrphanDependents   bool        `json:"orphanDependents,omitempty"`
	PropagationPolicy  interface{} `json:"propagationPolicy,omitempty"`
}

func NewBody(gracePeriodSeconds int64, orphanDependents bool) *body {
	return &body{
		//Kind:               "ReplicaSets",
		//ApiVersion:         "extensions/v1beta1",
		GracePeriodSeconds: gracePeriodSeconds,
		OrphanDependents:   orphanDependents,
	}
}

func Delete(master, name, namespace string) error {

	fmt.Println(master, " ", name, " ", namespace)
	rs := Replicasets{}

	if err := rs.List(master); err != nil {
		return err
	}

	fmt.Println(rs.ToJsonString())

	for _, item := range rs.Items {
		if (item.Meta.Namespace == namespace) && strings.Contains(item.Meta.Name, name) {
			fmt.Println(item.Meta.Name)
			if err := item.delete(master); err != nil {

				fmt.Println("err: ", err)
				return err
			}
		}
	}
	return nil
}

func (r *Replicaset) delete(master string) error {
	_, _, err := cluster.Call("DELETE", "/apis/extensions/v1beta1/namespaces/"+r.Meta.Namespace+"/replicasets/"+r.Meta.Name, master, nil)
	return err
}
