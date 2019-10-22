package watch

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
)

type Watch struct {
	Type       string      `json:"type,omitempty"` // "/api/v1"  or "/apis/apps/v1beta1"
	ApiVersion string      `json::"apiVersion,omitempty"`
	Object     interface{} `json:"object,omitempty"`
}

func NewWatch(apiVersion string) *Watch {
	return &Watch{
		ApiVersion: apiVersion,
	}
}

func (watch *Watch) Watch(obj, master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", watch.ApiVersion+"/watch/"+obj, master, nil)
}

func (watch *Watch) WatchOfNamespace(namespace, obj, master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", watch.ApiVersion+"/watch/namespaces/"+namespace+"/"+obj, master, nil)
}

func (watch *Watch) WatchWithName(namespace, obj, name, master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", watch.ApiVersion+"/watch/namespaces/"+namespace+"/"+obj+"/"+name, master, nil)
}

func (watch *Watch) ToJsonString() string {
	strs, err := json.Marshal(watch)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
