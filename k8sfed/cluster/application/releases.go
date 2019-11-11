package application

import (
	"encoding/json"
	"k8sfed/cluster"
)

type ReleaseList struct {
	Releases []*Release `json:"releases,omitempty"`
}

func (releaselist *ReleaseList) GetReleases(master string) error {
	//var charts = map[string][]Chart{}

	body, _, err := cluster.ReadBody(cluster.Call("GET", "/tiller/v2/releases/json", master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &releaselist); err != nil {
		return err
	}
	//return charts, nil
	return nil
	//return cluster.Call("GET", "/api/charts/", master, nil)
}
