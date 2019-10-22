package secret

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
	"strings"
)

type Secret struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Data       interface{}       `json:"data,omitempty"`
	StringData interface{}       `json:"stringData,omitempty"`
	Type       string            `json:"type,omitempty"`
}

func NewSecret(name, namespace, secretType string, data interface{}) *Secret {
	if namespace == "" {
		namespace = "default"
	}
	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}

	return &Secret{
		Kind:       "Secret",
		ApiVersion: "v1",
		Meta:       meta,
		Data:       data,
		Type:       secretType,
	}
}

func (secret *Secret) Get(master string) (io.ReadCloser, int, error) {
	if secret.Meta.Name == "" || strings.TrimSpace(secret.Meta.Name) == "" {
		return nil, -1, cluster.ParameterNotNULL("Secret.Meta.Name")
	}
	return cluster.Call("GET", "/api/v1/namespaces/"+secret.Meta.Namespace+"/secrets/"+secret.Meta.Name, master, nil)
}

func (secret *Secret) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+secret.Meta.Namespace+"/secrets", master, secret)
}

func (secret *Secret) Delete(master string) (io.ReadCloser, int, error) {
	if secret.Meta.Name == "" || strings.TrimSpace(secret.Meta.Name) == "" {
		return nil, -1, cluster.ParameterNotNULL("Secret.Meta.Name")
	}
	return cluster.Call("DELETE", "/api/v1/namespaces/"+secret.Meta.Namespace+"/secrets/"+secret.Meta.Name, master, nil)
}

func (secret *Secret) ToJsonString() string {
	strs, err := json.Marshal(secret)
	if err != nil {
		return fmt.Sprintf("%s", err)
	}

	return string(strs)
}
