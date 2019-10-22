package image

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

const DOCKERHUB = "index.docker.io"

type remoteImage struct {
	Is_automated bool   `json:"is_automated,omitempty"`
	ImageName    string `json:"name,omitempty"`
	Is_official  bool   `json:"is_official,omitempty"`
	Is_trusted   bool   `json:"is_trusted,omitempty"`
	Star_count   int64  `json:"star_count,omitempty"`
	Description  string `json:"description,omitempty"`
}

type RemoteImages struct {
	Num_pages   int64          `json:"num_pages,omitempty"`
	Num_results int64          `json:"num_results,omitempty"`
	Results     []*remoteImage `json:"results,omitempty"`
	Page_size   int64          `json:"page_size,omitempty"`
	Query       string         `json:"query,omitempty"`
	Page        int64          `json:"page,omitempty"`
}

func (r *RemoteImages) List(name string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/v1/search?q="+name, DOCKERHUB, nil)
}

func (r *RemoteImages) ToJsonString() string {
	strs, err := json.Marshal(r)

	if err != nil {
		return fmt.Sprintf("%v\n", err)
	}

	return string(strs)
}
