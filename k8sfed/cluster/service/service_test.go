package service

import (
	"encoding/json"
	"fmt"
	"k8s_v2/cluster"
	"testing"
)

func TestService(t *testing.T) {

	//services := &Services{}

	port := NewPort("", "", 8888, 0, 0)
	service := NewService("test", "", nil, map[string]string{"app": "test"}, "", "", []*Port{port})

	fmt.Printf("%s\n", service.ToJsonString())
	//body, statusCode, err := cluster.ReadBody(services.ListOfNamespace("", "controller:8080"))
	body, statusCode, err := cluster.ReadBody(service.Delete("controller:8080"))

	if err != nil {
		fmt.Printf("%v %v", statusCode, err)
	}

	fmt.Printf("%s\n", body)

	err = json.Unmarshal(body, service)

	if err != nil {
		fmt.Printf("%v", err)
	}

	fmt.Printf("%s\n", service.ToJsonString())

}
