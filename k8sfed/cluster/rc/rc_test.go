package rc

import (
	_ "encoding/json"
	_ "fmt"
	_ "k8s/cluster"
	_ "k8s/cluster/pod"
	"testing"
)

func TestRc(t *testing.T) {
	// port := pod.NewPort("", "", "", 0, 80) // 0 represent none

	// container := pod.NewContainer("nginx", "nginx", "IfNotPresent", "", nil, nil, []*pod.Port{port}, nil, nil)

	// pp := pod.NewPod("nginx", "", map[string]string{"app": "nginx"}, nil, []*pod.Container{container}, nil)

	// rc := NewRc("nginx", "", nil, map[string]string{"app": "nginx"}, 3, pp)

	// fmt.Printf("%s\n", rc.ToJsonString())
	// // rcs := &Rcs{}

	// body, statusCode, err := cluster.ReadBody(rc.Create("controller:8080"))

	// if err != nil {
	// 	fmt.Printf("%v %v\n", statusCode, err)
	// }

	// fmt.Printf("%s\n", body)
}
