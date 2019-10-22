package hpa

import (
	"encoding/json"
	"fmt"
	"io"
	"k8s_v2/cluster"
)

type Hpas struct {
	Kind       string                     `json:"kind,omitempty"`
	ApiVersion string                     `json:"apiVersion,omitempty"`
	Items      []*Horizontalpodautoscaler `json:"items,omitempty"`
}

func (hpas *Hpas) List(master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/autoscaling/v1/horizontalpodautoscalers", master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, hpas); err != nil {  //body是获取的json数据，把它赋值给hpas对象
		return err
	}

	return nil
}

func (hpas *Hpas) DELETE(namespace, master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/apis/autoscaling/v1/namespaces/"+namespace+"/horizontalpodautoscalers", master, nil)
}

func (hpas *Hpas) ToJsonString() string {
	strs, err := json.Marshal(hpas)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
