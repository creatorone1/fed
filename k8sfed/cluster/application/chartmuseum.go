package application

import (
	"io"

	"k8sfed/cluster"
)

type Chart struct {
	Name        string       `json:"name,omitempty"`
	Version     string       `json:"version,omitempty"`
	Icon        string       `json:"icon,omitempty"`
	Description string       `json:"description,omitempty"`
	ApiVersion  string       `json:"apiVersion,omitempty"`
	AppVersion  string       `json:"appVersion,omitempty"`
	Urls        []string     `json:"urls,omitempty"`
	Created     string       `json:"created,omitempty"`
	Digest      string       `json:"digest,omitempty"`
	Maintainers []Maintainer `json:"maintainers,omitempty"`
	Home        string       `json:"home,omitempty"`
	Sources     []string     `json:"sources,omitempty"`
	Engine      string       `json:"engine,omitempty"`
}
type Maintainer struct {
	Name  string `json:"name,omitempty"`
	Email string `json:"email,omitempty"`
}

type Chartinfo struct {
	Name      string `json:"name,omitempty"`
	Version   string `json:"version,omitempty"`
	Url       string `json:"url,omitempty"`
	Namespace string `json:"namespace,omitempty"`

	Values *Values `json:"values,omitempty"`
}

type Values struct {
	Raw *Raw `json:"raw,omitempty"`
}

type Raw struct {
	NS          string `json:"ns,omitempty"`
	clusterName string `json:"clusterName,omitempty"`
}

/*
func NewChartinfo(name,version,namespace,url string, values *Values) *Chartinfo {
	if namespace == "" {
		namespace = "default"
	}
	return &Chartinfo{
		Name:       name,
		Version:    version,
		Namespace:  namespace.
		Url:        url,
		Values:     values,
	}
}*/

func (Chart *Chart) Delete(master string) (io.ReadCloser, int, error) {
	return cluster.Call("DELETE", "/api/charts/"+Chart.Name+"/"+Chart.Version, master, nil)
}

func (chartinfo *Chartinfo) GetChartVersion(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/charts/"+chartinfo.Name, master, nil)
}

func (chartinfo *Chartinfo) GetChartUrl(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/charts/"+chartinfo.Name+"/"+chartinfo.Version, master, nil)
}
