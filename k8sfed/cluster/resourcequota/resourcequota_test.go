package resourcequota

import (
	"encoding/json"
	"fmt"
	"k8s_v2/cluster"
	"testing"
)

func TestResourceQuota(t *testing.T) {
	quota := NewResourceQouta("not-best-effort", "test-123", []string{"NotBestEffort"},
		map[string]string{"pods": "4", "requests.cpu": "1", "requests.memory": "1Gi", "limits.cpu": "2", "limits.memory": "2Gi"})
	//quotas := &ResourceQuotas{}

	fmt.Printf("%s\n", quota.ToJsonString())

	body, statusCode, err := cluster.ReadBody(quota.Delete("controller:8080"))

	if err != nil {
		fmt.Printf("%v %v\n", statusCode, err)
	}

	fmt.Printf("%s", body)

	err = json.Unmarshal(body, quota)

	if err != nil {
		fmt.Printf("%v", err)
	}

	fmt.Printf("%s\n", quota.ToJsonString())

}
