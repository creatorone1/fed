package hpa

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Horizontalpodautoscaler struct {
	Kind       string                         `json:"kind,omitempty"`
	ApiVersion string                         `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata              `json:"metadata,omitempty"`
	Spec       *Spec                          `json:"spec,omitempty"`
	Status     *HorizontalpodautoscalerStatus `json:"status,omitempty"`
}
type Spec struct {
	ScaleTargetRef                 *CrossVersionObjectReference `json:"scaleTargetRef,omitempty"`
	MinReplicas                    int64                        `json:"minReplicas,omitempty"`
	MaxReplicas                    int64                        `json:"maxReplicas,omitempty"`
	TargetCPUUtilizationPercentage int64                        `json:"targetCPUUtilizationPercentage,omitempty"`
}
type CrossVersionObjectReference struct {
	Kind       string `json:"kind,omitempty"`
	Name       string `json:"name,omitempty"`
	Apiversion string `json:"apiVersion,omitempty"`
}
type HorizontalpodautoscalerStatus struct {
	ObservedGeneration              int64  `json:"observedGeneration,omitempty"`
	LastScaleTime                   string `json:"lastScaleTime,omitempty"`
	CurrentReplicas                 int64  `json:"currentReplicas,omitempty"`
	DesiredReplicas                 int64  `json:"desiredReplicas,omitempty"`
	CurrentCPUUtilizationPercentage int64  `json:"currentCPUUtilizationPercentage,omitempty"`
}

func NewHorizontalpodautoscaler(name, namespace,refname string, minreplicas, maxreplicas, TargetCpu int64) *Horizontalpodautoscaler {
	if namespace == "" {
		namespace = "default"
	}
	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}
	crossVersionObjectReference := &CrossVersionObjectReference{
		Kind:       "Deployment",
		Name:       refname,
		Apiversion: "apps/v1beta1",
	}
	spec := &Spec{
		ScaleTargetRef:                 crossVersionObjectReference,
		MinReplicas:                    minreplicas,
		MaxReplicas:                    maxreplicas,
		TargetCPUUtilizationPercentage: TargetCpu,
	}
	return &Horizontalpodautoscaler{
		Kind:       "HorizontalPodAutoscaler",
		ApiVersion: "autoscaling/v1",
		Meta:       meta,
		Spec:       spec,
	}
}

func (hpa *Horizontalpodautoscaler) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/apis/autoscaling/v1/namespaces/"+hpa.Meta.Namespace+"/horizontalpodautoscalers/"+hpa.Meta.Name, master, nil)

}
func (hpa *Horizontalpodautoscaler) Geth(master string) error {

		body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/autoscaling/v1/namespaces/"+hpa.Meta.Namespace+"/horizontalpodautoscalers/"+hpa.Meta.Name, master, nil))

		if err != nil {
		return err
	}

		if err := json.Unmarshal(body, hpa); err != nil {
		return err
	}
		return nil

}


func (hpa *Horizontalpodautoscaler) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/apis/autoscaling/v1/namespaces/"+hpa.Meta.Namespace+"/horizontalpodautoscalers", master, hpa)


}

func (hpa *Horizontalpodautoscaler) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/apis/autoscaling/v1/namespaces/"+hpa.Meta.Namespace+"/horizontalpodautoscalers/"+hpa.Meta.Name, master, nil)
}

func (hpa *Horizontalpodautoscaler) ToJsonString() string {
	strs, err := json.Marshal(hpa)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}
	return string(strs)
}
