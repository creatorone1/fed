package heapster

import (
	"encoding/json"
	"fmt"
	"k8s_v2/cluster"
)

type PodResourceState struct {
	Name          string `json:"name,omitempty"`
	Namespace     string `json:"namespace,omitempty"`
	CpuRequest    int64  `json:"cpuRequest,omitempty"`
	MemoryRequest int64  `json:"memoryRequest,omitempty"`
	MemoryUsage   int64  `json:"memoryUsage,omitempty"`
	CpuRate       int64  `json:"cpuRate,omitempty"`
}

func (p *PodResourceState) Get(master string) error {
	if p.Name == "" {
		return cluster.ParameterNotNULL("name")
	}

	if p.Namespace == "" {
		p.Namespace = "default"
	}
	//controller:30082/api/v1/model/namespaces/default/pods/test-streaming-2536728930-jlr29/metrics/memory/usage
	paths := []string{
		fmt.Sprintf("/api/v1/model/namespaces/%s/pods/%s/metrics/cpu/request", p.Namespace, p.Name),
		fmt.Sprintf("/api/v1/model/namespaces/%s/pods/%s/metrics/memory/request", p.Namespace, p.Name),
		fmt.Sprintf("/api/v1/model/namespaces/%s/pods/%s/metrics/memory/usage", p.Namespace, p.Name),
		fmt.Sprintf("/api/v1/model/namespaces/%s/pods/%s/metrics/cpu/usage_rate", p.Namespace, p.Name),
	}

	r := &results{}

	for i, path := range paths {
		if err := r.view(path, master); err != nil {
			return err
		}

		if len(r.Metrics) <= 0 {
			continue
		}

		switch i {
		case 0:
			p.CpuRequest = r.Metrics[0].Value
		case 1:
			p.MemoryRequest = r.Metrics[0].Value
		case 2:
			p.MemoryUsage = r.Metrics[0].Value
		case 3:
			p.CpuRate = r.Metrics[0].Value
		}

	}
	return nil
}

func (p *PodResourceState) ToJsonString() string {
	str, err := json.Marshal(p)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(str)
}
