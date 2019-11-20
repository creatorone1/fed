package deployment

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type Deployments struct {
	Kind       string        `json:"kind,omitempty"`
	ApiVersion string        `json:"apiVersion,omitempty"`
	Items      []*Deployment `json:"items,omitempty"`
}

func (deployments *Deployments) List(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/apps/v1beta1/deployments", master, nil))

	if err != nil {
		return err
	}
	//fmt.Printf("%s", body)
	if err := json.Unmarshal(body, deployments); err != nil {
		return err
	}

	return nil
}
func (deployments *Deployments) ListFed(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/extensions/v1beta1/deployments", master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, deployments); err != nil {
		return err
	}

	return nil
}
func (deployments *Deployments) ListOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if cluster.IsSpace(namespace) {
		namespace = "default"
	}
	return cluster.Call("GET", "/apis/apps/v1beta1/namespaces/"+namespace+"/deployments", master, nil)
}

func (deployments *Deployments) DeleteOfNamespace(namespace, master string) (io.ReadCloser, int, error) {
	if cluster.IsSpace(namespace) {
		return nil, -1, cluster.ParameterNotNULL("namespace")
	} 
	return cluster.Call("DELETE", "/apis/apps/v1beta1/namespaces/"+namespace+"/deployments", master, nil)
}

func (deployments *Deployments) ToJsonString() string {
	strs, err := json.Marshal(deployments)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
