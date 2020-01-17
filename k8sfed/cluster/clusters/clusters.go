package clusters

import (
	"encoding/json"
	"fmt"
	"io"
	"k8sfed/cluster"
	"net"
	"os"
)

type Clusters struct {
	Kind       string     `json:"kind,omitempty"`
	ApiVersion string     `json:"apiVersion,omitempty"`
	Items      []*Cluster `json:"items,omitempty"`
}

type Cluster struct {
	Kind       string            `json:"kind,omitempty"`
	ApiVersion string            `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata `json:"metadata,omitempty"`
	Spe        *Spec             `json:"spec,omitempty"`
	Status     *State            `json:"status,omitempty"`
}

type DisCluster struct {
	Name  string
	IP    string
	Port  string
	Infed int
}

type JoinCluster struct {
	Name string `json:"Name"`
	IP   string `json:"IP"`
	Port string `json:"Port"`
}
type DisClustersList struct {
	Items []Cluster
}

type Spec struct {
	ServerAddressByClientCIDRs []*ServerAddressByClientCIDR `json:"serverAddressByClientCIDRs,omitempty"`
}

type ServerAddressByClientCIDR struct {
	ClientCIDR    string `json:"clientCIDR,omitempty"`
	ServerAddress string `json:"serverAddress,omitempty"`
}
type State struct {
	Conditions []*cluster.Condition `json:"conditions,omitempty"`
}

type Comstatuses struct {
	Kind       string       `json:"kind,omitempty"`
	ApiVersion string       `json:"apiVersion,omitempty"`
	Items      []*Comstatus `json:"items,omitempty"`
}
type Comstatus struct {
	Kind       string               `json:"kind,omitempty"`
	ApiVersion string               `json:"apiVersion,omitempty"`
	Meta       *cluster.Metadata    `json:"metadata,omitempty"`
	Conditions []*cluster.Condition `json:"conditions,omitempty"`
}

/*func (cs *Clusters) List(master string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/api/v1/namespaces", master, nil)
}*/
func (cs *Clusters) List(master string) error {
	//return cluster.Call("GET", "/api/v1/nodes", master, nil)
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/apis/federation/v1beta1/clusters", master, nil))

	if err != nil {
		return err
	}
	if err := json.Unmarshal(body, cs); err != nil {
		return err
	}
	return nil
}

func GetFedHealth(fedmaster string) (string, error) {
	//return cluster.Call("GET", "/api/v1/nodes", master, nil)
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/healthz", fedmaster, nil))

	if err != nil {
		return "", err
	}

	//正常应该返回 ok
	return string(body), nil
}
func GetHealth(master string) (string, error) {
	//return cluster.Call("GET", "/api/v1/nodes", master, nil)
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/healthz", master, nil))

	if err != nil {
		return "", err
	}

	//正常应该返回 ok
	return string(body), nil
}

func (cs *Cluster) Delete(master string) (io.ReadCloser, int, error) {
	b := cluster.NewBody(0, false)
	return cluster.Call("DELETE", "/apis/federation/v1beta1/clusters/"+cs.Meta.Name, master, b)
}
func (cs *Cluster) Update(master string, data []byte) (io.ReadCloser, int, error) {
	return cluster.PatchCall("PATCH", "/apis/federation/v1beta1/clusters/"+cs.Meta.Name, master, data)
}
func GetVersion(master string) (map[string]string, error) {
	//return cluster.Call("GET", "/api/v1/nodes", master, nil)
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/version", master, nil))

	if err != nil {
		return nil, err
	}
	var mp map[string]string
	//fmt.Printf("%s", body)
	if err := json.Unmarshal(body, &mp); err != nil {
		return nil, err
	}

	return mp, nil
}

func (cts *Comstatuses) GetComstatuses(master string) error {
	//return cluster.Call("GET", "/api/v1/nodes", master, nil)
	body, _, err := cluster.ReadBody(cluster.Call("GET", "/api/v1/componentstatuses", master, nil))

	if err != nil {
		return err
	}
	if err := json.Unmarshal(body, cts); err != nil {
		return err
	}
	return nil
}

func (cs *Clusters) ToJsonString() string {
	strs, err := json.Marshal(cs)
	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}

func FcJoinCluster(master string, dis JoinCluster) (io.ReadCloser, int, error) {
	fmt.Print("name:", dis.Name)
	var cmeta = &cluster.Metadata{
		Name: dis.Name,
	}
	var sa = &ServerAddressByClientCIDR{
		ClientCIDR:    "0.0.0.0/0",
		ServerAddress: "http://" + dis.IP + ":" + dis.Port,
	}
	var sas []*ServerAddressByClientCIDR
	sas = append(sas, sa)
	var cspe = &Spec{
		ServerAddressByClientCIDRs: sas,
	}
	var joincluster = &Cluster{
		Kind:       "Cluster",
		ApiVersion: "federation/v1beta1",
		Meta:       cmeta,
		Spe:        cspe,
	}
	datas, _ := json.Marshal(joincluster)
	fmt.Print(string(datas[:]))
	//joincluster.Kind = "Cluster"
	//joincluster.ApiVersion = "federation/v1beta1"
	//joincluster.Meta.Name = dis.Name
	//joincluster.Spe.ServerAddressByClientCIDRs[0].ClientCIDR = "0.0.0.0/0"
	//joincluster.Spe.ServerAddressByClientCIDRs[0].ServerAddress = dis.IP

	return cluster.Call("POST", "/apis/federation/v1beta1/clusters", master, joincluster)
}

func DiscoverCluster() []DisCluster {

	var dataSource []DisCluster

	address := "255.255.255.255:10025"

	addr, err := net.ResolveUDPAddr("udp", address)

	if err != nil {

		fmt.Println(err)

		os.Exit(1)

	}

	conn, err := net.ListenUDP("udp", addr)

	if err != nil {

		fmt.Println(err)

		os.Exit(1)

	}

	//

	for i := 0; i < 20; i++ {

		fmt.Println("Received:test")

		data := make([]byte, 11)

		_, rAddr, err := conn.ReadFromUDP(data)

		if err != nil {

			fmt.Println(err)

			continue

		}
		var DisCluster DisCluster
		var flag int = 0
		DisCluster.Name = string(data)
		DisCluster.IP = string(rAddr.IP)
		DisCluster.Port = "8080"
		DisCluster.Infed = 0
		for j := 0; j < len(dataSource); j++ {
			if dataSource[j].Name == DisCluster.Name {
				flag = 1
			}
		}
		if flag == 0 {
			dataSource = append(dataSource, DisCluster)
			strData := string(data)
			fmt.Println("Received Request From Cluster:", strData)
			fmt.Println("Cluster Addr:", rAddr)
		}
	}
	conn.Close()
	return dataSource
}
