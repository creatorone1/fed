package event

import (
	"encoding/json"
	"fmt"
	"k8s/cluster"
	"testing"
)

func TestEvent(t *testing.T) {
	events := NewEvent("my-nginx-jt4xm.14bdb959d50a0bc2", "default")

	body, statusCode, err := cluster.ReadBody(events.Get("controller:8080"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}

	fmt.Printf("%s", body)

	err = json.Unmarshal(body, events)

	if err != nil {
		fmt.Printf("%v", err)
	}

	fmt.Printf("%s\n", events.ToJsonString())

}
