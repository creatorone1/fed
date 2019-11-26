package api

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"k8sfed/cluster/user"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func getUsers(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("getUsers被访问！")
	var dataSource = []user.User{}

	user.Connect()
	dataSource = user.QueryUsr()

	usersdata, err := json.Marshal(dataSource)
	if err != nil {
		// handle error
		return err
	}
	w.Write(usersdata)
	//w.Write(body) 返回json数据byte数据类型
	return nil

	io.WriteString(w, "getUsers")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func getUserModulePermission(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {
	fmt.Println("getUserModulePermission被访问！")
	var username = p.ByName("username")
	var modulename = p.ByName("modulename")
	fmt.Println(username, modulename)
	user.Connect()
	err := user.QueryUsrModulePermission(username, modulename)

	if err != nil {
		sendErrorResponse(w, ErrorCreate)
		return err
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil

	io.WriteString(w, "getUserModulePermission")
	//w.Write(body) 返回json数据byte数据类型
	return nil

}

func getUserFedPermission(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {
	fmt.Println("getUserFedPermission被访问！")
	var username = p.ByName("username")

	user.Connect()
	err := user.QueryUsrFedPermission(username)

	if err != nil {
		sendErrorResponse(w, ErrorCreate)
		return err
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil

	io.WriteString(w, "getUserModulePermission")
	//w.Write(body) 返回json数据byte数据类型
	return nil

}

func getUserClusterPermission(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {
	fmt.Println("getUserClusterPermission被访问！")
	var username = p.ByName("username")
	var clustername = p.ByName("clustername")
	user.Connect()
	err := user.QueryUsrClusterPermission(username, clustername)

	if err != nil {
		sendErrorResponse(w, ErrorCreate)
		return err
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil

	io.WriteString(w, "getUserModulePermission")
	//w.Write(body) 返回json数据byte数据类型
	return nil

}

func pauseUsers(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("pauseUsers被访问！")
	var jsondata = r.FormValue("data")
	var datas = &user.UserList{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorUpdate)
		return errj
	}
	for _, item := range datas.Items {
		fmt.Println(item)
		user.Connect()
		item.Status = 0
		err := user.UpdateUsersStatus(item)
		if err != nil {
			fmt.Print(err)
		}
	}
	sendNormalResponse(w, NormalOp)
	io.WriteString(w, "pauseUsers")
	return nil
}

func pauseUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("pauseUser被访问！")

	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var usr = &user.User{}

	if err := json.Unmarshal(data, usr); err != nil {
		return err
	}
	usr.Status = 0
	user.Connect()
	errc := user.UpdateStatus(usr)

	if errc != nil {
		sendErrorResponse(w, ErrorCreate)
		return errc
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil

	io.WriteString(w, "pauseUsers")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func resumeUsers(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("resumeUsers被访问！")
	var jsondata = r.FormValue("data")
	var datas = &user.UserList{}
	errj := json.Unmarshal([]byte(jsondata), datas)
	if errj != nil {
		sendErrorResponse(w, ErrorUpdate)
		return errj
	}
	for _, item := range datas.Items {
		fmt.Println(item)
		user.Connect()
		item.Status = 0
		err := user.UpdateUsersStatus(item)
		if err != nil {
			fmt.Print(err)
		}
	}
	sendNormalResponse(w, NormalOp)
	io.WriteString(w, "resumeUsers")
	return nil
}

func resumeUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("resumeUser被访问！")

	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var usr = &user.User{}

	if err := json.Unmarshal(data, usr); err != nil {
		return err
	}
	usr.Status = 1
	user.Connect()
	errc := user.UpdateStatus(usr)

	if errc != nil {
		sendErrorResponse(w, ErrorCreate)
		return errc
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil

	io.WriteString(w, "pauseUsers")
	//w.Write(body) 返回json数据byte数据类型
	return nil

	io.WriteString(w, "resumeUsers")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}
func postUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("postUser被访问！")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var usr = &user.User{}
	if err := json.Unmarshal(data, usr); err != nil {
		return err
	}
	user.Connect()
	errc := user.Add(usr)

	if errc != nil {
		sendErrorResponse(w, ErrorCreate)
		return errc
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil

	io.WriteString(w, "postUser")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}

func userLogin(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("userLogin被访问！")

	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var usr = &user.User{}
	if err := json.Unmarshal(data, usr); err != nil {
		return err
	}
	user.Connect()
	errc := user.LoginCheck(usr.Name, usr.Password)

	if errc != nil {
		sendErrorResponse(w, ErrorCreate)
		return errc
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil

	//io.WriteString(w, "postUser")
	//w.Write(body) 返回json数据byte数据类型
	//return nil
}

func userLogout(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("userLogout被访问！")

	io.WriteString(w, "userLogout")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}
func deleteUsers(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("deleteUsers被访问！")

	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var usr = &user.User{}
	if err := json.Unmarshal(data, usr); err != nil {
		return err
	}
	user.Connect()
	errc := user.Delete(usr)

	if errc != nil {
		sendErrorResponse(w, ErrorCreate)
		return errc
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil

	io.WriteString(w, "postUser")
	//w.Write(body) 返回json数据byte数据类型
	return nil
	io.WriteString(w, "deleteUsers")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}
func updateUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) error {

	fmt.Println("updateUser被访问！")
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	var usr = &user.User{}
	if err := json.Unmarshal(data, usr); err != nil {
		return err
	}
	user.Connect()
	errc := user.Update(usr)

	if errc != nil {
		sendErrorResponse(w, ErrorCreate)
		return errc
	}
	//w.Write(body)
	sendNormalResponse(w, NormalOp)
	return nil

	io.WriteString(w, "updateUser")
	//w.Write(body) 返回json数据byte数据类型
	return nil
}
