package secret

import (
	//"encoding/json"
	"fmt"
	"k8s_v2/cluster"
	"testing"
)

func TestSecret(t *testing.T) {
	secrets := &Secrets{}
	body, statusCode, err := cluster.ReadBody(secrets.List("10.103.240.195:8080"))
	if err != nil {
		fmt.Printf("%v %v", statusCode, err)
	}

	fmt.Printf("%s\n", body)

	// err = json.Unmarshal(body, secrets)

	// if err != nil {
	// 	fmt.Printf("%v\n", err)
	// }

	// fmt.Printf("%s\n", secrets.ToJsonString())
	// secret := NewSecret("test", "", "", map[string][]byte{"username": []byte("aaa")}) //base64 <==> byte[]
	// fmt.Println(secret.ToJsonString())

	// body, statusCode, err = cluster.ReadBody(secret.Delete("controller:8080"))
	// if err != nil {
	// 	fmt.Printf("%v %v\n", statusCode, err)
	// }

	// fmt.Printf("%s\n", body)

}
