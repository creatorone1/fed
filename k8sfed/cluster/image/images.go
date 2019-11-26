package image

import (
	"encoding/json"
	"io"
	"k8sfed/cluster"
)

type Repository struct {
	Id            int64       `json:"id"`
	Name          string      `json:"name"`
	Project_id    int64       `json:"project_id"`
	Description   string      `json:"description"`
	Pull_count    int64       `json:"pull_count"`
	Star_count    int64       `json:"star_count"`
	Labels        interface{} `json:"labels"`
	Creation_time string      `json:"creation_time"`
	Update_time   string      `json:"update_time"`
	Tagnum        int         `json:"tagnum"`
	Images        []*Image    `json:"images"`
}
type Image struct {
	Digest         string      `json:"digest"`
	Name           string      `json:"name"`
	Size           float64     `json:"size"`
	Architecture   string      `json:"architecture"`
	Os             string      `json:"os"`
	Osversion      string      `json:"os.version"`
	Docker_version string      `json:"docker_version"`
	Author         string      `json:"author"`
	Created        string      `json:"created"`
	Config         interface{} `json:"config,omitempty"`
	Signature      interface{} `json:"signature,omitempty"`
	Labels         interface{} `json:"labels"`
	Push_time      string      `json:"push_time"`
	Pull_time      string      `json:"pull_time"`
	Pullname       string      `json:"pullname"`
}
type Repositories struct {
	Items []Repository `json:"items,omitempty"`
}
type Repos []*Repository
type Images []*Image

func (repos *Repos) ListRepos(master, uname, pwd string) error {
	body, _, err := cluster.ReadBody(cluster.AuthCall("GET", "/api/repositories?project_id=1", master, nil, uname, pwd))

	if err != nil {
		return err
	}
	//fmt.Printf("%s", body)
	if err := json.Unmarshal(body, repos); err != nil {
		return err
	}

	for _, item := range *repos {
		var images *Images = new(Images)
		//fmt.Println(item.Name)
		if erri := images.ListImages(master, item.Name, uname, pwd); err != nil {
			return erri
		}
		//fmt.Print(images)
		item.Images = *images
		item.Tagnum = len(*images)

	}

	return nil
	//return cluster.Call("GET", "/v2/_catalog", repository, nil)
}

func (images *Images) ListImages(master, reponame, uname, pwd string) error {
	body, _, err := cluster.ReadBody(cluster.AuthCall("GET", "/api/repositories/"+reponame+"/tags?project_id=1", master, nil, uname, pwd))

	if err != nil {
		return err
	}

	//fmt.Printf("%s", body)
	if err := json.Unmarshal(body, images); err != nil {
		return err
	}
	for _, image := range *images {
		//fmt.Println(item.Name)
		image.Pullname = master + "/" + reponame + ":" + image.Name

	}
	//fmt.Print(images)
	return nil
	//return cluster.Call("GET", "/v2/_catalog", repository, nil)
}
func (repo *Repository) DeleteRepo(master, uname, pwd string) (io.ReadCloser, int, error) {
	return cluster.AuthCall("DELETE", "/api/repositories/"+repo.Name, master, nil, uname, pwd)
}
func (tag *Image) DeleteImageTag(master, reponame, uname, pwd string) (io.ReadCloser, int, error) {
	return cluster.AuthCall("DELETE", "/api/repositories/"+reponame+"/tags/"+tag.Name, master, nil, uname, pwd)
}

/*
type Repositories struct {
	Repositories []string `json:"repositories,omitempty"`
}

func (r *Repositories) List(repository string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/v2/_catalog", repository, nil)
}

func (r *Repositories) ToJsonString() string {
	strs, err := json.Marshal(r)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}

type Tag struct {
	Name string   `json:"name,omitempty"`
	Tags []string `json:"tags,omitempty"`
}

func (t *Tag) List(name, repository string) (io.ReadCloser, int, error) {
	return cluster.Call("GET", "/v2/"+name+"/tags/list", repository, nil)
}

func (t *Tag) ToJsonString() string {
	strs, err := json.Marshal(t)

	if err != nil {

		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}

func (i *Image) ToJsonString() string {
	strs, err := json.Marshal(i)

	if err != nil {
		return fmt.Sprintf("%v", err)
	}

	return string(strs)
}
*/
