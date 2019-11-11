package application

import (
	"encoding/json"
	"k8sfed/cluster"
)

type ChartList struct {
	Charts map[string][]Chart `json:"charts,omitempty"`
}

func (chartlist *ChartList) GetAllCharts(master string) error {
	var charts = map[string][]Chart{}

	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/charts", master, nil))

	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &charts); err != nil {
		return err
	}
	chartlist.Charts = charts
	//return charts, nil
	return nil
	//return cluster.Call("GET", "/api/charts/", master, nil)
}
