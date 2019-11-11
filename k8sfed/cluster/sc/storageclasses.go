package sc

import (
	"encoding/json"
	"io"
	"k8sfed/cluster"
)

type StorageClassList struct {
	Kind       string            `json"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Items      []*StorageClass   `json:"items,omitempty"`
}

func (scl *StorageClassList) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/apis/storage.k8s.io/v1/storageclasses/", master, nil)
}

func (scl *StorageClassList) List(master string) error {

	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/storage.k8s.io/v1/storageclasses/", master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, scl); err != nil {
		return err
	}

	return nil
}
