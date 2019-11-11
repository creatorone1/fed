package application

import (
	"io"
	"k8sfed/cluster"
)

type Release struct {
	Name           string  `json:"name,omitempty"`
	Info           *Info   `json:"info,omitempty"`
	Chart_metadata *Chart  `json:"chart_metadata,omitempty"`
	Config         *Config `json:"config,omitempty"`
	Version        int64   `json:"version,omitempty"`
	Namespace      string  `json:"namespace,omitempty"`
}
type Info struct {
	Status         *Status `json:"status,omitempty"`
	First_deployed string  `json:"First_deployed,omitempty"`
	Last_deployed  string  `json:"last_deployed,omitempty"`
	Description    string  `json:"description,omitempty"`
}
type Config struct {
	Raw string `json:"raw,omitempty"`
}
type Status struct {
	Code  string `json:"code,omitempty"`
	Notes string `json:"notes,omitempty"`
}
type ReleaseMeta struct {
	Name      string `json:"name,omitempty"`
	Namespace string `json:"namespace,omitempty"`
	Cluster   string `json:"cluster,omitempty"`
	Charturl  string `json:"charturl,omitempty"`
	Version   string `json:"version,omitempty"`
}
type ReInfo struct {
	Chart_url string  `json:"chart_url,omitempty"`
	Namespace string  `json:"namespace,omitempty"`
	Values    *Values `json:"values,omitempty"`
}

func (releaseMeta *ReleaseMeta) Create(master string) (io.ReadCloser, int, error) {
	var info = ReInfo{
		Chart_url: releaseMeta.Charturl,
		Namespace: releaseMeta.Namespace,
	}
	//buf, _ := json.Marshal(info)
	//fmt.Printf("%s", buf)
	return cluster.Call("POST", "/tiller/v2/releases/"+releaseMeta.Name+"/json", master, info)
}

func (releaseMeta *ReleaseMeta) Update(master string) (io.ReadCloser, int, error) {
	var info = ReInfo{
		Chart_url: releaseMeta.Charturl,
		//Namespace: releaseMeta.Namespace,
	}
	return cluster.Call("PUT", "/tiller/v2/releases/"+releaseMeta.Name+"/json", master, info)
}
func (releaseMeta *ReleaseMeta) Rollback(master string) (io.ReadCloser, int, error) {

	return cluster.Call("GET", "/tiller/v2/releases/"+releaseMeta.Name+"/rollback/json", master, nil)
}
func (release *Release) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/tiller/v2/releases/"+release.Name+"/json?purge=true", master, nil)
}
