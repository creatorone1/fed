package pvc

import (
	"encoding/json"
	"fmt"
	"k8s/cluster"
	"testing"
)

func TestPvc(t *testing.T) {
	// pvc := NewPvc("test-pvc", "3Gi", "default", "", []string{"ReadWriteOnce"})
	// //body, statusCode, err := cluster.ReadBody(pvc.Create("controller:8080"))
	// body, statusCode, err := cluster.ReadBody(pvc.Get("controller:8080"))
	// //body, statusCode, err := cluster.ReadBody(pvc)

	// if err != nil {
	// 	fmt.Printf("%v %v\n", statusCode, err)
	// }

	// err = json.Unmarshal(body, pvc)

	// fmt.Printf("%s\n", pvc.ToJsonString())

	// fmt.Printf("%s\n", body)
	pvcs := &Pvcs{}

	body, statusCode, err := cluster.ReadBody(pvcs.ListOfNamespace("", "10.103.240.195:8080"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}

	err = json.Unmarshal(body, pvcs)

	if err != nil {
		fmt.Printf("%v\n", err)
	}

	fmt.Printf("%s", pvcs.ToJsonString())

}
