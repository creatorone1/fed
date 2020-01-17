package endpoint

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type Target struct {
	Kind            string `json:"kind,omitempty"`
	Namespace       string `json:"namespace,omitempty"`
	Name            string `json:"name,omitempty"`
	Uid             string `json:"uid,omitempty"`
	ApiVersion      string `json:"apiVersion,omitempty"`
	ResourceVersion string `json:"resourceVersion,omitempty"`
	FieldPath       string `json:"fieldPath,omitempty"`
}

type Address struct {
	Ip        string  `json:"ip,omitempty"`
	Hostname  string  `json:"hostname,omitempty"`
	Nodename  string  `json:"nodeName,omitempty"`
	TargetRef *Target `json:"targetRef,omitempty"`
}

type Port struct {
	Name     string `json:"name,omitempty"`
	Port     int64  `json:"port,omitempty"`
	Protocol string `json:"protocol,omitempty"`
}

type Subset struct {
	Addresses         []*Address `json:"addresses,omitempty"`
	NotReadyAddresses []*Address `json:"notReadyAddresses,omitempty"`
	Ports             []*Port    `json:"ports,omitempty"`
}

type Endpoint struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Subsets    []*Subset         `json:"subsets,omitempty"`
}

func NewPort(name, protocol string, port int64) *Port {

	if cluster.IsSpace(protocol) {
		protocol = "TCP"
	}
	return &Port{
		Name:     name,
		Protocol: protocol,
		Port:     port,
	}
}

func NewSubset(ips []string, ports []*Port) *Subset {

	var addresses []*Address

	for _, ip := range ips {
		address := &Address{
			Ip: ip,
		}
		addresses = append(addresses, address)
	}

	return &Subset{
		Addresses: addresses,
		Ports:     ports,
	}

}

func NewEndpoint(name, namespace string, subsets []*Subset) *Endpoint {

	if cluster.IsSpace(namespace) {
		namespace = "default"
	}

	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}

	return &Endpoint{
		Meta:    meta,
		Subsets: subsets,
	}

}

func (endpoint *Endpoint) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+endpoint.Meta.Namespace+"/endpoints", master, endpoint)
}

func (endpoint *Endpoint) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces/"+endpoint.Meta.Namespace+"/endpoints/"+endpoint.Meta.Name, master, nil)
}

func (endpoint *Endpoint) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces/"+endpoint.Meta.Namespace+"/endpoints/"+endpoint.Meta.Name, master, nil)
}

func (endpoint *Endpoint) ToJsonString() string {
	strs, err := json.Marshal(endpoint)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
