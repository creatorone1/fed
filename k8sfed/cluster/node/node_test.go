package node

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	//"k8s_v2/cluster"
	_ "strconv"
	_ "strings"
	"testing"
)

type AlipayRemoteReqStruct struct {
	Ono         string   `json:ono`
	OrderItem   []Item   `json:item`
	OrderRefund []Refund `json:refund`
}
type Item struct {
	Ono []string `json:ono`
	//Oid int      `json:oid`
}

type Refund struct {
	Ono     string `json:ono`
	Item    int    `json:item`
	Content string `json:content`
	Imgs    string `json:imgs`
	Status  string `json:status`
}

func TestNode(t *testing.T) {
	// meta := &cluster.Metadata{
	// Name: "controller",
	// }
	// node := &Node{
	// 	Meta: meta,
	// }

	nodes := &Nodes{}
	// node := &Node{
	// 	Meta: meta,
	// }
	body, statusCode, err := readBody(nodes.List("10.103.240.195:8080"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}
	//bytes := `{"kind":"Node","apiVersion":"v1","metadata":{"name":"node1","selfLink":"/api/v1/nodesnode1","uid":"f6186a08-20ec-11e7-8b9c-1418772a3369","resourceVersion":"1901403","creationTimestamp":"2017-04-14T08:32:57Z","labels":{"alpha.kubernetes.io/nvidia-gpu-name":"Tesla","beta.kubernetes.io/arch":"amd64","beta.kubernetes.io/os":"linux","kubernetes.io/hostname":"node1"},"annotations":{"node.alpha.kubernetes.io/ttl":"0","volumes.kubernetes.io/controller-managed-attach-detach":"true"}},"spec":{"externalID":"node1"},"status":{"capacity":{"alpha.kubernetes.io/nvidia-gpu":"1","cpu":"24","memory":"32835532Ki","pods":"110"},"allocatable":{"alpha.kubernetes.io/nvidia-gpu":"1","cpu":"24","memory":"32733132Ki","pods":"110"},"conditions":[{"type":"OutOfDisk","status":"False","lastHeartbeatTime":"2017-05-06T09:22:46Z","lastTransitionTime":"2017-04-14T08:32:57Z","reason":"KubeletHasSufficientDisk","message":"kubelet has sufficient disk space available"},{"type":"MemoryPressure","status":"False","lastHeartbeatTime":"2017-05-06T09:22:46Z","lastTransitionTime":"2017-04-14T08:32:57Z","reason":"KubeletHasSufficientMemory","message":"kubelet has sufficient memory available"},{"type":"DiskPressure","status":"False","lastHeartbeatTime":"2017-05-06T09:22:46Z","lastTransitionTime":"2017-04-14T08:32:57Z","reason":"KubeletHasNoDiskPressure","message":"kubelet has no disk pressure"},{"type":"Ready","status":"True","lastHeartbeatTime":"2017-05-06T09:22:46Z","lastTransitionTime":"2017-04-14T08:32:57Z","reason":"KubeletReady","message":"kubelet is posting ready status. AppArmor enabled"}],"addresses":[{"type":"LegacyHostIP","address":"192.168.0.16"},{"type":"InternalIP","address":"192.168.0.16"},{"type":"Hostname","address":"node1"}],"daemonEndpoints":{"kubeletEndpoint":{"Port":10250}},"nodeInfo":{"machineID":"702a6ce5f65ac75d01e6668d5789047c","systemUUID":"4C4C4544-0056-5110-8031-B7C04F433732","bootID":"15225f1c-8955-46c4-9b2c-611ef7714200","kernelVersion":"3.13.0-116-generic","osImage":"Ubuntu 14.04.5 LTS","containerRuntimeVersion":"docker://1.11.2-cs3","kubeletVersion":"v1.6.1","kubeProxyVersion":"v1.6.1","operatingSystem":"linux","architecture":"amd64"},"images":[{"names":["nvidia/cuda:latest"],"sizeBytes":1609401517},{"names":["mysql:5.7"],"sizeBytes":407146690},{"names":["mysql:5.6"],"sizeBytes":298435833},{"names":["gcr.io/google-samples/xtrabackup:1.0"],"sizeBytes":264925334},{"names":["192.168.0.15:30005/nginx:latest","nginx:latest"],"sizeBytes":182526651},{"names":["nginx:1.9.1"],"sizeBytes":132835913},{"names":["ubuntu:latest"],"sizeBytes":117230596},{"names":["gcr.io/google_containers/nginx-slim:0.8"],"sizeBytes":110487599},{"names":["nginx:1.7.9"],"sizeBytes":91664166},{"names":["gcr.io/google_containers/k8s-dns-kube-dns-amd64:1.14.1"],"sizeBytes":52360891},{"names":["gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.1"],"sizeBytes":44848461},{"names":["gcr.io/google_containers/k8s-dns-sidecar-amd64:1.14.1"],"sizeBytes":44520920},{"names":["registry:latest"],"sizeBytes":33192962},{"names":["gcr.io/google_containers/busybox:latest"],"sizeBytes":2433303},{"names":["busybox:latest"],"sizeBytes":1109996},{"names":["gcr.io/google_containers/pause-amd64:3.0"],"sizeBytes":746888},{"names":["hello-world:latest"],"sizeBytes":1840}]}}`

	// dec := json.NewDecoder(strings.NewReader(bytes))

	// for {
	// 	var node Node
	// 	if err := dec.Decode(&node); err == io.EOF {
	// 		break
	// 	} else if err != nil {
	// 		fmt.Printf("%v\n", err)
	// 	}

	// 	fmt.Printf("%v\n", len(node.Stat.Images))
	// }
	json.Unmarshal(body, nodes)
	fmt.Println(nodes.ToJsonString())
	//fmt.Printf("%v\n", len(nodes.Items))
	// fmt.Printf("%s\n", body)
	// fmt.Printf("kind: %s\n", nodes.Kind)
	// fmt.Printf("%v %v\n", len(nodes.Items), len(nodes.Items[0].Stat.Images))
	// for _, node := range nodes.Items {
	// 	fmt.Printf("%s %s %s %s\n", node.Meta.Name, node.Stat.Addresses[0].IPAddr,
	// 		node.Stat.Capacity.ToString(), node.Stat.Allocate.ToString())
	// }
	//fmt.Printf("%s", body)
	//var m AlipayRemoteReqStruct
	//m.Ono = "12345"
	//m.OrderItem = append(m.OrderItem, Item{Ono: "Shanghai_VPN", Oid: 1})
	//m.OrderItem = append(m.OrderItem, Item{Ono: "Beijing_VPN", Oid: 2})
	//for i := 1; i < 6; i++ {
	//	str := []byte("物品")
	//	str = strconv.AppendInt(str, int64(i), 10)
	// 	orderi := Item{Ono: string(str), Oid: i}
	// 	m.OrderItem = append(m.OrderItem, orderi)
	// }
	// bytes := `{"Ono":"12345","OrderItem":[{"Ono":["Shanghai_VPN","beijing"],"Oid":1},{"Ono":["Beijing_VPN"],"Oid":2},{"Ono":["物品1"],"Oid":1},{"Ono":["物品2"],"Oid":2},{"Ono":["物品3"],"Oid":3},{"Ono":["物品4"],"Oid":4},{"Ono":["物品5"],"Oid":5}],"OrderRefund":null}`
	// // //fmt.Printf("json:m,%s\n", bytes)
	// var js AlipayRemoteReqStruct
	// err := json.Unmarshal([]byte(bytes), &js)

	// fmt.Printf("%v\n", len(js.OrderItem))

	// if err != nil {
	// 	fmt.Printf("format err:%s\n", err.Error())
	// 	return
	// }
}

/*func TestNode(t *testing.T) {
	// meta := &Metadata{
	// 	Name: "node1",
	// }
	// node := &Node{
	// 	Meta: meta,
	// }

	var nodename string
	nodename = "node1"
	meta := &cluster.Metadata{
		Name: nodename,
	}

	node := &Node{
		Meta: meta,
	}

	body, statusCode, err := readBody(node.Get("controller:8080"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}

	json.Unmarshal(body, node)
	for k, v := range node.Meta.Labels.(map[string]interface{}) {
		fmt.Println(k, v)
	}
	//fmt.Println(node.ToJsonString())

}
func TestUpdate(t *testing.T) {
	var nodename string
	nodename = "node1"
	var label string
	label = "test2"
	meta := &cluster.Metadata{
		Name: nodename,
	}
	node1 := &Node{
		Meta: meta,
	}
	body, statusCode, err := readBody(node1.Get("controller:8080"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}
	json.Unmarshal(body, node1)
	fmt.Println(node1.Meta.Labels)
	labelmap := make(map[string]interface{})
	//	fmt.Println(node.ToJsonString())
	if _, ok := node1.Meta.Labels.(map[string]interface{}); ok {
		labelmap = node1.Meta.Labels.(map[string]interface{})
	}
	labelmap["test"] = label
	//labelmap := make(map[string]interface{})
	//labelmap = node.Meta.Labels
	//node.Meta.Labels["selector"] = label

	//fmt.Println(node.ToJsonString())
	//for k, v := range node.Meta.Labels.(map[string]interface{}) {
	//	fmt.Println(k, v)
	//}

	node1.Meta.Labels = labelmap
	fmt.Println(node1.Meta.Labels)
	node1.Update("controller:8080")
	//fmt.Print(StatusCode, erro)

}
*/
func readBody(src io.ReadCloser, StatusCode int, err error) ([]byte, int, error) {
	if err != nil {
		return nil, StatusCode, err
	}

	if src != nil {
		defer src.Close()
	}

	body, err := ioutil.ReadAll(src)

	if err != nil {
		return nil, -1, err
	}

	return body, StatusCode, nil

}
