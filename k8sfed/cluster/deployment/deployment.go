package deployment

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
	"k8sfed/cluster/pod"
)

type RollingUpdate struct {
	MaxUnavailable interface{} `json:"maxUnavailable,omitempty"`
	MaxSurge       interface{} `json:"maxSurge,omitempty"`
}

type Strategy struct {
	Type          string         `json:"type,omitempty"`
	Rollingupdate *RollingUpdate `json:"rollingUpdate,omitempty"`
}

type Rollback struct {
	Revision int64 `json:"revision,omitempty"`
}

type Spec struct {
	Replicas                int64             `json:"replicas,omitempty"`
	Select                  *cluster.Selector `json:"selector,omitempty"`
	Template                *pod.Pod          `json:"template,omitempty"`
	Strate                  *Strategy         `json:"strategy,omitempty"`
	MinReadySeconds         int64             `json:"minReadySeconds,omitempty"`
	RevisionHistoryLimit    int64             `json:"revisionHistoryLimit,omitempty"`
	Paused                  bool              `json:"paused,omitempty"`
	RollbackTo              *Rollback         `json:"rollbackTo,omitempty"`
	ProgressDeadlineSeconds int64             `json:"progressDeadlineSeconds,omitempty"`
	//ImagePullSecrets        []interface{}     `json:"imagePullSecrets,omitempty"`
}

type Condition struct {
	Type               string `json:"type,omitempty"`
	Status             string `json:"status,omitempty"`
	LastUpdateTime     string `json:"lastUpdateTime,omitempty"`
	LastTransitionTime string `json:"lastTransitionTime,omitempty"`
	Reason             string `json:"reason,omitempty"`
	Message            string `json:"message,omitempty"`
}

type State struct {
	ObservedGeneration  int64        `json:"observedGeneration,omitempty"`
	Replicas            int64        `json:"replicas,omitempty"`
	UpdatedReplicas     int64        `json:"updatedReplicas,omitempty"`
	ReadyReplicas       int64        `json:"readyReplicas,omitempty"`
	AvailableReplicas   int64        `json:"availableReplicas,omitempty"`
	UnavailableReplicas int64        `json:"unavailableReplicas,omitempty"`
	Conditions          []*Condition `json:"conditions,omitempty"`
}

type Deployment struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

/*
func NewDeployment(name, namespace string, matchLabels interface{}, labels map[string]string,
	replicas int64, podTemplate *pod.Pod, stategy *Strategy) *Deployment {

	if cluster.IsSpace(namespace) {
		namespace = "default"
	}

	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
		Labels:    labels,
	}

	selector := &cluster.Selector{
		MatchLabels: matchLabels,
	}

	spec := &Spec{
		Replicas: replicas,
		Select:   selector,
		Template: podTemplate,
		Strate:   stategy,
	}

	return &Deployment{
		Kind:       "Deployment",
		ApiVersion: "apps/v1beta1",
		Meta:       meta,
		Spe:        spec,
	}

}*/

func (deloyment *Deployment) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/apis/apps/v1beta1/namespaces/"+deloyment.Meta.Namespace+"/deployments", master, deloyment)
}
func (deployment *Deployment) Update(master string, data []byte) (io.ReadCloser, int, error) {
	return cluster.PatchCall("PATCH", "/apis/apps/v1beta1/namespaces/"+deployment.Meta.Namespace+"/deployments/"+deployment.Meta.Name, master, data)
}
func (deployment *Deployment) Replace(master string) (io.ReadCloser, int, error) {
	return cluster.Call("PUT", "/apis/apps/v1beta1/namespaces/"+deployment.Meta.Namespace+"/deployments/"+deployment.Meta.Name, master, deployment)
}

func (deloyment *Deployment) Get(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/apps/v1beta1/namespaces/"+deloyment.Meta.Namespace+"/deployments/"+deloyment.Meta.Name, master, nil))
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, deloyment); err != nil {
		return err
	}

	return nil
}

func (deloyment *Deployment) PutScale(scale *Scale, master string) (io.ReadCloser, int, error) {
	return scale.Put(deloyment.Meta.Name, deloyment.Meta.Namespace, master)
}

func (deployment *Deployment) GetScale(master string) (io.ReadCloser, int, error) {
	scale := &Scale{}
	return scale.Get(deployment.Meta.Name, deployment.Meta.Namespace, master)
}

func (deployment *Deployment) ToJsonString() string {
	strs, err := json.Marshal(deployment)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
