package limitrange

import (
	"encoding/json"
	"fmt"
	"k8s_v2/cluster"
	"testing"
)

func TestLimitRange(t *testing.T) {
	limit := NewLimit("Pod", map[string]string{"cpu": "2", "memory": "1Gi"}, map[string]string{"cpu": "200m", "memory": "6Mi"}, nil, nil)

	LR := NewLimitRange("mulimits", "", []*Limit{limit})

	fmt.Printf("%s\n", LR.ToJsonString())

	body, statusCode, err := cluster.ReadBody(LR.Delete("controller:8080"))
	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}

	fmt.Printf("%s", body)

	err = json.Unmarshal(body, LR)

	if err != nil {
		fmt.Printf("%v", err)
	}

	fmt.Printf("%s\n", LR.ToJsonString())

	// limits := &LimitRanges{}

	// body, statusCode, err = cluster.ReadBody(limits.ListOfNamespace("", "controller:8080"))

	// if err != nil {
	// 	fmt.Printf("%v %v\n", statusCode, err)
	// }

	// fmt.Printf("%s", body)

	// err = json.Unmarshal(body, limits)

	// if err != nil {
	// 	fmt.Printf("%v", err)
	// }

	// fmt.Printf("%s\n", limits.ToJsonString())

}
