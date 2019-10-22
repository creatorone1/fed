package event

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Source struct {
	Component string `json:"component,omitempty"`
	Host      string `json:"host,omitempty"`
}

type Event struct {
	Kind           string                  `json:"kind,omitempty"`
	ApiVersion     string                  `json:"apiVersion,omitempty"`
	Meta           *cluster.Metadata       `json:"metadata,omitempty"`
	Involveobject  *cluster.InvolvedObject `json:"involvedObject,omitempty"`
	Reason         string                  `json:"reason,omitempty"`
	Message        string                  `json:"message,omitempty"`
	Sour           *Source                 `json:"source,omitempty"`
	FirstTimestamp string                  `json:"firstTimestamp,omitempty"`
	LastTimeStamp  string                  `json:"lastTimestamp,omitempty"`
	Count          int64                   `json:"count,omitempty"`
	Type           string                  `json:"type,omitempty"`
}

func NewEvent(name, namespace string) *Event {
	meta := &cluster.Metadata{
		Name:      name,
		Namespace: namespace,
	}

	return &Event{
		Meta: meta,
	}
}

func (event *Event) Create(master string) (io.ReadCloser, int, error) {
	return cluster.Call("POST", "/api/v1/namespaces/"+event.Meta.Namespace+"/events", master, event)
}

func (event *Event) Get(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces/"+event.Meta.Namespace+"/events/"+event.Meta.Name, master, nil)
}

func (event *Event) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/v1/namespaces/"+event.Meta.Namespace+"/events/"+event.Meta.Name, master, nil)
}

func (event *Event) ToJsonString() string {
	strs, err := json.Marshal(event)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
