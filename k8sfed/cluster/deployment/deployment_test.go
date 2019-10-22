package deployment

import (
	_ "encoding/json"
	"fmt"
	//"k8s_v2/cluster"
	//_ "k8s_v2/cluster/pod"
	"testing"
)

func TestDeployment(t *testing.T) {

	deploy := NewDeployment("registry", "default", nil, nil, 0, nil, nil)
	//scale := NewScale("registry", "default", 1)

	//fmt.Println(scale.ToJsonString())
	if err := deploy.Get("10.103.240.195:8080"); err == nil {
		fmt.Println(deploy.ToJsonString())
	}
	// if body, _, err := cluster.ReadBody(deploy.Get("10.103.240.195:8080")); err != nil {
	// 	fmt.Println(err)
	// } else {
	// 	fmt.Println(string(body))
	// }

	//{"kind":"Scale","apiVersion":"apps/v1beta1","metadata":{"name":"test-nginx","namespace":"default","selfLink":"/apis/apps/v1beta1/namespaces/default/deployments/test-nginx/scale","uid":"29a71777-6db7-11e7-be7b-1418772a3369","resourceVersion":"5868476","creationTimestamp":"2017-07-21T01:51:50Z"},"spec":{"replicas":1},"status":{"replicas":1,"selector":{"name":"test-nginx"},"targetSelector":"name=test-nginx"}}

	// if _, _, err := deploy.PutScale(scale, "10.103.240.195:8080"); err != nil {
	// 	fmt.Println(err)
	// }

	// if _, _, err := scale.Put("test-nginx", "default", "controller:8080"); err != nil {
	// 	fmt.Println(err)
	// }

}
