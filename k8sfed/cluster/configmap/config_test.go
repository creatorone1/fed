package configmap

import (
	"encoding/json"
	"fmt"
	"k8s_v2/cluster"
	"testing"
)

func TestConfig(t *testing.T) {
	config := NewConfigMap("mysql-test", "", nil, map[string]string{"name": "enemies=aliens\nlives=3\n"})

	fmt.Printf("%s\n", config.ToJsonString())

	body, statusCode, err := cluster.ReadBody(config.Get("10.103.240.195:8080"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)

	}

	err = json.Unmarshal(body, config)

	if err != nil {
		fmt.Printf("%v\n", err)
	}

	fmt.Printf("%s\n", config.ToJsonString())

	fmt.Printf("%s", body)

	configs := &ConfigMaps{}

	body, statusCode, err = cluster.ReadBody(configs.ListOfNamespace("kube-system", "10.103.240.195:8080"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}

	fmt.Printf("%s %s", "configmaplist", body)

	json.Unmarshal(body, configs)

	fmt.Printf("%s\n", configs.ToJsonString())
	fmt.Printf("%d\n", len(configs.Items))

}
