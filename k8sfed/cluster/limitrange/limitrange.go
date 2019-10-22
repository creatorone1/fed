package limitrange

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Limit struct {
	Type                 string      `json:"type,omitempty"`
	Max                  interface{} `json:"max,omitempty"`
	Min                  interface{} `json:"min,omitempty"`
	Default              interface{} `json:"default,omitempty"`
	DefaultRequest       interface{} `json:"defaultRequest,omitempty"`
	MaxLimitRequestRatio interface{} `json:"maxLimitRequestRatio,omitempty"`
}

type Spec struct {
	Limits []*Limit `json:"limits,omitempty"`
}

type LimitRange struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
}

func NewLimit(limitType string, limitMax, limitMin, limitDefault, defaultRequest interface{}) *Limit {
	return &Limit{
		Type:           limitType,
		Max:            limitMax,
		Min:            limitMin,
		Default:        limitDefault,
		DefaultRequest: defaultRequest,
	}
}

func NewLimitRange(name, namespace string, limits []*Limit) *LimitRange {

	if cluster.IsSpace(namespace) {
		namespace = "default"
	}
	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}

	spec := &Spec{
		Limits: limits,
	}

	return &LimitRange{
		Kind:       "LimitRange",
		ApiVersion: "v1",
		Meta:       meta,
		Spe:        spec,
	}

}

func (limitRange *LimitRange) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+limitRange.Meta.Namespace+"/limitranges", master, limitRange)
}

func (limitRange *LimitRange) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces/"+limitRange.Meta.Namespace+"/limitranges/"+limitRange.Meta.Name, master, nil)
}

func (limitRange *LimitRange) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces/"+limitRange.Meta.Namespace+"/limitranges/"+limitRange.Meta.Name, master, nil)
}

func (limitRange *LimitRange) ToJsonString() string {
	strs, err := json.Marshal(limitRange)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
