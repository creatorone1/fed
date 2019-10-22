package pod

import (
	"io"
	"k8s_v2/cluster"
	"net/url"
	"strconv"
)

type PodLog struct {
	Namespace     string
	PodName       string
	Pretty        string
	ContainerName string
	Follow        bool
	Previous      bool
	SinceSeconds  int
	Timestamps    bool
	TailLine      int
	LimitBytes    int
}

func NewPodLog(namespace, podName, pretty, containerName string, follow, previous bool,
	sinceseconds int, timestamps bool, tailline, limitBytes int) *PodLog {

	if cluster.IsSpace(namespace) {
		namespace = "default"
	}
	return &PodLog{
		Pretty:        pretty,
		Namespace:     namespace,
		PodName:       podName,
		ContainerName: containerName,
		Follow:        follow,
		Previous:      previous,
		SinceSeconds:  sinceseconds,
		Timestamps:    timestamps,
		TailLine:      tailline,
		LimitBytes:    limitBytes,
	}
}

func (log *PodLog) View(master string) (io.ReadCloser, int, error) {

	v := url.Values{}

	if log.Follow {
		v.Set("follow", "true")
	}

	if !cluster.IsSpace(log.ContainerName) {
		v.Set("container", log.ContainerName)
	}

	if !cluster.IsSpace(log.Pretty) {
		v.Set("pretty", log.Pretty)
	}

	if log.Previous {
		v.Set("previous", "true")
	}

	if log.SinceSeconds > 0 {
		v.Set("sinceSeconds", strconv.Itoa(log.SinceSeconds))
	}

	if log.Timestamps {
		v.Set("timestamps", "true")
	}

	if log.TailLine > 0 {
		v.Set("tailLines", strconv.Itoa(log.TailLine))
	}

	if log.LimitBytes > 0 {
		v.Set("limitBytes", strconv.Itoa(log.LimitBytes))
	}

	return cluster.Call("GET", "/api/v1/namespaces/"+log.Namespace+"/pods/"+log.PodName+"/log?"+v.Encode(), master, nil)
}
