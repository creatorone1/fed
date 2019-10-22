package serviceaccount

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Secret struct {
	Kind            string `json:"kind,omitempty"`
	Namespace       string `json:"namespace,omitempty"`
	Name            string `json:"name,omitempty"`
	Uid             string `json:"uid,omitempty"`
	ApiVersion      string `json:"apiVersion,omitempty"`
	ResourceVersion string `json:"resourceVersion,omitempty"`
	FiledPath       string `json:"fieldPath,omitempty"`
}

type ImagePullSecret struct {
	Name string `json:"name,omitempty"`
}

type ServiceAccount struct {
	Kind                         string             `json:"kind,omitempty"`
	ApiVersion                   string             `json:"apiVersion,omitempty"`
	Meta                         *cluster.Metadata  `json:"metadata,omitempty"`
	Secrets                      []*Secret          `json:"secrets,omitempty"`
	ImagePullSecrets             []*ImagePullSecret `json:"imagePullSecrets,omitempty"`
	AutomountServiceAccountToken bool               `json:"automountServiceAccountToken,omitempty"`
}

func NewSecret(name string) *Secret {
	return &Secret{
		Name: name,
	}
}

func NewImagePullSecret(name string) *ImagePullSecret {
	return &ImagePullSecret{
		Name: name,
	}
}

func NewServiceAccount(name, namespace string, secrets []*Secret, imagePullSecrets []*ImagePullSecret) *ServiceAccount {

	if namespace == "" {
		namespace = "default"
	}

	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}

	return &ServiceAccount{
		Kind:             "ServiceAccount",
		ApiVersion:       "v1",
		Meta:             meta,
		Secrets:          secrets,
		ImagePullSecrets: imagePullSecrets,
	}

}

func (serviceaccount *ServiceAccount) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+serviceaccount.Meta.Namespace+"/serviceaccounts", master, serviceaccount)
}

func (serviceaccount *ServiceAccount) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces/"+serviceaccount.Meta.Namespace+"/serviceaccounts/"+serviceaccount.Meta.Name,
		master, nil)
}

func (serviceaccount *ServiceAccount) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces/"+serviceaccount.Meta.Namespace+"/serviceaccounts/"+serviceaccount.Meta.Name,
		master, nil)
}

func (serviceaccount *ServiceAccount) ToJsonString() string {
	strs, err := json.Marshal(serviceaccount)

	if err != nil {
		return fmt.Sprintf("%s", err)
	}

	return string(strs)
}
