package service

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type Port struct {
	Name       string      `json:"name,omitempty"`
	Protocol   string      `json:"protocol,omitempty"`
	Port       int64       `json:"port,omitempty"`
	TargetPort interface{} `json:"targetPort,omitempty"`
	NodePort   int64       `json:"nodePort,omitempty"`
}

type Spec struct {
	Ports                    []*Port           `json:"ports,omitempty"`
	Selector                 map[string]string `json:"selector,omitempty"`
	ClusterIP                string            `json:"clusterIP,omitempty"`
	Type                     string            `json:"type,omitempty"`
	ExternalIPs              []string          `json:"externalIPs,omitempty"`
	DeprecatedPublicIPs      []string          `json:"deprecatedPublicIPs,omitempty"`
	SessionAffinity          string            `json:"sessionAffinity,omitempty"`
	LoadBalancerIp           string            `json:"loadBalancerIP,omitempty"`
	LoadBalancerSourceRanges []string          `json:"loadBalancerSourceRanges,omitempty"`
	ExternalName             string            `json:"externalName,omitempty"`
}

type Ingress struct {
	Ip       string `json:"ip,omitempty"`
	Hostname string `json:"hostname,omitempty"`
}

type LoadBalancer struct {
	Ing []*Ingress `json:"ingress,omitempty"`
}

type State struct {
	LoadBalance *LoadBalancer `json:"loadBalancer,omitempty"`
}

type Service struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

func NewPort(name, protocol string, port, targetPort, nodePort int64) *Port {
	p := &Port{
		Name:     name,
		Protocol: protocol,
		Port:     port,
		NodePort: nodePort,
	}

	if targetPort != 0 {
		p.TargetPort = targetPort
	}

	return p
}

func NewService(name, namespace string, labels, selector map[string]string, portType, clusterIP string, ports []*Port) *Service {

	if namespace == "" {
		namespace = "default"
	}

	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
		Labels:    labels,
	}

	spec := &Spec{
		Ports:     ports,
		Selector:  selector,
		Type:      portType,
		ClusterIP: clusterIP,
	}

	return &Service{
		Kind:       "Service",
		ApiVersion: "v1",
		Meta:       meta,
		Spe:        spec,
	}

}

func (service *Service) Get(master string) error {

	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/namespaces/"+service.Meta.Namespace+"/services/"+service.Meta.Name, master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, service); err != nil {
		return err
	}

	return nil
}

func (service *Service) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+service.Meta.Namespace+"/services", master, service)
}

func (service *Service) Delete(master string) (io.ReadCloser, int, error) {
	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/api/v1/namespaces/"+service.Meta.Namespace+"/services/"+service.Meta.Name, master, b)
}

func (service *Service) ToJsonString() string {
	strs, err := json.Marshal(service)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
