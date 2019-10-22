package rc

import (
	"encoding/json"
	"fmt"
	"k8s_v2/cluster"
	"testing"
)

func TestScale(t *testing.T) {

	meta := &cluster.Metadata{
		Namespace: "kube-system",
	}

	scale := &Scale{Meta: meta}

	body, statusCode, err := cluster.ReadBody(scale.get("heapster", "kube-system", "10.103.240.195:8080"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)

	}

	err = json.Unmarshal(body, scale)

	if err != nil {
		fmt.Printf("%v\n", err)
	}

	fmt.Printf("%s", scale.ToJsonString())

}
