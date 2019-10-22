package pod

import (
	_ "encoding/json"
	"fmt"
	"testing"
)

func TestPod(t *testing.T) {
	pods := &Pods{}

	if err := pods.List("10.103.240.195:8080"); err != nil {

		fmt.Printf("%v\n", err)
	}

	fmt.Printf("%s\n", pods.ToJsonString())
	fmt.Println(len(pods.Items))
}
