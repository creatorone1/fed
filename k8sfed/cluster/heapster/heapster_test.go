package heapster

import (
	"fmt"
	"testing"
)

func TestHeapster(t *testing.T) {

	h := &NodeMonitor{}

	if err := h.View("controller", "10.103.240.195:30082"); err != nil {
		fmt.Printf("%v\n", err)
	}

	fmt.Printf("%s\n", h.toJsonString())

}

//func TestGetPods(t *testing.T) {
//	GetPods("default", "controller:30082")
//}

func TestPodStateGet(t *testing.T) {
	p := &PodResourceState{
		Name:      "test-synosis-3594545524-c16xw",
		Namespace: "default",
	}

	p.Get("10.103.240.195:30082")

	fmt.Println(p.ToJsonString())
}
