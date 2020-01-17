package heapster

import (
	"encoding/json"
	"fmt"
	"k8sfed/cluster"
)

type NodeMonitor struct {
	CpuAllocatable int64
	CpuRequest     int64
	CpuLimit       int64
	CpuUsage       int64
	CpuUsageRate   int64

	MemoryAllocatable int64
	MemoryRequest     int64
	MemoryLimit       int64
	MemoryUsage       int64

	NetworkRx     int64
	NetworkRxRate int64
	NetworkTx     int64
	NetworkTxRate int64
}

type metric struct {
	Timestamp string `json:"timestamp,omitempty"`
	Value     int64  `json:"value,omitempty"`
}

type results struct {
	Metrics []*metric `json:"metrics,omitempty"`
}

func (n *NodeMonitor) View(node, master string) error {
	paths := []string{
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/cpu/node_allocatable", node),
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/cpu/request", node),
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/cpu/limit", node),
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/cpu/usage", node),
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/cpu/usage_rate", node),

		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/memory/node_allocatable", node),
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/memory/request", node),
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/memory/limit", node),
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/memory/usage", node),

		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/network/rx", node),
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/network/rx_rate", node),
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/network/tx", node),
		fmt.Sprintf("/api/v1/model/nodes/%s/metrics/network/rx_rate", node),
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
			n.CpuAllocatable = r.Metrics[0].Value
		case 1:
			n.CpuRequest = r.Metrics[0].Value
		case 2:
			n.CpuLimit = r.Metrics[0].Value
		case 3:
			n.CpuUsage = r.Metrics[0].Value
		case 4:
			n.CpuUsageRate = r.Metrics[0].Value
		case 5:
			n.MemoryAllocatable = r.Metrics[0].Value
		case 6:
			n.MemoryRequest = r.Metrics[0].Value
		case 7:
			n.MemoryLimit = r.Metrics[0].Value
		case 8:
			n.MemoryUsage = r.Metrics[0].Value
		case 9:
			n.NetworkRx = r.Metrics[0].Value
		case 10:
			n.NetworkRxRate = r.Metrics[0].Value
		case 11:
			n.NetworkTx = r.Metrics[0].Value
		case 12:
			n.NetworkTxRate = r.Metrics[0].Value
		}
	}

	return nil

}

func (r *results) view(path, master string) error {
	body, _, err := cluster.ReadBody(cluster.Call("GET", path, master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, r); err != nil {

		return err
	}

	return nil

}

func (n *NodeMonitor) toJsonString() string {
	str, err := json.Marshal(n)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(str)
}
