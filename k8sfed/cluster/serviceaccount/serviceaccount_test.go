package serviceaccount

import (
	"encoding/json"
	"fmt"
	"k8s/cluster"
	"testing"
)

func TestServiceAccount(t *testing.T) {
	// serviceaccounts := &ServiceAccounts{}

	// body, statusCode, err := cluster.ReadBody(serviceaccounts.ListOfNamespace("", "controller:8080"))
	// if err != nil {
	// 	fmt.Printf("%v %v\n", statusCode, err)
	// }

	// fmt.Printf("%s\n", body)

	// err = json.Unmarshal(body, serviceaccounts)

	// if err != nil {
	// 	fmt.Printf("%v", err)
	// }

	// fmt.Printf("%s\n", serviceaccounts.ToJsonString())

	serviceaccount := NewServiceAccount("test", "", nil, nil)

	fmt.Printf("%s\n", serviceaccount.ToJsonString())

	body, statusCode, err := cluster.ReadBody(serviceaccount.Delete("controller:8080"))
	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}

	fmt.Printf("%s\n", body)

	err = json.Unmarshal(body, serviceaccount)

	if err != nil {
		fmt.Printf("%v\n", err)
	}
	fmt.Printf("%s\n", serviceaccount.ToJsonString())

}
