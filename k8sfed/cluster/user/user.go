package user

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	_ "github.com/Go-SQL-Driver/MySQL"
)

type User struct {
	Id                string `json:"Id"`
	Name              string `json:"Name"`
	Password          string `json:"Password"`
	Status            int    `json:"Status"`
	Rool              int    `json:"Rool"`
	Fedpermission     int    `json:"Fedpermission"`
	Clusterpermission string `json:"Clusterpermission"`
	Modulepermission  string `json:"Modulepermission"`
	Createtime        string `json:"Createtime"`
	Permissiontime    string `json:"Permissiontime"`
}

type UserList struct {
	Items []User `json:"Items,omitempty"`
}

func Newuser(name, password, clusterpermission, modulepermission string, fedpermission, status, rool int) *User {
	id := time.Now().Format("2006-01-02 15:04:05")
	createtime := time.Now().Format("2006-01-02 15:04:05")
	permissiontime := time.Now().Format("2006-01-02 15:04:05")

	return &User{
		Id:                id,
		Name:              name,
		Password:          password,
		Status:            status,
		Rool:              rool,
		Fedpermission:     fedpermission,
		Clusterpermission: clusterpermission,
		Modulepermission:  modulepermission,
		Createtime:        createtime,
		Permissiontime:    permissiontime,
	}
}

var db *sql.DB
var err error

func Connect(mysqlip string) {
	db, err = sql.Open("mysql", "root:root@tcp("+mysqlip+":3306)/k8sfeduser?charset=utf8")
	checkErr(err)
}

func Add(usr *User) error {
	stmt, err := db.Prepare("INSERT user_info SET id=?,name=?,status=?,password=?,rool=?,fedpermission=?,clusterpermission=?,modulepermission=?,createtime=?,permissiontime=?")
	checkErr(err)
	id := time.Now().Format("2006-01-02 15:04:05")
	createtime := time.Now().Format("2006-01-02 15:04:05")
	permissiontime := time.Now().Format("2006-01-02 15:04:05")
	res, err := stmt.Exec(id, usr.Name, usr.Status, usr.Password, usr.Rool, usr.Fedpermission, usr.Clusterpermission, usr.Modulepermission, createtime, permissiontime)
	fmt.Println(res)
	checkErr(err)
	defer db.Close()
	return err
}

func QueryUsr() []User {
	rows, err := db.Query("SELECT * FROM user_info")
	checkErr(err)
	var dataSource []User
	var usr User
	for rows.Next() {
		err = rows.Scan(&usr.Id, &usr.Name, &usr.Password, &usr.Status, &usr.Rool, &usr.Fedpermission, &usr.Clusterpermission, &usr.Modulepermission, &usr.Createtime, &usr.Permissiontime)
		checkErr(err)
		dataSource = append(dataSource, usr)
	}
	defer db.Close()
	return dataSource
}

func QueryUsrFedPermission(username string) error {
	rows, err := db.Query("SELECT * FROM user_info")
	checkErr(err)
	var usr User
	var federr error = errors.New("no federation permission")
	for rows.Next() {
		err = rows.Scan(&usr.Id, &usr.Name, &usr.Password, &usr.Status, &usr.Rool, &usr.Fedpermission, &usr.Clusterpermission, &usr.Modulepermission, &usr.Createtime, &usr.Permissiontime)
		if usr.Name == username {
			if usr.Rool == 1 {
				return nil
			} else if usr.Fedpermission == 0 {
				return federr
			} else if usr.Fedpermission == 1 {
				return nil
			}
		}
		checkErr(err)
	}
	defer db.Close()
	return nil
}

func QueryUsrClusterPermission(username string, clustername string) error {
	rows, err := db.Query("SELECT * FROM user_info")
	checkErr(err)
	var usr User
	var nodeerr error = errors.New("no federation permission")
	for rows.Next() {
		err = rows.Scan(&usr.Id, &usr.Name, &usr.Password, &usr.Status, &usr.Rool, &usr.Fedpermission, &usr.Clusterpermission, &usr.Modulepermission, &usr.Createtime, &usr.Permissiontime)
		if usr.Name == username {
			permission := strings.Index(usr.Clusterpermission, clustername)
			if usr.Rool == 1 {
				return nil
			} else if permission == -1 {
				return nodeerr
			} else if permission != -1 {
				return nil
			}
		}
		checkErr(err)
	}
	defer db.Close()
	return nil
}

func QueryUsrModulePermission(username string, modulename string) error {
	rows, err := db.Query("SELECT * FROM user_info")
	checkErr(err)
	var usr User
	var moduleerr error = errors.New("no module permission")
	for rows.Next() {
		err = rows.Scan(&usr.Id, &usr.Name, &usr.Password, &usr.Status, &usr.Rool, &usr.Fedpermission, &usr.Clusterpermission, &usr.Modulepermission, &usr.Createtime, &usr.Permissiontime)
		if usr.Name == username {
			if usr.Rool == 1 {
				return nil
			} else if strings.Index(usr.Modulepermission, modulename) == -1 {
				return moduleerr
			} else if strings.Index(usr.Modulepermission, modulename) != -1 {
				return nil
			}
		}
		checkErr(err)
	}
	defer db.Close()
	return nil
}

func LoginCheck(name string, password string) error {
	//fmt.Println("LoginCheck")
	rows, err := db.Query("SELECT * FROM user_info")
	checkErr(err)
	var usr User
	var flag = false
	for rows.Next() {
		err = rows.Scan(&usr.Id, &usr.Name, &usr.Password, &usr.Status, &usr.Rool, &usr.Fedpermission, &usr.Clusterpermission, &usr.Modulepermission, &usr.Createtime, &usr.Permissiontime)
		//fmt.Println("name")
		if usr.Name == name {
			flag = true
			//fmt.Println(usr.Name + usr.Password)
			if password == usr.Password {
				return nil
			} else {
				//fmt.Println("login failed")
				var err error = errors.New("login failed")
				return err
			}
		}
	}
	if !flag {
		//fmt.Println("login failed")
		var err error = errors.New("login failed")
		return err
	}
	defer db.Close()
	//checkErr(err)
	return nil
}

func Delete(usr *User) error {
	stmt, err := db.Prepare("delete from user_info where id=?")
	checkErr(err)

	res, err := stmt.Exec(usr.Id)
	fmt.Println(res)
	checkErr(err)
	defer db.Close()
	return err
}

func Update(usr *User) error {

	rows, err := db.Query("SELECT * FROM user_info")
	checkErr(err)
	var usr1 User
	for rows.Next() {
		err = rows.Scan(&usr1.Id, &usr1.Name, &usr1.Password, &usr1.Status, &usr1.Rool, &usr1.Fedpermission, &usr1.Clusterpermission, &usr1.Modulepermission, &usr1.Createtime, &usr1.Permissiontime)

		if (usr1.Name == usr.Name) && (usr.Password == "") {
			usr.Password = usr1.Password
		}
	}
	res, err := db.Exec("update user_info SET name=?,password=?,status=?,rool=?,fedpermission=?,clusterpermission=?,modulepermission=?,permissiontime=? where id=?", usr.Name, usr.Password, usr.Status, usr.Rool, usr.Fedpermission, usr.Clusterpermission, usr.Modulepermission, usr.Permissiontime, usr.Id)
	checkErr(err)
	affect, err := res.RowsAffected()
	fmt.Println(affect)
	checkErr(err)
	db.Close()
	return err
}

func UpdateStatus(usr *User) error {

	//stmt, err := db.Prepare("update user_info SET name=?,password=?,status=?,rool=?,fedpermission=?,clusterpermission=?,modulepermission=?,permissiontime=? where id=?")
	//checkErr(err)

	res, err := db.Exec("update user_info SET status=? where id=?", usr.Status, usr.Id)
	checkErr(err)

	affect, err := res.RowsAffected()
	fmt.Println(affect)
	defer db.Close()
	checkErr(err)
	return err
}

func UpdateUsersStatus(usr User) error {

	//stmt, err := db.Prepare("update user_info SET name=?,password=?,status=?,rool=?,fedpermission=?,clusterpermission=?,modulepermission=?,permissiontime=? where id=?")
	//checkErr(err)

	res, err := db.Exec("update user_info SET status=? where id=?", usr.Status, usr.Id)
	//var err error
	checkErr(err)

	affect, err := res.RowsAffected()
	fmt.Println(affect)
	defer db.Close()
	checkErr(err)
	return err
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}
