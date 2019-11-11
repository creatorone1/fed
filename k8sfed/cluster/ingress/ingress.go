package ingress

import (
	"encoding/json"
	"io"
	"k8sfed/cluster"
)

type Ingress struct {
	Kind       string            `json"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *Status           `json:"status,omitempty"`
}

type Spec struct {
	Backend *Backend `json:"backend,omitempty"`
	Rules   []*Rule  `json:"rules,omitempty"`
	Tls     []*Tls   `json:"tls,omitempty"`
}

type Status struct {
	LoadBalancer LB `json:"loadbalancer,omitempty"`
}

type LB struct {
	Ingress []*Ing
}
type Ing struct {
	hostname string
	ip       string
}

type Backend struct {
	ServiceName string `json:"serviceName,omitempty"`
	ServicePort interface{} `json:"servicePort,omitempty"`
}

type Rule struct {
	Host string                `json:"host,omitempty"`
	Http *HttpIngressRuleValue `json:"http,omitempty"`
}

type HttpIngressRuleValue struct {
	Paths []*HttpIngressPath `json:"paths,omitempty"`
}

type HttpIngressPath struct {
	Backend *Backend `json:"backend,omitempty"`
	Path    string   `json:"path,omitempty"`
}

type Tls struct {
	Hosts      []string `json:"hosts,omitempty"`
	SecretName string   `json:"secretname,omitempty"`
}

/*
type Ingress struct {
	Kind       string            `json"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	//Data       interface{}       `json:"data,omitempty"`
	Spe    *Spec
	Status *State
}

type Spec struct {
	Backend *Backend `json:"strategy,omitempty"`
	Rules   []*Rule  `json:"minReadySeconds,omitempty"`
	Tls     []*Tls   `json:"revisionHistoryLimit,omitempty"`
}

type State struct {
	LoadBalancer *LB
}
type LB struct {
	Ingress []*Ing
}
type Ing struct {
	hostname string
	ip       string
}
type Backend struct {
	ServiceName string
	ServicePort string
}

type Rule struct {
	Host string
	Http *HttpIngressRuleValue
}

type HttpIngressRuleValue struct {
	Paths []*HttpIngressPath
}

type HttpIngressPath struct {
	Backend *Backend
	Path    string
}

type Tls struct {
	Hosts      []string
	SecretName string
}*/

/*
func NewIngress(name string, backend *Backend, rules []*Rules, tls []*Tls, status *Status) *IngressClass {

	meta := &cluster.Metadata{
		Name: name,
	}

	spec := &Spec{
		Backend: capacity,
		Rules:   nfs,
		Tls:     hostPath,
	}

	return &IngressClass{
		Kind:       "Ingress",
		ApiVersion: "v1",
		Meta:       meta,
		Spe:        spec,
		Status:     status,
	}
}*/

func (ingress *Ingress) Create(master string) (io.ReadCloser, int, error) {

	return cluster.Call("POST", "/apis/extensions/v1beta1/namespaces/"+ingress.Meta.Namespace+"/ingresses", master, ingress)
}

func (ingress *Ingress) Get(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/extensions/v1beta1/namespaces/"+ingress.Meta.Namespace+"/ingresses/"+ingress.Meta.Name, master, nil))
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, ingress); err != nil {
		return err
	}
	return nil
}
func (ingress *Ingress) Replace(master string) (io.ReadCloser, int, error) {
	return cluster.Call("PUT", "/apis/extensions/v1beta1/namespaces/"+ingress.Meta.Namespace+"/ingresses/"+ingress.Meta.Name, master, ingress)
}
func (ingress *Ingress) Update(master string, update []byte) (io.ReadCloser, int, error) {
	return cluster.PatchCall("PATCH", "/apis/extensions/v1beta1/namespaces/"+ingress.Meta.Namespace+"/ingresses/"+ingress.Meta.Name, master, update)
	//return cluster.Update("PATCH", "/apis/apps/v1beta1/namespaces/"+ingress.Meta.Namespace+"/ingresses"+ingress.Meta.Name, master, update)
}

func (ingress *Ingress) Delete(master string) (io.ReadCloser, int, error) {
	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/apis/extensions/v1beta1/namespaces/"+ingress.Meta.Namespace+"/ingresses/"+ingress.Meta.Name, master, b)
}

func (ingress *Ingress) DeleteIngresses(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/apis/extensions/v1beta1/namespaces/"+ingress.Meta.Namespace, master, nil)
}
