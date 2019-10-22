package endpoint

import (
	"encoding/json"
	"fmt"
	"k8s/cluster"
	"testing"
)

func TestEndpoing(t *testing.T) {
	// endpoints := &Endpoints{}

	// body, statusCode, err := cluster.ReadBody(endpoints.ListOfNamespace("", "controller:8080"))

	// if err != nil {
	// 	fmt.Printf("%v %v\n", statusCode, err)
	// }

	// fmt.Printf("%s", body)

	// err = json.Unmarshal(body, endpoints)

	// if err != nil {
	// 	fmt.Printf("%v", err)
	// }

	// fmt.Printf("%s\n", endpoints.ToJsonString())

	port := NewPort("", "", 12345)
	subset := NewSubset([]string{"10.1.2.1"}, []*Port{port})
	endpoint := NewEndpoint("test", "", []*Subset{subset})

	fmt.Printf("%s\n", endpoint.ToJsonString())

	body, statusCode, err := cluster.ReadBody(endpoint.Delete("controller:8080"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}

	err = json.Unmarshal(body, endpoint)

	// if err != nil {
	// 	fmt.Printf("%v\n", err)
	// }

	fmt.Printf("%s\n", endpoint.ToJsonString())
}
