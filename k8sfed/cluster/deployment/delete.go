package deployment

import (
	"io"
	"k8sfed/cluster"
)

/*type DeBody struct {
	Kind               string      `json:"kind,omitempty"`
	ApiVersion         string      `json:"apiVersion,omitempty"`
	GracePeriodSeconds int64       `json:"gracePeriodSeconds,omitempty"`
	Preconditions      interface{} `json:"preconditions,omitempty"`
	OrphanDependents   bool        `json:"orphanDependents,omitempty"`
	PropagationPolicy  interface{} `json:"propagationPolicy,omitempty"`
}*/

/**下面不能加omitempty 不然初始化为0 和false就不会转化为json数据
`json:"gracePeriodSeconds,omitempty"`  不能这么写
*/

func (deloyment *Deployment) Delete(master string) (io.ReadCloser, int, error) { //note: return value is diffence from Create and Get.

	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/apis/extensions/v1beta1/namespaces/"+deloyment.Meta.Namespace+"/deployments/"+deloyment.Meta.Name, master, b)
	/*data, _ := json.Marshal(b)
	fmt.Printf("%s", data)
	var bb io.ReadCloser
	return bb, 0, nil*/

}
