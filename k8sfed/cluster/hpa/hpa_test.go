package hpa

import (
	"encoding/json"
	"fmt"
	"k8s_v2/cluster"
	"testing"
)

func TestHpa(t *testing.T) {
	meta := &cluster.Metadata{
		Name:      "istio-pilot",
		Namespace: "default",
	}
	hpa := &Horizontalpodautoscaler{
		Meta: meta,
	}
	body, statusCode, err := cluster.ReadBody(hpa.Get("10.103.240.195:8080"))
	if err != nil {
		fmt.Printf("%v %v", statusCode, err)
	}
	fmt.Printf("%s\n", body)
	err1 := json.Unmarshal(body, hpa)
	if err1 != nil {
		fmt.Println(err1)
	}
	// err = json.Unmarshal(body, Horizontalpodautoscaler)
	// if err != nil {
	// 	fmt.Printf("%v\n", err)
	// }

	fmt.Printf("%s\n", hpa.ToJsonString())
}
func TestHpas(t *testing.T) {

	hpas := &Hpas{}
	err := hpas.List("10.103.240.195:8080")
	if err != nil {
		fmt.Printf("%v", err)
	}
	fmt.Printf("%s\n", hpas.ToJsonString())
}
