package image

import (
	"encoding/json"
	"fmt"
	"k8s_v2/cluster"
	"testing"
)

func TestImage(t *testing.T) {
	r := &RemoteImages{}

	body, statusCode, err := cluster.ReadBody(r.List("ubuntu"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}

	fmt.Printf("%s\n", body)

	err = json.Unmarshal(body, r)

	if err != nil {
		fmt.Printf("%v\n", err)
	}

	fmt.Printf("%s\n", r.ToJsonString())

}
