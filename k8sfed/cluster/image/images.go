package image

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Repositories struct {
	Repositories []string `json:"repositories,omitempty"`
}

func (r *Repositories) List(repository string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/v2/_catalog", repository, nil)
}

func (r *Repositories) ToJsonString() string {
	strs, err := json.Marshal(r)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}

type Tag struct {
	Name string   `json:"name,omitempty"`
	Tags []string `json:"tags,omitempty"`
}

func (t *Tag) List(name, repository string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/v2/"+name+"/tags/list", repository, nil)
}

func (t *Tag) ToJsonString() string {
	strs, err := json.Marshal(t)

	if err != nil {

		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}

type Image struct {
	Imagename string `json:"imagename,omitempty"`
	Version   string `json:"version,omitempty"`
	Local     bool   `json:"local"`
}

func (i *Image) ToJsonString() string {
	strs, err := json.Marshal(i)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
