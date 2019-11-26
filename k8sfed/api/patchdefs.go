package api

import (
	"io"
	"k8sfed/cluster"
	"k8sfed/cluster/deployment"
	"k8sfed/cluster/pod"
)

type PatchNode struct {
	Kind       string         `json:"kind,omitempty"`
	ApiVersion string         `json:"apiVersion,omitempty"`
	Meta       *PatchMetadata `json:"metadata,omitempty"`
}
type PatchCluster struct {
	Kind       string         `json:"kind,omitempty"`
	ApiVersion string         `json:"apiVersion,omitempty"`
	Meta       *PatchMetadata `json:"metadata,omitempty"`
}
type PatchMetadata struct {
	Name                       string             `json:"name,omitempty"`
	GenerateName               string             `json:"generateName,omitempty"`
	Namespace                  string             `json:"namespace,omitempty"`
	SelfLink                   string             `json:"selfLink,omitempty"`
	Uid                        string             `json:"uid,omitempty"`
	ResourceVersion            string             `json:"resourceVersion,omitempty"`
	Generation                 int64              `json:"generation,omitempty"`
	CreationTimeStamp          string             `json:"creationTimestamp,omitempty"`
	DeletionTimeStamp          string             `json:"deletionTimestamp,omitempty"`
	DeletionGracePeriodSeconds int64              `json:"deletionGracePeriodSeconds,omitempty"`
	Labels                     map[string]*string `json:"labels"`
	Annotation                 map[string]string  `json:"annotations,omitempty"`
	//OwnerReferences            []*OwnerReference `json:"ownerReferences,omitempty"`
	//Finalizers                 []string          `json:"finalizers,omitempty"`
	ClusterName string `json:"clusterName,omitempty"`
}

func (node *PatchNode) Update(master string, data []byte) (io.ReadCloser, int, error) {
	return cluster.PatchCall("PATCH", "/api/v1/nodes/"+node.Meta.Name, master, data)
	//return cluster.Call("PATCH", "/api/v1/nodes/"+node.Meta.Name, master, node)
}
func (cs *PatchCluster) Update(master string, data []byte) (io.ReadCloser, int, error) {
	return cluster.PatchCall("PATCH", "/apis/federation/v1beta1/clusters/"+cs.Meta.Name, master, data)
}

type PatchDeployment struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *PatchMetadata    `json:"metadata,omitempty"`
	Spe        *PatchSpec        `json:"spec,omitempty"`
	Status     *deployment.State `json:"status,omitempty"`
}
type PatchPod struct {
	Kind       string         `json:"kind,omitempty"`
	ApiVersion string         `json:"apiVersion,omitempty"`
	Meta       *PatchMetadata `json:"metadata,omitempty"`
	Spe        *pod.Spec      `json:"spec,omitempty"`
	Status     *pod.PodState  `json:"status,omitempty"`
}
type PatchSpec struct {
	Replicas                int64                `json:"replicas,omitempty"`
	Select                  *cluster.Selector    `json:"selector,omitempty"`
	Template                *PatchPod            `json:"template,omitempty"`
	Strate                  *deployment.Strategy `json:"strategy,omitempty"`
	MinReadySeconds         int64                `json:"minReadySeconds,omitempty"`
	RevisionHistoryLimit    int64                `json:"revisionHistoryLimit,omitempty"`
	Paused                  bool                 `json:"paused,omitempty"`
	RollbackTo              *deployment.Rollback `json:"rollbackTo,omitempty"`
	ProgressDeadlineSeconds int64                `json:"progressDeadlineSeconds,omitempty"`
	//ImagePullSecrets        []interface{}     `json:"imagePullSecrets,omitempty"`
}

func (deployment *PatchDeployment) Update(master string, data []byte) (io.ReadCloser, int, error) {
	return cluster.PatchCall("PATCH", "/apis/apps/v1beta1/namespaces/"+deployment.Meta.Namespace+"/deployments/"+deployment.Meta.Name, master, data)

}
