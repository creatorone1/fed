package pv

import (
	"encoding/json"
	"fmt"
	"k8s/cluster"
	//"io/ioutil"
	"testing"
)

func TestPv(t *testing.T) {
	pvs := &Pvs{}

	body, statusCode, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/persistentvolumeclaims", "10.103.240.195:8080", nil))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}

	err = json.Unmarshal(body, pvs)
	if err != nil {
		fmt.Printf("%v\n", err)
	}

	fmt.Printf("%s\n", pvs.ToJsonString())

	// meta := &Metadata{
	// 	Name: "mysql-pv1",
	// }

	// pv := &Pv{
	// 	Meta: meta,
	// }

	// body, statusCode, err = cluster.ReadBody(pv.Get("controller:8080"))

	// if err != nil {
	// 	fmt.Printf("%v %v\n", statusCode, err)
	// }

	// err = json.Unmarshal(body, pv)

	// if err != nil {
	// 	fmt.Printf("%v\n", err)

	// }

	// pv := NewPv("pv000", "5Gi", "192.168.0.17", "/home/bupt/nfs/test", []string{"ReadWriteOnce"})
	// body, status, err := cluster.ReadBody(pv.Delete("controller:8080"))

	// if err != nil {
	// 	fmt.Printf("%v %v\n", status, err)
	// }

	// fmt.Printf("%s\n", body)

	//fmt.Printf("%s\n", pv.ToJsonString())

}
